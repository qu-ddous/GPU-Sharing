import React from 'react';
import { useJobStore } from '../../store/useJobStore.js';
import { 
  Radio, 
  Square, 
  FolderOpen, 
  Zap, 
  Clock, 
  HardDrive, 
  Cpu, 
  Layers, 
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const ActiveJobView: React.FC = () => {
  const {
    activeJob,
    overallPercent,
    subtaskPercent,
    currentFps,
    currentSpeed,
    elapsedSeconds,
    etaSeconds,
    remoteCpuPercent,
    remoteGpuPercent,
    consoleLogs,
    cancelActiveJob,
    clearLogs
  } = useJobStore();

  const handleOpenFolder = () => {
    if (window.electronAPI?.revealInExplorer) {
      window.electronAPI.revealInExplorer('C:\\Users\\mqudd\\Downloads');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeJob) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 h-[calc(100vh-4rem)]">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
          <Radio className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Active Workload Running</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Start a new render job, batch script, or training session from the sidebar to stream live hardware telemetry and console logs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      {/* Job Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeJob.id}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase ${
              activeJob.status === 'completed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : activeJob.status === 'rendering'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {activeJob.status === 'rendering' ? '● Rendering on Remote GPU' : activeJob.status}
            </span>
            <span className="text-xs text-slate-500 font-mono">Priority: {activeJob.priority}</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{activeJob.filename}</h2>
          <p className="text-xs text-slate-500 font-mono">Connected Worker: {activeJob.client_ip}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {activeJob.status === 'rendering' && (
            <button
              onClick={cancelActiveJob}
              className="bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200 px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel Task</span>
            </button>
          )}

          <button
            onClick={handleOpenFolder}
            className="bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 border border-slate-200 px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Output Folder</span>
          </button>
        </div>
      </div>

      {/* Dual Progress Bars Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Pipeline Progress</span>
            <span className="text-base font-extrabold text-indigo-700 font-mono">{overallPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Chunk / Subtask</span>
            <span className="text-xs font-bold text-slate-600 font-mono">{subtaskPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${subtaskPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Encode Speed</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{currentFps} <span className="text-sm font-normal text-slate-500">FPS</span></p>
          <p className="text-[11px] text-slate-500 font-medium">{currentSpeed} real-time multiplier</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Elapsed Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{formatTime(elapsedSeconds)}</p>
          <p className="text-[11px] text-slate-500 font-medium">ETA: ~{formatTime(etaSeconds)} left</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Remote GPU Load</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{remoteGpuPercent}%</p>
          <p className="text-[11px] text-slate-500 font-medium">NVIDIA RTX NVENC Engine</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Local Laptop Load</span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">0.0%</p>
          <p className="text-[11px] text-emerald-700 font-medium">Fan Idle • Zero Throttling</p>
        </div>
      </div>

      {/* Live Terminal Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800">Remote Worker Console Stream</span>
          </div>
          <button
            onClick={clearLogs}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Buffer</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1 selection:bg-indigo-500 selection:text-white">
          {consoleLogs.length === 0 ? (
            <p className="text-slate-500 italic">Waiting for standard output stream from worker node...</p>
          ) : (
            consoleLogs.map((log, index) => (
              <p
                key={index}
                className={
                  log.includes('[ERROR]') || log.includes('Failed')
                    ? 'text-rose-400'
                    : log.includes('frame=') || log.includes('FPS')
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }
              >
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
