import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { Power, Shield, Copy, Check, Users } from 'lucide-react';

export const ServerTopbar: React.FC = () => {
  const daemonOnline = useServerNodeStore((s) => s.daemonOnline);
  const toggleDaemon = useServerNodeStore((s) => s.toggleDaemon);
  const workerIp = useServerNodeStore((s) => s.workerIp);
  const workerPort = useServerNodeStore((s) => s.workerPort);
  const activeClientCount = useServerNodeStore((s) => s.activeClientCount);

  const [copied, setCopied] = useState(false);
  const [firewallToast, setFirewallToast] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(`${workerIp}:${workerPort}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFirewall = async () => {
    if (window.electronAPI?.unblockFirewall) {
      await window.electronAPI.unblockFirewall(workerPort);
    }
    setFirewallToast(true);
    setTimeout(() => setFirewallToast(false), 3000);
  };

  return (
    <header className="h-16 px-6 bg-surface-900/80 backdrop-blur-md border-b border-surface-border/50 flex items-center justify-between shrink-0 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>GPU Worker Server</span>
          <span className="text-xs font-mono font-normal text-slate-400">(:8000)</span>
        </h2>
        <p className="text-[11px] text-slate-400">
          Dedicated NVIDIA GPU render node for remote video processing & AI training
        </p>
      </div>

      {/* Control Buttons & Badges */}
      <div className="flex items-center gap-3">
        {/* Daemon Toggle Button */}
        <button
          onClick={toggleDaemon}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            daemonOnline
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-claySm'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-claySm'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{daemonOnline ? '● Server Online' : '● Server Stopped'}</span>
        </button>

        {/* Worker IP Copy Badge */}
        <button
          onClick={handleCopyIp}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-border text-slate-200 text-xs font-mono font-semibold hover:border-brand-blue transition-all"
          title="Click to copy IP:Port"
        >
          <span>{workerIp}:{workerPort}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
        </button>

        {/* Active Clients Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-xs font-bold font-mono">
          <Users className="w-3.5 h-3.5" />
          <span>{activeClientCount} Clients Active</span>
        </div>

        {/* Windows Firewall Action */}
        <button
          onClick={handleFirewall}
          className="clay-button-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-300"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>{firewallToast ? '✔ Rule Added' : '🛡️ Windows Firewall'}</span>
        </button>
      </div>
    </header>
  );
};
