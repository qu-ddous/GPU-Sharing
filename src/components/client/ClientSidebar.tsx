import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Radio, 
  Zap, 
  Settings, 
  BrainCircuit, 
  BookOpen, 
  Cpu,
  Activity,
  Server
} from 'lucide-react';
import { useServerStore } from '../../store/useServerStore.js';

export type ClientNavView = 
  | 'dashboard' 
  | 'render_job' 
  | 'active_job' 
  | 'benchmarks' 
  | 'ai_studio' 
  | 'server_overview' 
  | 'server_queue' 
  | 'settings' 
  | 'docs';

interface ClientSidebarProps {
  currentView: ClientNavView;
  onNavigate: (view: ClientNavView) => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentView, onNavigate }) => {
  const nvencReady = useServerStore((s) => s.nvencReady);

  const workflowItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'render_job', label: 'New Render Job', icon: <Film className="w-4 h-4" /> },
    { id: 'active_job', label: 'Live Monitor', icon: <Radio className="w-4 h-4" /> },
  ];

  const computeItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'ai_studio', label: 'AI Studio & Lens', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'benchmarks', label: 'Benchmarks Suite', icon: <Zap className="w-4 h-4" /> },
  ];

  const serverItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode }> = [
    { id: 'server_overview', label: 'GPU Worker Node', icon: <Activity className="w-4 h-4" /> },
    { id: 'server_queue', label: 'Server Queue', icon: <Server className="w-4 h-4" /> },
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
        {/* Brand Header */}
        <div className="px-2 pt-1">
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold tracking-wider mb-1.5">
            ALL-IN-ONE STUDIO
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="text-purple-600 text-2xl leading-none">⚡</span> GPUShare
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Distributed Task & GPU Studio</p>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4">
          {renderNavGroup('Main Workflow', workflowItems)}
          {renderNavGroup('Compute & AI', computeItems)}
          {renderNavGroup('Worker Server & GPU', serverItems)}
          {renderNavGroup('System & Help', systemItems)}
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
              {nvencReady ? '● NVENC Ready' : '● CPU Fallback'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              {nvencReady ? 'h264_nvenc Active' : 'libx264 Multi-Core'}
            </p>
          </div>
          <Cpu className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
