import { create } from 'zustand';
import type { JobItem, JobStatus, ProgressEvent } from '../types/index.js';
import { wsClient } from '../services/wsClient.js';
import { apiClient } from '../services/apiClient.js';
import { notifyToast } from './useToastStore.js';

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

export const useJobStore = create<JobState>((set, get) => ({
  activeJob: null,
  jobHistory: [],
  consoleLogs: [],
  currentSpeed: '0.0x',
  currentFps: 0,
  overallPercent: 0,
  subtaskPercent: 0,
  elapsedSeconds: 0,
  etaSeconds: 0,
  remoteCpuPercent: 0,
  remoteGpuPercent: 0,

  setActiveJob: (job) => set({ activeJob: job }),

  updateFromProgressEvent: (event) => {
    set((state) => {
      const active = state.activeJob;
      if (!active) return state;

      const pct = event.percent ?? active.percent;
      const elapsed = event.elapsed_sec ?? active.elapsed_seconds;
      const eta = event.eta_sec ?? active.eta_seconds;
      const spd = event.speed ?? active.speed ?? '0x';
      const fps = event.fps ?? active.fps ?? 0;

      const newStatus = (event.status as JobStatus) || active.status;
      if (newStatus === 'completed' && active.status !== 'completed') {
        notifyToast('Render Completed!', `${active.filename} finished on remote GPU.`, 'success');
      } else if (newStatus === 'failed' && active.status !== 'failed') {
        notifyToast('Task Failed', `${active.filename} encountered an error.`, 'error');
      }

      const updatedJob: JobItem = {
        ...active,
        percent: pct,
        elapsed_seconds: elapsed,
        eta_seconds: eta,
        speed: spd,
        fps: fps,
        status: newStatus,
      };

      const newLogs = event.message 
        ? [...state.consoleLogs, event.message].slice(-500) 
        : state.consoleLogs;

      return {
        activeJob: updatedJob,
        overallPercent: pct,
        subtaskPercent: pct,
        currentSpeed: spd,
        currentFps: fps,
        elapsedSeconds: elapsed,
        etaSeconds: eta,
        remoteCpuPercent: event.cpu_percent ?? state.remoteCpuPercent,
        remoteGpuPercent: event.gpu_util_percent ?? state.remoteGpuPercent,
        consoleLogs: newLogs,
      };
    });
  },

  submitNewJob: async (formData, filename) => {
    try {
      const resp = await apiClient.submitJob(formData);
      const newJob: JobItem = {
        id: resp.job_id,
        filename,
        client_ip: 'Local Client',
        priority: 'Normal',
        status: 'rendering',
        percent: 0,
        elapsed_seconds: 0,
        eta_seconds: 0,
        speed: '0x',
        fps: 0,
      };

      set((state) => ({
        activeJob: newJob,
        overallPercent: 0,
        subtaskPercent: 0,
        consoleLogs: [`[Client] Workload "${filename}" transmitted to remote worker node (ID: ${resp.job_id})`],
        jobHistory: [newJob, ...state.jobHistory],
      }));

      // Connect real WebSocket stream
      wsClient.connect(resp.job_id);
      wsClient.subscribe((event: ProgressEvent) => {
        get().updateFromProgressEvent(event);
      });

      notifyToast('Workload Offloaded', `"${filename}" dispatched to remote GPU (${resp.job_id})`, 'info');
      return resp.job_id;
    } catch (err: any) {
      console.error('Job submission failed:', err);
      notifyToast('Submission Failed', 'Could not transmit job to Worker Node.', 'error');
      throw err;
    }
  },

  cancelActiveJob: async () => {
    const active = get().activeJob;
    if (active) {
      try {
        await apiClient.cancelJob(active.id);
      } catch {}
      set((state) => ({
        activeJob: state.activeJob ? { ...state.activeJob, status: 'failed' } : null,
        consoleLogs: [...state.consoleLogs, `[Client] Task ${active.id} cancelled by user.`],
      }));
      notifyToast('Task Cancelled', `Job ${active.id} stopped on Worker Node.`, 'warning');
    }
  },

  clearLogs: () => set({ consoleLogs: [] }),
  addConsoleLog: (msg) => set((s) => ({ consoleLogs: [...s.consoleLogs, msg].slice(-500) }))
}));
