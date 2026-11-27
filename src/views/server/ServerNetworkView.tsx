import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { Network, Copy, Check, Users, Server, Activity } from 'lucide-react';

export const ServerNetworkView: React.FC = () => {
  const { workerIp, workerPort, activeSessions, activeClientCount, totalTransferredDisplay } = useServerNodeStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${workerIp}:${workerPort}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 4 Network KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-sans">Daemon Service</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">Listening (:{workerPort})</p>
          <p className="text-[11px] text-slate-500 font-sans">FastAPI & WebSocket Online</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-sans">Worker Node IP</span>
            <button
              onClick={handleCopy}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center cursor-pointer"
              title="Copy IP"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xl font-extrabold text-blue-600">{workerIp}</p>
          <p className="text-[11px] text-slate-500 font-sans">Direct Cat6 Ethernet</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-sans">Active Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-md shadow-purple-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">{activeClientCount} Connected</p>
          <p className="text-[11px] text-slate-500 font-sans">Zero packet loss</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-sans">Session Transfer</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-inset ring-white/40 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">{totalTransferredDisplay}</p>
          <p className="text-[11px] text-slate-500 font-sans">Direct Socket Pipe</p>
        </div>
      </div>

      {/* Network Adapters Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-sm ring-1 ring-inset ring-white/40 flex items-center justify-center">
            <Network className="w-3.5 h-3.5" />
          </span>
          <span>Detected Network Adapters & Direct Cable Interfaces</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adapter 1: Direct Ethernet */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                Direct Ethernet Cable (P2P High Speed)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
            <div className="space-y-1 text-slate-600">
              <p>IPv4 Address: <span className="text-slate-900 font-bold">{workerIp}</span> (Active Binding)</p>
              <p>Subnet Mask: 255.255.255.0</p>
              <p>Link Speed: <span className="text-emerald-700 font-bold">1.0 Gbps (Full Duplex)</span></p>
              <p>UDP Broadcast: Port 8002 Auto-Discovery</p>
            </div>
          </div>

          {/* Adapter 2: Router Wi-Fi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                LAN / Wi-Fi Adapter (Secondary)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                Standby
              </span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p>Bind Interface: <span className="text-slate-700">0.0.0.0:{workerPort}</span></p>
              <p>Subnet Mask: 255.255.255.0</p>
              <p>Transport: HTTP Multipart + WebSocket</p>
              <p>Fallback: Automatic Multi-Interface</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Client Sessions Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm ring-1 ring-inset ring-white/40 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </span>
          <span>Active Connected Client Sessions</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
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
            <tbody className="divide-y divide-slate-100">
              {activeSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    No active client sessions yet. Waiting for laptop client connection on port {workerPort}.
                  </td>
                </tr>
              ) : (
                activeSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{session.ip}</td>
                    <td className="py-3 px-3 text-slate-500">{session.port}</td>
                    <td className="py-3 px-3 text-slate-600">{session.duration}</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{session.latency}</td>
                    <td className="py-3 px-3 text-slate-600">{session.bytesReceived}</td>
                    <td className="py-3 px-3 text-slate-600">{session.bytesSent}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        session.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
