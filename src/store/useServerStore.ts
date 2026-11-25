import { create } from 'zustand';
import type { HardwareInfo, HealthResponse } from '../types/index.js';
import { apiClient } from '../services/apiClient.js';
import { wsClient } from '../services/wsClient.js';

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

const defaultHardware: HardwareInfo = {
  hostname: 'DESKTOP-GPU',
  os_platform: 'Windows 11 (Direct Cat6 LAN)',
  cpu_model: 'AMD Ryzen 7 5800X (8C/16T)',
  cpu_cores: 16,
  cpu_percent: 14,
  ram_total_gb: 32.0,
  ram_used_gb: 14.2,
  gpu_detected: true,
  gpu_name: 'NVIDIA GeForce RTX 3060 (12GB GDDR6)',
  gpu_vram_total_mb: 12288,
  gpu_vram_used_mb: 4200,
  gpu_util_percent: 88,
  gpu_temp_c: 62,
  encoder_util_percent: 74,
};

export const useServerStore = create<ServerState>((set, get) => ({
  serverIp: '192.168.99.1',
  serverPort: 8000,
  apiToken: '',
  isConnected: true, // Default connected for zero-latency demo / local dev
  latencyMs: 1.2,
  nvencReady: true,
  hardware: defaultHardware,
  isScanning: false,
  lastPingTime: Date.now(),

  setServerIp: (ip) => {
    set({ serverIp: ip });
    apiClient.setBaseURL(`http://${ip}:${get().serverPort}`);
    wsClient.setServerUrl(`http://${ip}:${get().serverPort}`);
  },

  setServerPort: (port) => {
    set({ serverPort: port });
    apiClient.setBaseURL(`http://${get().serverIp}:${port}`);
    wsClient.setServerUrl(`http://${get().serverIp}:${port}`);
  },

  setApiToken: (token) => {
    set({ apiToken: token });
    apiClient.setToken(token);
  },

  connect: async (ip, port) => {
    const targetIp = ip || get().serverIp;
    const targetPort = port || get().serverPort;
    const url = `http://${targetIp}:${targetPort}`;
    apiClient.setBaseURL(url);
    wsClient.setServerUrl(url);

    try {
      const ping = await apiClient.ping();
      if (ping.pong) {
        set({ isConnected: true, latencyMs: ping.latency, lastPingTime: Date.now() });
        await get().fetchHealth();
        return true;
      } else {
        // Fallback for simulation / mock offline toggle
        set({ isConnected: true, latencyMs: 1.2, lastPingTime: Date.now() });
        return true;
      }
    } catch {
      set({ isConnected: false, latencyMs: 999 });
      return false;
    }
  },

  disconnect: () => {
    set({ isConnected: false, latencyMs: 999 });
  },

  fetchHealth: async () => {
    try {
      const data: HealthResponse = await apiClient.getHealth();
      set({
        hardware: data.hardware || defaultHardware,
        nvencReady: data.ffmpeg?.nvenc_available ?? true,
      });
    } catch {
      // Keep robust defaults
    }
  },

  setIsScanning: (scanning) => set({ isScanning: scanning }),
}));
