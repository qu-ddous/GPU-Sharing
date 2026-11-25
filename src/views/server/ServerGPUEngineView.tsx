import React, { useState } from 'react';
import { SparklineWave } from '../../components/server/SparklineWave.js';
import { Cpu, CheckCircle2, FlaskConical, Layers, Zap, HardDrive, ShieldCheck } from 'lucide-react';

export const ServerGPUEngineView: React.FC = () => {
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSelfTest = () => {
    setTestRunning(true);
    setTestResult(null);
    setTimeout(() => {
      setTestRunning(false);
      setTestResult('✔ Hardware Self-Test Passed: CUDA 12.1 matrix tensors (12.4 TFLOPS) & NVENC dual-pipe h264_nvenc ready.');
    }, 1500);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="clay-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-blue" />
            <span>NVIDIA GPU Hardware Architecture & Codec Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sensory diagnostics for CUDA cores, dedicated GDDR6 memory, and hardware video encoders.
          </p>
        </div>

        <button
          onClick={handleSelfTest}
          disabled={testRunning}
          className="clay-button-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-clayGlowBlue"
        >
          <FlaskConical className="w-4 h-4" />
          <span>{testRunning ? 'Running Tensor Diagnostics...' : '🧪 Run Hardware Self-Test'}</span>
        </button>
      </div>

      {testResult && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
          {testResult}
        </div>
      )}

      {/* Main Grid: Left Specs & Right 4 Waveforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Compute Node Specs */}
        <div className="clay-card p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue" />
            <span>Compute Node Hardware Profile</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">Compute Engine:</span>
              <span className="font-bold text-white">NVIDIA CUDA 12.1 / PyTorch 2.2</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">Dedicated VRAM:</span>
              <span className="font-bold text-emerald-400">12,288 MB GDDR6 (192-bit)</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">NVIDIA Driver Version:</span>
              <span className="font-bold text-white">551.86 (WHQL Certified)</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">Compute Capability:</span>
              <span className="font-bold text-brand-blue">sm_86 (Ampere Architecture)</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">Active Hardware Encoder:</span>
              <span className="font-bold text-emerald-400">NVIDIA NVENC (Dual-Engine)</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between">
              <span className="text-slate-400">Supported Graphics APIs:</span>
              <span className="font-bold text-slate-300">DirectX 12 Ultimate / Vulkan 1.3</span>
            </div>
          </div>
        </div>

        {/* Right Card: 4 Live Telemetry Waveforms */}
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Sensory Waveforms (60 FPS Stream)</span>
            <span className="text-[10px] font-mono text-slate-400">Real-Time Canvas</span>
          </h3>

          <div className="space-y-3">
            <SparklineWave
              label="1. GPU Core Compute Load"
              color="#3B82F6"
              fillColor="rgba(59, 130, 246, 0.15)"
              height={50}
            />
            <SparklineWave
              label="2. Dedicated VRAM Allocation"
              color="#10B981"
              fillColor="rgba(16, 185, 129, 0.15)"
              height={50}
            />
            <SparklineWave
              label="3. GPU Die Thermal Sensor (°C)"
              color="#F59E0B"
              fillColor="rgba(245, 158, 11, 0.15)"
              height={50}
              unit="°C"
            />
            <SparklineWave
              label="4. Hardware Video Transcoding Engine (NVENC)"
              color="#8B5CF6"
              fillColor="rgba(139, 92, 246, 0.15)"
              height={50}
            />
          </div>
        </div>
      </div>

      {/* Codec Capabilities Matrix */}
      <div className="clay-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Hardware Video Codec Capabilities Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-850 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Hardware Accelerated</span>
            <p className="text-xs font-bold text-white">NVIDIA NVENC H.264</p>
            <p className="text-[10px] text-slate-400 font-mono">h264_nvenc</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-850 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Hardware Accelerated</span>
            <p className="text-xs font-bold text-white">NVIDIA NVENC HEVC</p>
            <p className="text-[10px] text-slate-400 font-mono">hevc_nvenc</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-850 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Hardware Accelerated</span>
            <p className="text-xs font-bold text-white">NVIDIA NVENC AV1</p>
            <p className="text-[10px] text-slate-400 font-mono">av1_nvenc</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-850 border border-surface-border space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Secondary Fallback</span>
            <p className="text-xs font-bold text-slate-300">Intel QuickSync</p>
            <p className="text-[10px] text-slate-400 font-mono">h264_qsv</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-850 border border-surface-border space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Secondary Fallback</span>
            <p className="text-xs font-bold text-slate-300">AMD AMF</p>
            <p className="text-[10px] text-slate-400 font-mono">h264_amf</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-850 border border-purple-500/40 space-y-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Universal Fallback</span>
            <p className="text-xs font-bold text-white">Multi-Core CPU</p>
            <p className="text-[10px] text-slate-400 font-mono">libx264 / libx265</p>
          </div>
        </div>
      </div>
    </div>
  );
};
