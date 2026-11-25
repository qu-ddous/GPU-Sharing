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
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 h-[calc(100vh-4rem)] text-[#eeeeee] font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#222831] text-[#00adb5] flex items-center justify-center border border-[#303640] shadow-glass">
          <Radio className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#eeeeee]">No Active Workload Running</h3>
        <p className="text-xs text-[#b8eef0]/70 max-w-md">
          Start a new render job, batch script, or training session from the sidebar to stream live hardware telemetry and console logs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto text-[#eeeeee] font-sans">
      {/* Job Header Card */}
      <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#00adb5]/20 text-[#00adb5] border border-[#00adb5]/40 shadow-xs">
              {activeJob.id}
            </span>
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase ${
              activeJob.status === 'completed'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : activeJob.status === 'rendering'
                ? 'bg-[#00adb5]/20 border-[#00adb5]/40 text-[#00adb5] animate-pulse shadow-[0_0_12px_rgba(0,173,181,0.3)]'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}>
              {activeJob.status === 'rendering' ? '● Rendering on Remote GPU' : activeJob.status}
            </span>
            <span className="text-xs text-[#b8eef0]/70 font-mono">Priority: {activeJob.priority}</span>
          </div>
          <h2 className="text-lg font-extrabold text-[#eeeeee] tracking-tight">{activeJob.filename}</h2>
          <p className="text-xs text-[#eeeeee]/60 font-mono">Connected Worker: {activeJob.client_ip}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {activeJob.status === 'rendering' && (
            <button
              onClick={cancelActiveJob}
              className="bg-rose-500/20 hover:bg-rose-500/30 active:scale-[0.98] text-rose-300 border border-rose-500/40 px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel Task</span>
            </button>
          )}

          <button
            onClick={handleOpenFolder}
            className="bg-[#1d232c] hover:border-[#00adb5] active:scale-[0.98] text-[#eeeeee] border border-[#303640] px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#00adb5]" />
            <span>Open Output Folder</span>
          </button>
        </div>
      </div>

      {/* Dual Progress Bars Card */}
      <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-wider">Overall Pipeline Progress</span>
            <span className="text-base font-extrabold text-[#00adb5] font-mono">{overallPercent}%</span>
          </div>
          <div className="w-full bg-[#1d232c] h-3 rounded-full overflow-hidden p-0.5 border border-[#303640]">
            <div
              className="bg-[#00adb5] h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_#00adb5]"
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-[#eeeeee]/60 uppercase tracking-wider">Current Chunk / Subtask</span>
            <span className="text-xs font-bold text-[#b8eef0] font-mono">{subtaskPercent}%</span>
          </div>
          <div className="w-full bg-[#1d232c] h-1.5 rounded-full overflow-hidden border border-[#303640]/50">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_#34d399]"
              style={{ width: `${subtaskPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#222831]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#303640] shadow-glass space-y-1 hover:border-[#00adb5]/50 transition-all">
          <div className="flex items-center justify-between text-[#eeeeee]/60">
            <span className="text-xs font-bold uppercase tracking-wider">Encode Speed</span>
            <Zap className="w-4 h-4 text-[#00adb5]" />
          </div>
          <p className="text-2xl font-extrabold text-[#eeeeee] font-mono">{currentFps} <span className="text-sm font-normal text-[#b8eef0]">FPS</span></p>
          <p className="text-[11px] text-[#b8eef0]/70 font-medium">{currentSpeed} real-time multiplier</p>
        </div>

        <div className="bg-[#222831]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#303640] shadow-glass space-y-1 hover:border-[#00adb5]/50 transition-all">
          <div className="flex items-center justify-between text-[#eeeeee]/60">
            <span className="text-xs font-bold uppercase tracking-wider">Elapsed Time</span>
            <Clock className="w-4 h-4 text-[#00adb5]" />
          </div>
          <p className="text-2xl font-extrabold text-[#eeeeee] font-mono">{formatTime(elapsedSeconds)}</p>
          <p className="text-[11px] text-[#b8eef0]/70 font-medium">ETA: ~{formatTime(etaSeconds)} left</p>
        </div>

        <div className="bg-[#222831]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#303640] shadow-glass space-y-1 hover:border-[#00adb5]/50 transition-all">
          <div className="flex items-center justify-between text-[#eeeeee]/60">
            <span className="text-xs font-bold uppercase tracking-wider">Remote GPU Load</span>
            <Cpu className="w-4 h-4 text-[#00adb5]" />
          </div>
          <p className="text-2xl font-extrabold text-[#00adb5] font-mono">{remoteGpuPercent}%</p>
          <p className="text-[11px] text-[#b8eef0]/70 font-medium">NVIDIA RTX NVENC Engine</p>
        </div>

        <div className="bg-[#222831]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#303640] shadow-glass space-y-1 hover:border-[#00adb5]/50 transition-all">
          <div className="flex items-center justify-between text-[#eeeeee]/60">
            <span className="text-xs font-bold uppercase tracking-wider">Local Laptop Load</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">0.0%</p>
          <p className="text-[11px] text-emerald-400 font-medium">Fan Idle • Zero Throttling</p>
        </div>
      </div>

      {/* Live Terminal Stream */}
      <div className="bg-[#222831]/80 backdrop-blur-xl rounded-2xl border border-[#303640] shadow-glass overflow-hidden">
        <div className="px-5 py-3.5 bg-[#1d232c] border-b border-[#303640] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00adb5]" />
            <span className="text-xs font-bold text-[#eeeeee]">Remote Worker Console Stream</span>
          </div>
          <button
            onClick={clearLogs}
            className="text-[11px] font-semibold text-[#b8eef0]/70 hover:text-[#00adb5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Buffer</span>
          </button>
        </div>

        <div className="p-4 bg-[#15181e] font-mono text-xs text-[#b8eef0] h-64 overflow-y-auto space-y-1">
          {consoleLogs.length === 0 ? (
            <p className="text-[#eeeeee]/40 italic">Waiting for standard output stream from worker node...</p>
          ) : (
            consoleLogs.map((log, index) => (
              <p
                key={index}
                className={
                  log.includes('[ERROR]') || log.includes('Failed')
                    ? 'text-rose-400'
                    : log.includes('frame=') || log.includes('FPS')
                    ? 'text-[#00adb5]'
                    : 'text-[#eeeeee]/80'
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
