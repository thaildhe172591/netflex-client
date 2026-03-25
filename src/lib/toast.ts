import { useToastStore } from "@/stores/toast-store";

type PushToastArgs = {
  title: string;
  description?: string;
  durationMs?: number;
};

export const appToast = {
  loading: ({ title, description }: PushToastArgs) =>
    useToastStore
      .getState()
      .pushToast({ title, description, kind: "loading", durationMs: 0 }),
  success: ({ title, description, durationMs = 2500 }: PushToastArgs) =>
    useToastStore
      .getState()
      .pushToast({ title, description, kind: "success", durationMs }),
  error: ({ title, description, durationMs = 3500 }: PushToastArgs) =>
    useToastStore
      .getState()
      .pushToast({ title, description, kind: "error", durationMs }),
  dismiss: (id: string) => useToastStore.getState().dismissToast(id),
};
