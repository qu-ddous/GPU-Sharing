import { ipcMain, dialog, BrowserWindow } from 'electron';

export function setupFileDialogs(mainWindow: BrowserWindow | null) {
  ipcMain.handle('open-file-dialog', async (_event, options?: { title?: string; filters?: Array<{ name: string; extensions: string[] }> }) => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: options?.title || 'Select File',
      properties: ['openFile'],
      filters: options?.filters || [
        { name: 'Video Files', extensions: ['mp4', 'mov', 'mkv', 'avi', 'wmv', 'webm'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('open-directory-dialog', async (_event, options?: { title?: string }) => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      title: options?.title || 'Select Folder',
      properties: ['openDirectory', 'createDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });
}
