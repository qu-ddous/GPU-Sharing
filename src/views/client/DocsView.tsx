import React, { useState } from 'react';
import docsData from '../../../shared/docs_content.json';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [openSectionId, setOpenSectionId] = useState<string>('overview');

  const currentDocs = docsData[lang];

  const toggleSection = (id: string) => {
    setOpenSectionId(prev => prev === id ? '' : id);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-3.5rem)] max-w-5xl mx-auto text-slate-900 font-sans">
      {/* Header with Bilingual Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>{currentDocs.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{currentDocs.subtitle}</p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>

          <button
            onClick={() => setLang('ur')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'ur'
                ? 'bg-white text-blue-600 shadow-xs'
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
              className="bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {sec.title}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {sec.summary}
                  </p>

                  {sec.points && sec.points.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {sec.points.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
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
