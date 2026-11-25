import React, { useState } from 'react';
import docsData from '../../../shared/docs_content.json';
import { BookOpen, ChevronDown, ChevronRight, Globe2, Network, ShieldCheck } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [openSectionId, setOpenSectionId] = useState<string>('overview');

  const currentDocs = docsData[lang];

  const toggleSection = (id: string) => {
    setOpenSectionId(prev => prev === id ? '' : id);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      {/* Header with Bilingual Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>{currentDocs.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{currentDocs.subtitle}</p>
        </div>

        {/* Language Switcher Button Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>

          <button
            onClick={() => setLang('ur')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'ur'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇵🇰 Roman Urdu</span>
          </button>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {currentDocs.sections.map((sec) => {
          const isOpen = openSectionId === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-white overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <h3 className="text-sm font-bold text-slate-800">{sec.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
                  <p className="font-medium text-slate-800">{sec.summary}</p>
                  
                  {sec.points && sec.points.length > 0 && (
                    <ul className="space-y-1.5 pl-2">
                      {sec.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.id === 'cable_setup' && (
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold">
                        <Network className="w-4 h-4 text-indigo-600" />
                        <span>Direct Cat6 Cable Pairing Cheat Sheet:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 font-mono text-indigo-800 text-[11px]">
                        <li>Worker Desktop: 192.168.99.1 (Subnet: 255.255.255.0)</li>
                        <li>Client Laptop: 192.168.99.2 (Subnet: 255.255.255.0)</li>
                        <li>Zero internet required • 1.2 ms duplex ping latency</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
