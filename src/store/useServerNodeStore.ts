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
  cancelJob: (jobId: string) => void;
  purgeJob: (jobId: string) => void;
  clearLogs: () => void;
  saveSettings: (settings: Partial<ServerNodeState>) => void;
}

const initialSessions: ClientSession[] = [
  { ip: '192.168.99.2', port: 52140, duration: '01h 42m', latency: '0.8 ms', bytesReceived: '3,420 MB', bytesSent: '1,890 MB', status: 'Active' },
  { ip: '192.168.99.3', port: 48922, duration: '24m 10s', latency: '1.4 ms', bytesReceived: '120 MB', bytesSent: '45 MB', status: 'Idle' }
];

const initialEvents = [
  { id: '1', timestamp: '14:32:01', level: 'SUCCESS' as const, source: '[NVENC]', message: 'promo_4k.mp4 rendered at 184 FPS — Output: promo_4k_remote_1080p.mp4' },
  { id: '2', timestamp: '14:28:45', level: 'INFO' as const, source: '[FastAPI]', message: 'New client connected: 192.168.99.2 (latency 0.8ms)' },
  { id: '3', timestamp: '14:21:12', level: 'SUCCESS' as const, source: '[PyTorch]', message: 'CNN training complete — Epoch 10/10 Acc: 97.2% Loss: 0.028' },
  { id: '4', timestamp: '14:15:03', level: 'WARNING' as const, source: '[NVENC]', message: 'h264_nvenc fallback test — verified auto-switch to libx264' },
  { id: '5', timestamp: '14:10:55', level: 'INFO' as const, source: '[System]', message: 'GPU temperature stable at 62°C — VRAM 4.2/12.0 GB' },
  { id: '6', timestamp: '14:05:18', level: 'INFO' as const, source: '[Network]', message: 'Direct Ethernet Cat6 adapter linked at 1.0 Gbps Full Duplex' }
];

export const useServerNodeStore = create<ServerNodeState>((set) => ({
  daemonOnline: true,
  workerIp: '192.168.99.1',
  workerPort: 8000,
  activeClientCount: 2,
  totalTransferredBytes: 5153960755,
  totalTransferredDisplay: '4.8 GB',
  averageFps: 184,
  renderQueue: [
    { id: '001', filename: 'promo_4k.mp4 → 1080p H.264', client_ip: '192.168.99.2', priority: 'Normal', status: 'rendering', percent: 68.4, elapsed_seconds: 98, eta_seconds: 14, fps: 184 },
    { id: '002', filename: 'trailer_hevc.mov → 4K AV1', client_ip: '192.168.99.2', priority: 'High', status: 'queued', percent: 0, elapsed_seconds: 0, eta_seconds: 102 },
    { id: '003', filename: 'cnn_training.py (ResNet18)', client_ip: '192.168.99.3', priority: 'Real-Time', status: 'rendering', percent: 34.0, elapsed_seconds: 45, eta_seconds: 88, fps: 1840 },
    { id: '004', filename: 'batch_deploy.zip', client_ip: '192.168.99.2', priority: 'Normal', status: 'completed', percent: 100, elapsed_seconds: 24, eta_seconds: 0 },
    { id: '005', filename: 'documentary.mkv → 1440p', client_ip: '192.168.99.4', priority: 'Normal', status: 'failed', percent: 12.0, elapsed_seconds: 4, eta_seconds: 0 }
  ],
  activeSessions: initialSessions,
  eventLogs: initialEvents,

  autoStartOnBoot: false,
  minimizeToTray: true,
  autoReconnect: true,
  maxConcurrentJobs: 2,
  defaultResolution: '1080p',
  defaultBitrate: '8M',
  defaultPreset: 'p5',
  defaultContainer: 'MP4 (H.264)',
  uploadTempDir: 'C:\\GPUShare\\Temp\\Uploads',
  renderOutputDir: 'C:\\GPUShare\\Output',
  requireApiToken: false,
  apiSecretToken: 'gpu_sec_' + Math.random().toString(36).substring(2, 10),

  toggleDaemon: () => set((state) => ({ daemonOnline: !state.daemonOnline })),

  cancelJob: (jobId) =>
    set((state) => ({
      renderQueue: state.renderQueue.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j)),
      eventLogs: [{ id: String(Date.now()), timestamp: new Date().toLocaleTimeString(), level: 'WARNING', source: '[Manager]', message: `Job #${jobId} cancelled by server operator.` }, ...state.eventLogs]
    })),

  purgeJob: (jobId) =>
    set((state) => ({
      renderQueue: state.renderQueue.filter((j) => j.id !== jobId)
    })),

  clearLogs: () => set({ eventLogs: [] }),

  saveSettings: (settings) => set((state) => ({ ...state, ...settings })),
}));
