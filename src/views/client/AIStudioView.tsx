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
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 4 Clean Sub-Tabs */}
      <div className="bg-slate-100/80 p-1 rounded-xl grid grid-cols-4 gap-1 border border-slate-200/80">
        <button
          onClick={() => setActiveTab('cnn')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cnn'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Remote CNN Training</span>
        </button>

        <button
          onClick={() => setActiveTab('lens')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'lens'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Visual Object Classifier</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Custom Python Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>CPU vs GPU Suite</span>
        </button>
      </div>

      {/* SUB-TAB 1: Remote CNN Training */}
      {activeTab === 'cnn' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-5">
            {/* Dataset Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Dataset Selection & Benchmark Stream
              </h3>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    {datasetName}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-900">{totalDatasetImages.toLocaleString()} Tensors</span>
                </div>
                <p className="text-xs text-slate-600">
                  High-throughput in-memory synthetic image stream for testing maximum CUDA tensor performance.
                </p>
              </div>
            </div>

            {/* Hyperparameters Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Model Hyperparameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Architecture</label>
                  <select
                    value={modelArch}
                    onChange={(e) => setModelArch(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="ResNet18-Lite">ResNet18-Lite (Standard)</option>
                    <option value="MobileNetV2-Lite">MobileNetV2-Lite (Mobile)</option>
                    <option value="SimpleCNN">SimpleCNN (Fast Baseline)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Epochs</label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Batch Size</label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value={32}>32</option>
                    <option value={64}>64 (Recommended)</option>
                    <option value={128}>128</option>
                    <option value={256}>256</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Optimizer</label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Adam">Adam</option>
                    <option value="SGD with Momentum">SGD with Momentum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Target Compute Device</label>
                <select
                  value={hardwareTarget}
                  onChange={(e) => setHardwareTarget(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="Remote NVIDIA GPU (CUDA)">Remote NVIDIA GPU (CUDA Acceleration)</option>
                  <option value="Local CPU">Local CPU (Slow Benchmark Baseline)</option>
                </select>
              </div>

              <div className="pt-2">
                {isTraining ? (
                  <button
                    onClick={cancelTraining}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Cancel Training Job</span>
                  </button>
                ) : (
                  <button
                    onClick={startTraining}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Remote Training on GPU</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Training Telemetry */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Training Telemetry</span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Epoch [{trainingProgress.epoch}/{trainingProgress.total_epochs}]
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cross-Entropy Loss</span>
                <p className="text-2xl font-extrabold text-rose-600 font-mono">{trainingProgress.loss.toFixed(4)}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Top-1 Accuracy</span>
                <p className="text-2xl font-extrabold text-emerald-600 font-mono">{trainingProgress.accuracy.toFixed(1)}%</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Throughput Speed</span>
                <p className="text-2xl font-extrabold text-blue-600 font-mono">{trainingProgress.speed_fps} <span className="text-xs font-normal text-slate-400">img/s</span></p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">VRAM Allocation</span>
                <p className="text-2xl font-extrabold text-amber-600 font-mono">{trainingProgress.vram_mb} <span className="text-xs font-normal text-slate-400">MB</span></p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Epoch History & Log Stream</span>
              <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-300 h-48 overflow-y-auto space-y-1">
                {trainingProgress.recent_logs.map((log, i) => (
                  <p key={i} className={log.includes('Acc:') ? 'text-emerald-400' : 'text-slate-300'}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Visual Object Classifier */}
      {activeTab === 'lens' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Camera Viewfinder & Image Input</span>
            </h3>

            <div className="relative h-60 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
              <div className="absolute inset-4 border border-dashed border-blue-400/50 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-l-2 border-blue-400 absolute top-0 left-0"></div>
                <div className="w-10 h-10 border-t-2 border-r-2 border-blue-400 absolute top-0 right-0"></div>
                <div className="w-10 h-10 border-b-2 border-l-2 border-blue-400 absolute bottom-0 left-0"></div>
                <div className="w-10 h-10 border-b-2 border-r-2 border-blue-400 absolute bottom-0 right-0"></div>
                <span className="text-xs font-mono text-blue-200 bg-slate-900/90 px-3 py-1 rounded-md">
                  {lensSample === 'cat' ? '🐱 Persian Cat Selected' :
                   lensSample === 'car' ? '🚗 Sports Car Selected' :
                   lensSample === 'dog' ? '🐶 Golden Retriever Selected' :
                   '✈️ Aircraft Jet Selected'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Quick Test Samples</label>
              <div className="grid grid-cols-4 gap-2">
                {(['cat', 'car', 'dog', 'plane'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSampleClick(item)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      lensSample === item
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item === 'cat' ? '🐱 Cat' : item === 'car' ? '🚗 Car' : item === 'dog' ? '🐶 Dog' : '✈️ Plane'}
                  </button>
                ))}
              </div>
            </div>

            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700 transition-all">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload Custom Image for Classification</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vision Inference Output</h3>
              {lensResult && (
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ⚡ {lensResult.inference_latency_ms.toFixed(1)} ms Latency
                </span>
              )}
            </div>

            {lensResult && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predicted Classification</span>
                  <p className="text-xl font-extrabold text-slate-900">{lensResult.predicted_class}</p>
                  <p className="text-xs font-mono text-emerald-600 font-bold">{lensResult.confidence_percent.toFixed(1)}% Confidence Match</p>
                </div>

                <div className="space-y-2.5">
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
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${cand.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
                  <span className="font-bold block">Execution Device:</span>
                  <span className="font-mono text-blue-700">{lensResult.device_used}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Custom Python Runner */}
      {activeTab === 'custom' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Custom Python & Deep Learning Script Runner</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any local Python script to execute remotely with dedicated CUDA 12 hardware acceleration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
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
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer transition-all"
            >
              Browse Script
            </button>
          </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Script on Remote GPU</span>
          </button>
        </div>
      )}

      {/* SUB-TAB 4: CPU vs GPU Suite */}
      {activeTab === 'benchmark' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Host CPU vs Remote GPU Direct Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Runs identical convolutional neural batches on your laptop's CPU vs the desktop's NVIDIA RTX GPU.
              </p>
            </div>

            <button
              onClick={runCpuVsGpuBenchmark}
              disabled={isBenchmarking}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isBenchmarking ? 'Running Benchmarks...' : 'Run Comparative Suite'}</span>
            </button>
          </div>

          {benchmarkResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Local Laptop CPU</span>
                    <Cpu className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 font-mono">
                    {benchmarkResult.cpuThroughput} <span className="text-sm font-normal text-slate-400">img/s</span>
                  </p>
                  <p className="text-xs text-slate-500">100% Core Load • Thermal Throttling</p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase">Remote NVIDIA RTX GPU</span>
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-blue-700 font-mono">
                    {benchmarkResult.gpuThroughput} <span className="text-sm font-normal text-blue-500">img/s</span>
                  </p>
                  <p className="text-xs text-blue-800 font-semibold">CUDA 12 Hardware Accelerated • 0% Laptop Fan</p>
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
