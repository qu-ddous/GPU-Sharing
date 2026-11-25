import React, { useState } from 'react';
import { useServerNodeStore } from '../../store/useServerNodeStore.js';
import { Sliders, Save, RotateCcw, Power, HardDrive, Shield, Film, Key } from 'lucide-react';

export const ServerSettingsView: React.FC = () => {
  const store = useServerNodeStore();
  const [subTab, setSubTab] = useState<'startup' | 'render' | 'storage' | 'security'>('startup');

  // Local state
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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">Worker Server Configuration</h2>
          <p className="text-xs text-slate-400">Manage startup policies, transcode presets, disk storage, and API security.</p>
        </div>
        {saved && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            ✔ Server Configuration Saved!
          </span>
        )}
      </div>

      {/* 4 Sub-Tabs */}
      <div className="clay-card p-1.5 grid grid-cols-4 gap-2">
        <button
          onClick={() => setSubTab('startup')}
          className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'startup' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>Startup & Daemon</span>
        </button>

        <button
          onClick={() => setSubTab('render')}
          className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'render' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Render Defaults</span>
        </button>

        <button
          onClick={() => setSubTab('storage')}
          className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'storage' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Storage & Files</span>
        </button>

        <button
          onClick={() => setSubTab('security')}
          className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subTab === 'security' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Token</span>
        </button>
      </div>

      {/* Sub-Tab 1: Startup & Daemon */}
      {subTab === 'startup' && (
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Startup & Process Daemon</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-850 border border-surface-border cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Start server daemon automatically on Windows startup</span>
              <input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} className="rounded" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-850 border border-surface-border cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Minimize to system tray on window close</span>
              <input type="checkbox" checked={minTray} onChange={e => setMinTray(e.target.checked)} className="rounded" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-850 border border-surface-border cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Auto-reconnect on Ethernet cable replug</span>
              <input type="checkbox" checked={autoReconnect} onChange={e => setAutoReconnect(e.target.checked)} className="rounded" />
            </label>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Max Concurrent Worker Jobs</label>
                <select value={maxJobs} onChange={e => setMaxJobs(Number(e.target.value))} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white">
                  <option value={1}>1 Job (Dedicated Maximum Performance)</option>
                  <option value={2}>2 Concurrent Jobs (Recommended)</option>
                  <option value={4}>4 Concurrent Jobs</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Listening HTTP/WS Port</label>
                <input type="number" value={port} onChange={e => setPort(Number(e.target.value))} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Render Defaults */}
      {subTab === 'render' && (
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Default Hardware Transcode Presets</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Default Output Resolution</label>
              <select value={res} onChange={e => setRes(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white">
                <option value="1080p">1920 x 1080 (1080p Full HD)</option>
                <option value="4K">3840 x 2160 (4K UHD)</option>
                <option value="Source">Source (Original)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Default Bitrate</label>
              <select value={bitrate} onChange={e => setBitrate(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white">
                <option value="5M">5 Mbps</option>
                <option value="8M">8 Mbps (Recommended)</option>
                <option value="12M">12 Mbps</option>
                <option value="20M">20 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Default NVENC Preset</label>
              <select value={preset} onChange={e => setPreset(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white">
                <option value="p1">p1 (Fastest)</option>
                <option value="p5">p5 (High Quality - Default)</option>
                <option value="p7">p7 (Slowest / Master)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Default Output Container</label>
              <select value={container} onChange={e => setContainer(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white">
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
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Local Directories & Cache Policies</h3>
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase font-sans">Upload Temporary Ingest Directory</label>
              <input type="text" value={tempDir} onChange={e => setTempDir(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-white" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase font-sans">Render Output Artifacts Directory</label>
              <input type="text" value={outDir} onChange={e => setOutDir(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-white" />
            </div>

            <div className="pt-2">
              <button className="clay-button-secondary px-4 py-2 text-xs font-sans text-rose-400 hover:bg-rose-500/10">
                🧹 Clean Temp Cache Now (Frees 12.4 GB)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Security & Access Control */}
      {subTab === 'security' && (
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">API Authentication & Subnet Whitelist</h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-850 border border-surface-border cursor-pointer">
              <div>
                <p className="text-xs text-white font-bold">Require API Secret Token (X-API-Token Header)</p>
                <p className="text-[11px] text-slate-400">Rejects unauthenticated client requests over the LAN.</p>
              </div>
              <input type="checkbox" checked={requireToken} onChange={e => setRequireToken(e.target.checked)} className="rounded" />
            </label>

            <div className="space-y-1.5 font-mono">
              <label className="text-xs font-bold text-slate-400 uppercase font-sans">Worker Secret Token</label>
              <div className="flex gap-2">
                <input type="text" value={secretToken} onChange={e => setSecretToken(e.target.value)} className="w-full bg-surface-950 border border-surface-border rounded-xl px-3 py-2 text-xs text-white" />
                <button onClick={handleGenerateToken} className="clay-button-secondary px-3 py-2 text-xs shrink-0 font-sans flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <button onClick={handleSave} className="clay-button-primary px-7 py-2.5 text-xs font-extrabold flex items-center gap-2 shadow-clayGlowBlue">
          <Save className="w-3.5 h-3.5" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};
