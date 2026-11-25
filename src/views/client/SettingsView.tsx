import React, { useState } from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { Settings, FolderCheck, Save, RotateCcw, Key, ShieldCheck, Folder, Check } from 'lucide-react';

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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Host Connection & Studio Settings</h2>
          <p className="text-xs text-slate-500">Configure P2P IP addresses, security tokens, and watch folder automations.</p>
        </div>

        {savedToast && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Applied</span>
          </span>
        )}
      </div>

      {/* Remote Worker Connection Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Remote GPU Worker Node Endpoint</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Worker Host / IP Address</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.99.1 or 169.254.x.x"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Worker Port</label>
            <input
              type="text"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              placeholder="8000"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-600 uppercase">API Security Token (Optional)</label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter worker daemon secret token if enabled"
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Automated Watch Folder Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Automated Watch Folder (Zero-Click Offload)</h3>
            <p className="text-xs text-slate-500">
              When enabled, any exported video dropped into this directory automatically uploads and renders on the worker GPU.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={watchEnabled}
              onChange={(e) => setWatchEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase">Monitored Directory Path</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={watchPath}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-600"
            />
            <button
              onClick={handlePickWatchFolder}
              className="bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Folder className="w-4 h-4 text-slate-500" />
              <span>Browse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save & Reset Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          className="bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save & Apply Settings</span>
        </button>
      </div>
    </div>
  );
};
