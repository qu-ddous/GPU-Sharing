import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { Network, Copy, Check, ShieldCheck, Activity, Users, ArrowDown, ArrowUp } from 'lucide-react';

export const ServerNetworkView: React.FC = () => {
  const { workerIp, workerPort, activeSessions, activeClientCount, totalTransferredDisplay } = useServerNodeStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${workerIp}:${workerPort}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* 4 Network KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="clay-card p-4 space-y-1 border-emerald-500/40">
          <span className="text-xs font-bold text-emerald-400 uppercase">Daemon Service</span>
          <p className="text-xl font-extrabold text-white">Listening (:8000)</p>
          <p className="text-[11px] text-slate-400">FastAPI & WebSocket Online</p>
        </div>

        <div className="clay-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Worker Node IP</span>
            <button onClick={handleCopy} className="text-xs text-brand-blue hover:underline">
              {copied ? '✔ Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xl font-extrabold text-brand-blue">{workerIp}</p>
          <p className="text-[11px] text-slate-400">Direct Cat6 Ethernet</p>
        </div>

        <div className="clay-card p-4 space-y-1 border-brand-blue/40">
          <span className="text-xs font-bold text-brand-blue uppercase">Active Sessions</span>
          <p className="text-xl font-extrabold text-white">{activeClientCount} Connected</p>
          <p className="text-[11px] text-slate-400">Zero packet loss</p>
        </div>

        <div className="clay-card p-4 space-y-1 border-amber-500/40">
          <span className="text-xs font-bold text-amber-400 uppercase">Session Transfer</span>
          <p className="text-xl font-extrabold text-white">{totalTransferredDisplay}</p>
          <p className="text-[11px] text-slate-400">Direct Socket Pipe</p>
        </div>
      </div>

      {/* Network Adapters Section */}
      <div className="clay-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Network className="w-4 h-4 text-brand-blue" />
          <span>Detected Network Adapters & Direct Cable Interfaces</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adapter 1: Direct Ethernet */}
          <div className="p-4 rounded-xl bg-surface-850 border border-emerald-500/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Direct Ethernet Cable (P2P High Speed)
              </span>
              <span className="clay-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/40">Connected</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <p>IPv4 Address: <span className="text-white font-bold">192.168.99.1</span> (Static Subnet)</p>
              <p>Subnet Mask: 255.255.255.0</p>
              <p>Link Speed: <span className="text-emerald-400 font-bold">1.0 Gbps (Full Duplex)</span></p>
              <p>MAC: 00:1A:2B:3C:4D:5E</p>
            </div>
          </div>

          {/* Adapter 2: Router Wi-Fi */}
          <div className="p-4 rounded-xl bg-surface-850 border border-surface-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                LAN Wi-Fi Adapter (Home Router)
              </span>
              <span className="clay-badge bg-slate-800 text-slate-400 border-surface-border">Fallback</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <p>IPv4 Address: <span className="text-slate-300">192.168.1.145</span></p>
              <p>Subnet Mask: 255.255.255.0</p>
              <p>Link Speed: 433.0 Mbps (802.11ac)</p>
              <p>MAC: B8:27:EB:12:34:56</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Client Sessions Table */}
      <div className="clay-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-blue" />
          <span>Active Connected Client Sessions</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-surface-border text-slate-400 font-bold uppercase">
              <tr>
                <th className="pb-3 px-3">Client IPv4</th>
                <th className="pb-3 px-3">Port</th>
                <th className="pb-3 px-3">Connected For</th>
                <th className="pb-3 px-3">Last Ping</th>
                <th className="pb-3 px-3">Payload Uploaded</th>
                <th className="pb-3 px-3">Render Downloaded</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/30">
              {activeSessions.map((session, idx) => (
                <tr key={idx} className="hover:bg-surface-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{session.ip}</td>
                  <td className="py-3 px-3 text-slate-400">{session.port}</td>
                  <td className="py-3 px-3 text-slate-300">{session.duration}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{session.latency}</td>
                  <td className="py-3 px-3 text-slate-300">{session.bytesReceived}</td>
                  <td className="py-3 px-3 text-slate-300">{session.bytesSent}</td>
                  <td className="py-3 px-3">
                    <span className={`clay-badge text-[10px] ${
                      session.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
