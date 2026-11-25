import React, { useState } from 'react';
import { useJobStore } from '../../store/useJobStore.js';
import { 
  Film, 
  Terminal, 
  FolderArchive, 
  UploadCloud, 
  FileVideo, 
  Check, 
  Sliders, 
  HardDrive
} from 'lucide-react';
import type { ResolutionPreset, NvencPreset } from '../../types/index.js';

interface RenderJobViewProps {
  onJobSubmitted: () => void;
}

export const RenderJobView: React.FC<RenderJobViewProps> = ({ onJobSubmitted }) => {
  const submitNewJob = useJobStore((s) => s.submitNewJob);

  // Profile Selector
  const [profile, setProfile] = useState<'video' | 'batch' | 'universal'>('video');

  // Form State
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; path: string; checksum?: string } | null>({
    name: 'cyberpunk_city_4k_cinematic.mp4',
    size: '3.42 GB',
    path: 'C:\\Videos\\cyberpunk_city_4k_cinematic.mp4',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  });

  const [resolution, setResolution] = useState<ResolutionPreset>('1080p');
  const [bitrate, setBitrate] = useState<'2M' | '5M' | '8M' | '12M' | '20M'>('8M');
  const [preset, setPreset] = useState<NvencPreset>('p5');
  const [allowCpuFallback, setAllowCpuFallback] = useState(true);
  const [outputFilename, setOutputFilename] = useState('cyberpunk_city_remote_1080p.mp4');
  const [outputFolder, setOutputFolder] = useState('C:\\Users\\mqudd\\Downloads');
  const [customCommand, setCustomCommand] = useState('python train.py --epochs 10 --batch 64');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBrowseFile = async () => {
    if (window.electronAPI?.openFileDialog) {
      const path = await window.electronAPI.openFileDialog({
        title: 'Select Video or Task File',
        filters: [{ name: 'Media/Project', extensions: ['mp4', 'mov', 'mkv', 'zip', 'sh', 'bat', 'py'] }]
      });
      if (path) {
        const parts = path.split(/[\/\\]/);
        const name = parts[parts.length - 1];
        setSelectedFile({
          name,
          size: '1.2 GB',
          path,
          checksum: 'Calculating SHA-256...'
        });
        if (window.electronAPI?.computeFileSHA256) {
          const hash = await window.electronAPI.computeFileSHA256(path);
          setSelectedFile(prev => prev ? { ...prev, checksum: hash } : null);
        }
      }
    }
  };

  const handleBrowseFolder = async () => {
    if (window.electronAPI?.openDirectoryDialog) {
      const dir = await window.electronAPI.openDirectoryDialog({ title: 'Select Output Destination' });
      if (dir) setOutputFolder(dir);
    }
  };

  const handleBrowseUniversalFolder = async () => {
    if (window.electronAPI?.openDirectoryDialog) {
      const dir = await window.electronAPI.openDirectoryDialog({ title: 'Select Project Directory to Zip & Offload' });
      if (dir) {
        setSelectedFile({
          name: 'workspace.zip',
          size: 'Compressing directory...',
          path: dir,
          checksum: 'Compressing workspace (excluding .git, node_modules)...'
        });
        if (window.electronAPI?.compressFolderToZip) {
          const res = await window.electronAPI.compressFolderToZip(dir);
          if (res.success && res.zipPath) {
            let hash = 'Calculating SHA-256...';
            if (window.electronAPI?.computeFileSHA256) {
              hash = await window.electronAPI.computeFileSHA256(res.zipPath);
            }
            setSelectedFile({
              name: `${dir.split(/[/\\]/).pop() || 'workspace'}.zip`,
              size: `${res.sizeMB || '0'} MB`,
              path: res.zipPath,
              checksum: hash
            });
          } else {
            setSelectedFile({
              name: `${dir.split(/[/\\]/).pop() || 'workspace'}.zip`,
              size: 'Compression error',
              path: dir,
              checksum: res.error || 'Failed to compress folder'
            });
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('resolution', resolution);
    fd.append('bitrate', bitrate);
    fd.append('preset', preset);
    fd.append('allow_cpu_fallback', String(allowCpuFallback));
    fd.append('output_filename', outputFilename);
    if (profile === 'universal') {
      fd.append('custom_command', customCommand);
    }

    await submitNewJob(fd, selectedFile.name);
    setIsSubmitting(false);
    onJobSubmitted();
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Profile Selector */}
      <div className="clay-card p-2 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setProfile('video')}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
            profile === 'video'
              ? 'bg-brand-purple text-white shadow-claySm'
              : 'text-slate-400 hover:text-white hover:bg-surface-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>🎬 Video Transcode (GPU NVENC)</span>
        </button>

        <button
          type="button"
          onClick={() => setProfile('batch')}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
            profile === 'batch'
              ? 'bg-brand-purple text-white shadow-claySm'
              : 'text-slate-400 hover:text-white hover:bg-surface-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>⚡ Batch / Shell Script</span>
        </button>

        <button
          type="button"
          onClick={() => setProfile('universal')}
          className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
            profile === 'universal'
              ? 'bg-brand-purple text-white shadow-claySm'
              : 'text-slate-400 hover:text-white hover:bg-surface-800'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>🌟 All-in-One (Zip Workspace)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: File & Folder Picker */}
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-brand-purple" />
            <span>Step 1: Input Payload & Cryptographic Verification</span>
          </h3>

          <div
            onClick={profile === 'universal' ? handleBrowseUniversalFolder : handleBrowseFile}
            className="border-2 border-dashed border-surface-border/70 hover:border-brand-purple/70 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-surface-950/40 hover:bg-surface-900/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center mb-3">
              {profile === 'universal' ? <FolderArchive className="w-7 h-7" /> : <FileVideo className="w-7 h-7" />}
            </div>
            <p className="text-sm font-bold text-slate-200">
              {profile === 'universal'
                ? <span>Click to select entire <span className="text-brand-purple underline">Project Folder</span> (auto-zipped) or archive</span>
                : <span>Drag & drop media file here or <span className="text-brand-purple underline">Browse Computer</span></span>}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {profile === 'universal'
                ? 'Excludes .git, node_modules, and __pycache__ automatically'
                : 'Supports MP4, MOV, MKV, AVI, ZIP archives up to 50 GB'}
            </p>
          </div>

          {profile === 'universal' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBrowseUniversalFolder}
                className="clay-button-secondary py-2 px-4 text-xs font-semibold text-slate-200 flex items-center gap-2"
              >
                <FolderArchive className="w-3.5 h-3.5 text-brand-purple" />
                Select Project Directory (Auto-Zip)
              </button>
              <button
                type="button"
                onClick={handleBrowseFile}
                className="clay-button-secondary py-2 px-4 text-xs font-semibold text-slate-300 flex items-center gap-2"
              >
                <UploadCloud className="w-3.5 h-3.5 text-brand-blue" />
                Select Existing .zip / script
              </button>
            </div>
          )}

          {selectedFile && (
            <div className="p-4 rounded-xl bg-surface-800/60 border border-surface-border/50 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {selectedFile.name} ({selectedFile.size})
                </p>
                <p className="text-slate-400 text-[11px] truncate max-w-xl">
                  Path: {selectedFile.path}
                </p>
                <p className="text-slate-500 text-[10px]">
                  SHA-256: {selectedFile.checksum}
                </p>
              </div>
              <button
                type="button"
                onClick={handleBrowseFile}
                className="clay-button-secondary px-3 py-1.5 text-xs text-slate-300 font-sans"
              >
                Change File
              </button>
            </div>
          )}

          {profile === 'universal' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Execution Command Inside Workspace:
              </label>
              <input
                type="text"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-purple"
                placeholder="e.g. pip install -r requirements.txt && python train.py"
              />
            </div>
          )}
        </div>

        {/* Card 2: Transcode & Execution Settings */}
        {profile === 'video' && (
          <div className="clay-card p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-blue" />
              <span>Step 2: NVIDIA NVENC Hardware Transcode Settings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Target Resolution */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as ResolutionPreset)}
                  className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="Original">Original Resolution (Source)</option>
                  <option value="4K">4K UHD (3840 x 2160)</option>
                  <option value="1440p">1440p QHD (2560 x 1440)</option>
                  <option value="1080p">1080p Full HD (1920 x 1080)</option>
                  <option value="720p">720p HD (1280 x 720)</option>
                </select>
              </div>

              {/* Bitrate */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Bitrate</label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value as any)}
                  className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="2M">2 Mbps (Web Draft)</option>
                  <option value="5M">5 Mbps (Standard Streaming)</option>
                  <option value="8M">8 Mbps (High Quality 1080p)</option>
                  <option value="12M">12 Mbps (High Bitrate 1440p)</option>
                  <option value="20M">20 Mbps (Mastering / 4K)</option>
                </select>
              </div>

              {/* NVENC Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NVENC Speed/Quality Preset</label>
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as NvencPreset)}
                  className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="p1">p1 (Fastest / Lowest Overhead)</option>
                  <option value="p2">p2 (Faster)</option>
                  <option value="p3">p3 (Fast)</option>
                  <option value="p4">p4 (Medium - Balanced)</option>
                  <option value="p5">p5 (Slow - Recommended High Quality)</option>
                  <option value="p6">p6 (Slower - Better Compression)</option>
                  <option value="p7">p7 (Slowest / Maximum Quality)</option>
                </select>
              </div>
            </div>

            {/* Checkbox: CPU Fallback */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="cpuFallback"
                checked={allowCpuFallback}
                onChange={(e) => setAllowCpuFallback(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-950 border-surface-border text-brand-purple focus:ring-0 cursor-pointer"
              />
              <label htmlFor="cpuFallback" className="text-xs text-slate-300 font-medium cursor-pointer">
                Allow automatic CPU software fallback (libx264) if remote NVENC encoder encounters hardware limits
              </label>
            </div>
          </div>
        )}

        {/* Card 3: Output Destination */}
        <div className="clay-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Step 3: Output Artifact Delivery Destination</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Output Filename</label>
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination Directory</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outputFolder}
                  onChange={(e) => setOutputFolder(e.target.value)}
                  className="w-full bg-surface-950 border border-surface-border/70 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 truncate"
                />
                <button
                  type="button"
                  onClick={handleBrowseFolder}
                  className="clay-button-secondary px-3 py-2 text-xs shrink-0"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !selectedFile}
            className="clay-button-primary px-8 py-3 text-sm font-extrabold flex items-center gap-3 shadow-clayGlowPurple"
          >
            <span>{isSubmitting ? 'Uploading to Server Node...' : '🚀 Submit & Render on Remote GPU'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
