import React from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { SparklineWave } from '../../components/server/SparklineWave.js';
import { 
  Cpu, 
  Layers, 
  Thermometer, 
  Network, 
  Clock, 
  Zap, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export const ServerOverviewView: React.FC = () => {
  const {
    workerIp,
    workerPort,
    totalTransferredDisplay,
    averageFps,
    renderQueue,
    eventLogs
  } = useServerNodeStore();

  const completedJobs = renderQueue.filter(j => j.status === 'completed').length;
  const processingJobs = renderQueue.filter(j => j.status === 'rendering').length;

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* 5 Core Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* GPU Utilization Card */}
        <div className="clay-card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-brand-blue" /> GPU Utilization</span>
            <span className="text-[10px] text-brand-blue font-bold font-mono">NVENC</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">88%</span>
            <span className="text-[11px] text-slate-400 font-medium">RTX 3060 12GB</span>
          </div>
          <div className="w-full bg-surface-950 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-blue h-full rounded-full transition-all duration-300" style={{ width: '88%' }} />
          </div>
        </div>

        {/* GPU VRAM Usage Card */}
        <div className="clay-card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-emerald-400" /> GPU VRAM</span>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">35% Used</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono tracking-tight">4.2 / 12 GB</span>
            <span className="text-[11px] text-slate-400 font-medium">GDDR6</span>
          </div>
          <div className="w-full bg-surface-950 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: '35%' }} />
          </div>
        </div>

        {/* GPU Temperature Card */}
        <div className="clay-card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-amber-400" /> GPU Thermals</span>
            <span className="text-[10px] text-emerald-400 font-bold">Normal</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">62 °C</span>
            <span className="text-[11px] text-slate-400 font-medium">Fan: 52%</span>
          </div>
          <div className="w-full bg-surface-950 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: '62%' }} />
          </div>
        </div>

        {/* CPU Usage Card */}
        <div className="clay-card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> CPU Usage</span>
            <span className="text-[10px] text-purple-400 font-bold">16 Threads</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">14%</span>
            <span className="text-[11px] text-slate-400 font-medium">Ryzen 7 5800X</span>
          </div>
          <div className="w-full bg-surface-950 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-purple h-full rounded-full transition-all duration-300" style={{ width: '14%' }} />
          </div>
        </div>

        {/* Network Worker Node Card */}
        <div className="clay-card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-brand-blue" /> Daemon Service</span>
            <span className="text-[10px] text-emerald-400 font-bold">Port 8000</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold text-white font-mono truncate">{workerIp}</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">FastAPI Listening</p>
        </div>
      </div>

      {/* Middle Row: Real-Time Dynamic Sparkline Waveforms & Session Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="clay-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Real-Time Hardware Waveforms (60-Second Window)
            </h3>
            <span className="text-xs text-slate-400 font-mono">60 FPS Canvas Stream</span>
          </div>

          <div className="space-y-4">
            <SparklineWave
              label="GPU Core Utilization (CUDA / NVENC Compute)"
              color="#3B82F6"
              fillColor="rgba(59, 130, 246, 0.18)"
              height={80}
            />

            <SparklineWave
              label="GPU VRAM Memory Allocation"
              color="#10B981"
              fillColor="rgba(16, 185, 129, 0.18)"
              height={70}
            />
          </div>
        </div>

        {/* Session Summary Stats */}
        <div className="clay-card p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Worker Session Totals</h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between items-center">
              <span className="text-slate-400">Total Jobs Rendered</span>
              <span className="text-base font-extrabold text-white">{completedJobs + 19}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between items-center">
              <span className="text-slate-400">Data Transferred</span>
              <span className="text-base font-extrabold text-emerald-400">{totalTransferredDisplay}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between items-center">
              <span className="text-slate-400">Average Transcode Speed</span>
              <span className="text-base font-extrabold text-brand-blue">{averageFps} FPS</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-border/50 flex justify-between items-center">
              <span className="text-slate-400">Direct Link Bandwidth</span>
              <span className="text-base font-extrabold text-amber-400">1.0 Gbps Cat6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Quick Feed */}
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Worker Subsystem Event Logs</h3>
          <span className="text-xs text-slate-400 font-mono">Zero UI Lag Virtualization</span>
        </div>

        <div className="space-y-2">
          {eventLogs.slice(0, 5).map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-surface-850/60 border border-surface-border/40 flex items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500">[{evt.timestamp}]</span>
                <span className={`clay-badge uppercase font-bold text-[10px] ${
                  evt.level === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  evt.level === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  evt.level === 'ERROR' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                  'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
                }`}>
                  {evt.level}
                </span>
                <span className="text-slate-300 font-bold">{evt.source}</span>
                <span className="text-slate-200">{evt.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
