// TypeScript Data Contracts matching Python Pydantic Models

export type JobStatus = 'queued' | 'rendering' | 'completed' | 'failed' | 'cancelled';
export type ResolutionPreset = 'Original' | '720p' | '1080p' | '1440p' | '4K';
export type NvencPreset = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
export type AppMode = 'client' | 'server';

export interface HardwareInfo {
  hostname: string;
  os_platform: string;
  cpu_model: string;
  cpu_cores: number;
  cpu_percent: number;
  ram_total_gb: number;
  ram_used_gb: number;
  gpu_detected: boolean;
  gpu_name?: string;
  gpu_vram_total_mb?: number;
  gpu_vram_used_mb?: number;
  gpu_util_percent?: number;
  gpu_temp_c?: number;
  encoder_util_percent?: number;
}

export interface HealthResponse {
  status: string;
  protocol_version: string;
  server_time: string;
  ffmpeg: {
    available: boolean;
    version?: string;
    nvenc_available: boolean;
    supported_encoders: string[];
  };
  hardware: HardwareInfo;
  limits: {
    max_upload_size_bytes: number;
    max_concurrent_jobs: number;
    active_jobs: number;
  };
}

export interface ProgressEvent {
  type: 'progress' | 'state' | 'log' | 'error';
  job_id: string;
  status?: JobStatus;
  percent?: number;
  elapsed_sec?: number;
  eta_sec?: number;
  speed?: string;
  fps?: number;
  cpu_percent?: number;
  ram_used_gb?: number;
  gpu_util_percent?: number;
  gpu_vram_used_mb?: number;
  message?: string;
  output_size_bytes?: number;
  output_checksum?: string;
}

export interface AIPredictResponse {
  predicted_class: string;
  confidence_percent: number;
  top_candidates: Array<{ label: string; probability: number }>;
  inference_latency_ms: number;
  device_used: string;
}

export interface AITrainingProgress {
  is_training: boolean;
  is_paused?: boolean;
  model_ready?: boolean;
  epoch: number;
  total_epochs: number;
  loss: number;
  accuracy: number;
  speed_fps: number;
  vram_mb: number;
  recent_logs: string[];
  history?: Array<{ epoch: number; loss: number; accuracy: number }>;
}

export interface JobItem {
  id: string;
  filename: string;
  client_ip: string;
  priority: 'Normal' | 'High' | 'Real-Time';
  status: JobStatus;
  percent: number;
  elapsed_seconds: number;
  eta_seconds: number;
  speed?: string;
  fps?: number;
  checksum?: string;
}

export interface DiscoveredServer {
  hostname: string;
  ip: string;
  port: number;
  gpu: string;
  protocol_version: string;
}

export interface ElectronAPI {
  openFileDialog: (options?: { title?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
  openDirectoryDialog: (options?: { title?: string }) => Promise<string | null>;
  computeFileSHA256: (filePath: string) => Promise<string>;
  revealInExplorer: (filePath: string) => Promise<void>;
  unblockFirewall: (port: number) => Promise<{ success: boolean; message: string }>;
  startDiscoveryScan: () => Promise<DiscoveredServer[]>;
  startWatchFolder: (folderPath: string) => Promise<void>;
  stopWatchFolder: () => Promise<void>;
  onWatchFolderNewFile: (callback: (filePath: string) => void) => void;
  compressFolderToZip: (folderPath: string, destZipPath?: string) => Promise<{ success: boolean; zipPath?: string; sizeBytes?: number; sizeMB?: string; error?: string }>;
  getAppMode: () => Promise<AppMode>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    __GPUSHARE_MODE__?: AppMode;
  }
}
