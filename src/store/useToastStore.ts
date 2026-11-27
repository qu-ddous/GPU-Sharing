import { create } from 'zustand';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  notify: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  notify: ({ title, message, type }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      // Replace any previous 'info' loading toast when a final result arrives for instant feel
      toasts: [
        ...state.toasts.filter((t) => t.type !== 'info').slice(-2),
        { id, title, message, type }
      ]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3000);
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const notifyToast = (title: string, message: string, type: ToastType = 'success') => {
  useToastStore.getState().notify({ title, message, type });
};
