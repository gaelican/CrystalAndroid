// Export all types
export * from './config';
export * from './project';
export * from './session';

// Additional mobile-specific types
export interface GitRepository {
  path: string;
  name: string;
  currentBranch: string;
  remoteUrl?: string;
  lastCommit?: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
}

export interface TerminalSession {
  id: string;
  command: string;
  output: string[];
  exitCode?: number;
  isRunning: boolean;
}