import { create } from 'zustand';
import type { JobItem } from '../types/index.js';

export interface ClientSession {
  ip: string;
  port: number;
  duration: string;
  latency: string;
  bytesReceived: string;
  bytesSent: string;
  status: 'Active' | 'Idle';
}

interface ServerNodeState {
  daemonOnline: boolean;
  workerIp: string;
  workerPort: number;
  activeClientCount: number;
  totalTransferredBytes: number;
  totalTransferredDisplay: string;
  averageFps: number;
  renderQueue: JobItem[];
  activeSessions: ClientSession[];
  eventLogs: Array<{
    id: string;
    timestamp: string;
    level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    source: string;
    message: string;
  }>;

  // Real Host Hardware Metrics
  cpuPercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  gpuName: string;
  gpuUtilPercent: number;
  vramUsedMb: number;
  vramTotalMb: number;
  gpuTempC: number;

  // Settings
  autoStartOnBoot: boolean;
  minimizeToTray: boolean;
  autoReconnect: boolean;
  maxConcurrentJobs: number;
  defaultResolution: string;
  defaultBitrate: string;
  defaultPreset: string;
  defaultContainer: string;
  uploadTempDir: string;
  renderOutputDir: string;
  requireApiToken: boolean;
  apiSecretToken: string;

  toggleDaemon: () => void;
  setDaemonOnline: (online: boolean) => void;
  cancelJob: (jobId: string) => void;
  purgeJob: (jobId: string) => void;
  clearLogs: () => void;
  addEventLog: (level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', source: string, message: string) => void;
  updateHardwareStats: (stats: any) => void;
  saveSettings: (settings: Partial<ServerNodeState>) => void;
}

export const useServerNodeStore = create<ServerNodeState>((set, get) => ({
  daemonOnline: true,
  workerIp: '192.168.99.1',
  workerPort: 8000,
  activeClientCount: 0,
  totalTransferredBytes: 0,
  totalTransferredDisplay: '0 MB',
  averageFps: 0,
  renderQueue: [],
  activeSessions: [],
  eventLogs: [
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      source: '[Daemon]',
      message: 'Worker Server Node ready. Listening for client connections on Port 8000.'
    }
  ],

  cpuPercent: 0,
  ramUsedGb: 0,
  ramTotalGb: 0,
  gpuName: 'Detecting GPU...',
  gpuUtilPercent: 0,
  vramUsedMb: 0,
  vramTotalMb: 0,
  gpuTempC: 0,

  autoStartOnBoot: false,
  minimizeToTray: false,
  autoReconnect: true,
  maxConcurrentJobs: 2,
  defaultResolution: '1080p',
  defaultBitrate: '8M',
  defaultPreset: 'p5',
  defaultContainer: 'mp4',
  uploadTempDir: 'C:\\GPUShare\\uploads',
  renderOutputDir: 'C:\\GPUShare\\output',
  requireApiToken: false,
  apiSecretToken: '',

  toggleDaemon: () => {
    const next = !get().daemonOnline;
    set({ daemonOnline: next });
    get().addEventLog(
      next ? 'SUCCESS' : 'WARNING',
      '[Daemon]',
      next ? 'Worker Server daemon resumed.' : 'Worker Server daemon paused by operator.'
    );
  },

  setDaemonOnline: (online) => set({ daemonOnline: online }),

  cancelJob: (jobId) => {
    set((state) => ({
      renderQueue: state.renderQueue.map((j) => (j.id === jobId ? { ...j, status: 'failed' } : j)),
    }));
    get().addEventLog('WARNING', '[Queue]', `Job ${jobId} was manually cancelled.`);
  },

  purgeJob: (jobId) => {
    set((state) => ({
      renderQueue: state.renderQueue.filter((j) => j.id !== jobId),
    }));
    get().addEventLog('INFO', '[Queue]', `Job ${jobId} was purged from queue.`);
  },

  clearLogs: () => set({ eventLogs: [] }),

  addEventLog: (level, source, message) => {
    const newLog = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString(),
      level,
      source,
      message,
    };
    set((state) => ({ eventLogs: [newLog, ...state.eventLogs].slice(0, 500) }));
  },

  updateHardwareStats: (stats) => {
    set({
      cpuPercent: stats.cpu_percent || 0,
      ramUsedGb: stats.ram_used_gb || 0,
      ramTotalGb: stats.ram_total_gb || 0,
      gpuName: stats.gpu_name || 'Multi-Core CPU Mode',
      gpuUtilPercent: stats.gpu_util_percent || 0,
      vramUsedMb: stats.gpu_vram_used_mb || 0,
      vramTotalMb: stats.gpu_vram_total_mb || 0,
      gpuTempC: stats.gpu_temp_c || 0,
    });
  },

  saveSettings: (settings) => set((state) => ({ ...state, ...settings }))
}));
