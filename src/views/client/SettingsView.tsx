import React, { useState } from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { Settings, FolderCheck, Save, RotateCcw, Key, ShieldCheck, Folder } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    serverIp,
    serverPort,
    apiToken,
    setServerIp,
    setServerPort,
    setApiToken,
    connect
  } = useServerStore();

  const [ipInput, setIpInput] = useState(serverIp);
  const [portInput, setPortInput] = useState(String(serverPort));
  const [tokenInput, setTokenInput] = useState(apiToken);

  // Watch Folder Automation
  const [watchEnabled, setWatchEnabled] = useState(true);
  const [watchPath, setWatchPath] = useState('C:\\Videos\\Premiere_Exports');
  const [savedToast, setSavedToast] = useState(false);

  const handlePickWatchFolder = async () => {
    if (window.electronAPI?.openDirectoryDialog) {
      const folder = await window.electronAPI.openDirectoryDialog({ title: 'Select Watch Folder' });
      if (folder) setWatchPath(folder);
    }
  };

  const handleSave = () => {
    setServerIp(ipInput);
    setServerPort(Number(portInput));
    setApiToken(tokenInput);
    connect(ipInput, Number(portInput));

    if (watchEnabled && window.electronAPI?.startWatchFolder) {
      window.electronAPI.startWatchFolder(watchPath);
    }

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleReset = () => {
    setIpInput('192.168.99.1');
    setPortInput('8000');
    setTokenInput('');
    setWatchPath('C:\\Videos\\Premiere_Exports');
    setWatchEnabled(true);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">Host Connection & Studio Settings</h2>
          <p className="text-xs text-slate-400">Configure P2P IP addresses, API security tokens, and watch folder automations.</p>
        </div>
        {savedToast && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            ✔ Configuration Saved Successfully!
          </span>
        )}
      </div>

      {/* Host Connection Config Card */}
      <div className="clay-card p-6 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-purple" />
          <span>Worker Host Connection Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Worker Node IPv4 Address</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-purple"
              placeholder="192.168.99.1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Worker HTTP / WebSocket Port</label>
            <input
              type="text"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-purple"
              placeholder="8000"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Optional API Secret Token (X-API-Token Header)</span>
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-purple"
            placeholder="Leave empty if worker has no security token required"
          />
        </div>
      </div>

      {/* Watch Folder Automation Card */}
      <div className="clay-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-emerald-400" />
            <span>Watch Folder Background Automation</span>
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={watchEnabled}
              onChange={(e) => setWatchEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Automatically detects newly exported videos from Adobe Premiere Pro, DaVinci Resolve, or CapCut, computes file stability over 2 seconds, streams to worker GPU, and downloads the finished render with zero manual clicks.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase">Monitored Watch Folder Path</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={watchPath}
              onChange={(e) => setWatchPath(e.target.value)}
              className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handlePickWatchFolder}
              className="clay-button-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Browse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleReset}
          className="clay-button-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Factory Defaults</span>
        </button>

        <button
          onClick={handleSave}
          className="clay-button-primary px-7 py-2.5 text-xs font-extrabold flex items-center gap-2 shadow-clayGlowPurple"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};
