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
  Terminal,
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
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-3 h-[calc(100vh-3.5rem)] bg-[#F8FAFC] text-slate-900 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-white text-slate-400 flex items-center justify-center border border-slate-200/80 shadow-xs">
          <Radio className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Active Workload Running</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Start a new render job, batch script, or training session from the sidebar to stream live hardware telemetry and console logs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] max-w-5xl mx-auto text-slate-900 font-sans">
      {/* Job Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {activeJob.id}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
              activeJob.status === 'completed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : activeJob.status === 'rendering'
                ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {activeJob.status === 'rendering' ? '● Rendering on Remote GPU' : activeJob.status}
            </span>
            <span className="text-xs text-slate-500 font-mono">Priority: {activeJob.priority}</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{activeJob.filename}</h2>
          <p className="text-xs text-slate-500 font-mono">Connected Worker: {activeJob.client_ip}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeJob.status === 'rendering' && (
            <button
              onClick={cancelActiveJob}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel Task</span>
            </button>
          )}

          <button
            onClick={handleOpenFolder}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Output Folder</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall Pipeline Progress</span>
            <span className="text-sm font-extrabold text-blue-600 font-mono">{overallPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Chunk / Subtask</span>
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

      {/* 4 Performance Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Encode Speed</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{currentFps} <span className="text-xs font-normal text-slate-400">FPS</span></p>
          <p className="text-[11px] text-slate-500">{currentSpeed} real-time multiplier</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elapsed Time</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{formatTime(elapsedSeconds)}</p>
          <p className="text-[11px] text-slate-500">ETA: ~{formatTime(etaSeconds)} left</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Remote GPU</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{remoteGpuPercent}%</p>
          <p className="text-[11px] text-slate-500">NVIDIA RTX NVENC Engine</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Laptop Load</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">0.0%</p>
          <p className="text-[11px] text-emerald-700 font-medium">Fan Idle • Zero Throttling</p>
        </div>
      </div>

      {/* Live Terminal Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
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

        <div className="p-4 bg-slate-900 font-mono text-xs text-slate-300 h-60 overflow-y-auto space-y-1">
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
