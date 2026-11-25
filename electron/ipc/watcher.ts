import { ipcMain, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';

let nativeWatcher: fs.FSWatcher | null = null;
const fileStabilityCache = new Map<string, { size: number; lastChecked: number; stableCount: number }>();
const activeDebounceTimers = new Map<string, NodeJS.Timeout>();

export function setupWatcher(mainWindow: BrowserWindow | null) {
  ipcMain.handle('start-watch-folder', async (_event, folderPath: string) => {
    // Clean up any existing watcher
    if (nativeWatcher) {
      nativeWatcher.close();
      nativeWatcher = null;
    }
    for (const timer of activeDebounceTimers.values()) {
      clearInterval(timer);
    }
    activeDebounceTimers.clear();
    fileStabilityCache.clear();

    if (!fs.existsSync(folderPath)) {
      throw new Error(`Watch folder does not exist: ${folderPath}`);
    }

    const VALID_EXTS = ['.mp4', '.mov', '.mkv', '.avi', '.wmv', '.flv', '.ts', '.webm', '.m4v'];

    try {
      // Native Node.js watcher with recursive support on Windows
      nativeWatcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        const fullPath = path.isAbsolute(filename) ? filename : path.join(folderPath, filename);
        const lower = filename.toLowerCase();

        // Filter temporary or non-target files
        if (lower.endsWith('.tmp') || lower.endsWith('.crdownload') || lower.endsWith('.part') || lower.includes('_remote_')) {
          return;
        }

        const isValidExt = VALID_EXTS.some(ext => lower.endsWith(ext));
        if (!isValidExt) return;

        // Debounce: ensure file is done copying / downloading
        if (activeDebounceTimers.has(fullPath)) return;

        const checkInterval = setInterval(() => {
          try {
            if (!fs.existsSync(fullPath)) {
              clearInterval(checkInterval);
              activeDebounceTimers.delete(fullPath);
              fileStabilityCache.delete(fullPath);
              return;
            }

            const stats = fs.statSync(fullPath);
            const currentSize = stats.size;
            const entry = fileStabilityCache.get(fullPath) || { size: currentSize, lastChecked: Date.now(), stableCount: 0 };

            if (currentSize === entry.size && currentSize > 0) {
              entry.stableCount += 1;
            } else {
              entry.size = currentSize;
              entry.stableCount = 0;
            }
            entry.lastChecked = Date.now();
            fileStabilityCache.set(fullPath, entry);

            // Stable for 2 consecutive 1-second checks
            if (entry.stableCount >= 2) {
              clearInterval(checkInterval);
              activeDebounceTimers.delete(fullPath);
              fileStabilityCache.delete(fullPath);

              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('watch-folder-new-file', fullPath);
              }
            }
          } catch {
            clearInterval(checkInterval);
            activeDebounceTimers.delete(fullPath);
            fileStabilityCache.delete(fullPath);
          }
        }, 1000);

        activeDebounceTimers.set(fullPath, checkInterval);
      });

      return true;
    } catch (err: any) {
      console.error('Failed to initialize native folder watcher:', err);
      throw err;
    }
  });

  ipcMain.handle('stop-watch-folder', async () => {
    if (nativeWatcher) {
      nativeWatcher.close();
      nativeWatcher = null;
    }
    for (const timer of activeDebounceTimers.values()) {
      clearInterval(timer);
    }
    activeDebounceTimers.clear();
    fileStabilityCache.clear();
    return true;
  });
}
