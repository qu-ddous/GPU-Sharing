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
  const [showIpHelp, setShowIpHelp] = useState(false);

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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] text-[#eeeeee] font-sans">
      {/* Quick Connect Floating Glass Bar */}
      <div className="bg-[#222831]/85 backdrop-blur-xl border border-[#303640] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#b8eef0]/70 uppercase tracking-widest">Target Node:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#eeeeee]/60 font-medium">IP:</span>
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              className="bg-[#1d232c] border border-[#303640] rounded-full px-3.5 py-1.5 text-xs font-mono text-[#00adb5] focus:outline-none focus:border-[#00adb5] focus:shadow-[0_0_12px_rgba(0,173,181,0.3)] w-36 transition-all"
              placeholder="192.168.99.1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#eeeeee]/60 font-medium">Port:</span>
            <input
              type="text"
              value={inputPort}
              onChange={(e) => setInputPort(e.target.value)}
              className="bg-[#1d232c] border border-[#303640] rounded-full px-3.5 py-1.5 text-xs font-mono text-[#00adb5] focus:outline-none focus:border-[#00adb5] focus:shadow-[0_0_12px_rgba(0,173,181,0.3)] w-20 transition-all"
              placeholder="8000"
            />
          </div>
          <button
            onClick={handleConnect}
            className="bg-[#00adb5] hover:bg-[#b8eef0] text-[#1d232c] px-5 py-1.5 text-xs font-bold rounded-full transition-all duration-180 shadow-[0_0_16px_rgba(0,173,181,0.4)]"
          >
            Connect
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowIpHelp(!showIpHelp)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all duration-180 backdrop-blur-md ${
              showIpHelp
                ? 'bg-[#00adb5]/20 border-[#00adb5] text-[#00adb5] shadow-[0_0_12px_rgba(0,173,181,0.3)]'
                : 'bg-[#1d232c] border-[#303640] text-[#eeeeee]/80 hover:border-[#00adb5]/60 hover:text-[#00adb5]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#00adb5]" />
            <span>💡 How to find IP?</span>
          </button>

          <button
            onClick={handleDiscovery}
            disabled={isScanning}
            className="bg-[#1d232c] border border-[#303640] hover:border-[#00adb5] text-[#eeeeee] px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-2 shadow-xs transition-all duration-180"
          >
            <Search className={`w-3.5 h-3.5 text-[#00adb5] ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning UDP...' : 'Auto-Discover (Port 8002)'}</span>
          </button>
        </div>
      </div>

      {/* Expandable IP Guide Card */}
      {showIpHelp && (
        <div className="bg-[#222831]/90 backdrop-blur-2xl border border-[#00adb5]/40 rounded-2xl p-5 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-[#303640] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00adb5]/20 text-[#00adb5] flex items-center justify-center border border-[#00adb5]/40">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#eeeeee]">How to Find Worker Node IP (Dosri Device Ka IP Kese Maloom Karein?)</h4>
                <p className="text-xs text-[#b8eef0]/70">Desktop GPU machine ka IP address find karne ke 4 aasan tareeqay:</p>
              </div>
            </div>
            <button 
              onClick={() => setShowIpHelp(false)}
              className="text-xs text-[#eeeeee]/60 hover:text-[#eeeeee] px-2.5 py-1 rounded-full hover:bg-[#303640] border border-[#303640]"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Method 1 */}
            <div className="p-3.5 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1.5">
              <span className="font-bold text-[#00adb5] flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Method 1: Automatic 1-Click Scan (Sub Se Aasan)
              </span>
              <p className="text-[#eeeeee]/80 leading-relaxed text-[11px]">
                Upar <strong>"Auto-Discover"</strong> button dabayein. Agar dono devices ek hi direct cable ya local network par hain toh UDP port 8002 ke zariye desktop server 1.5 seconds mein khud detect ho kar connect ho jayega.
              </p>
            </div>

            {/* Method 2 */}
            <div className="p-3.5 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Monitor className="w-4 h-4" /> Method 2: Server Desktop Screen Par Dekhein
              </span>
              <p className="text-[#eeeeee]/80 leading-relaxed text-[11px]">
                Desktop computer par <strong>GPUShare-Server.exe</strong> open karein. Topbar mein IP aur Port seedha likha hota hai (e.g. <code>192.168.99.1:8000</code>). Uspar click karein, wo copy ho jayega!
              </p>
            </div>

            {/* Method 3 */}
            <div className="p-3.5 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1.5">
              <span className="font-bold text-[#b8eef0] flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Method 3: Windows Command Prompt (CMD) Se
              </span>
              <p className="text-[#eeeeee]/80 leading-relaxed text-[11px]">
                Desktop par <kbd className="bg-[#303640] px-1.5 py-0.5 rounded text-[10px] text-[#00adb5]">Win + R</kbd> dabayein, <code>cmd</code> likhein aur Enter karein:
              </p>
              <div className="bg-[#15181e] border border-[#303640] px-2.5 py-1 rounded-lg font-mono text-[11px] text-[#00adb5]">
                ipconfig
              </div>
              <p className="text-[#eeeeee]/60 text-[10px]">
                Ethernet adapter ke niche <strong>IPv4 Address</strong> (e.g. 192.168.x.x ya 169.254.x.x) note karein.
              </p>
            </div>

            {/* Method 4 */}
            <div className="p-3.5 rounded-xl bg-[#1d232c]/80 border border-[#303640] space-y-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Network className="w-4 h-4" /> Method 4: Direct Cat6 Cable (Static IP Recommendation)
              </span>
              <p className="text-[#eeeeee]/80 leading-relaxed text-[11px]">
                Bina router direct cable lagane ke liye:
              </p>
              <ul className="text-[#eeeeee]/80 list-disc list-inside space-y-0.5 text-[11px] font-mono">
                <li>Desktop (Server): <span className="font-bold text-[#00adb5]">192.168.99.1</span></li>
                <li>Laptop (Client): <span className="font-bold text-[#00adb5]">192.168.99.2</span></li>
                <li>Subnet Mask: <span className="font-bold text-[#00adb5]">255.255.255.0</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Gauges Grid */}
      <div>
        <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>Worker Server Hardware Telemetry</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#303640] text-[#00adb5] border border-[#303640]">
            1.0s interval
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Gauge */}
          <div className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-5 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-[#00adb5]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#eeeeee]/70 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#00adb5]" /> CPU Load
              </span>
              <span className="text-xs font-bold text-[#b8eef0]/80">{hardware.cpu_cores} Cores</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#eeeeee] tracking-tight">{hardware.cpu_percent}%</span>
              <span className="text-xs text-[#eeeeee]/60 truncate max-w-[140px]">{hardware.cpu_model}</span>
            </div>
            <div className="w-full bg-[#1d232c] h-2 rounded-full overflow-hidden border border-[#303640]/50">
              <div 
                className="bg-[#00adb5] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00adb5]" 
                style={{ width: `${Math.min(hardware.cpu_percent, 100)}%` }}
              />
            </div>
          </div>

          {/* RAM Gauge */}
          <div className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-5 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-[#00adb5]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#eeeeee]/70 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#00adb5]" /> RAM Allocation
              </span>
              <span className="text-xs font-bold text-[#b8eef0]/80">{hardware.ram_total_gb.toFixed(1)} GB Total</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#eeeeee] tracking-tight">{hardware.ram_used_gb.toFixed(1)} GB</span>
              <span className="text-xs text-[#eeeeee]/60">
                {((hardware.ram_used_gb / hardware.ram_total_gb) * 100).toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full bg-[#1d232c] h-2 rounded-full overflow-hidden border border-[#303640]/50">
              <div 
                className="bg-[#00adb5] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00adb5]" 
                style={{ width: `${(hardware.ram_used_gb / hardware.ram_total_gb) * 100}%` }}
              />
            </div>
          </div>

          {/* GPU Utilization */}
          <div className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-5 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-[#00adb5]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#eeeeee]/70 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00adb5]" /> GPU Core Engine
              </span>
              <span className="text-xs font-bold text-[#00adb5] font-mono">NVENC Active</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#eeeeee] tracking-tight">{hardware.gpu_util_percent ?? 88}%</span>
              <span className="text-xs text-[#eeeeee]/60 truncate max-w-[140px]">{hardware.gpu_name}</span>
            </div>
            <div className="w-full bg-[#1d232c] h-2 rounded-full overflow-hidden border border-[#303640]/50">
              <div 
                className="bg-[#00adb5] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00adb5]" 
                style={{ width: `${hardware.gpu_util_percent ?? 88}%` }}
              />
            </div>
          </div>

          {/* GPU VRAM */}
          <div className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-5 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-[#00adb5]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#eeeeee]/70 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00adb5]" /> Dedicated VRAM
              </span>
              <span className="text-xs font-bold text-[#b8eef0]/80">
                {((hardware.gpu_vram_total_mb ?? 12288) / 1024).toFixed(0)} GB GDDR6
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#eeeeee] tracking-tight">
                {((hardware.gpu_vram_used_mb ?? 4200) / 1024).toFixed(1)} GB
              </span>
              <span className="text-xs text-[#eeeeee]/60">
                {(((hardware.gpu_vram_used_mb ?? 4200) / (hardware.gpu_vram_total_mb ?? 12288)) * 100).toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full bg-[#1d232c] h-2 rounded-full overflow-hidden border border-[#303640]/50">
              <div 
                className="bg-[#00adb5] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00adb5]" 
                style={{ width: `${((hardware.gpu_vram_used_mb ?? 4200) / (hardware.gpu_vram_total_mb ?? 12288)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Cards */}
      <div>
        <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest mb-4">Quick Offloading Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onNavigate('render_job')}
            className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-6 cursor-pointer hover:border-[#00adb5] hover:shadow-[0_0_24px_rgba(0,173,181,0.25)] group transition-all duration-180"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00adb5]/15 text-[#00adb5] border border-[#00adb5]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-[#eeeeee] group-hover:text-[#00adb5] transition-colors">
                New Render Job
              </h4>
              <ArrowUpRight className="w-4 h-4 text-[#eeeeee]/40 group-hover:text-[#00adb5]" />
            </div>
            <p className="text-xs text-[#eeeeee]/70 leading-relaxed">
              Offload 4K/1080p video transcoding to remote NVENC GPU or submit batch shell scripts.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('ai_studio')}
            className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-6 cursor-pointer hover:border-[#00adb5] hover:shadow-[0_0_24px_rgba(0,173,181,0.25)] group transition-all duration-180"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00adb5]/15 text-[#00adb5] border border-[#00adb5]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-[#eeeeee] group-hover:text-[#00adb5] transition-colors">
                Deep Learning & Vision Studio
              </h4>
              <ArrowUpRight className="w-4 h-4 text-[#eeeeee]/40 group-hover:text-[#00adb5]" />
            </div>
            <p className="text-xs text-[#eeeeee]/70 leading-relaxed">
              Train PyTorch CNNs over 100k images, scan photos with visual classifier, or offload Python scripts.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('benchmarks')}
            className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-6 cursor-pointer hover:border-[#00adb5] hover:shadow-[0_0_24px_rgba(0,173,181,0.25)] group transition-all duration-180"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00adb5]/15 text-[#00adb5] border border-[#00adb5]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-[#eeeeee] group-hover:text-[#00adb5] transition-colors">
                Run Benchmarks
              </h4>
              <ArrowUpRight className="w-4 h-4 text-[#eeeeee]/40 group-hover:text-[#00adb5]" />
            </div>
            <p className="text-xs text-[#eeeeee]/70 leading-relaxed">
              Automated 5-step pipeline comparing local laptop CPU vs remote NVIDIA RTX GPU speedup.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-[#222831]/80 backdrop-blur-xl border border-[#303640] rounded-2xl p-6 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest">Recent Activity Feed</h3>
          <span className="text-xs text-[#eeeeee]/60 font-mono">{jobHistory.length} Total Executions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#303640] text-[#b8eef0]/70 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Job ID</th>
                <th className="pb-3 px-3">Task / Media</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Elapsed</th>
                <th className="pb-3 px-3">Speed / FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303640]/50">
              {jobHistory.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-[#303640]/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#00adb5]">{job.id}</td>
                  <td className="py-3 px-3 font-medium text-[#eeeeee]">{job.filename}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      job.status === 'completed' 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : job.status === 'rendering'
                        ? 'bg-[#00adb5]/15 border-[#00adb5]/30 text-[#00adb5]'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    }`}>
                      {job.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {job.status === 'rendering' && <Clock className="w-3 h-3 animate-spin" />}
                      {job.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      <span className="uppercase">{job.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#eeeeee]/60">{job.elapsed_seconds}s</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#b8eef0]">{job.speed || (job.fps ? `${job.fps} fps` : '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
