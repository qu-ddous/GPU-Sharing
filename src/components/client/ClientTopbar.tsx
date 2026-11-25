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
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none shadow-xs">
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Job Quick Pill */}
        {activeJob && activeJob.status === 'rendering' && (
          <button
            onClick={onNavigateToJob}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-all shadow-xs animate-pulse"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rendering {overallPercent.toFixed(1)}%</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {/* Connection Pill */}
        <button
          onClick={() => connect()}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isConnected
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
              : 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
          }`}
          title={isConnected ? 'Connected. Click to re-ping.' : 'Offline. Click to retry connection.'}
        >
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <Wifi className="w-3.5 h-3.5" />
              <span>
                Connected: {serverIp}:{serverPort} ({latencyMs.toFixed(1)} ms)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span>● Worker Server Offline</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
