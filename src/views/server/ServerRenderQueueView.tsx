import React from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { ListOrdered, CheckCircle2, Clock, AlertCircle, Trash2, XCircle, Inbox } from 'lucide-react';

export const ServerRenderQueueView: React.FC = () => {
  const renderQueue = useServerNodeStore((s) => s.renderQueue);
  const cancelJob = useServerNodeStore((s) => s.cancelJob);
  const purgeJob = useServerNodeStore((s) => s.purgeJob);

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-emerald-600" />
            <span>Worker Render & Task Queue</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time monitor of incoming video encoding and script offloading jobs from connected clients.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          Total Queue: {renderQueue.length}
        </span>
      </div>

      {renderQueue.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Jobs in Queue</h3>
          <p className="text-xs text-slate-500 max-w-md">
            The worker GPU node is idle and ready. When the client laptop offloads a video or script, it will appear here with live progress and cancel controls.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Filename / Workload</th>
                  <th className="py-3 px-4">Client IP</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renderQueue.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{job.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{job.filename}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{job.client_ip}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        job.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : job.status === 'rendering'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{job.percent}%</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {job.status === 'rendering' && (
                        <button
                          onClick={() => cancelJob(job.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => purgeJob(job.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-all"
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
