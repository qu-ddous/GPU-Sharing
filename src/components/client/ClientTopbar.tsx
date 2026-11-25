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
    <header className="h-16 px-6 bg-[#222831]/80 backdrop-blur-xl border-b border-[#303640] flex items-center justify-between shrink-0 select-none shadow-[0_4px_20px_rgba(0,0,0,0.25)] relative z-10">
      {/* Title */}
      <div>
        <h2 className="text-sm md:text-base font-bold text-[#eeeeee] tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00adb5]"></span>
          {pageTitle}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Job Quick Pill */}
        {activeJob && activeJob.status === 'rendering' && (
          <button
            onClick={onNavigateToJob}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00adb5]/20 border border-[#00adb5]/50 text-[#00adb5] text-xs font-bold hover:bg-[#00adb5]/30 transition-all shadow-[0_0_14px_rgba(0,173,181,0.3)] animate-pulse"
          >
            <Activity className="w-3.5 h-3.5 text-[#00adb5]" />
            <span>Rendering {overallPercent.toFixed(1)}%</span>
            <ArrowRight className="w-3 h-3 text-[#00adb5]" />
          </button>
        )}

        {/* Connection Status Glass Pill */}
        <button
          onClick={() => connect()}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-180 backdrop-blur-md shadow-xs ${
            isConnected
              ? 'bg-[#00adb5]/15 border-[#00adb5]/40 text-[#00adb5] hover:bg-[#00adb5]/25 hover:shadow-[0_0_14px_rgba(0,173,181,0.3)]'
              : 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25'
          }`}
          title={isConnected ? 'Connected to GPU Node. Click to re-ping.' : 'Offline. Click to retry connection.'}
        >
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#00adb5] animate-ping"></span>
              <Wifi className="w-3.5 h-3.5" />
              <span>
                {serverIp}:{serverPort} ({latencyMs.toFixed(1)} ms)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span>GPU Host Offline</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
