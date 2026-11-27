import React, { useState } from 'react';
import { useServerStore } from '../../store/useServerStore.js';
import { Settings, FolderCheck, Save, RotateCcw, Key, Folder, Check } from 'lucide-react';

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
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Host Connection & Studio Settings</h2>
          <p className="text-xs text-slate-500">Configure P2P IP addresses, security tokens, and watch folder automations.</p>
        </div>

        {savedToast && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Check className="w-4 h-4" />
            <span>Settings Saved & Applied</span>
          </span>
        )}
      </div>

      {/* Network Connection Settings Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm ring-1 ring-inset ring-white/30 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </span>
          <span>Worker Node Connection Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Worker Node IPv4 Address</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.99.1 or 169.254.12.34"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase">HTTP / WebSocket Port</label>
            <input
              type="text"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              placeholder="8000"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-600" />
            <span>Node Authentication Token (Optional)</span>
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Leave blank for local zero-security P2P cable connections"
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>
      </div>

      {/* Watch Folder Automation Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm ring-1 ring-inset ring-white/40 flex items-center justify-center">
                <FolderCheck className="w-4 h-4" />
              </span>
              <span>Automated Watch Folder (Daemon Mode)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically offload files to remote GPU when video editors (Premiere, DaVinci) export to this folder.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={watchEnabled}
              onChange={(e) => setWatchEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {watchEnabled && (
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Monitored Export Directory</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={watchPath}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-600"
              />
              <button
                type="button"
                onClick={handlePickWatchFolder}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Folder className="w-4 h-4" />
                <span>Browse</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save & Reset Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-[18px] h-[18px]" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
