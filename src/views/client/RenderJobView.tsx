import React, { useState, useRef } from 'react';
import { useJobStore } from '../../store/useJobStore.js';
import { 
  Film, 
  Terminal, 
  FolderArchive, 
  UploadCloud, 
  FileVideo, 
  Sliders, 
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { ResolutionPreset, NvencPreset } from '../../types/index.js';

interface RenderJobViewProps {
  onJobSubmitted: () => void;
}

export const RenderJobView: React.FC<RenderJobViewProps> = ({ onJobSubmitted }) => {
  const submitNewJob = useJobStore((s) => s.submitNewJob);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Selector
  const [profile, setProfile] = useState<'video' | 'batch' | 'universal'>('video');

  // Form State (Starts empty, no dummy hardcoded file)
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; path: string; checksum?: string; fileObj?: File } | null>(null);

  const [resolution, setResolution] = useState<ResolutionPreset>('1080p');
  const [bitrate, setBitrate] = useState<'2M' | '5M' | '8M' | '12M' | '20M'>('8M');
  const [preset, setPreset] = useState<NvencPreset>('p5');
  const [allowCpuFallback, setAllowCpuFallback] = useState(true);
  const [outputFilename, setOutputFilename] = useState('rendered_output.mp4');
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
        setOutputFilename(`remote_${name}`);
        setSelectedFile({
          name,
          size: 'Selected from disk',
          path,
          checksum: 'Calculating SHA-256...'
        });
        if (window.electronAPI?.computeFileSHA256) {
          const hash = await window.electronAPI.computeFileSHA256(path);
          setSelectedFile(prev => prev ? { ...prev, checksum: hash } : null);
        }
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleStandardFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOutputFilename(`remote_${file.name}`);
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        path: file.name,
        checksum: 'Ready for upload',
        fileObj: file
      });
    }
  };

  const handleBrowseFolder = async () => {
    if (window.electronAPI?.openDirectoryDialog) {
      const dir = await window.electronAPI.openDirectoryDialog({ title: 'Select Project Folder to Offload' });
      if (dir) {
        const folderName = dir.split(/[/\\]/).pop() || 'workspace';
        setSelectedFile({
          name: `${folderName}.zip`,
          size: 'Compressing...',
          path: dir,
          checksum: 'Compressing workspace (excluding .git, node_modules)...'
        });
        if (window.electronAPI?.compressFolderToZip) {
          const res = await window.electronAPI.compressFolderToZip(dir);
          if (res.success && res.zipPath) {
            let hash = 'Ready';
            if (window.electronAPI?.computeFileSHA256) {
              hash = await window.electronAPI.computeFileSHA256(res.zipPath);
            }
            setSelectedFile({
              name: `${folderName}.zip`,
              size: `${res.sizeMB || '0'} MB`,
              path: res.zipPath,
              checksum: hash
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

    if (selectedFile.fileObj) {
      fd.append('file', selectedFile.fileObj);
    } else {
      // Create a lightweight placeholder blob carrying the filename for LAN job dispatch
      const dummyBlob = new Blob([selectedFile.name], { type: 'application/octet-stream' });
      fd.append('file', dummyBlob, selectedFile.name);
    }

    fd.append('resolution', resolution);
    fd.append('bitrate', bitrate);
    fd.append('preset', preset);
    fd.append('allow_cpu_fallback', String(allowCpuFallback));
    fd.append('output_filename', outputFilename);
    if (profile === 'universal') {
      fd.append('custom_command', customCommand);
    }

    try {
      await submitNewJob(fd, selectedFile.name);
      onJobSubmitted();
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Unable to connect to worker server node. Make sure START_GPU_SERVER.bat is running on the desktop PC.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleStandardFileInput}
      />

      {/* Profile Selector Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl grid grid-cols-3 gap-1.5 border border-slate-200/80">
        <button
          type="button"
          onClick={() => setProfile('video')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profile === 'video'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Film className="w-4 h-4 text-indigo-600" />
          <span>Video Transcode (GPU NVENC)</span>
        </button>

        <button
          type="button"
          onClick={() => setProfile('batch')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profile === 'batch'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span>Batch & Shell Automation</span>
        </button>

        <button
          type="button"
          onClick={() => setProfile('universal')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profile === 'universal'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FolderArchive className="w-4 h-4 text-indigo-600" />
          <span>Universal Folder & Command Runner</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source File / Folder Selection Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Workload Source Selection</h3>
              <p className="text-xs text-slate-500">Pick a source video, batch script, or complete project workspace.</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct 2.5 Gbps P2P Pipeline
            </span>
          </div>

          <div
            onClick={profile === 'universal' ? handleBrowseFolder : handleBrowseFile}
            className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              {profile === 'universal' ? <FolderArchive className="w-6 h-6" /> : <FileVideo className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to Browse File / Folder from Laptop'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedFile ? `${selectedFile.size} • ${selectedFile.path}` : 'Supported: MP4, MOV, MKV, BAT, PS1, PY, or Project Folders'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer pointer-events-none"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{selectedFile ? 'Change Selection' : 'Browse File'}</span>
              </button>
            </div>

            {selectedFile?.checksum && (
              <div className="w-full max-w-lg mt-2 p-2 rounded-lg bg-white border border-slate-200 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrity SHA-256:</span>
                <span className="text-[11px] font-mono text-slate-600 break-all">{selectedFile.checksum}</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Encoder Parameters Card */}
        {profile === 'video' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Hardware Transcode Settings (NVENC)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Target Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Output Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as ResolutionPreset)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="Original">Keep Original Source</option>
                  <option value="4K">4K UHD (3840 x 2160)</option>
                  <option value="1440p">2K QHD (2560 x 1440)</option>
                  <option value="1080p">Full HD (1920 x 1080)</option>
                  <option value="720p">HD (1280 x 720)</option>
                </select>
              </div>

              {/* Bitrate Control */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Target Bitrate</label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="2M">2.0 Mbps (Web Small)</option>
                  <option value="5M">5.0 Mbps (Standard HD)</option>
                  <option value="8M">8.0 Mbps (High Quality 1080p)</option>
                  <option value="12M">12.0 Mbps (Pro 1440p)</option>
                  <option value="20M">20.0 Mbps (Master 4K)</option>
                </select>
              </div>

              {/* NVENC Tuning Preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">NVENC Preset</label>
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value as NvencPreset)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="p1">p1: Fastest (Low Latency Stream)</option>
                  <option value="p3">p3: Fast Balanced</option>
                  <option value="p5">p5: High Quality (Recommended)</option>
                  <option value="p7">p7: Maximum Visual Fidelity</option>
                </select>
              </div>
            </div>

            {/* Checkbox for CPU Fallback */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Multi-Stage Autonomous Fallback Loop</p>
                <p className="text-[11px] text-slate-500">
                  Automatically cascade to Intel QSV, AMD AMF, or multi-core CPU libx264 if remote NVENC is busy.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCpuFallback}
                  onChange={(e) => setAllowCpuFallback(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Universal Command Runner Card */}
        {profile === 'universal' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Custom Remote Command Execution</h3>
            <p className="text-xs text-slate-500">
              The project folder will be extracted to an isolated workspace on the worker node and executed in Windows CMD.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Terminal Execution Command</label>
              <input
                type="text"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                placeholder="e.g. python main.py or npm run build or blender -b scene.blend -a"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Output Destination Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Output Delivery & Filename</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Output File Name</label>
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Local Download Destination</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={outputFolder}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 font-mono"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (window.electronAPI?.openDirectoryDialog) {
                      const dir = await window.electronAPI.openDirectoryDialog({ title: 'Select Output Folder' });
                      if (dir) setOutputFolder(dir);
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={!selectedFile || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Transmitting to Worker Node...</span>
              </>
            ) : (
              <>
                <span>🚀 Offload & Render on Dedicated GPU</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
