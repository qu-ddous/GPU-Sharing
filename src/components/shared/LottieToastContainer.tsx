import React from 'react';
import { Lottie } from 'lottie-react';
import { X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore.js';
import { successLottie, infoLottie, errorLottie } from '../../assets/lottieAnimations.js';

export const LottieToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const animData =
          t.type === 'error'
            ? errorLottie
            : t.type === 'info' || t.type === 'warning'
            ? infoLottie
            : successLottie;

        const borderClass =
          t.type === 'error'
            ? 'border-rose-200'
            : t.type === 'warning'
            ? 'border-amber-200'
            : t.type === 'info'
            ? 'border-blue-200'
            : 'border-emerald-200';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md border ${borderClass} rounded-2xl p-3.5 shadow-lg shadow-slate-900/10 flex items-center gap-3 transition-all`}
          >
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <Lottie
                src={animData}
                autoplay
                loop={t.type === 'info' || t.type === 'warning'}
                className="w-11 h-11"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">{t.title}</h4>
              <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{t.message}</p>
            </div>

            <button
              onClick={() => dismiss(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
