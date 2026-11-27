import React from 'react';
import { 
  BarChart3, 
  ListOrdered, 
  ScrollText, 
  Cpu,
  Zap,
  Network,
  Settings,
  BookOpen
} from 'lucide-react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';

export type ServerNavView =
  | 'server_overview'
  | 'render_queue'
  | 'activity_logs'
  | 'gpu_engine'
  | 'network'
  | 'server_settings'
  | 'server_docs';

interface ServerSidebarProps {
  currentView: ServerNavView;
  onNavigate: (view: ServerNavView) => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({ currentView, onNavigate }) => {
  const daemonOnline = useServerNodeStore((s) => s.daemonOnline);
  const workerPort = useServerNodeStore((s) => s.workerPort);
  const gpuName = useServerNodeStore((s) => s.gpuName);

  const navItems: Array<{ id: ServerNavView; label: string; icon: React.ReactNode; badgeClass: string }> = [
    {
      id: 'server_overview',
      label: 'Overview',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm shadow-blue-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'render_queue',
      label: 'Render Queue',
      icon: <ListOrdered className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-sm shadow-purple-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'activity_logs',
      label: 'Activity Logs',
      icon: <ScrollText className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'gpu_engine',
      label: 'GPU & Engine',
      icon: <Cpu className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-sm shadow-rose-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'network',
      label: 'Network',
      icon: <Network className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white shadow-sm shadow-cyan-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'server_settings',
      label: 'Settings',
      icon: <Settings className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm shadow-slate-700/30 ring-1 ring-inset ring-white/30'
    },
    {
      id: 'server_docs',
      label: 'Docs & Guide',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-inset ring-white/40'
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 h-screen select-none shrink-0">
      <div className="space-y-6 overflow-y-auto">
        {/* Clean Brand Header matching Client Studio */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40">
            <Zap className="w-4 h-4 fill-current drop-shadow-sm" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                GPUShare
              </h1>
              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  daemonOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                WORKER
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              Dedicated GPU Server
            </p>
          </div>
        </div>

        {/* Navigation List with distinct glossy icon badges */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? 'bg-white/20 text-white ring-1 ring-inset ring-white/40 shadow-inner'
                      : item.badgeClass
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Pills */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                daemonOnline ? 'bg-emerald-600 animate-pulse shadow-emerald-500/50' : 'bg-rose-600 shadow-rose-500/50'
              }`}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {daemonOnline ? `Daemon Running (:${workerPort})` : 'Daemon Stopped'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                UDP 8002 Discovery Active
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 rounded-xl border bg-emerald-50/70 border-emerald-200/80 text-emerald-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm ring-1 ring-inset ring-white/40 flex items-center justify-center shrink-0">
            <Cpu className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-bold truncate">{gpuName}</span>
        </div>
      </div>
    </aside>
  );
};
