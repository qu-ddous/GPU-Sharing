import { create } from 'zustand';
import type { HardwareInfo, HealthResponse } from '../types/index.js';
import { apiClient } from '../services/apiClient.js';
import { wsClient } from '../services/wsClient.js';
import { notifyToast } from './useToastStore.js';

interface ServerState {
  serverIp: string;
  serverPort: number;
  apiToken: string;
  isConnected: boolean;
  latencyMs: number;
  nvencReady: boolean;
  hardware: HardwareInfo;
  isScanning: boolean;
  lastPingTime: number;

  setServerIp: (ip: string) => void;
  setServerPort: (port: number) => void;
  setApiToken: (token: string) => void;
  connect: (ip?: string, port?: number) => Promise<boolean>;
  disconnect: () => void;
  fetchHealth: () => Promise<void>;
  setIsScanning: (scanning: boolean) => void;
}

const emptyHardware: HardwareInfo = {
  hostname: 'Not Connected',
  os_platform: 'Awaiting Connection',
  cpu_model: 'Host Processor',
  cpu_cores: 0,
  cpu_percent: 0,
  ram_total_gb: 0,
  ram_used_gb: 0,
  gpu_detected: false,
  gpu_name: 'No GPU Detected',
  gpu_vram_total_mb: 0,
  gpu_vram_used_mb: 0,
  gpu_util_percent: 0,
  gpu_temp_c: 0,
  encoder_util_percent: 0,
};

let healthPollInterval: any = null;

export const useServerStore = create<ServerState>((set, get) => ({
  serverIp: '192.168.99.1',
  serverPort: 8000,
  apiToken: '',
  isConnected: false,
  latencyMs: 0,
  nvencReady: false,
  hardware: emptyHardware,
  isScanning: false,
  lastPingTime: 0,

  setServerIp: (ip: string) => {
    set({ serverIp: ip });
    apiClient.setBaseURL(`http://${ip}:${get().serverPort}`);
    wsClient.setServerUrl(`http://${ip}:${get().serverPort}`);
  },

  setServerPort: (port: number) => {
    set({ serverPort: port });
    apiClient.setBaseURL(`http://${get().serverIp}:${port}`);
    wsClient.setServerUrl(`http://${get().serverIp}:${port}`);
  },

  setApiToken: (token: string) => {
    set({ apiToken: token });
    apiClient.setToken(token);
  },

  connect: async (ip?: string, port?: number) => {
    const targetIp = ip || get().serverIp;
    const targetPort = port || get().serverPort;

    apiClient.setBaseURL(`http://${targetIp}:${targetPort}`);
    wsClient.setServerUrl(`http://${targetIp}:${targetPort}`);

    const res = await apiClient.ping();

    if (res.pong) {
      set({ isConnected: true, latencyMs: res.latency, serverIp: targetIp, serverPort: targetPort });
      await get().fetchHealth();

      // Poll real health every 3 seconds
      if (healthPollInterval) clearInterval(healthPollInterval);
      healthPollInterval = setInterval(() => {
        if (get().isConnected) {
          get().fetchHealth();
        }
      }, 3000);

      notifyToast('Worker Node Connected', `Paired with ${targetIp}:${targetPort} (${res.latency.toFixed(1)} ms)`, 'success');
      return true;
    } else {
      set({ isConnected: false, latencyMs: 0 });
      notifyToast('Connection Failed', `Unable to reach Worker Node at ${targetIp}:${targetPort}`, 'error');
      return false;
    }
  },

  disconnect: () => {
    if (healthPollInterval) {
      clearInterval(healthPollInterval);
      healthPollInterval = null;
    }
    set({ isConnected: false, hardware: emptyHardware });
  },

  fetchHealth: async () => {
    try {
      const data: HealthResponse = await apiClient.getHealth();
      set({
        isConnected: true,
        nvencReady: data.ffmpeg?.nvenc_available ?? false,
        hardware: data.hardware,
        lastPingTime: Date.now()
      });
    } catch {
      set({ isConnected: false });
    }
  },

  setIsScanning: (scanning: boolean) => set({ isScanning: scanning })
}));
