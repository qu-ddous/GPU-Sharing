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
      <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 h-screen select-none shrink-0 shadow-xs">
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Brand Header - Pure Client Studio */}
        <div className="px-2 pt-1">
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold tracking-wider mb-1.5">
            💻 CLIENT STUDIO
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="text-purple-600 text-2xl leading-none">⚡</span> GPUShare
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Remote GPU Task Offloader</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-600 truncate">
              {isConnected ? `Worker: ${serverIp}:${serverPort}` : 'Worker Offline'}
            </span>
          </div>
        </div>

        {/* Pure Client Navigation Groups (Only 7 Client Views) */}
        <nav className="space-y-4">
          {renderNavGroup('Main Workflow', workflowItems)}
          {renderNavGroup('Compute & AI', computeItems)}
          {renderNavGroup('System & Preferences', systemItems)}
        </nav>
      </div>

      {/* Engine Status Card at Bottom */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            {nvencReady && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                nvencReady ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {nvencReady ? '● Remote NVENC Ready' : '● CPU Fallback'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              {nvencReady ? 'h264_nvenc Accelerated' : 'libx264 Multi-Core'}
            </p>
          </div>
          <Cpu className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
