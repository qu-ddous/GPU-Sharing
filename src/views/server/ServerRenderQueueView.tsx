import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { 
  ListOrdered, 
  Search, 
  Square, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter
} from 'lucide-react';

export const ServerRenderQueueView: React.FC = () => {
  const { renderQueue, cancelJob, purgeJob } = useServerNodeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'rendering' | 'queued' | 'completed' | 'failed'>('All');

  const filtered = renderQueue.filter((job) => {
    const matchesSearch = 
      job.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client_ip.includes(searchTerm) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = renderQueue.length;
  const processing = renderQueue.filter(j => j.status === 'rendering').length;
  const completed = renderQueue.filter(j => j.status === 'completed').length;
  const failed = renderQueue.filter(j => j.status === 'failed' || j.status === 'cancelled').length;

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* 4 Header KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="clay-card p-4 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Queue Tasks</span>
          <p className="text-2xl font-extrabold text-white font-mono">{total}</p>
        </div>
        <div className="clay-card p-4 space-y-1 border-brand-blue/40">
          <span className="text-xs font-bold text-brand-blue uppercase">▶ Processing on GPU</span>
          <p className="text-2xl font-extrabold text-brand-blue font-mono">{processing}</p>
        </div>
        <div className="clay-card p-4 space-y-1 border-emerald-500/40">
          <span className="text-xs font-bold text-emerald-400 uppercase">✔ Completed Renders</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{completed}</p>
        </div>
        <div className="clay-card p-4 space-y-1 border-rose-500/40">
          <span className="text-xs font-bold text-rose-400 uppercase">✖ Aborted / Failed</span>
          <p className="text-2xl font-extrabold text-rose-400 font-mono">{failed}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by filename, client IP, or ID..."
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Status:</span>
          {(['All', 'rendering', 'queued', 'completed', 'failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-brand-blue text-white shadow-claySm'
                  : 'bg-surface-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Live Interactive Queue Table */}
      <div className="clay-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-850/80 border-b border-surface-border/50 text-slate-400 font-bold uppercase tracking-wider font-mono">
            <tr>
              <th className="py-3 px-4"># ID</th>
              <th className="py-3 px-4">Filename / Task Profile</th>
              <th className="py-3 px-4">Client IPv4</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/30">
            {filtered.map((job) => (
              <tr key={job.id} className="hover:bg-surface-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-blue">{job.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-200">{job.filename}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{job.client_ip}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    job.priority === 'Real-Time' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                    job.priority === 'High' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {job.priority}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`clay-badge inline-flex items-center gap-1.5 uppercase ${
                    job.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    job.status === 'rendering' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue animate-pulse' :
                    job.status === 'queued' ? 'bg-slate-700/50 border-slate-600 text-slate-400' :
                    'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {job.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {job.status === 'rendering' && <Clock className="w-3 h-3 animate-spin" />}
                    {job.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                    <span>{job.status}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="w-24 space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
                      <span>{job.percent}%</span>
                    </div>
                    <div className="w-full bg-surface-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-blue h-full rounded-full" 
                        style={{ width: `${job.percent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {job.eta_seconds ? `${job.eta_seconds}s` : '—'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {job.status === 'rendering' && (
                      <button
                        onClick={() => cancelJob(job.id)}
                        className="clay-button-secondary px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-1"
                        title="Abort running subprocess"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={() => purgeJob(job.id)}
                      className="clay-button-secondary px-2 py-1 text-xs text-slate-400 hover:text-rose-400"
                      title="Purge entry and clean temp cache"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
