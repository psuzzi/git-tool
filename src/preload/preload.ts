import { contextBridge, ipcRenderer } from 'electron';
import { GitCommandResult } from '../types/global';

contextBridge.exposeInMainWorld('electron', {
    gitCommand: async (command: string, args?: string[]): Promise<GitCommandResult> => {
        return ipcRenderer.invoke('git-command', { command, args });
    }
});