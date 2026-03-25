import { create } from "zustand";

export type ToastKind = "loading" | "success" | "error";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
  durationMs?: number;
};

type ToastStore = {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, "id">) => string;
  dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
