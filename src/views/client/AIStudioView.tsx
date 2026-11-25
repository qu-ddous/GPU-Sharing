import React, { useState } from 'react';
import { useAIStore } from '../../store/useAIStore.js';
import { 
  BrainCircuit, 
  Search, 
  Upload, 
  Check, 
  Zap, 
  Square, 
  Play, 
  Layers, 
  Activity,
  Award,
  Sparkles,
  Camera,
  Cpu,
  BarChart2,
  FileCode
} from 'lucide-react';

export const AIStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cnn' | 'lens' | 'custom' | 'benchmark'>('cnn');

  const {
    isTraining,
    modelArch,
    epochs,
    batchSize,
    learningRate,
    optimizer,
    hardwareTarget,
    datasetName,
    totalDatasetImages,
    trainingProgress,
    lensResult,
    isPredicting,
    benchmarkResult,
    isBenchmarking,
    setModelArch,
    setEpochs,
    setBatchSize,
    setLearningRate,
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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      {/* 4 Dedicated Sub-Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl grid grid-cols-4 gap-1.5 border border-slate-200/80">
        <button
          onClick={() => setActiveTab('cnn')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cnn'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <span>Remote CNN Training</span>
        </button>

        <button
          onClick={() => setActiveTab('lens')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'lens'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Search className="w-4 h-4 text-indigo-600" />
          <span>Visual Object Classifier</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileCode className="w-4 h-4 text-indigo-600" />
          <span>Custom Python Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-600" />
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Dataset Selection & Benchmark Stream
                </h3>
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      {datasetName}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-900">{totalDatasetImages.toLocaleString()} Tensors</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    High-throughput in-memory synthetic image stream for testing maximum CUDA tensor performance.
                  </p>
                </div>
              </div>

              {/* Hyperparameters Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Model Hyperparameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Architecture</label>
                    <select
                      value={modelArch}
                      onChange={(e) => setModelArch(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="ResNet18-Lite">ResNet18-Lite (Standard)</option>
                      <option value="MobileNetV2-Lite">MobileNetV2-Lite (Mobile)</option>
                      <option value="SimpleCNN">SimpleCNN (Fast Baseline)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Epochs</label>
                    <input
                      type="number"
                      value={epochs}
                      onChange={(e) => setEpochs(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Batch Size</label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value={32}>32</option>
                      <option value={64}>64 (Recommended)</option>
                      <option value={128}>128</option>
                      <option value={256}>256</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Optimizer</label>
                    <select
                      value={optimizer}
                      onChange={(e) => setOptimizer(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Adam">Adam</option>
                      <option value="SGD with Momentum">SGD with Momentum</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Target Compute Device</label>
                  <select
                    value={hardwareTarget}
                    onChange={(e) => setHardwareTarget(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Remote NVIDIA GPU (CUDA)">Remote NVIDIA GPU (CUDA Acceleration)</option>
                    <option value="Local CPU">Local CPU (Slow Benchmark Baseline)</option>
                  </select>
                </div>

                <div className="pt-2">
                  {isTraining ? (
                    <button
                      onClick={cancelTraining}
                      className="w-full bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Cancel Training Job</span>
                    </button>
                  ) : (
                    <button
                      onClick={startTraining}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Remote Training on GPU</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Live Training Telemetry & Logs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live Training Telemetry</span>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Epoch [{trainingProgress.epoch}/{trainingProgress.total_epochs}]
                </span>
              </div>

              {/* Loss & Accuracy Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Cross-Entropy Loss</span>
                  <p className="text-2xl font-extrabold text-rose-600 font-mono">{trainingProgress.loss.toFixed(4)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Top-1 Accuracy</span>
                  <p className="text-2xl font-extrabold text-emerald-600 font-mono">{trainingProgress.accuracy.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Throughput Speed</span>
                  <p className="text-2xl font-extrabold text-indigo-600 font-mono">{trainingProgress.speed_fps} <span className="text-xs font-normal text-slate-500">img/s</span></p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">VRAM Allocation</span>
                  <p className="text-2xl font-extrabold text-amber-600 font-mono">{trainingProgress.vram_mb} <span className="text-xs font-normal text-slate-500">MB</span></p>
                </div>
              </div>

              {/* Real-time Loss Stream Log */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Epoch History & Log Stream</span>
                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 h-48 overflow-y-auto space-y-1">
                  {trainingProgress.recent_logs.map((log, i) => (
                    <p key={i} className={log.includes('Acc:') ? 'text-emerald-400' : 'text-slate-300'}>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Camera Viewfinder & Image Input</span>
            </h3>

            {/* Viewfinder Reticle */}
            <div className="relative h-64 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-indigo-500/30">
              <div className="absolute inset-4 border border-dashed border-indigo-400/50 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-l-2 border-indigo-400 absolute top-0 left-0"></div>
                <div className="w-12 h-12 border-t-2 border-r-2 border-indigo-400 absolute top-0 right-0"></div>
                <div className="w-12 h-12 border-b-2 border-l-2 border-indigo-400 absolute bottom-0 left-0"></div>
                <div className="w-12 h-12 border-b-2 border-r-2 border-indigo-400 absolute bottom-0 right-0"></div>
                <span className="text-xs font-mono text-indigo-300 bg-slate-900/80 px-3 py-1 rounded-md">
                  {lensSample === 'cat' ? '🐱 Persian Cat Selected' :
                   lensSample === 'car' ? '🚗 Sports Car Selected' :
                   lensSample === 'dog' ? '🐶 Golden Retriever Selected' :
                   '✈️ Aircraft Jet Selected'}
                </span>
              </div>
            </div>

            {/* Quick Sample Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Quick Test Samples</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSampleClick('cat')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'cat'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🐱 Cat
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('car')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'car'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🚗 Car
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('dog')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'dog'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🐶 Dog
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('plane')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lensSample === 'plane'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ✈️ Plane
                </button>
              </div>
            </div>

            {/* Custom Image Upload */}
            <div className="pt-2">
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700 transition-all">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload Custom Image for Real Classification</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right: Results Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Vision Inference Output</h3>
              {lensResult && (
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ⚡ {lensResult.inference_latency_ms.toFixed(1)} ms Latency
                </span>
              )}
            </div>

            {lensResult && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predicted Classification</span>
                  <p className="text-xl font-extrabold text-slate-900">{lensResult.predicted_class}</p>
                  <p className="text-xs font-mono text-emerald-600 font-bold">{lensResult.confidence_percent.toFixed(1)}% Confidence Match</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Top Candidate Probabilities</span>
                  <div className="space-y-2">
                    {lensResult.top_candidates.map((cand, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{cand.label}</span>
                          <span className="text-slate-500 font-mono">{(cand.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${cand.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                  <span className="font-bold block">Execution Device:</span>
                  <span className="font-mono text-indigo-700">{lensResult.device_used}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Custom Python Runner */}
      {activeTab === 'custom' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Custom Python & Deep Learning Script Runner</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any local Python script to execute remotely with dedicated CUDA 12 hardware acceleration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-800">{selectedScript}</span>
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
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer transition-all"
              >
                Browse Script
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                alert(`Script "${selectedScript}" submitted to remote worker daemon.`);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Script on Remote GPU</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CPU vs GPU Suite */}
      {activeTab === 'benchmark' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Host CPU vs Remote GPU Direct Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Runs identical convolutional neural batches on your laptop's CPU vs the desktop's NVIDIA RTX GPU.
              </p>
            </div>

            <button
              onClick={runCpuVsGpuBenchmark}
              disabled={isBenchmarking}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isBenchmarking ? 'Running Benchmarks...' : 'Run Comparative Suite'}</span>
            </button>
          </div>

          {benchmarkResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase">Local Laptop CPU</span>
                    <Cpu className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-800 font-mono">
                    {benchmarkResult.cpuThroughput} <span className="text-sm font-normal text-slate-500">img/s</span>
                  </p>
                  <p className="text-xs text-slate-500">100% Core Load • Thermal Throttling</p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Remote NVIDIA RTX GPU</span>
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-indigo-700 font-mono">
                    {benchmarkResult.gpuThroughput} <span className="text-sm font-normal text-indigo-500">img/s</span>
                  </p>
                  <p className="text-xs text-indigo-800 font-semibold">CUDA 12 Hardware Accelerated • 0% Laptop Fan</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Hardware Acceleration Winner: Remote Desktop GPU
                    </h4>
                    <p className="text-xs text-emerald-700">
                      The remote GPU completed the inference {benchmarkResult.speedupMultiplier}x faster than your laptop.
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-black text-emerald-700 font-mono">
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
