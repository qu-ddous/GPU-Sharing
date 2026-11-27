import React, { useEffect, useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { notifyToast } from '../../store/useToastStore.js';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Thermometer, 
  Network, 
  Copy, 
  Check, 
  Users, 
  Radio,
  Power
} from 'lucide-react';

export const ServerOverviewView: React.FC = () => {
  const {
    workerIp,
    workerPort,
    daemonOnline,
    toggleDaemon,
    activeSessions,
    cpuPercent,
    ramUsedGb,
    ramTotalGb,
    gpuName,
    gpuUtilPercent,
    vramUsedMb,
    vramTotalMb,
    gpuTempC,
    updateHardwareStats
  } = useServerNodeStore();

  const [copied, setCopied] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(`${workerIp}:${workerPort}`);
    setCopied(true);
    notifyToast('Worker IP Copied', `${workerIp}:${workerPort} copied to clipboard.`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Poll real hardware stats from local FastAPI daemon
  useEffect(() => {
    let isMounted = true;
    const fetchRealTelemetry = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${workerPort}/api/v1/health`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.hardware) {
            updateHardwareStats(data.hardware);
          }
        }
      } catch {
        // Server daemon is starting or not yet launched
      }
    };

    fetchRealTelemetry();
    const interval = setInterval(fetchRealTelemetry, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [workerPort, updateHardwareStats]);

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Hero Card matching Client Studio */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            GPUShare Worker Node
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated GPU compute & NVENC transcoding host listening for incoming workloads from client laptops over your local Ethernet cable or LAN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyIp}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-[18px] h-[18px]" /> : <Copy className="w-[18px] h-[18px]" />}
            <span>{copied ? 'IP Copied!' : `Copy IP (${workerIp}:${workerPort})`}</span>
          </button>

          <button
            onClick={toggleDaemon}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              daemonOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Power className="w-[18px] h-[18px]" />
            <span>{daemonOnline ? 'Daemon Active' : 'Start Daemon'}</span>
          </button>
        </div>
      </div>

      {/* 4 Real Hardware KPI Cards with Glossy Corner Icon Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Util Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HOST CPU LOAD</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Cpu className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {cpuPercent.toFixed(1)}%
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, cpuPercent))}%` }}
            ></div>
          </div>
        </div>

        {/* RAM Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SYSTEM RAM</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white shadow-md shadow-purple-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <HardDrive className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {ramUsedGb} <span className="text-sm font-normal text-slate-400">/ {ramTotalGb || 16} GB</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${ramTotalGb > 0 ? (ramUsedGb / ramTotalGb) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* GPU Compute Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GPU COMPUTE</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Activity className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {gpuUtilPercent > 0 ? `${gpuUtilPercent.toFixed(0)}%` : '0% (Idle)'}
          </p>
          <p className="text-[11px] text-slate-400 truncate">{gpuName}</p>
        </div>

        {/* VRAM / Hardware Temp Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GPU VRAM & TEMP</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Thermometer className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {vramTotalMb > 0 ? `${vramUsedMb} MB` : '0 MB'}
          </p>
          <p className="text-[11px] text-slate-400">
            {gpuTempC > 0 ? `Thermal: ${gpuTempC}°C` : 'Optimal Temperature'}
          </p>
        </div>
      </div>

      {/* Network & Worker Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Network className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Ethernet LAN Status</h3>
              <p className="text-xs text-slate-500">Listening on 0.0.0.0:{workerPort} • Auto-Discovery UDP Port 8002</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Worker IP: {workerIp}</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 text-xs text-slate-600 space-y-1.5">
          <p className="font-bold text-slate-800">
            📌 Connect your laptop client:
          </p>
          <p>
            Plug an Ethernet cable from this desktop PC into your laptop. On your laptop, open <strong>GPUShare-Client.exe</strong> and click <strong>"Auto-Discover"</strong>, or enter <code>{workerIp}:{workerPort}</code> to start offloading video and compute tasks with 0% load on the laptop.
          </p>
        </div>
      </div>

      {/* Connected Clients Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm ring-1 ring-inset ring-white/40 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </span>
          <span>Active Connected Laptop Clients</span>
        </h3>

        {activeSessions.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-md shadow-rose-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center mx-auto">
              <Radio className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">Awaiting Client Connection</p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              When a laptop client connects over the Ethernet cable, its session IP, latency, and data transfer will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeSessions.map((sess, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-800">{sess.ip}:{sess.port}</span>
                <span className="text-emerald-600 font-semibold">{sess.status} • {sess.latency}</span>
                <span className="text-slate-500">{sess.duration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
