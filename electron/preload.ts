import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI, DiscoveredServer, AppMode } from '../src/types/index.js';

const electronAPI: ElectronAPI = {
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  openDirectoryDialog: (options) => ipcRenderer.invoke('open-directory-dialog', options),
  computeFileSHA256: (filePath) => ipcRenderer.invoke('compute-file-sha256', filePath),
  revealInExplorer: (filePath) => ipcRenderer.invoke('reveal-in-explorer', filePath),
  unblockFirewall: (port) => ipcRenderer.invoke('unblock-firewall', port),
  startDiscoveryScan: () => ipcRenderer.invoke('start-discovery-scan'),
  startWatchFolder: (folderPath) => ipcRenderer.invoke('start-watch-folder', folderPath),
  stopWatchFolder: () => ipcRenderer.invoke('stop-watch-folder'),
  onWatchFolderNewFile: (callback) => {
    ipcRenderer.on('watch-folder-new-file', (_event, filePath) => callback(filePath));
  },
  compressFolderToZip: (folderPath, destZipPath) => ipcRenderer.invoke('compress-folder', folderPath, destZipPath),
  getAppMode: () => ipcRenderer.invoke('get-app-mode'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
