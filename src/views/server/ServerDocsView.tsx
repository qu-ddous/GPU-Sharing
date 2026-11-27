import React, { useState } from 'react';
import { BookMarked, ChevronDown, ChevronRight } from 'lucide-react';

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
        'Click the "Unblock Firewall" button in the Server Topbar to auto-execute elevated rule.',
        'Or run in elevated PowerShell: netsh advfirewall firewall add rule name="GPUShare_Server" dir=in action=allow protocol=TCP localport=8000',
        'If client shows "Worker Offline", check that the network profile is set to Private.'
      ] : [
        'Server Topbar mein "Unblock Firewall" button dabayein taake automatic rule ban jaye.',
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
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] w-full bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-inset ring-white/40 flex items-center justify-center shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Worker Server Administrator Manual & Direct Cable Setup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive setup documentation for network engineers and video editors.
            </p>
          </div>
        </div>

        {/* Bilingual Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'en' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setLang('ur')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'ur' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            <div key={t.id} className="bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <button
                onClick={() => setOpenTopic(isOpen ? '' : t.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">{t.title}</h3>
                </div>
                {isOpen ? <ChevronDown className="w-[18px] h-[18px] text-blue-600" /> : <ChevronRight className="w-[18px] h-[18px] text-slate-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 space-y-3 text-xs text-slate-600 border-t border-slate-100">
                  <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-medium text-slate-700">
                    {t.summary}
                  </p>
                  <ul className="space-y-1.5 pl-1">
                    {t.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
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
