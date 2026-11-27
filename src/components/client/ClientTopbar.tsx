import React from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { useJobStore } from '../../store/useJobStore.js';
import { Wifi, WifiOff, Activity, ArrowRight } from 'lucide-react';

interface ClientTopbarProps {
  pageTitle: string;
  onNavigateToJob?: () => void;
}

export const ClientTopbar: React.FC<ClientTopbarProps> = ({ pageTitle, onNavigateToJob }) => {
  const isConnected = useServerStore((s) => s.isConnected);
  const serverIp = useServerStore((s) => s.serverIp);
  const serverPort = useServerStore((s) => s.serverPort);
  const latencyMs = useServerStore((s) => s.latencyMs);
  const connect = useServerStore((s) => s.connect);

  const activeJob = useJobStore((s) => s.activeJob);
  const overallPercent = useJobStore((s) => s.overallPercent);

  return (
    <header className="h-14 px-6 bg-white/90 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0 select-none">
      {/* Page Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Active Job Quick Pill */}
        {activeJob && activeJob.status === 'rendering' && (
          <button
            onClick={onNavigateToJob}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Rendering {overallPercent.toFixed(1)}%</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Connection Status Pill */}
        <button
          onClick={() => connect()}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            isConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title={isConnected ? 'Connected to GPU Node. Click to re-ping.' : 'Offline. Click to retry connection.'}
        >
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-sm shadow-emerald-500/50"></span>
              <Wifi className="w-4 h-4 text-emerald-700" />
              <span className="font-mono text-[11px]">
                {serverIp}:{serverPort} ({latencyMs.toFixed(1)} ms)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-600 shadow-sm shadow-rose-500/50"></span>
              <WifiOff className="w-4 h-4 text-rose-600" />
              <span>Worker Offline • Retry</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
