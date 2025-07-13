import { NativeModules } from 'react-native';
import { GitRepository } from '../types';

// This is implemented as a native module using JGit
const { GitModule } = NativeModules;

export interface GitCredentials {
  username?: string;
  password?: string;
}

export interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

export interface GitBranch {
  name: string;
  isRemote: boolean;
}

export class GitService {
  static async init(path: string): Promise<string> {
    return GitModule.init(path);
  }

  static async clone(url: string, path: string, credentials?: GitCredentials): Promise<string> {
    return GitModule.clone(
      url, 
      path, 
      credentials?.username || null, 
      credentials?.password || null
    );
  }

  static async status(path: string): Promise<GitStatus> {
    return GitModule.status(path);
  }

  static async add(path: string, files: string[]): Promise<string> {
    return GitModule.add(path, files);
  }

  static async commit(path: string, message: string): Promise<string> {
    return GitModule.commit(path, message);
  }

  static async push(
    path: string, 
    remote: string = 'origin', 
    branch: string = 'main',
    credentials?: GitCredentials
  ): Promise<string> {
    return GitModule.push(
      path, 
      remote, 
      branch,
      credentials?.username || null,
      credentials?.password || null
    );
  }

  static async pull(
    path: string, 
    remote: string = 'origin', 
    branch: string = 'main',
    credentials?: GitCredentials
  ): Promise<string> {
    return GitModule.pull(
      path, 
      remote, 
      branch,
      credentials?.username || null,
      credentials?.password || null
    );
  }

  static async getBranches(path: string): Promise<GitBranch[]> {
    return GitModule.getBranches(path);
  }

  static async getCurrentBranch(path: string): Promise<string> {
    return GitModule.getCurrentBranch(path);
  }

  static async checkout(path: string, branch: string): Promise<string> {
    return GitModule.checkout(path, branch);
  }

  static async createBranch(path: string, branch: string): Promise<string> {
    return GitModule.createBranch(path, branch);
  }

  static async createWorktree(repoPath: string, worktreePath: string, branch: string): Promise<string> {
    return GitModule.createWorktree(repoPath, worktreePath, branch);
  }

  static async getRepositoryInfo(path: string): Promise<GitRepository> {
    return GitModule.getRepositoryInfo(path);
  }

  static async diff(path: string, file?: string): Promise<string> {
    return GitModule.diff(path, file || null);
  }
}