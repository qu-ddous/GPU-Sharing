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

  const navItems: Array<{ id: ClientNavView; label: string; icon: React.ReactNode; badgeClass: string }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm shadow-blue-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'render_job',
      label: 'Render Studio',
      icon: <Film className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-sm shadow-purple-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'active_job',
      label: 'Live Monitor',
      icon: <Radio className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-sm shadow-rose-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'ai_studio',
      label: 'Vision & Deep Learning',
      icon: <BrainCircuit className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white shadow-sm shadow-teal-600/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'benchmarks',
      label: 'Benchmarks Suite',
      icon: <Zap className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-inset ring-white/40'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm shadow-slate-700/30 ring-1 ring-inset ring-white/30'
    },
    {
      id: 'docs',
      label: 'Docs & Guide',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      badgeClass: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-sm shadow-emerald-600/30 ring-1 ring-inset ring-white/40'
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 h-screen select-none shrink-0">
      <div className="space-y-6 overflow-y-auto">
        {/* Clean Brand Header with glossy gradient icon */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/35 ring-1 ring-inset ring-white/40">
            <Zap className="w-4 h-4 fill-current drop-shadow-sm" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                GPUShare
              </h1>
              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isConnected ? 'ONLINE' : 'READY'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              Direct GPU Offloading
            </p>
          </div>
        </div>

        {/* Clean Navigation List with distinct glossy icon badges */}
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
        {/* Connection Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${
                isConnected ? 'bg-emerald-600 animate-pulse shadow-emerald-500/50' : 'bg-amber-600 shadow-amber-500/50'
              }`}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {isConnected ? 'Worker Connected' : 'Cable Ready (Offline)'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {isConnected ? `${serverIp}:${serverPort}` : 'Waiting for GPU PC'}
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Engine Pill */}
        <div
          className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${
            nvencReady
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm ring-1 ring-inset ring-white/40 ${
              nvencReady ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-amber-500 to-orange-600'
            }`}>
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold truncate">
              {nvencReady ? 'Remote NVENC Ready' : 'CPU Fallback Mode'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
