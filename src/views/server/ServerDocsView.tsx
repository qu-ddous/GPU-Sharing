import React, { useState } from 'react';
import { BookMarked, ChevronDown, ChevronRight, Network, Shield, Cpu, Activity } from 'lucide-react';

export const ServerDocsView: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [openTopic, setOpenTopic] = useState<string>('topic1');

  const topics = [
    {
      id: 'topic1',
      title: lang === 'en' ? '1. Direct Cat6 Cable Connection without a Router' : '1. Bina Router Ke Direct Cat6 Cable Connection',
      summary: lang === 'en' 
        ? 'Plug standard Cat5e/Cat6/Cat7 Ethernet cable directly between worker PC and client laptop.'
        : 'Cat6 cable ko seedha desktop aur laptop ke LAN ports ke darmiyan lagayein.',
      points: lang === 'en' ? [
        'Modern Gigabit network cards have Auto-MDI/MDIX so no crossover cable is required.',
        'Direct connection gives 1000 Mbps (1 Gbps) or 2500 Mbps (2.5 Gbps) bandwidth with <1ms ping.',
        'Zero packets touch your home Wi-Fi, leaving home internet 100% free for other users.'
      ] : [
        'Aaj kal ke Gigabit cards mein Auto-MDIX hota hai is liye aam cable bhi direct kaam karti hai.',
        'Direct connection se 1000 Mbps speed aur <1ms latency milti hai jo Wi-Fi se 10x fast hai.',
        'Ghar ke Wi-Fi par bilkul bojh nahi parta aur zero internet data kharch hota hai.'
      ]
    },
    {
      id: 'topic2',
      title: lang === 'en' ? '2. Windows Static IP Configuration' : '2. Windows Mein Static IP Set Karne Ka Tareeqa',
      summary: lang === 'en'
        ? 'Assign 192.168.99.1 to Server Node and 192.168.99.2 to Client Studio.'
        : 'Desktop Server par 192.168.99.1 aur Laptop Client par 192.168.99.2 set karein.',
      points: lang === 'en' ? [
        'Open Control Panel -> Network and Sharing Center -> Change adapter settings.',
        'Right click Ethernet adapter -> Properties -> Select Internet Protocol Version 4 (TCP/IPv4).',
        'Set IP: 192.168.99.1, Subnet Mask: 255.255.255.0, Default Gateway: leave empty.'
      ] : [
        'Control Panel kholein -> Network and Sharing Center -> Change adapter settings.',
        'Ethernet adapter par right-click karein -> Properties -> TCP/IPv4 chunein.',
        'IP Address mein 192.168.99.1 aur Subnet Mask mein 255.255.255.0 daalein.'
      ]
    },
    {
      id: 'topic3',
      title: lang === 'en' ? '3. Windows Defender Firewall Troubleshooting' : '3. Windows Defender Firewall Masla Hal Karein',
      summary: lang === 'en'
        ? 'Ensure inbound TCP Port 8000 is permitted in Windows Firewall.'
        : 'Windows Firewall mein Port 8000 ko allow karna zaroori hai.',
      points: lang === 'en' ? [
        'Click the "Windows Firewall" button in the Server Topbar to auto-execute elevated rule.',
        'Or run in elevated PowerShell: netsh advfirewall firewall add rule name="GPUShare_Server" dir=in action=allow protocol=TCP localport=8000',
        'If client shows "Server Offline", check that the network profile is set to Private.'
      ] : [
        'Server Topbar mein "Windows Firewall" button dabayein taake automatic rule ban jaye.',
        'Ya PowerShell Administrator mein netsh advfirewall rule add karein.',
        'Agar client connect na ho to check karein ke network profile Private par ho.'
      ]
    },
    {
      id: 'topic4',
      title: lang === 'en' ? '4. NVIDIA Driver & CUDA Toolkit Optimization' : '4. NVIDIA Driver aur CUDA Toolkit Ki Optimization',
      summary: lang === 'en'
        ? 'Keep NVIDIA Game Ready / Studio drivers above version 530+ for latest NVENC presets.'
        : 'NVIDIA driver version 530+ hona zaroori hai taake tamam modern codecs theek chalein.',
      points: lang === 'en' ? [
        'NVIDIA NVENC Dual-Engine handles up to 4 concurrent 4K renders at >140 FPS.',
        'PyTorch with CUDA 12.x requires no additional CUDA toolkit installation if using torch prebuilt wheels.',
        'Check Task Manager: Video Encode and CUDA graphs show exact GPU load during offloaded jobs.'
      ] : [
        'NVIDIA NVENC Dual-Engine ek waqt mein multiple 4K renders 140+ FPS par kar sakta hai.',
        'PyTorch prebuilt wheels ke saath alag se CUDA install karne ki zaroorat nahi hoti.',
        'Task Manager mein Video Encode aur CUDA graphs par aap live load dekh sakte hain.'
      ]
    }
  ];

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-5xl">
      {/* Header */}
      <div className="clay-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-brand-blue" />
            <span>Worker Server Administrator Manual & Direct Cable Setup</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive setup documentation for network engineers and video editors.
          </p>
        </div>

        {/* Bilingual Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-950 border border-surface-border">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setLang('ur')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'ur' ? 'bg-brand-blue text-white shadow-claySm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇵🇰 Roman Urdu
          </button>
        </div>
      </div>

      {/* Accordion Topics */}
      <div className="space-y-3">
        {topics.map((t) => {
          const isOpen = openTopic === t.id;
          return (
            <div key={t.id} className="clay-card overflow-hidden border border-surface-border/60">
              <button
                onClick={() => setOpenTopic(isOpen ? '' : t.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                  <h3 className="text-sm font-bold text-white tracking-tight">{t.title}</h3>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-brand-blue" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 space-y-4 text-xs text-slate-300 border-t border-surface-border/40">
                  <p className="bg-surface-800/40 p-3.5 rounded-xl border border-surface-border/40 font-medium text-slate-200">
                    {t.summary}
                  </p>
                  <ul className="space-y-2 pl-2">
                    {t.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
