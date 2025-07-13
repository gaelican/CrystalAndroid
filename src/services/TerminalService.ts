import { NativeModules, NativeEventEmitter } from 'react-native';
import { TerminalSession } from '../types';

const { TerminalModule } = NativeModules;
const terminalEventEmitter = new NativeEventEmitter(TerminalModule);

export class TerminalService {
  private static sessions: Map<string, TerminalSession> = new Map();
  private static listeners: Map<string, any> = new Map();

  static async createSession(command: string, workingDirectory?: string): Promise<string> {
    const sessionId = await TerminalModule.createSession(command, workingDirectory);
    
    const session: TerminalSession = {
      id: sessionId,
      command,
      output: [],
      isRunning: true,
    };
    
    this.sessions.set(sessionId, session);
    
    // Listen for output
    const listener = terminalEventEmitter.addListener(
      `terminal_output_${sessionId}`,
      (event) => {
        const currentSession = this.sessions.get(sessionId);
        if (currentSession) {
          currentSession.output.push(event.data);
        }
      }
    );
    
    this.listeners.set(sessionId, listener);
    
    return sessionId;
  }

  static async sendInput(sessionId: string, input: string): Promise<void> {
    return TerminalModule.sendInput(sessionId, input);
  }

  static async killSession(sessionId: string): Promise<void> {
    await TerminalModule.killSession(sessionId);
    
    const listener = this.listeners.get(sessionId);
    if (listener) {
      listener.remove();
      this.listeners.delete(sessionId);
    }
    
    this.sessions.delete(sessionId);
  }

  static getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  static getAllSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  static async executeCommand(command: string, workingDirectory?: string): Promise<string> {
    return TerminalModule.executeCommand(command, workingDirectory);
  }
}