import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { ScrollText, Trash2, Download, Search, RefreshCw } from 'lucide-react';

export const ServerActivityLogsView: React.FC = () => {
  const eventLogs = useServerNodeStore((s) => s.eventLogs);
  const clearLogs = useServerNodeStore((s) => s.clearLogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = eventLogs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const text = eventLogs.map((l) => `[${l.timestamp}] [${l.level}] ${l.source} ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPUShare_Server_Logs_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            <span>Worker Node Activity & Event Audit Logs</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time audit log of client connections, job submissions, and FFmpeg transcoding progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearLogs}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Logs</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Log (.txt)</span>
          </button>
        </div>
      </div>

      {/* Filter and Log Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by keyword or source..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 h-96 overflow-y-auto space-y-1.5">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-500 italic">No events recorded matching criteria.</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`font-bold px-1.5 py-0.2 rounded text-[10px] shrink-0 ${
                    log.level === 'SUCCESS'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : log.level === 'WARNING'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : log.level === 'ERROR'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-400 shrink-0">{log.source}</span>
                <span className="text-slate-200 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
