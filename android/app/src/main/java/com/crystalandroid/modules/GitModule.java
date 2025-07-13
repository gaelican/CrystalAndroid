package com.crystalandroid.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.eclipse.jgit.api.CloneCommand;
import org.eclipse.jgit.api.PushCommand;
import org.eclipse.jgit.api.PullCommand;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Set;

public class GitModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "GitModule";

    public GitModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void init(String path, Promise promise) {
        try {
            File gitDir = new File(path, ".git");
            if (gitDir.exists()) {
                promise.reject("GIT_ALREADY_INITIALIZED", "Repository already initialized");
                return;
            }

            Git.init()
                .setDirectory(new File(path))
                .call();
            
            promise.resolve("Initialized empty Git repository in " + path);
        } catch (Exception e) {
            promise.reject("GIT_INIT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void clone(String url, String path, String username, String password, Promise promise) {
        try {
            File targetDir = new File(path);
            if (targetDir.exists() && targetDir.list() != null && targetDir.list().length > 0) {
                promise.reject("DIRECTORY_NOT_EMPTY", "Target directory is not empty");
                return;
            }

            CloneCommand cloneCommand = Git.cloneRepository()
                .setURI(url)
                .setDirectory(targetDir);
            
            if (username != null && password != null && !username.isEmpty()) {
                cloneCommand.setCredentialsProvider(
                    new UsernamePasswordCredentialsProvider(username, password)
                );
            }
            
            cloneCommand.call();
            promise.resolve("Repository cloned successfully");
        } catch (Exception e) {
            promise.reject("GIT_CLONE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void status(String path, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            Status status = git.status().call();
            
            WritableMap result = Arguments.createMap();
            
            // Modified files
            WritableArray modified = Arguments.createArray();
            for (String file : status.getModified()) {
                modified.pushString(file);
            }
            result.putArray("modified", modified);
            
            // Added files
            WritableArray added = Arguments.createArray();
            for (String file : status.getAdded()) {
                added.pushString(file);
            }
            result.putArray("added", added);
            
            // Deleted files
            WritableArray deleted = Arguments.createArray();
            for (String file : status.getRemoved()) {
                deleted.pushString(file);
            }
            result.putArray("deleted", deleted);
            
            // Untracked files
            WritableArray untracked = Arguments.createArray();
            for (String file : status.getUntracked()) {
                untracked.pushString(file);
            }
            result.putArray("untracked", untracked);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("GIT_STATUS_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void add(String path, ReadableArray files, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            
            for (int i = 0; i < files.size(); i++) {
                git.add().addFilepattern(files.getString(i)).call();
            }
            
            promise.resolve("Files added successfully");
        } catch (Exception e) {
            promise.reject("GIT_ADD_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void commit(String path, String message, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            RevCommit commit = git.commit()
                .setMessage(message)
                .call();
            
            promise.resolve(commit.getId().getName());
        } catch (Exception e) {
            promise.reject("GIT_COMMIT_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void push(String path, String remote, String branch, String username, String password, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            PushCommand pushCommand = git.push()
                .setRemote(remote);
            
            if (branch != null && !branch.isEmpty()) {
                pushCommand.add(branch);
            }
            
            if (username != null && password != null && !username.isEmpty()) {
                pushCommand.setCredentialsProvider(
                    new UsernamePasswordCredentialsProvider(username, password)
                );
            }
            
            pushCommand.call();
            promise.resolve("Push successful");
        } catch (Exception e) {
            promise.reject("GIT_PUSH_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void pull(String path, String remote, String branch, String username, String password, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            PullCommand pullCommand = git.pull()
                .setRemote(remote);
            
            if (branch != null && !branch.isEmpty()) {
                pullCommand.setRemoteBranchName(branch);
            }
            
            if (username != null && password != null && !username.isEmpty()) {
                pullCommand.setCredentialsProvider(
                    new UsernamePasswordCredentialsProvider(username, password)
                );
            }
            
            pullCommand.call();
            promise.resolve("Pull successful");
        } catch (Exception e) {
            promise.reject("GIT_PULL_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void getBranches(String path, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            List<Ref> branches = git.branchList().setListMode(org.eclipse.jgit.api.ListBranchCommand.ListMode.ALL).call();
            
            WritableArray result = Arguments.createArray();
            for (Ref branch : branches) {
                WritableMap branchInfo = Arguments.createMap();
                branchInfo.putString("name", branch.getName());
                branchInfo.putBoolean("isRemote", branch.getName().startsWith("refs/remotes/"));
                result.pushMap(branchInfo);
            }
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("GIT_BRANCHES_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void getCurrentBranch(String path, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            String branch = git.getRepository().getBranch();
            promise.resolve(branch);
        } catch (Exception e) {
            promise.reject("GIT_CURRENT_BRANCH_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void checkout(String path, String branch, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            git.checkout().setName(branch).call();
            promise.resolve("Checked out to " + branch);
        } catch (Exception e) {
            promise.reject("GIT_CHECKOUT_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void createBranch(String path, String branch, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            git.checkout()
                .setCreateBranch(true)
                .setName(branch)
                .call();
            promise.resolve("Branch " + branch + " created and checked out");
        } catch (Exception e) {
            promise.reject("GIT_CREATE_BRANCH_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void createWorktree(String repoPath, String worktreePath, String branch, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(repoPath));
            
            // Create worktree using JGit's worktree support
            git.worktree()
                .add()
                .setNewBranchName(branch)
                .setPath(new File(worktreePath))
                .call();
            
            promise.resolve("Worktree created at " + worktreePath);
        } catch (Exception e) {
            promise.reject("GIT_WORKTREE_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void getRepositoryInfo(String path, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            Repository repository = git.getRepository();
            
            WritableMap info = Arguments.createMap();
            
            // Basic info
            File repoDir = repository.getDirectory().getParentFile();
            info.putString("name", repoDir.getName());
            info.putString("path", repoDir.getAbsolutePath());
            
            // Current branch
            info.putString("currentBranch", repository.getBranch());
            
            // Remote URL
            String remoteUrl = repository.getConfig().getString("remote", "origin", "url");
            if (remoteUrl != null) {
                info.putString("remoteUrl", remoteUrl);
            }
            
            // Last commit info
            try {
                Iterable<RevCommit> commits = git.log().setMaxCount(1).call();
                for (RevCommit commit : commits) {
                    WritableMap lastCommit = Arguments.createMap();
                    lastCommit.putString("hash", commit.getId().getName());
                    lastCommit.putString("message", commit.getFullMessage());
                    lastCommit.putString("author", commit.getAuthorIdent().getName());
                    lastCommit.putString("date", commit.getAuthorIdent().getWhen().toString());
                    info.putMap("lastCommit", lastCommit);
                    break;
                }
            } catch (Exception e) {
                // No commits yet
            }
            
            promise.resolve(info);
        } catch (Exception e) {
            promise.reject("GIT_INFO_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }

    @ReactMethod
    public void diff(String path, String file, Promise promise) {
        Git git = null;
        try {
            git = Git.open(new File(path));
            
            // Get diff for specific file or all files
            String diff = git.diff()
                .setPathFilter(file != null ? org.eclipse.jgit.treewalk.filter.PathFilter.create(file) : null)
                .setShowNameAndStatusOnly(false)
                .call()
                .stream()
                .map(entry -> entry.toString())
                .reduce("", (acc, curr) -> acc + curr + "\n");
            
            promise.resolve(diff);
        } catch (Exception e) {
            promise.reject("GIT_DIFF_ERROR", e.getMessage());
        } finally {
            if (git != null) {
                git.close();
            }
        }
    }
}