export interface GitCommandResult {
    success: boolean;
    output?: string;
    error?: string;
    command: string;
    code?: number;
  }
  
  /**
   * Interface for the Git class
   */
  export interface GitInterface {
    executeGitCommand(command: string, args?: string[]): Promise<GitCommandResult>;
    status(): Promise<GitCommandResult>;
    add(files?: string[]): Promise<GitCommandResult>;
    commit(message: string): Promise<GitCommandResult>;
    pull(remote?: string, branch?: string): Promise<GitCommandResult>;
    push(remote?: string, branch?: string): Promise<GitCommandResult>;
    getCurrentBranch(): Promise<string>;
    getBranches(): Promise<string[]>;
  }