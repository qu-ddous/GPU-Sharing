import { create } from 'zustand';
import type { AIPredictResponse, AITrainingProgress } from '../types/index.js';
import { apiClient } from '../services/apiClient.js';
import { notifyToast } from './useToastStore.js';

interface AIState {
  isTraining: boolean;
  isPaused: boolean;
  modelReady: boolean;
  isUploadingDataset: boolean;
  modelArch: 'ResNet18-Lite' | 'MobileNetV2-Lite' | 'SimpleCNN';
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'Adam' | 'SGD with Momentum';
  hardwareTarget: 'Remote NVIDIA GPU (CUDA)' | 'Local CPU';
  datasetName: string;
  totalDatasetImages: number;

  trainingProgress: AITrainingProgress;
  lensResult: AIPredictResponse | null;
  isPredicting: boolean;
  benchmarkResult: {
    cpuThroughput: number;
    gpuThroughput: number;
    speedupMultiplier: number;
  } | null;
  isBenchmarking: boolean;

  setModelArch: (arch: any) => void;
  setEpochs: (n: number) => void;
  setBatchSize: (n: number) => void;
  setLearningRate: (n: number) => void;
  setOptimizer: (opt: any) => void;
  setHardwareTarget: (target: any) => void;
  setDataset: (name: string, count: number) => void;
  uploadDataset: (file: File) => Promise<void>;
  startTraining: () => Promise<void>;
  pauseTraining: () => Promise<void>;
  resumeTraining: () => Promise<void>;
  cancelTraining: () => Promise<void>;
  downloadTrainedModel: () => void;
  downloadTrainingReport: () => void;
  classifyImage: (file: File | Blob, filename?: string) => Promise<void>;
  runCpuVsGpuBenchmark: () => Promise<void>;
}

let trainingPollTimer: any = null;

export const useAIStore = create<AIState>((set, get) => ({
  isTraining: false,
  isPaused: false,
  modelReady: false,
  isUploadingDataset: false,
  modelArch: 'ResNet18-Lite',
  epochs: 10,
  batchSize: 64,
  learningRate: 0.001,
  optimizer: 'Adam',
  hardwareTarget: 'Remote NVIDIA GPU (CUDA)',
  datasetName: 'GPUShare 100,000 Benchmark Dataset',
  totalDatasetImages: 100000,

  trainingProgress: {
    is_training: false,
    is_paused: false,
    model_ready: false,
    epoch: 0,
    total_epochs: 10,
    loss: 0.0,
    accuracy: 0.0,
    speed_fps: 0,
    vram_mb: 0,
    recent_logs: [
      '[System] PyTorch CUDA deep learning engine ready on remote workstation.',
      '[System] Select dataset & hyperparameters and click "Start Remote Training on GPU".'
    ],
    history: []
  },

  lensResult: null,
  isPredicting: false,

  benchmarkResult: null,
  isBenchmarking: false,

  setModelArch: (arch) => set({ modelArch: arch }),
  setEpochs: (epochs) => set({ epochs }),
  setBatchSize: (batchSize) => set({ batchSize }),
  setLearningRate: (learningRate) => set({ learningRate }),
  setOptimizer: (optimizer) => set({ optimizer }),
  setHardwareTarget: (hardwareTarget) => set({ hardwareTarget }),
  setDataset: (name, count) => set({ datasetName: name, totalDatasetImages: count }),

  uploadDataset: async (file: File) => {
    set({ isUploadingDataset: true });
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await apiClient.uploadAIDataset(fd);
      set({
        datasetName: res.dataset_name || file.name,
        totalDatasetImages: res.image_count || 1,
        isUploadingDataset: false
      });
      notifyToast('Dataset Uploaded', `${res.image_count} images loaded onto Worker Node.`, 'success');
    } catch {
      set({ isUploadingDataset: false });
      notifyToast('Dataset Upload Failed', 'Ensure Worker Node is connected before uploading dataset.', 'error');
    }
  },

  startTraining: async () => {
    const total = get().epochs;
    try {
      await apiClient.startAITraining({
        model_arch: get().modelArch,
        epochs: total,
        batch_size: get().batchSize,
        learning_rate: get().learningRate,
        optimizer: get().optimizer,
        use_gpu: get().hardwareTarget.includes('GPU')
      });

      set({
        isTraining: true,
        isPaused: false,
        modelReady: false,
        trainingProgress: {
          is_training: true,
          is_paused: false,
          model_ready: false,
          epoch: 0,
          total_epochs: total,
          loss: 0,
          accuracy: 0,
          speed_fps: 0,
          vram_mb: 0,
          recent_logs: [`[Engine] Starting real PyTorch ${get().modelArch} training on Worker Node...`],
          history: []
        }
      });

      notifyToast('Training Started', `${get().modelArch} running on remote Worker Node.`, 'info');

      if (trainingPollTimer) clearInterval(trainingPollTimer);
      trainingPollTimer = setInterval(async () => {
        try {
          const prog: AITrainingProgress = await apiClient.getAIProgress();
          set({
            isTraining: prog.is_training,
            isPaused: Boolean(prog.is_paused),
            modelReady: Boolean(prog.model_ready),
            trainingProgress: prog
          });

          if (!prog.is_training) {
            clearInterval(trainingPollTimer);
            trainingPollTimer = null;
            if (prog.model_ready) {
              notifyToast(
                'Training Complete!',
                `Final Accuracy: ${prog.accuracy.toFixed(1)}% • Model (.pth) ready to download.`,
                'success'
              );
            }
          }
        } catch {
          clearInterval(trainingPollTimer);
          trainingPollTimer = null;
          set({ isTraining: false });
        }
      }, 600);
    } catch {
      notifyToast('Training Failed', 'Worker Node unreachable. Connect to server first.', 'error');
    }
  },

  pauseTraining: async () => {
    try {
      await apiClient.pauseAITraining();
      set({ isPaused: true });
      notifyToast('Training Paused', 'PyTorch epoch loop paused on Worker Node.', 'warning');
    } catch {}
  },

  resumeTraining: async () => {
    try {
      await apiClient.resumeAITraining();
      set({ isPaused: false });
      notifyToast('Training Resumed', 'PyTorch epoch loop resumed.', 'info');
    } catch {}
  },

  cancelTraining: async () => {
    if (trainingPollTimer) {
      clearInterval(trainingPollTimer);
      trainingPollTimer = null;
    }
    try {
      await apiClient.cancelAITraining();
    } catch {}
    set((state) => ({
      isTraining: false,
      isPaused: false,
      trainingProgress: {
        ...state.trainingProgress,
        is_training: false,
        recent_logs: ['[Abort] Training loop stopped by operator.', ...state.trainingProgress.recent_logs]
      }
    }));
    notifyToast('Training Cancelled', 'PyTorch training aborted.', 'warning');
  },

  downloadTrainedModel: () => {
    const url = apiClient.getAIModelDownloadUrl();
    window.open(url, '_blank');
    notifyToast('Downloading Model', 'Fetching trained .pth weights from Worker Node.', 'success');
  },

  downloadTrainingReport: () => {
    const url = apiClient.getAIReportDownloadUrl();
    window.open(url, '_blank');
    notifyToast('Downloading Report', 'Fetching training_report.json from Worker Node.', 'success');
  },

  classifyImage: async (file, filename) => {
    set({ isPredicting: true });
    const fd = new FormData();
    fd.append('file', file, filename || (file instanceof File ? file.name : 'sample.jpg'));
    try {
      const res = await apiClient.predictImage(fd);
      set({ lensResult: res, isPredicting: false });
      notifyToast('Classification Complete', `${res.predicted_class} (${res.confidence_percent}%)`, 'success');
    } catch {
      set({ isPredicting: false });
      notifyToast('Classification Failed', 'Connect to Worker Node to run remote vision inference.', 'error');
    }
  },

  runCpuVsGpuBenchmark: async () => {
    set({ isBenchmarking: true });
    try {
      const res = await apiClient.runAIBenchmark();
      set({ benchmarkResult: res, isBenchmarking: false });
      notifyToast('Benchmark Complete', `Speedup: ${res.speedupMultiplier}x (${res.gpuThroughput} img/s)`, 'success');
    } catch {
      set({ isBenchmarking: false });
      notifyToast('Benchmark Failed', 'Unable to reach Worker Node for hardware benchmark.', 'error');
    }
  }
}));
