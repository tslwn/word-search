/* eslint-disable @typescript-eslint/no-var-requires */
import { app, ipcMain, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const dictionary = 'dictionary.txt';

const buffer = fs.readFileSync(
  path.resolve(__dirname, '..', 'data', dictionary),
);

const { search } = require('native');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(path.join(app.getAppPath(), 'src', 'preload.js')),
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools({ mode: 'detach' });
};

app.on('ready', createWindow);

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

ipcMain.on('search', (event, pattern: string) => {
  event.reply('search-reply', search(buffer, pattern));
});
