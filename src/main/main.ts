// src/main/main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
// import { GitInterface } from './gitInterface';

// Replace electron-is-dev with a simple check
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});