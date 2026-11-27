import React from 'react';
import { Lottie } from 'lottie-react';
import { X, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { useToastStore, ToastType } from '../../store/useToastStore.js';
import { successLottie, infoLottie, errorLottie } from '../../assets/lottieAnimations.js';

class LottieSafeBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const FallbackIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  if (type === 'error') {
    return (
      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center animate-bounce">
        <XCircle className="w-6 h-6" />
      </div>
    );
  }
  if (type === 'warning') {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center animate-pulse">
        <AlertTriangle className="w-6 h-6" />
      </div>
    );
  }
  if (type === 'info') {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
        <Info className="w-6 h-6" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-bounce">
      <CheckCircle2 className="w-6 h-6" />
    </div>
  );
};

export const LottieToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const animData =
          t.type === 'error'
            ? errorLottie
            : t.type === 'info' || t.type === 'warning'
            ? infoLottie
            : successLottie;

        const accentClass =
          t.type === 'error'
            ? 'border-rose-200 border-l-4 border-l-rose-600'
            : t.type === 'warning'
            ? 'border-amber-200 border-l-4 border-l-amber-500'
            : t.type === 'info'
            ? 'border-blue-200 border-l-4 border-l-blue-600'
            : 'border-emerald-200 border-l-4 border-l-emerald-600';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-white border ${accentClass} rounded-2xl p-3.5 shadow-xl shadow-slate-900/15 flex items-center gap-3 transition-all`}
          >
            <div className="w-11 h-11 shrink-0 flex items-center justify-center">
              <LottieSafeBoundary fallback={<FallbackIcon type={t.type} />}>
                <Lottie
                  src={animData}
                  autoplay
                  speed={2}
                  loop={t.type === 'info' || t.type === 'warning'}
                  className="w-11 h-11"
                />
              </LottieSafeBoundary>
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
