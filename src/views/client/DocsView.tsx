import React, { useState } from 'react';
import docsData from '../../../shared/docs_content.json';
import { BookOpen, ChevronDown, ChevronRight, Globe2 } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [openSectionId, setOpenSectionId] = useState<string>('overview');

  const currentDocs = docsData[lang];

  const toggleSection = (id: string) => {
    setOpenSectionId(prev => prev === id ? '' : id);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-5xl">
      {/* Header with Bilingual Switcher */}
      <div className="clay-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-purple" />
            <span>{currentDocs.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{currentDocs.subtitle}</p>
        </div>

        {/* Language Switcher Button Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-950 border border-surface-border">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              lang === 'en'
                ? 'bg-brand-purple text-white shadow-claySm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>

          <button
            onClick={() => setLang('ur')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              lang === 'ur'
                ? 'bg-brand-purple text-white shadow-claySm'
                : 'text-slate-400 hover:text-white'
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
              className="clay-card overflow-hidden border border-surface-border/60 transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                  <h3 className="text-sm font-bold text-white tracking-tight">{sec.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-brand-purple" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 space-y-4 text-xs text-slate-300 border-t border-surface-border/40">
                  <p className="leading-relaxed text-slate-200 font-medium bg-surface-800/40 p-3.5 rounded-xl border border-surface-border/40">
                    {sec.summary}
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    {sec.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
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
