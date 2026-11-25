import React from 'react';
import { 
  BarChart3, 
  ListOrdered, 
  Cpu, 
  Network, 
  Sliders, 
  ScrollText, 
  BookMarked 
} from 'lucide-react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';

export type ServerNavView =
  | 'server_overview'
  | 'render_queue'
  | 'gpu_engine'
  | 'network'
  | 'server_settings'
  | 'activity_logs'
  | 'server_docs';

interface ServerSidebarProps {
  currentView: ServerNavView;
  onNavigate: (view: ServerNavView) => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({ currentView, onNavigate }) => {
  const daemonOnline = useServerNodeStore((s) => s.daemonOnline);

  const navItems: Array<{ id: ServerNavView; label: string; icon: React.ReactNode }> = [
    { id: 'server_overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'render_queue', label: 'Render Queue', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'gpu_engine', label: 'GPU & Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Network className="w-4 h-4" /> },
    { id: 'server_settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'activity_logs', label: 'Activity Logs', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'server_docs', label: 'Docs & Guide', icon: <BookMarked className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-surface-900 border-r border-surface-border/60 flex flex-col justify-between p-4 h-screen select-none shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1">
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-blue/20 border border-brand-blue/40 text-brand-blue text-[10px] font-bold tracking-wider mb-1.5 shadow-clayGlowBlue">
            WORKER NODE
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <span className="text-brand-blue text-2xl leading-none">⚡</span> GPU Worker
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                daemonOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-300">
              {daemonOnline ? 'Daemon Running' : 'Daemon Paused'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40 shadow-claySm'
                    : 'text-slate-300 hover:bg-surface-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hardware Detection Footer */}
      <div className="p-3.5 rounded-2xl bg-surface-800/80 border border-surface-border/50 shadow-claySm space-y-1">
        <p className="text-xs font-bold text-white truncate">NVIDIA GeForce RTX 3060</p>
        <p className="text-[11px] text-slate-400 font-mono">Driver: 551.86 • NVENC Active</p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-surface-border/40 font-mono">
          <span>CUDA 12.1</span>
          <span>sm_86 Ampere</span>
        </div>
      </div>
    </aside>
  );
};
