import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { notifyToast } from '../../store/useToastStore.js';
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
    notifyToast('Worker IP Copied', `${workerIp}:${workerPort} copied to clipboard.`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFirewall = async () => {
    if (window.electronAPI?.unblockFirewall) {
      await window.electronAPI.unblockFirewall(workerPort);
    }
    setFirewallToast(true);
    notifyToast('Firewall Rule Applied', `Port ${workerPort} allowed for incoming LAN connections.`, 'success');
    setTimeout(() => setFirewallToast(false), 3000);
  };

  return (
    <header className="h-14 px-6 bg-white/90 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between shrink-0 select-none">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">
          GPUShare • Worker Server Node
        </h2>
        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          Port {workerPort}
        </span>
      </div>

      {/* Control Buttons & Badges */}
      <div className="flex items-center gap-2.5">
        {/* Daemon Toggle Pill */}
        <button
          onClick={toggleDaemon}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
            daemonOnline
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <Power className={`w-4 h-4 ${daemonOnline ? 'text-emerald-700' : 'text-rose-600'}`} />
          <span>{daemonOnline ? 'Daemon Running' : 'Daemon Paused'}</span>
        </button>

        {/* Worker IP Copy Badge */}
        <button
          onClick={handleCopyIp}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-bold hover:bg-slate-100 transition-all cursor-pointer"
          title="Click to copy IP for laptop client"
        >
          <span>{workerIp}:{workerPort}</span>
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-cyan-700" />}
        </button>

        {/* Windows Firewall Elevation Button */}
        <button
          onClick={handleFirewall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          title="Unblock Port 8000 in Windows Firewall"
        >
          <Shield className="w-4 h-4 text-indigo-700" />
          <span>{firewallToast ? 'Firewall Allowed ✔' : 'Unblock Firewall'}</span>
        </button>

        {/* Active Client Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Users className="w-4 h-4 text-blue-700" />
          <span>{activeClientCount} Connected</span>
        </div>
      </div>
    </header>
  );
};
