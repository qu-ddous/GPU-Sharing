import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { setupFileDialogs } from './ipc/file-dialogs';
import { setupHasher } from './ipc/hasher';
import { setupFirewall } from './ipc/firewall';
import { setupDiscovery } from './ipc/discovery';
import { setupWatcher } from './ipc/watcher';
import { setupArchiver } from './ipc/archiver';

let mainWindow: BrowserWindow | null = null;

// Determine app mode: passed via command line --mode=client or --mode=server, or detected via executable name
const modeArg = process.argv.find(arg => arg.startsWith('--mode='));
const exeName = path.basename(process.execPath).toLowerCase();
const appMode = modeArg ? modeArg.split('=')[1] : (exeName.includes('server') ? 'server' : 'client');

process.on('uncaughtException', (err) => {
  console.error('Fatal Uncaught Exception:', err);
  try {
    dialog.showErrorBox('Fatal Error in Main Process', String(err?.stack || err));
  } catch {}
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1200,
    minHeight: 800,
    title: 'GPUShare Studio',
    backgroundColor: '#F8FAFC',
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    autoHideMenuBar: true,
  });

  // Inject initial mode
  ipcMain.handle('get-app-mode', () => appMode);

  // Register all IPC modules safely
  try {
    setupFileDialogs(mainWindow);
    setupHasher();
    setupFirewall();
    setupDiscovery();
    setupWatcher(mainWindow);
    setupArchiver();
  } catch (err) {
    console.error('IPC initialization error:', err);
  }

  // Shell reveal helper
  ipcMain.handle('reveal-in-explorer', async (_event, filePath: string) => {
    shell.showItemInFolder(filePath);
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    if (!validatedURL.includes('localhost')) {
      dialog.showErrorBox(
        'GPUShare Load Error',
        `Failed to load URL: ${validatedURL}\nError: ${errorDescription} (${errorCode})`
      );
    }
  });

  const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || process.argv.includes('--dev'));
  if (isDev) {
    try {
      await mainWindow.loadURL('http://localhost:5173');
    } catch {
      await mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
    }
  } else {
    // In packaged app, load built dist/index.html
    const appDir = app.getAppPath();
    const candidatePaths = [
      path.join(appDir, 'dist/index.html'),
      path.join(__dirname, '../../dist/index.html'),
      path.join(__dirname, '../dist/index.html')
    ];
    let loaded = false;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        await mainWindow.loadFile(p);
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      await mainWindow.loadFile(path.join(appDir, 'dist/index.html'));
    }
  }

  mainWindow.show();
  mainWindow.focus();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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
