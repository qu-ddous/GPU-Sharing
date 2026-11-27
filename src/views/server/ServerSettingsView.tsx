import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { Save, Power, HardDrive, Shield, Film, Key, Settings } from 'lucide-react';

export const ServerSettingsView: React.FC = () => {
  const store = useServerNodeStore();
  const [subTab, setSubTab] = useState<'startup' | 'render' | 'storage' | 'security'>('startup');

  const [autoStart, setAutoStart] = useState(store.autoStartOnBoot);
  const [minTray, setMinTray] = useState(store.minimizeToTray);
  const [autoReconnect, setAutoReconnect] = useState(store.autoReconnect);
  const [maxJobs, setMaxJobs] = useState(store.maxConcurrentJobs);
  const [port, setPort] = useState(store.workerPort);

  const [res, setRes] = useState(store.defaultResolution);
  const [bitrate, setBitrate] = useState(store.defaultBitrate);
  const [preset, setPreset] = useState(store.defaultPreset);
  const [container, setContainer] = useState(store.defaultContainer);

  const [tempDir, setTempDir] = useState(store.uploadTempDir);
  const [outDir, setOutDir] = useState(store.renderOutputDir);

  const [requireToken, setRequireToken] = useState(store.requireApiToken);
  const [secretToken, setSecretToken] = useState(store.apiSecretToken);

  const [saved, setSaved] = useState(false);

  const handleGenerateToken = () => {
    setSecretToken('gpu_sec_' + Math.random().toString(36).substring(2, 12));
  };

  const handleSave = () => {
    store.saveSettings({
      autoStartOnBoot: autoStart,
      minimizeToTray: minTray,
      autoReconnect,
      maxConcurrentJobs: maxJobs,
      workerPort: port,
      defaultResolution: res,
      defaultBitrate: bitrate,
      defaultPreset: preset,
      defaultContainer: container,
      uploadTempDir: tempDir,
      renderOutputDir: outDir,
      requireApiToken: requireToken,
      apiSecretToken: secretToken
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md shadow-slate-700/30 ring-1 ring-inset ring-white/30 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Worker Server Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage startup policies, transcode presets, disk storage, and API security.</p>
          </div>
        </div>
        {saved && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            ✔ Server Configuration Saved!
          </span>
        )}
      </div>

      {/* 4 Sub-Tabs */}
      <div className="bg-slate-100/80 p-1 rounded-xl grid grid-cols-4 gap-1 border border-slate-200/80">
        <button
          onClick={() => setSubTab('startup')}
          className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'startup' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Power className="w-4 h-4 text-emerald-600" />
          <span>Startup & Daemon</span>
        </button>

        <button
          onClick={() => setSubTab('render')}
          className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'render' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Film className="w-4 h-4 text-violet-700" />
          <span>Render Defaults</span>
        </button>

        <button
          onClick={() => setSubTab('storage')}
          className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'storage' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4 text-amber-600" />
          <span>Storage & Files</span>
        </button>

        <button
          onClick={() => setSubTab('security')}
          className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            subTab === 'security' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-600" />
          <span>Security & Token</span>
        </button>
      </div>

      {/* Sub-Tab 1: Startup & Daemon */}
      {subTab === 'startup' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Startup & Process Daemon</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <span className="text-xs text-slate-700 font-semibold">Start server daemon automatically on Windows startup</span>
              <input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} className="rounded accent-blue-600" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <span className="text-xs text-slate-700 font-semibold">Minimize to system tray on window close</span>
              <input type="checkbox" checked={minTray} onChange={e => setMinTray(e.target.checked)} className="rounded accent-blue-600" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <span className="text-xs text-slate-700 font-semibold">Auto-reconnect on Ethernet cable replug</span>
              <input type="checkbox" checked={autoReconnect} onChange={e => setAutoReconnect(e.target.checked)} className="rounded accent-blue-600" />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Max Concurrent Worker Jobs</label>
                <select value={maxJobs} onChange={e => setMaxJobs(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900">
                  <option value={1}>1 Job (Dedicated Maximum Performance)</option>
                  <option value={2}>2 Concurrent Jobs (Recommended)</option>
                  <option value={4}>4 Concurrent Jobs</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Listening HTTP/WS Port</label>
                <input type="number" value={port} onChange={e => setPort(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Render Defaults */}
      {subTab === 'render' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Default Hardware Transcode Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Default Output Resolution</label>
              <select value={res} onChange={e => setRes(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900">
                <option value="1080p">1920 x 1080 (1080p Full HD)</option>
                <option value="4K">3840 x 2160 (4K UHD)</option>
                <option value="Source">Source (Original)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Default Bitrate</label>
              <select value={bitrate} onChange={e => setBitrate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900">
                <option value="5M">5 Mbps</option>
                <option value="8M">8 Mbps (Recommended)</option>
                <option value="12M">12 Mbps</option>
                <option value="20M">20 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Default NVENC Preset</label>
              <select value={preset} onChange={e => setPreset(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900">
                <option value="p1">p1 (Fastest)</option>
                <option value="p5">p5 (High Quality - Default)</option>
                <option value="p7">p7 (Slowest / Master)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Default Output Container</label>
              <select value={container} onChange={e => setContainer(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900">
                <option value="MP4 (H.264)">MP4 (H.264 / AAC)</option>
                <option value="MKV (HEVC)">MKV (HEVC H.265)</option>
                <option value="MOV">QuickTime MOV</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Storage & Files */}
      {subTab === 'storage' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Local Directories & Cache Policies</h3>
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase font-sans text-[11px]">Upload Temporary Ingest Directory</label>
              <input type="text" value={tempDir} onChange={e => setTempDir(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase font-sans text-[11px]">Render Output Artifacts Directory</label>
              <input type="text" value={outDir} onChange={e => setOutDir(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900" />
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Security & Access Control */}
      {subTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">API Authentication & Subnet Whitelist</h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs text-slate-900 font-bold">Require API Secret Token (X-API-Token Header)</p>
                <p className="text-[11px] text-slate-500">Rejects unauthenticated client requests over the LAN.</p>
              </div>
              <input type="checkbox" checked={requireToken} onChange={e => setRequireToken(e.target.checked)} className="rounded accent-blue-600" />
            </label>

            <div className="space-y-1.5 font-mono">
              <label className="text-[11px] font-bold text-slate-500 uppercase font-sans">Worker Secret Token</label>
              <div className="flex gap-2">
                <input type="text" value={secretToken} onChange={e => setSecretToken(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
                <button onClick={handleGenerateToken} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 font-sans flex items-center gap-1.5 cursor-pointer">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Action */}
      <div className="flex justify-end pt-1">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all">
          <Save className="w-[18px] h-[18px]" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};
