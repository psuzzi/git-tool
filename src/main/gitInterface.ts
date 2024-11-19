import { spawn } from 'child_process';
import { GitCommandResult } from '../types/global';

export class GitInterface {
    private repoPath: string;

    constructor(repoPath: string) {
        this.repoPath = repoPath;
    }

    async executeGitCommand(command: string, args: string[] = []): Promise<GitCommandResult> {
        return new Promise((resolve, reject) => {
            const gitProcess = spawn('git', [command, ...args], {
                cwd: this.repoPath,
                env: process.env
            });

            let stdout = '';
            let stderr = '';

            gitProcess.stdout.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            gitProcess.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            gitProcess.on('close', (code: number) => {
                if (code === 0) {
                    resolve({
                        success: true,
                        output: stdout.trim(),
                        command: `git ${command} ${args.join(' ')}`
                    });
                } else {
                    reject({
                        success: false,
                        error: stderr.trim(),
                        command: `git ${command} ${args.join(' ')}`,
                        code
                    });
                }
            });

            gitProcess.on('error', (error: Error) => {
                reject({
                    success: false,
                    error: error.message,
                    command: `git ${command} ${args.join(' ')}`
                });
            });
        });
    }

    async status(): Promise<GitCommandResult> {
        return this.executeGitCommand('status');
    }

    async add(files: string[] = ['.']): Promise<GitCommandResult> {
        return this.executeGitCommand('add', files);
    }

    async commit(message: string): Promise<GitCommandResult> {
        return this.executeGitCommand('commit', ['-m', message]);
    }

    async pull(remote: string = 'origin', branch: string = 'main'): Promise<GitCommandResult> {
        return this.executeGitCommand('pull', [remote, branch]);
    }

    async push(remote: string = 'origin', branch: string = 'main'): Promise<GitCommandResult> {
        return this.executeGitCommand('push', [remote, branch]);
    }

    async getCurrentBranch(): Promise<string> {
        const result = await this.executeGitCommand('branch', ['--show-current']);
        return result.output ?? '';  // Using nullish coalescing operator to provide default value
    }

    async getBranches(): Promise<string[]> {
        const result = await this.executeGitCommand('branch');
        return (result.output ?? '').split('\n')  // Using nullish coalescing operator
            .map(branch => branch.trim())
            .filter(branch => branch.length > 0);
    }
}