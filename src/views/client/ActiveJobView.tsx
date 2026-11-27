import React from 'react';
import { useJobStore } from '../../store/useJobStore.js';
import { useServerStore } from '../../store/useServerStore.js';
import { 
  Radio, 
  Square, 
  FolderOpen, 
  Zap, 
  Clock, 
  HardDrive, 
  Cpu, 
  Terminal,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ActiveJobView: React.FC = () => {
  const {
    activeJob,
    jobHistory,
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

  const {
    isConnected,
    serverIp,
    serverPort,
    latencyMs,
    hardware,
    fetchHealth
  } = useServerStore();

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

  const liveGpuPercent = activeJob && activeJob.status === 'rendering'
    ? remoteGpuPercent
    : (hardware.gpu_util_percent ?? 0);

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Status & Job Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-md shadow-rose-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center shrink-0">
            <Radio className={`w-6 h-6 ${activeJob?.status === 'rendering' ? 'animate-pulse' : ''}`} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {activeJob ? activeJob.id : 'LIVE MONITOR'}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                activeJob?.status === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : activeJob?.status === 'rendering'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse'
                  : activeJob?.status === 'failed'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : isConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                {activeJob
                  ? (activeJob.status === 'rendering' ? '● Rendering on Remote GPU' : activeJob.status)
                  : (isConnected ? '● Worker Ready & Listening' : '● Worker Offline')}
              </span>
              {activeJob && (
                <span className="text-xs text-slate-500 font-mono">Priority: {activeJob.priority}</span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {activeJob ? activeJob.filename : 'Remote Worker Telemetry & Console Stream'}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {activeJob
                ? `Connected Worker: ${activeJob.client_ip}`
                : `WebSocket Stream: ws://${serverIp}:${serverPort}/ws/logs (${isConnected ? `${latencyMs.toFixed(1)} ms` : 'Disconnected'})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {activeJob?.status === 'rendering' ? (
            <button
              onClick={cancelActiveJob}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Cancel Task</span>
            </button>
          ) : (
            <button
              onClick={() => fetchHealth()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Telemetry</span>
            </button>
          )}

          <button
            onClick={handleOpenFolder}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-amber-600" />
            <span>Open Output Folder</span>
          </button>
        </div>
      </div>

      {/* 4 Live Real-Time Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Encode Speed</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Zap className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {currentFps} <span className="text-xs font-normal text-slate-400">FPS</span>
          </p>
          <p className="text-[11px] text-slate-500">
            {activeJob ? `${currentSpeed} real-time multiplier` : 'Awaiting active render stream'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elapsed Time</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Clock className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{formatTime(elapsedSeconds)}</p>
          <p className="text-[11px] text-slate-500">
            {activeJob ? `ETA: ~${formatTime(etaSeconds)} left` : `Ping: ${latencyMs.toFixed(1)} ms`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Remote GPU</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-md shadow-purple-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Cpu className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{liveGpuPercent}%</p>
          <p className="text-[11px] text-slate-500 truncate">{hardware.gpu_name}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Laptop Load</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <HardDrive className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">0.0%</p>
          <p className="text-[11px] text-emerald-700 font-medium">Fan Idle • Zero Throttling</p>
        </div>
      </div>

      {/* Pipeline Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
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

      {/* Live Terminal Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-[18px] h-[18px] text-cyan-700" />
            <span className="text-xs font-bold text-slate-800">Remote Worker Console Stream</span>
          </div>
          <button
            onClick={clearLogs}
            className="text-[11px] font-semibold text-slate-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Buffer</span>
          </button>
        </div>

        <div className="p-4 bg-slate-900 font-mono text-xs text-slate-300 h-56 overflow-y-auto space-y-1">
          {consoleLogs.length === 0 ? (
            <p className="text-slate-400 italic">
              {isConnected
                ? `[WS] Connected to ws://${serverIp}:${serverPort}/ws/logs — waiting for job output...`
                : `[WS] Waiting for Worker Node (${serverIp}:${serverPort}) to come online...`}
            </p>
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

      {/* Session Execution History */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Session Execution History</h3>
          <span className="text-xs text-slate-500 font-mono">{jobHistory.length} Recorded</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-2.5 px-3">Job ID</th>
                <th className="pb-2.5 px-3">Task / Media</th>
                <th className="pb-2.5 px-3">Status</th>
                <th className="pb-2.5 px-3">Elapsed</th>
                <th className="pb-2.5 px-3">Speed / FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                    No jobs executed in this session yet. Submit a job from Render Studio to monitor it live here.
                  </td>
                </tr>
              ) : (
                jobHistory.slice(0, 6).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{job.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{job.filename}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        job.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : job.status === 'rendering'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {job.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {job.status === 'rendering' && <Clock className="w-3.5 h-3.5 animate-spin" />}
                        {job.status === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                        <span className="uppercase">{job.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{job.elapsed_seconds}s</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{job.speed || (job.fps ? `${job.fps} fps` : '—')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
