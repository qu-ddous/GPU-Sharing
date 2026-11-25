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
  AlertTriangle
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
        <div className="w-16 h-16 rounded-2xl bg-surface-800 text-slate-500 flex items-center justify-center">
          <Radio className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Active Job Running</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Start a new render job or AI training session from the sidebar to stream live hardware telemetry and console logs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Job Header */}
      <div className="clay-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
              {activeJob.id}
            </span>
            <span className={`clay-badge uppercase ${
              activeJob.status === 'completed'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : activeJob.status === 'rendering'
                ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue animate-pulse'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
            }`}>
              {activeJob.status === 'rendering' ? '● Rendering (GPU)' : activeJob.status}
            </span>
            <span className="text-xs text-slate-400 font-mono">Priority: {activeJob.priority}</span>
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">{activeJob.filename}</h2>
          <p className="text-xs text-slate-400 font-mono">Connected Client: {activeJob.client_ip}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {activeJob.status === 'rendering' && (
            <button
              onClick={cancelActiveJob}
              className="clay-button-secondary px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/40 flex items-center gap-2"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel Task</span>
            </button>
          )}

          <button
            onClick={handleOpenFolder}
            className="clay-button-secondary px-4 py-2 text-xs font-bold flex items-center gap-2 text-slate-200"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open Output Folder</span>
          </button>
        </div>
      </div>

      {/* Dual Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="clay-card p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">Overall Transcode Progress</span>
            <span className="font-extrabold font-mono text-brand-purple text-base">{overallPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-surface-950 h-3 rounded-full overflow-hidden border border-surface-border/50">
            <div 
              className="bg-gradient-to-r from-brand-purple to-brand-blue h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(overallPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Pass 1/1 (NVENC Dual-Pipe)</span>
            <span>{Math.round(overallPercent)}% Complete</span>
          </div>
        </div>

        <div className="clay-card p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">Current Chunk / Batch Buffer</span>
            <span className="font-extrabold font-mono text-emerald-400 text-base">{subtaskPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-surface-950 h-3 rounded-full overflow-hidden border border-surface-border/50">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(subtaskPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Ringbuffer Stream (NVENC FIFO)</span>
            <span>Stable Lock</span>
          </div>
        </div>
      </div>

      {/* Real-Time KPIs & Hardware Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Transcode Speed
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{currentSpeed}</p>
        </div>

        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> GPU FPS
          </div>
          <p className="text-xl font-extrabold text-emerald-400 font-mono">{currentFps} FPS</p>
        </div>

        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Elapsed Time
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{formatTime(elapsedSeconds)}</p>
        </div>

        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Clock className="w-3.5 h-3.5 text-brand-purple" /> Remaining (ETA)
          </div>
          <p className="text-xl font-extrabold text-brand-purple font-mono">{formatTime(etaSeconds)}</p>
        </div>

        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Cpu className="w-3.5 h-3.5 text-slate-400" /> Remote CPU
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{remoteCpuPercent}%</p>
        </div>

        <div className="clay-card-secondary p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
            <Layers className="w-3.5 h-3.5 text-brand-blue" /> Remote GPU
          </div>
          <p className="text-xl font-extrabold text-brand-blue font-mono">{remoteGpuPercent}%</p>
        </div>
      </div>

      {/* Live Streaming Console Terminal */}
      <div className="clay-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-purple" />
            <span>Duplex WebSocket Telemetry & Stdout Stream</span>
          </h3>
          <button
            onClick={clearLogs}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Clear Terminal
          </button>
        </div>

        <div className="bg-surface-950 border border-surface-border/60 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1 select-text">
          {consoleLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log.includes('[NVENC]') ? (
                <span className="text-emerald-400">{log}</span>
              ) : log.includes('[GPU]') ? (
                <span className="text-brand-blue">{log}</span>
              ) : log.includes('[WARNING]') || log.includes('[ABORT]') ? (
                <span className="text-amber-400">{log}</span>
              ) : (
                <span className="text-slate-400">{log}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
