import React, { useState } from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { useJobStore } from '../../store/useJobStore.js';
import { scanForServers } from '../../services/discoveryClient.js';
import { notifyToast } from '../../store/useToastStore.js';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  Search, 
  Film, 
  BrainCircuit, 
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Monitor,
  Terminal,
  Network,
  Radio,
  Gauge
} from 'lucide-react';
import type { ClientNavView } from '../../components/client/ClientSidebar.js';

interface DashboardViewProps {
  onNavigate: (view: ClientNavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    serverIp,
    serverPort,
    setServerIp,
    setServerPort,
    connect,
    isConnected,
    nvencReady,
    hardware,
    isScanning,
    setIsScanning
  } = useServerStore();

  const jobHistory = useJobStore((s) => s.jobHistory);
  const [inputIp, setInputIp] = useState(serverIp);
  const [inputPort, setInputPort] = useState(String(serverPort));
  const [showIpHelp, setShowIpHelp] = useState(false);

  const handleConnect = () => {
    setServerIp(inputIp);
    setServerPort(Number(inputPort));
    notifyToast('Connecting...', `Pinging Worker Node at ${inputIp}:${inputPort}`, 'info');
    connect(inputIp, Number(inputPort));
  };

  const handleDiscovery = async () => {
    setIsScanning(true);
    notifyToast('Scanning LAN...', 'Searching for Worker Nodes on UDP Port 8002.', 'info');
    const found = await scanForServers();
    setIsScanning(false);
    if (found.length > 0) {
      setInputIp(found[0].ip);
      setInputPort(String(found[0].port));
      setServerIp(found[0].ip);
      setServerPort(found[0].port);
      notifyToast('Worker Node Discovered!', `Found ${found[0].ip}:${found[0].port} via UDP 8002`, 'success');
      connect(found[0].ip, found[0].port);
    } else {
      notifyToast('No Nodes Found', 'No Worker Node responded on UDP Port 8002.', 'warning');
    }
  };

  const ramPercent = hardware.ram_total_gb > 0 ? (hardware.ram_used_gb / hardware.ram_total_gb) * 100 : 0;
  const vramTotalMb = hardware.gpu_vram_total_mb || 12288;
  const vramUsedMb = hardware.gpu_vram_used_mb ?? 0;
  const vramPercent = vramTotalMb > 0 ? (vramUsedMb / vramTotalMb) * 100 : 0;
  const gpuUtil = hardware.gpu_util_percent ?? 0;

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Hero Card (Clean White matching WireDrop style) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            GPUShare Peer-to-Peer
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ultra-fast offline GPU rendering, 4K NVENC transcoding, and PyTorch compute streaming directly across your Ethernet cable. Zero laptop thermal load and complete remote hardware utilization.
          </p>
        </div>

        {/* 3 Clean Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('render_job')}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Film className="w-[18px] h-[18px]" />
            <span>New Render Job</span>
          </button>

          <button
            onClick={() => onNavigate('ai_studio')}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <BrainCircuit className="w-[18px] h-[18px]" />
            <span>Vision & AI Studio</span>
          </button>

          <button
            onClick={() => onNavigate('benchmarks')}
            className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-[18px] h-[18px]" />
            <span>Run Benchmarks</span>
          </button>
        </div>
      </div>

      {/* 4 Hardware Stat Cards (Glossy Rich Corner Icon Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Load */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CPU LOAD</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Cpu className="w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{hardware.cpu_percent}%</span>
              <span className="text-[11px] font-semibold text-slate-500">{hardware.cpu_cores} Cores</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{hardware.cpu_model}</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(hardware.cpu_percent, 100)}%` }}
            />
          </div>
        </div>

        {/* RAM Allocation */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RAM ALLOCATION</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white shadow-md shadow-purple-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <HardDrive className="w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{hardware.ram_used_gb.toFixed(1)} GB</span>
              <span className="text-[11px] font-semibold text-slate-500">{ramPercent.toFixed(0)}% Used</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{hardware.ram_total_gb.toFixed(1)} GB Total Memory</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(ramPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* GPU Core Engine */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GPU ENGINE</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Gauge className="w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{gpuUtil}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                nvencReady
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {nvencReady ? 'NVENC Ready' : 'Standby'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{hardware.gpu_name}</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(gpuUtil, 100)}%` }}
            />
          </div>
        </div>

        {/* Dedicated VRAM */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DEDICATED VRAM</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Layers className="w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {(vramUsedMb / 1024).toFixed(1)} GB
              </span>
              <span className="text-[11px] font-semibold text-slate-500">{vramPercent.toFixed(0)}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{(vramTotalMb / 1024).toFixed(0)} GB GDDR6 Capacity</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(vramPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Worker Node Connection & LAN Discovery Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Radio className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Worker Node Connection & LAN Discovery</h3>
              <p className="text-xs text-slate-500">Communicating over direct Ethernet cable or UDP broadcast beacons (Port 8002)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIpHelp(!showIpHelp)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showIpHelp
                  ? 'bg-violet-50 border-violet-200 text-violet-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-violet-700" />
              <span>How to find IP?</span>
            </button>

            <button
              onClick={handleDiscovery}
              disabled={isScanning}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Search className={`w-4 h-4 text-cyan-300 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning UDP...' : 'Auto-Discover'}</span>
            </button>
          </div>
        </div>

        {/* Clean Connection Input Row */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Target IP:</span>
              <input
                type="text"
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 w-36"
                placeholder="192.168.99.1"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Port:</span>
              <input
                type="text"
                value={inputPort}
                onChange={(e) => setInputPort(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 w-20"
                placeholder="8000"
              />
            </div>

            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Connect
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="font-semibold text-slate-600">
              {isConnected ? `Connected to ${serverIp}:${serverPort}` : 'Ready for P2P pairing'}
            </span>
          </div>
        </div>

        {/* Expandable IP Guide */}
        {showIpHelp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
              <span className="font-bold text-blue-700 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Method 1: Automatic 1-Click Scan
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Upar <strong>"Auto-Discover"</strong> button dabayein. Agar dono devices ek hi direct cable ya local network par hain toh UDP port 8002 ke zariye desktop server 1.5 seconds mein khud detect ho jayega.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Monitor className="w-4 h-4" /> Method 2: Server Desktop Screen Par Dekhein
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Desktop computer par <strong>GPUShare-Server.exe</strong> open karein. Topbar mein IP aur Port seedha likha hota hai (e.g. <code>192.168.99.1:8000</code>).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Method 3: Windows CMD (ipconfig)
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Desktop par <kbd className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">Win + R</kbd> → <code>cmd</code> → <code>ipconfig</code> likhein aur Ethernet IPv4 Address check karein.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
              <span className="font-bold text-amber-800 flex items-center gap-1.5">
                <Network className="w-4 h-4" /> Method 4: Direct Cat6 Cable Static IP
              </span>
              <p className="text-slate-600 font-mono text-[11px]">
                Server: <strong>192.168.99.1</strong> • Client: <strong>192.168.99.2</strong> • Mask: <strong>255.255.255.0</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Offload Activity</h3>
          <span className="text-xs text-slate-500 font-mono">{jobHistory.length} Total Executions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-3">Job ID</th>
                <th className="pb-3 px-3">Task / Media</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Elapsed</th>
                <th className="pb-3 px-3">Speed / FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No offload jobs recorded yet. Start a render job or benchmark to see live history.
                  </td>
                </tr>
              ) : (
                jobHistory.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{job.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{job.filename}</td>
                    <td className="py-3 px-3">
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
                    <td className="py-3 px-3 font-mono text-slate-500">{job.elapsed_seconds}s</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{job.speed || (job.fps ? `${job.fps} fps` : '—')}</td>
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
