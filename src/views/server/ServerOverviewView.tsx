import React, { useEffect } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
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
  Server
} from 'lucide-react';

export const ServerOverviewView: React.FC = () => {
  const {
    workerIp,
    workerPort,
    daemonOnline,
    activeClientCount,
    totalTransferredDisplay,
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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      {/* 4 Real Hardware KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* CPU Util Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Host CPU Load</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {cpuPercent.toFixed(1)}%
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, cpuPercent))}%` }}
            ></div>
          </div>
        </div>

        {/* RAM Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">System RAM</span>
            <HardDrive className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {ramUsedGb} <span className="text-sm font-normal text-slate-500">/ {ramTotalGb || 16} GB</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${ramTotalGb > 0 ? (ramUsedGb / ramTotalGb) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* GPU / Compute Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">GPU Compute</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {gpuUtilPercent > 0 ? `${gpuUtilPercent.toFixed(0)}%` : '0% (Idle)'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{gpuName}</p>
        </div>

        {/* VRAM / Hardware Temp Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">GPU VRAM</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {vramTotalMb > 0 ? `${vramUsedMb} MB` : '0 MB'}
          </p>
          <p className="text-[11px] text-slate-500">
            {gpuTempC > 0 ? `Thermal: ${gpuTempC}°C` : 'Optimal Temperature'}
          </p>
        </div>
      </div>

      {/* Network & Worker Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Network className="w-5 h-5" />
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

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800">
            📌 Connect your laptop client:
          </p>
          <p>
            Plug an Ethernet cable from this desktop PC into your laptop. On your laptop, open <strong>GPUShare-Client.exe</strong> and click <strong>"Scan LAN"</strong>, or enter <code>{workerIp}:{workerPort}</code> to start offloading video and compute tasks with 0% load on the laptop.
          </p>
        </div>
      </div>

      {/* Connected Clients Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Active Connected Laptop Clients</span>
        </h3>

        {activeSessions.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
            <Radio className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Awaiting Client Connection</p>
            <p className="text-[11px] text-slate-500">
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
