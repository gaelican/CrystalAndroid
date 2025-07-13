package com.crystalandroid.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class TerminalModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "TerminalModule";
    private final Map<String, TerminalSession> sessions = new HashMap<>();
    
    public TerminalModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void createSession(String command, String workingDirectory, Promise promise) {
        try {
            String sessionId = UUID.randomUUID().toString();
            TerminalSession session = new TerminalSession(sessionId, command, workingDirectory);
            sessions.put(sessionId, session);
            
            session.start();
            promise.resolve(sessionId);
        } catch (Exception e) {
            promise.reject("TERMINAL_CREATE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void sendInput(String sessionId, String input, Promise promise) {
        try {
            TerminalSession session = sessions.get(sessionId);
            if (session == null) {
                promise.reject("SESSION_NOT_FOUND", "Terminal session not found");
                return;
            }
            
            session.sendInput(input);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("TERMINAL_INPUT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void killSession(String sessionId, Promise promise) {
        try {
            TerminalSession session = sessions.get(sessionId);
            if (session == null) {
                promise.reject("SESSION_NOT_FOUND", "Terminal session not found");
                return;
            }
            
            session.stop();
            sessions.remove(sessionId);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("TERMINAL_KILL_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void executeCommand(String command, String workingDirectory, Promise promise) {
        try {
            ProcessBuilder pb = new ProcessBuilder("sh", "-c", command);
            if (workingDirectory != null) {
                pb.directory(new java.io.File(workingDirectory));
            }
            pb.redirectErrorStream(true);
            
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                promise.reject("COMMAND_FAILED", "Command exited with code " + exitCode + ": " + output.toString());
            } else {
                promise.resolve(output.toString());
            }
        } catch (Exception e) {
            promise.reject("TERMINAL_EXECUTE_ERROR", e.getMessage());
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private class TerminalSession {
        private final String sessionId;
        private final String command;
        private final String workingDirectory;
        private Process process;
        private BufferedReader reader;
        private OutputStreamWriter writer;
        private Thread outputThread;
        private boolean isRunning = false;

        TerminalSession(String sessionId, String command, String workingDirectory) {
            this.sessionId = sessionId;
            this.command = command;
            this.workingDirectory = workingDirectory;
        }

        void start() throws Exception {
            ProcessBuilder pb = new ProcessBuilder("sh", "-c", command);
            if (workingDirectory != null) {
                pb.directory(new java.io.File(workingDirectory));
            }
            
            process = pb.start();
            reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            writer = new OutputStreamWriter(process.getOutputStream());
            isRunning = true;
            
            // Start output reading thread
            outputThread = new Thread(() -> {
                try {
                    String line;
                    while (isRunning && (line = reader.readLine()) != null) {
                        WritableMap event = Arguments.createMap();
                        event.putString("sessionId", sessionId);
                        event.putString("data", line);
                        sendEvent("terminal_output_" + sessionId, event);
                    }
                } catch (Exception e) {
                    // Handle error
                }
            });
            outputThread.start();
        }

        void sendInput(String input) throws Exception {
            if (writer != null) {
                writer.write(input);
                writer.flush();
            }
        }

        void stop() {
            isRunning = false;
            if (process != null) {
                process.destroy();
            }
            if (outputThread != null) {
                try {
                    outputThread.join(1000);
                } catch (InterruptedException e) {
                    // Ignore
                }
            }
        }
    }
}