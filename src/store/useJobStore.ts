import { create } from 'zustand';
import type { JobItem, JobStatus, ProgressEvent } from '../types/index.js';
import { wsClient } from '../services/wsClient.js';
import { apiClient } from '../services/apiClient.js';

interface JobState {
  activeJob: JobItem | null;
  jobHistory: JobItem[];
  consoleLogs: string[];
  currentSpeed: string;
  currentFps: number;
  overallPercent: number;
  subtaskPercent: number;
  elapsedSeconds: number;
  etaSeconds: number;
  remoteCpuPercent: number;
  remoteGpuPercent: number;

  setActiveJob: (job: JobItem | null) => void;
  updateFromProgressEvent: (event: ProgressEvent) => void;
  submitNewJob: (formData: FormData, filename: string) => Promise<string>;
  cancelActiveJob: () => Promise<void>;
  clearLogs: () => void;
  addConsoleLog: (msg: string) => void;
}

const initialHistory: JobItem[] = [
  { id: 'job_a1b2', filename: 'promo_4k.mp4 → 1080p H.264', client_ip: '192.168.99.2', priority: 'Normal', status: 'completed', percent: 100, elapsed_seconds: 102, eta_seconds: 0, speed: '6.1x', fps: 184 },
  { id: 'job_c3d4', filename: 'trailer_hevc.mov → 4K AV1', client_ip: '192.168.99.2', priority: 'High', status: 'rendering', percent: 68.4, elapsed_seconds: 48, eta_seconds: 22, speed: '3.4x', fps: 144 },
  { id: 'job_e5f6', filename: 'cnn_train.py (ResNet18-Lite)', client_ip: '192.168.99.2', priority: 'Real-Time', status: 'completed', percent: 100, elapsed_seconds: 492, eta_seconds: 0, speed: '1840 img/s', fps: 1840 },
  { id: 'job_g7h8', filename: 'batch_deploy.zip', client_ip: '192.168.99.2', priority: 'Normal', status: 'failed', percent: 8, elapsed_seconds: 3, eta_seconds: 0 }
];

export const useJobStore = create<JobState>((set, get) => ({
  activeJob: {
    id: 'job_c3d4',
    filename: 'promo_4k_final.mp4 → 1080p NVENC P5',
    client_ip: '192.168.99.2',
    priority: 'High',
    status: 'rendering',
    percent: 68.4,
    elapsed_seconds: 98,
    eta_seconds: 42,
    speed: '6.14x',
    fps: 184
  },
  jobHistory: initialHistory,
  consoleLogs: [
    '[14:33:12] [FFmpeg] Input: promo_4k_final.mp4 (3840x2160, 29.97fps, 24.3Mbps H.264)',
    '[14:33:12] [NVENC] Encoder: h264_nvenc P5, Bitrate: 8000kbps, Output: 1920x1080',
    '[14:33:13] frame=  184 fps=184 q=28.0 size=   12288kB time=00:00:06.14 bitrate=16399.1kbits/s speed=6.14x',
    '[14:33:14] frame=  368 fps=184 q=28.0 size=   24576kB time=00:00:12.27 bitrate=16399.0kbits/s speed=6.14x',
    '[14:34:01] [GPU] NVENC throughput: 184 FPS • GPU Util: 92% • VRAM: 4.2GB',
    '[14:34:08] [System] GPU Temperature: 62°C (Normal) • Fan: 55% • Power: 180W',
    '[14:34:22] frame= 2576 fps=184 q=28.0 size=  172032kB time=00:01:26.00 bitrate=16399.1kbits/s speed=6.13x'
  ],
  currentSpeed: '6.14x',
  currentFps: 184,
  overallPercent: 68.4,
  subtaskPercent: 42.0,
  elapsedSeconds: 98,
  etaSeconds: 42,
  remoteCpuPercent: 18,
  remoteGpuPercent: 92,

  setActiveJob: (job) => set({ activeJob: job }),

  updateFromProgressEvent: (event) => {
    if (event.type === 'log' && event.message) {
      set((state) => ({ consoleLogs: [...state.consoleLogs.slice(-200), event.message!] }));
    } else if (event.type === 'progress') {
      set({
        overallPercent: event.percent ?? get().overallPercent,
        currentSpeed: event.speed ?? get().currentSpeed,
        currentFps: event.fps ?? get().currentFps,
        elapsedSeconds: event.elapsed_sec ?? get().elapsedSeconds,
        etaSeconds: event.eta_sec ?? get().etaSeconds,
        remoteCpuPercent: event.cpu_percent ?? get().remoteCpuPercent,
        remoteGpuPercent: event.gpu_util_percent ?? get().remoteGpuPercent,
      });
      if (get().activeJob) {
        set((state) => ({
          activeJob: state.activeJob ? { ...state.activeJob, percent: event.percent ?? state.activeJob.percent, status: event.status ?? state.activeJob.status } : null
        }));
      }
    } else if (event.type === 'state') {
      if (event.status === 'completed' || event.status === 'failed') {
        const active = get().activeJob;
        if (active) {
          const updated = { ...active, status: event.status, percent: event.status === 'completed' ? 100 : active.percent };
          set((state) => ({
            activeJob: updated,
            jobHistory: [updated, ...state.jobHistory]
          }));
        }
      }
    }
  },

  submitNewJob: async (formData, filename) => {
    const tempId = 'job_' + Math.random().toString(36).substring(2, 8);
    const newJob: JobItem = {
      id: tempId,
      filename,
      client_ip: '192.168.99.2',
      priority: 'High',
      status: 'rendering',
      percent: 0,
      elapsed_seconds: 0,
      eta_seconds: 60,
      speed: '0x',
      fps: 0
    };

    set({
      activeJob: newJob,
      overallPercent: 0,
      subtaskPercent: 0,
      consoleLogs: [`[INIT] Job ${tempId} submitted for remote GPU rendering...`, `[UPLOAD] Transferring ${filename} to Worker Node...`]
    });

    try {
      wsClient.connect(tempId);
      wsClient.subscribe((event) => get().updateFromProgressEvent(event));
      apiClient.submitJob(formData).catch(() => {});
    } catch {}

    return tempId;
  },

  cancelActiveJob: async () => {
    const active = get().activeJob;
    if (active) {
      try {
        await apiClient.cancelJob(active.id);
      } catch {}
      set((state) => ({
        activeJob: state.activeJob ? { ...state.activeJob, status: 'cancelled' } : null,
        consoleLogs: [...state.consoleLogs, `[ABORT] Job ${active.id} cancelled by user.`]
      }));
    }
  },

  clearLogs: () => set({ consoleLogs: [] }),

  addConsoleLog: (msg) => set((state) => ({ consoleLogs: [...state.consoleLogs.slice(-200), msg] })),
}));
