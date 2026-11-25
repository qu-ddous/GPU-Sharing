import React, { useState } from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { useJobStore } from '../../store/useJobStore.js';
import { scanForServers } from '../../services/discoveryClient.js';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  Search, 
  ArrowUpRight, 
  Film, 
  BrainCircuit, 
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Monitor,
  Terminal,
  Network
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
    hardware,
    isScanning,
    setIsScanning
  } = useServerStore();

  const jobHistory = useJobStore((s) => s.jobHistory);
  const [inputIp, setInputIp] = useState(serverIp);
  const [inputPort, setInputPort] = useState(String(serverPort));
  const [showIpHelp, setShowIpHelp] = useState(true);

  const handleConnect = () => {
    setServerIp(inputIp);
    setServerPort(Number(inputPort));
    connect(inputIp, Number(inputPort));
  };

  const handleDiscovery = async () => {
    setIsScanning(true);
    const found = await scanForServers();
    setIsScanning(false);
    if (found.length > 0) {
      setInputIp(found[0].ip);
      setInputPort(String(found[0].port));
      setServerIp(found[0].ip);
      setServerPort(found[0].port);
      connect(found[0].ip, found[0].port);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      {/* Quick Connect Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Node:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">IP:</span>
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-600 w-36"
              placeholder="192.168.99.1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Port:</span>
            <input
              type="text"
              value={inputPort}
              onChange={(e) => setInputPort(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-600 w-20"
              placeholder="8000"
            />
          </div>
          <button
            onClick={handleConnect}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Connect
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIpHelp(!showIpHelp)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
              showIpHelp
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>💡 How to find IP?</span>
          </button>

          <button
            onClick={handleDiscovery}
            disabled={isScanning}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all"
          >
            <Search className={`w-3.5 h-3.5 text-purple-600 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning UDP...' : 'Auto-Discover (Port 8002)'}</span>
          </button>
        </div>
      </div>

      {/* Expandable IP Guide Card */}
      {showIpHelp && (
        <div className="bg-white border border-purple-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">How to Find Worker Node IP (Dosri Device Ka IP Kese Maloom Karein?)</h4>
                <p className="text-xs text-slate-500">Desktop GPU machine ka IP address find karne ke 4 aasan tareeqay:</p>
              </div>
            </div>
            <button 
              onClick={() => setShowIpHelp(false)}
              className="text-xs text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-200"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Method 1 */}
            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1.5">
              <span className="font-bold text-purple-700 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Method 1: Automatic 1-Click Scan (Sub Se Aasan)
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Upar <strong>"Auto-Discover"</strong> button dabayein. Agar dono devices ek hi direct cable ya local network par hain toh UDP port 8002 ke zariye desktop server 1.5 seconds mein khud detect ho kar connect ho jayega.
              </p>
            </div>

            {/* Method 2 */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Monitor className="w-4 h-4" /> Method 2: Server Desktop Screen Par Dekhein
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Desktop computer par <strong>GPUShare-Server.exe</strong> open karein ya server console dekhein. Topbar mein IP aur Port seedha likha hota hai (e.g. <code>192.168.99.1:8000</code>). Uspar click karein, wo copy ho jayega!
              </p>
            </div>

            {/* Method 3 */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
              <span className="font-bold text-blue-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Method 3: Windows Command Prompt (CMD) Se
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Desktop par <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-800">Win + R</kbd> dabayein, <code>cmd</code> likhein aur Enter karein:
              </p>
              <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg font-mono text-[11px] text-amber-300">
                ipconfig
              </div>
              <p className="text-slate-500 text-[10px]">
                Ethernet adapter ke niche <strong>IPv4 Address</strong> (e.g. 192.168.x.x ya 169.254.x.x) note karein.
              </p>
            </div>

            {/* Method 4 */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <span className="font-bold text-amber-800 flex items-center gap-1.5">
                <Network className="w-4 h-4" /> Method 4: Direct Cat6 Cable (Static IP Recommendation)
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Bina router direct cable lagane ke liye:
              </p>
              <ul className="text-slate-600 list-disc list-inside space-y-0.5 text-[11px] font-mono">
                <li>Desktop (Server): <span className="font-bold text-slate-900">192.168.99.1</span></li>
                <li>Laptop (Client): <span className="font-bold text-slate-900">192.168.99.2</span></li>
                <li>Subnet Mask: <span className="font-bold text-slate-900">255.255.255.0</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Gauges Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Worker Server Hardware Telemetry</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            1.0s interval
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Gauge */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-600" /> CPU Load
              </span>
              <span className="text-xs font-bold text-slate-500">{hardware.cpu_cores} Cores</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{hardware.cpu_percent}%</span>
              <span className="text-xs text-slate-500 truncate max-w-[140px]">{hardware.cpu_model}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(hardware.cpu_percent, 100)}%` }}
              />
            </div>
          </div>

          {/* RAM Gauge */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-blue-600" /> RAM Allocation
              </span>
              <span className="text-xs font-bold text-slate-500">{hardware.ram_total_gb.toFixed(1)} GB Total</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{hardware.ram_used_gb.toFixed(1)} GB</span>
              <span className="text-xs text-slate-500">
                {((hardware.ram_used_gb / hardware.ram_total_gb) * 100).toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(hardware.ram_used_gb / hardware.ram_total_gb) * 100}%` }}
              />
            </div>
          </div>

          {/* GPU Utilization */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> GPU Core Engine
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">NVENC Active</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{hardware.gpu_util_percent ?? 88}%</span>
              <span className="text-xs text-slate-500 truncate max-w-[140px]">{hardware.gpu_name}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${hardware.gpu_util_percent ?? 88}%` }}
              />
            </div>
          </div>

          {/* GPU VRAM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" /> Dedicated VRAM
              </span>
              <span className="text-xs font-bold text-slate-500">
                {((hardware.gpu_vram_total_mb ?? 12288) / 1024).toFixed(0)} GB GDDR6
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {((hardware.gpu_vram_used_mb ?? 4200) / 1024).toFixed(1)} GB
              </span>
              <span className="text-xs text-slate-500">
                {(((hardware.gpu_vram_used_mb ?? 4200) / (hardware.gpu_vram_total_mb ?? 12288)) * 100).toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${((hardware.gpu_vram_used_mb ?? 4200) / (hardware.gpu_vram_total_mb ?? 12288)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Quick Offloading Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onNavigate('render_job')}
            className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-purple-300 hover:shadow-md group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                New Render Job
              </h4>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Offload 4K/1080p video transcoding to remote NVENC GPU or submit batch shell scripts.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('ai_studio')}
            className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-300 hover:shadow-md group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Deep Learning & Vision Studio
              </h4>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Train PyTorch CNNs over 100k images, scan photos with visual classifier, or offload Python scripts.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('benchmarks')}
            className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-emerald-300 hover:shadow-md group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Run Benchmarks
              </h4>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated 5-step pipeline comparing local laptop CPU vs remote NVIDIA RTX GPU speedup.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity Feed</h3>
          <span className="text-xs text-slate-500 font-mono">{jobHistory.length} Total Executions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Job ID</th>
                <th className="pb-3 px-3">Task / Media</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Elapsed</th>
                <th className="pb-3 px-3">Speed / FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobHistory.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-purple-600">{job.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{job.filename}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      job.status === 'completed' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : job.status === 'rendering'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                      {job.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {job.status === 'rendering' && <Clock className="w-3 h-3 animate-spin" />}
                      {job.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      <span className="uppercase">{job.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{job.elapsed_seconds}s</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{job.speed || (job.fps ? `${job.fps} fps` : '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
