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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl mx-auto text-[#eeeeee] font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#eeeeee] tracking-tight">Host Connection & Studio Settings</h2>
          <p className="text-xs text-[#b8eef0]/70">Configure P2P IP addresses, security tokens, and watch folder automations.</p>
        </div>

        {savedToast && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00adb5]/20 text-[#00adb5] border border-[#00adb5]/40 text-xs font-bold animate-fade-in shadow-[0_0_12px_rgba(0,173,181,0.3)]">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved & Applied</span>
          </span>
        )}
      </div>

      {/* Network Connection Settings Card */}
      <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-4">
        <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#00adb5]" />
          <span>Worker Node Connection Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Worker Node IPv4 Address</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.99.1 or 169.254.12.34"
              className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3.5 py-2 text-xs font-mono text-[#00adb5] focus:outline-none focus:border-[#00adb5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">HTTP / WebSocket Port</label>
            <input
              type="text"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              placeholder="8000"
              className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3.5 py-2 text-xs font-mono text-[#00adb5] focus:outline-none focus:border-[#00adb5]"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-[#eeeeee]/70 uppercase flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#00adb5]" />
            <span>Node Authentication Token (Optional)</span>
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Leave blank for local zero-security P2P cable connections"
            className="w-full bg-[#1d232c] border border-[#303640] rounded-xl px-3.5 py-2 text-xs font-mono text-[#eeeeee] focus:outline-none focus:border-[#00adb5]"
          />
        </div>
      </div>

      {/* Watch Folder Automation Card */}
      <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#b8eef0]/80 uppercase tracking-widest flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-[#00adb5]" />
              <span>Automated Watch Folder (Daemon Mode)</span>
            </h3>
            <p className="text-xs text-[#b8eef0]/70 mt-0.5">
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
            <div className="w-11 h-6 bg-[#303640] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#eeeeee] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00adb5]"></div>
          </label>
        </div>

        {watchEnabled && (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#eeeeee]/70 uppercase">Monitored Export Directory</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={watchPath}
                className="flex-1 bg-[#1d232c] border border-[#303640] rounded-xl px-3.5 py-2 text-xs font-mono text-[#b8eef0]"
              />
              <button
                type="button"
                onClick={handlePickWatchFolder}
                className="bg-[#303640] hover:bg-[#00adb5] hover:text-[#1d232c] text-[#eeeeee] border border-[#303640] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Browse</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save & Reset Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-bold text-[#eeeeee]/60 hover:text-[#eeeeee] flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#303640] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#00adb5] hover:bg-[#b8eef0] active:scale-[0.98] text-[#1d232c] text-xs font-bold px-7 py-2.5 rounded-full shadow-[0_0_18px_rgba(0,173,181,0.4)] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
