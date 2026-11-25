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
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-5xl mx-auto text-[#eeeeee] font-sans">
      {/* Header with Bilingual Switcher */}
      <div className="bg-[#222831]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#303640] shadow-glass flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#eeeeee] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00adb5]" />
            <span>{currentDocs.title}</span>
          </h2>
          <p className="text-xs text-[#b8eef0]/70 mt-1">{currentDocs.subtitle}</p>
        </div>

        {/* Language Switcher Button Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#1d232c] border border-[#303640]">
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                : 'text-[#eeeeee]/70 hover:text-[#00adb5]'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>

          <button
            onClick={() => setLang('ur')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              lang === 'ur'
                ? 'bg-[#00adb5] text-[#1d232c] shadow-[0_0_12px_rgba(0,173,181,0.4)]'
                : 'text-[#eeeeee]/70 hover:text-[#00adb5]'
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
              className="bg-[#222831]/80 backdrop-blur-xl overflow-hidden rounded-2xl border border-[#303640] shadow-glass transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#303640]/40 transition-colors"
              >
                <span className="text-sm font-bold text-[#eeeeee] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00adb5]"></span>
                  {sec.title}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[#00adb5]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#eeeeee]/40" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-[#303640]/60 space-y-3">
                  <p className="text-xs text-[#b8eef0] leading-relaxed font-medium">
                    {sec.summary}
                  </p>

                  {sec.points && sec.points.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {sec.points.map((pt, i) => (
                        <li key={i} className="text-xs text-[#eeeeee]/80 flex items-start gap-2">
                          <span className="text-[#00adb5] font-bold">•</span>
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
