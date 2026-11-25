import React, { useState } from 'react';
import { useAIStore } from '../../store/useAIStore.js';
import { useJobStore } from '../../store/useJobStore.js';
import { 
  BrainCircuit, 
  Search, 
  Upload, 
  Zap, 
  Square, 
  Play, 
  Sparkles,
  Camera,
  Cpu,
  Award,
  FileCode
} from 'lucide-react';

interface AIStudioViewProps {
  onNavigate?: (view: any) => void;
}

export const AIStudioView: React.FC<AIStudioViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'cnn' | 'lens' | 'custom' | 'benchmark'>('cnn');
  const submitNewJob = useJobStore((s) => s.submitNewJob);

  const {
    isTraining,
    modelArch,
    epochs,
    batchSize,
    optimizer,
    hardwareTarget,
    datasetName,
    totalDatasetImages,
    trainingProgress,
    lensResult,
    benchmarkResult,
    isBenchmarking,
    setModelArch,
    setEpochs,
    setBatchSize,
    setOptimizer,
    setHardwareTarget,
    startTraining,
    cancelTraining,
    classifyImage,
    runCpuVsGpuBenchmark
  } = useAIStore();

  const [selectedScript, setSelectedScript] = useState('train_vision_yolo.py (14.2 KB)');
  const [lensSample, setLensSample] = useState<'cat' | 'car' | 'dog' | 'plane'>('cat');

  const handleSampleClick = (type: 'cat' | 'car' | 'dog' | 'plane') => {
    setLensSample(type);
    const blob = new Blob(['sample-image-bytes'], { type: 'image/jpeg' });
    classifyImage(blob);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      classifyImage(file);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto text-[#eeeeee] font-sans">
      {/* 4 Dedicated Sub-Tabs (Liquid Glass Capsule) */}
      <div className="bg-[#222831]/85 backdrop-blur-xl p-1.5 rounded-full grid grid-cols-4 gap-1.5 border border-[#303640]">
        <button
          onClick={() => setActiveTab('cnn')}
          className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-180 cursor-pointer ${
            activeTab === 'cnn'
              ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_16px_rgba(0,173,181,0.45)]'
              : 'text-[#eeeeee]/70 hover:text-[#00adb5] hover:bg-[#303640]/50'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Remote CNN Training</span>
        </button>

        <button
          onClick={() => setActiveTab('lens')}
          className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-180 cursor-pointer ${
            activeTab === 'lens'
              ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_16px_rgba(0,173,181,0.45)]'
              : 'text-[#eeeeee]/70 hover:text-[#00adb5] hover:bg-[#303640]/50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Visual Object Classifier</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-180 cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_16px_rgba(0,173,181,0.45)]'
              : 'text-[#eeeeee]/70 hover:text-[#00adb5] hover:bg-[#303640]/50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Custom Python Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-180 cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_16px_rgba(0,173,181,0.45)]'
              : 'text-[#eeeeee]/70 hover:text-[#00adb5] hover:bg-[#303640]/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>CPU vs GPU Suite</span>
        </button>
      </div>

      {/* SUB-TAB 1: Remote CNN Training */}
      {activeTab === 'cnn' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Dataset & Hyperparameters */}
            <div className="space-y-6">
              {/* Dataset Card */}
              <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-4">
                <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest">
                  Dataset Selection & Benchmark Stream
                </h3>
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00adb5] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00adb5]" />
                      {datasetName}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b8eef0]">{totalDatasetImages.toLocaleString()} Tensors</span>
                  </div>
                  <p className="text-xs text-[#eeeeee]/70">
                    High-throughput in-memory synthetic image stream for testing maximum CUDA tensor performance.
                  </p>
                </div>
              </div>

              {/* Hyperparameters Card */}
              <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-4">
                <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest">Model Hyperparameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Architecture</label>
                    <select
                      value={modelArch}
                      onChange={(e) => setModelArch(e.target.value as any)}
                      className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3 py-2 text-xs font-semibold text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
                    >
                      <option value="ResNet18-Lite">ResNet18-Lite (Standard)</option>
                      <option value="MobileNetV2-Lite">MobileNetV2-Lite (Mobile)</option>
                      <option value="SimpleCNN">SimpleCNN (Fast Baseline)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Epochs</label>
                    <input
                      type="number"
                      value={epochs}
                      onChange={(e) => setEpochs(Number(e.target.value))}
                      className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3 py-2 text-xs font-semibold text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Batch Size</label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3 py-2 text-xs font-semibold text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
                    >
                      <option value={32}>32</option>
                      <option value={64}>64 (Recommended)</option>
                      <option value={128}>128</option>
                      <option value={256}>256</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Optimizer</label>
                    <select
                      value={optimizer}
                      onChange={(e) => setOptimizer(e.target.value as any)}
                      className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3 py-2 text-xs font-semibold text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
                    >
                      <option value="Adam">Adam</option>
                      <option value="SGD with Momentum">SGD with Momentum</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Target Compute Device</label>
                  <select
                    value={hardwareTarget}
                    onChange={(e) => setHardwareTarget(e.target.value as any)}
                    className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3 py-2 text-xs font-semibold text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
                  >
                    <option value="Remote NVIDIA GPU (CUDA)">Remote NVIDIA GPU (CUDA Acceleration)</option>
                    <option value="Local CPU">Local CPU (Slow Benchmark Baseline)</option>
                  </select>
                </div>

                <div className="pt-2">
                  {isTraining ? (
                    <button
                      onClick={cancelTraining}
                      className="w-full bg-rose-500/20 hover:bg-rose-500/30 active:scale-[0.98] text-rose-300 border border-rose-500/40 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Cancel Training Job</span>
                    </button>
                  ) : (
                    <button
                      onClick={startTraining}
                      className="w-full bg-[#00adb5] hover:bg-[#b8eef0] active:scale-[0.98] text-[#1d232c] py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(0,173,181,0.4)] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Remote Training on GPU</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Live Training Telemetry & Logs */}
            <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest">Live Training Telemetry</span>
                <span className="text-xs font-mono font-bold text-[#00adb5] bg-[#00adb5]/15 px-3 py-1 rounded-full border border-[#00adb5]/30">
                  Epoch [{trainingProgress.epoch}/{trainingProgress.total_epochs}]
                </span>
              </div>

              {/* Loss & Accuracy Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1">
                  <span className="text-[10px] font-bold text-[#eeeeee]/60 uppercase">Cross-Entropy Loss</span>
                  <p className="text-2xl font-extrabold text-rose-400 font-mono">{trainingProgress.loss.toFixed(4)}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1">
                  <span className="text-[10px] font-bold text-[#eeeeee]/60 uppercase">Top-1 Accuracy</span>
                  <p className="text-2xl font-extrabold text-[#00adb5] font-mono">{trainingProgress.accuracy.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1">
                  <span className="text-[10px] font-bold text-[#eeeeee]/60 uppercase">Throughput Speed</span>
                  <p className="text-2xl font-extrabold text-[#b8eef0] font-mono">{trainingProgress.speed_fps} <span className="text-xs font-normal text-[#eeeeee]/50">img/s</span></p>
                </div>
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1">
                  <span className="text-[10px] font-bold text-[#eeeeee]/60 uppercase">VRAM Allocation</span>
                  <p className="text-2xl font-extrabold text-amber-400 font-mono">{trainingProgress.vram_mb} <span className="text-xs font-normal text-[#eeeeee]/50">MB</span></p>
                </div>
              </div>

              {/* Real-time Loss Stream Log */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#eeeeee]/70">Epoch History & Log Stream</span>
                <div className="p-3.5 rounded-xl bg-[#15181e] font-mono text-[11px] text-[#b8eef0] h-48 overflow-y-auto space-y-1 border border-[#303640]">
                  {trainingProgress.recent_logs.map((log, i) => (
                    <p key={i} className={log.includes('Acc:') ? 'text-[#00adb5]' : 'text-[#eeeeee]/80'}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Google Lens Classifier */}
      {activeTab === 'lens' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Viewfinder & Samples */}
          <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-5">
            <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#00adb5]" />
              <span>Camera Viewfinder & Image Input</span>
            </h3>

            {/* Viewfinder Reticle */}
            <div className="relative h-64 rounded-xl bg-[#15181e] overflow-hidden flex items-center justify-center border-2 border-[#00adb5]/30 shadow-inner">
              <div className="absolute inset-4 border border-dashed border-[#00adb5]/40 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-l-2 border-[#00adb5] absolute top-0 left-0"></div>
                <div className="w-12 h-12 border-t-2 border-r-2 border-[#00adb5] absolute top-0 right-0"></div>
                <div className="w-12 h-12 border-b-2 border-l-2 border-[#00adb5] absolute bottom-0 left-0"></div>
                <div className="w-12 h-12 border-b-2 border-r-2 border-[#00adb5] absolute bottom-0 right-0"></div>
                <span className="text-xs font-mono text-[#00adb5] bg-[#1d232c]/90 border border-[#303640] px-3.5 py-1.5 rounded-full shadow-lg">
                  {lensSample === 'cat' ? '🐱 Persian Cat Selected' :
                   lensSample === 'car' ? '🚗 Sports Car Selected' :
                   lensSample === 'dog' ? '🐶 Golden Retriever Selected' :
                   '✈️ Aircraft Jet Selected'}
                </span>
              </div>
            </div>

            {/* Quick Sample Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Quick Test Samples</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSampleClick('cat')}
                  className={`p-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'cat'
                      ? 'bg-[#00adb5] text-[#1d232c] border-[#00adb5] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                      : 'bg-[#1d232c] border-[#303640] text-[#eeeeee]/80 hover:border-[#00adb5]/50'
                  }`}
                >
                  🐱 Cat
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('car')}
                  className={`p-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'car'
                      ? 'bg-[#00adb5] text-[#1d232c] border-[#00adb5] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                      : 'bg-[#1d232c] border-[#303640] text-[#eeeeee]/80 hover:border-[#00adb5]/50'
                  }`}
                >
                  🚗 Car
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('dog')}
                  className={`p-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'dog'
                      ? 'bg-[#00adb5] text-[#1d232c] border-[#00adb5] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                      : 'bg-[#1d232c] border-[#303640] text-[#eeeeee]/80 hover:border-[#00adb5]/50'
                  }`}
                >
                  🐶 Dog
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('plane')}
                  className={`p-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'plane'
                      ? 'bg-[#00adb5] text-[#1d232c] border-[#00adb5] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                      : 'bg-[#1d232c] border-[#303640] text-[#eeeeee]/80 hover:border-[#00adb5]/50'
                  }`}
                >
                  ✈️ Plane
                </button>
              </div>
            </div>

            {/* Custom Image Upload */}
            <div className="pt-2">
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-[#00adb5]/40 bg-[#1d232c] hover:bg-[#15181e] cursor-pointer text-xs font-semibold text-[#00adb5] transition-all">
                <Upload className="w-4 h-4 text-[#00adb5]" />
                <span>Upload Custom Image for Real Classification</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right: Results Card */}
          <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest">Vision Inference Output</h3>
              {lensResult && (
                <span className="text-[11px] font-mono font-bold text-[#00adb5] bg-[#00adb5]/15 border border-[#00adb5]/30 px-3 py-1 rounded-full shadow-xs">
                  ⚡ {lensResult.inference_latency_ms.toFixed(1)} ms Latency
                </span>
              )}
            </div>

            {lensResult && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1">
                  <span className="text-[10px] font-bold text-[#b8eef0]/60 uppercase tracking-wider">Predicted Classification</span>
                  <p className="text-xl font-extrabold text-[#eeeeee]">{lensResult.predicted_class}</p>
                  <p className="text-xs font-mono text-[#00adb5] font-bold">{lensResult.confidence_percent.toFixed(1)}% Confidence Match</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#eeeeee]/70">Top Candidate Probabilities</span>
                  <div className="space-y-2">
                    {lensResult.top_candidates.map((cand, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#eeeeee]/90">{cand.label}</span>
                          <span className="text-[#b8eef0] font-mono">{(cand.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-[#15181e] h-2 rounded-full overflow-hidden border border-[#303640]/50">
                          <div
                            className="bg-[#00adb5] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#00adb5]"
                            style={{ width: `${cand.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1d232c]/80 border border-[#303640] text-xs text-[#b8eef0] space-y-1">
                  <span className="font-bold block text-[#eeeeee]">Execution Device:</span>
                  <span className="font-mono text-[#00adb5]">{lensResult.device_used}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Custom Python Runner */}
      {activeTab === 'custom' && (
        <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#eeeeee]">Custom Python & Deep Learning Script Runner</h3>
            <p className="text-xs text-[#b8eef0]/70 mt-0.5">
              Select any local Python script to execute remotely with dedicated CUDA 12 hardware acceleration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#00adb5]">{selectedScript}</span>
              <button
                type="button"
                onClick={async () => {
                  if (window.electronAPI?.openFileDialog) {
                    const p = await window.electronAPI.openFileDialog({
                      title: 'Select Python Script',
                      filters: [{ name: 'Python', extensions: ['py', 'pyw', 'ipynb'] }]
                    });
                    if (p) setSelectedScript(p.split(/[/\\]/).pop() || p);
                  }
                }}
                className="bg-[#303640] hover:bg-[#00adb5] hover:text-[#1d232c] text-[#eeeeee] border border-[#303640] text-xs font-bold px-4 py-1.5 rounded-full shadow-xs cursor-pointer transition-all"
              >
                Browse Script
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={async () => {
                const fd = new FormData();
                fd.append('output_filename', 'python_output.txt');
                fd.append('custom_command', `python ${selectedScript}`);
                try {
                  await submitNewJob(fd, selectedScript);
                  if (onNavigate) {
                    onNavigate('active_job');
                  }
                } catch (e) {
                  console.error(e);
                  alert('Unable to connect to worker node. Ensure server is online.');
                }
              }}
              className="bg-[#00adb5] hover:bg-[#b8eef0] active:scale-[0.98] text-[#1d232c] text-xs font-bold px-6 py-3 rounded-full shadow-[0_0_18px_rgba(0,173,181,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Script on Remote GPU</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CPU vs GPU Suite */}
      {activeTab === 'benchmark' && (
        <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#eeeeee]">Host CPU vs Remote GPU Direct Comparison</h3>
              <p className="text-xs text-[#b8eef0]/70 mt-0.5">
                Runs identical convolutional neural batches on your laptop's CPU vs the desktop's NVIDIA RTX GPU.
              </p>
            </div>

            <button
              onClick={runCpuVsGpuBenchmark}
              disabled={isBenchmarking}
              className="bg-[#00adb5] hover:bg-[#b8eef0] active:scale-[0.98] disabled:opacity-50 text-[#1d232c] text-xs font-bold px-6 py-2.5 rounded-full shadow-[0_0_18px_rgba(0,173,181,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isBenchmarking ? 'Running Benchmarks...' : 'Run Comparative Suite'}</span>
            </button>
          </div>

          {benchmarkResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#1d232c]/80 border border-[#303640] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#eeeeee]/60 uppercase">Local Laptop CPU</span>
                    <Cpu className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-[#eeeeee] font-mono">
                    {benchmarkResult.cpuThroughput} <span className="text-sm font-normal text-[#eeeeee]/50">img/s</span>
                  </p>
                  <p className="text-xs text-[#eeeeee]/60">100% Core Load • Thermal Throttling</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#00adb5]/10 border border-[#00adb5]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00adb5] uppercase">Remote NVIDIA RTX GPU</span>
                    <Zap className="w-4 h-4 text-[#00adb5]" />
                  </div>
                  <p className="text-3xl font-extrabold text-[#00adb5] font-mono">
                    {benchmarkResult.gpuThroughput} <span className="text-sm font-normal text-[#b8eef0]">img/s</span>
                  </p>
                  <p className="text-xs text-[#b8eef0] font-semibold">CUDA 12 Hardware Accelerated • 0% Laptop Fan</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-[#1d232c] flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">
                      Hardware Acceleration Winner: Remote Desktop GPU
                    </h4>
                    <p className="text-xs text-[#eeeeee]/70">
                      The remote GPU completed the inference {benchmarkResult.speedupMultiplier}x faster than your laptop.
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {benchmarkResult.speedupMultiplier}x Faster
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
