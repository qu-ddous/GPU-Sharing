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
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Worker Server Node</span>
          <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Port {workerPort}
          </span>
        </h2>
        <p className="text-xs text-slate-500">
          Dedicated workstation for remote video transcoding & compute offloading
        </p>
      </div>

      {/* Control Buttons & Badges */}
      <div className="flex items-center gap-3">
        {/* Daemon Toggle Button */}
        <button
          onClick={toggleDaemon}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            daemonOnline
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{daemonOnline ? '● Daemon Running' : '● Daemon Paused'}</span>
        </button>

        {/* Worker IP Copy Badge */}
        <button
          onClick={handleCopyIp}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
          title="Click to copy IP for laptop client"
        >
          <span>{workerIp}:{workerPort}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Windows Firewall Elevation Button */}
        <button
          onClick={handleFirewall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          title="Unblock Port 8000 in Windows Firewall"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>{firewallToast ? 'Firewall Allowed ✔' : 'Unblock Firewall'}</span>
        </button>

        {/* Active Client Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{activeClientCount} Connected</span>
        </div>
      </div>
    </header>
  );
};
