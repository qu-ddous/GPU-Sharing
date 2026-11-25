import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Radio, 
  Zap, 
  Settings, 
  BrainCircuit, 
  BookOpen, 
  Cpu
} from 'lucide-react';
import { useServerStore } from '../../store/useServerStore.js';

export type ClientNavView = 
  | 'dashboard' 
  | 'render_job' 
  | 'active_job' 
  | 'ai_studio' 
  | 'benchmarks' 
  | 'settings' 
  | 'docs';

interface ClientSidebarProps {
  currentView: ClientNavView;
  onNavigate: (view: ClientNavView) => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentView, onNavigate }) => {
  const nvencReady = useServerStore((s) => s.nvencReady);
  const isConnected = useServerStore((s) => s.isConnected);
  const serverIp = useServerStore((s) => s.serverIp);
  const serverPort = useServerStore((s) => s.serverPort);

  const workflowItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'render_job', label: 'Render Studio', icon: <Film className="w-4 h-4" /> },
    { id: 'active_job', label: 'Live Monitor', icon: <Radio className="w-4 h-4" /> },
  ];

  const computeItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'ai_studio', label: 'Vision & Deep Learning', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'benchmarks', label: 'Benchmarks Suite', icon: <Zap className="w-4 h-4" /> },
  ];

  const systemItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'settings', label: 'Host & Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'docs', label: 'Docs & Guide', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const renderNavGroup = (title: string, items: typeof workflowItems) => (
    <div>
      <p className="px-3 text-[10px] font-bold text-[#b8eef0]/60 uppercase tracking-widest mb-1.5 font-sans">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-180 select-none ${
                isActive
                  ? 'bg-[#00adb5] text-[#1d232c] font-bold shadow-[0_0_18px_rgba(0,173,181,0.45)] border border-[#b8eef0]/50 translate-x-0.5'
                  : 'text-[#eeeeee]/80 hover:bg-[#303640]/60 hover:text-[#00adb5] border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-[#1d232c]' : 'text-[#00adb5]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-[#222831]/95 backdrop-blur-2xl border-r border-[#303640] flex flex-col justify-between p-4 h-screen select-none shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.35)] relative z-20">
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Brand Header - Pure Client Studio */}
        <div className="px-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00adb5]/15 border border-[#00adb5]/30 text-[#00adb5] text-[10px] font-bold tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00adb5] animate-ping" />
            CLIENT STUDIO
          </div>
          <h1 className="text-xl font-extrabold text-[#eeeeee] tracking-tight flex items-center gap-2">
            <span className="text-[#00adb5] text-2xl drop-shadow-[0_0_12px_rgba(0,173,181,0.6)]">⚡</span> GPUShare
          </h1>
          <p className="text-xs text-[#b8eef0]/70 font-medium mt-0.5">Remote GPU Compute & Render</p>
          
          {/* Connection Indicator Pill */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#303640]/80">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#00adb5] shadow-[0_0_10px_#00adb5] animate-pulse' : 'bg-red-400'
              }`}
            />
            <span className="text-[11px] font-mono font-medium text-[#eeeeee]/80 truncate">
              {isConnected ? `Host: ${serverIp}:${serverPort}` : 'Worker Server Offline'}
            </span>
          </div>
        </div>

        {/* Client Navigation Groups */}
        <nav className="space-y-4">
          {renderNavGroup('Workflows', workflowItems)}
          {renderNavGroup('Compute & Intelligence', computeItems)}
          {renderNavGroup('Configuration', systemItems)}
        </nav>
      </div>

      {/* Engine Status Capsule at Bottom */}
      <div className="p-3 rounded-xl bg-[#1d232c]/85 border border-[#303640] backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            {nvencReady && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00adb5] opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                nvencReady ? 'bg-[#00adb5] shadow-[0_0_8px_#00adb5]' : 'bg-amber-400'
              }`}
            ></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#eeeeee] truncate">
              {nvencReady ? 'Remote NVENC Ready' : 'CPU Compute Fallback'}
            </p>
            <p className="text-[10px] text-[#b8eef0]/70 font-mono truncate">
              {nvencReady ? 'Hardware Acceleration' : 'Multi-Core libx264'}
            </p>
          </div>
          <Cpu className="w-4 h-4 text-[#00adb5]" />
        </div>
      </div>
    </aside>
  );
};
