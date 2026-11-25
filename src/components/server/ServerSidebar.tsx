import React from 'react';
import { 
  BarChart3, 
  ListOrdered, 
  ScrollText, 
  Cpu
} from 'lucide-react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';

export type ServerNavView =
  | 'server_overview'
  | 'render_queue'
  | 'activity_logs';

interface ServerSidebarProps {
  currentView: ServerNavView;
  onNavigate: (view: ServerNavView) => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({ currentView, onNavigate }) => {
  const daemonOnline = useServerNodeStore((s) => s.daemonOnline);
  const gpuName = useServerNodeStore((s) => s.gpuName);

  const navItems: Array<{ id: ServerNavView; label: string; icon: React.ReactNode }> = [
    { id: 'server_overview', label: 'Overview & Monitor', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'render_queue', label: 'Render Queue', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'activity_logs', label: 'Activity Logs', icon: <ScrollText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 h-screen select-none shrink-0 shadow-xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1">
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold tracking-wider mb-1.5">
            WORKER NODE
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="text-emerald-600 text-2xl leading-none">⚡</span> GPU Worker
          </h1>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
            <span
              className={`w-2 h-2 rounded-full ${
                daemonOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-700">
              {daemonOnline ? 'Daemon Running (:8000)' : 'Daemon Stopped'}
            </span>
          </div>
        </div>

        {/* Streamlined Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hardware Status Footer */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 truncate">{gpuName}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">Port 8000 • UDP 8002 Active</p>
      </div>
    </aside>
  );
};
