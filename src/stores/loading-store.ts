import { create } from "zustand";

type LoadingStore = {
  routeLoading: boolean;
  apiInFlight: number;
  startRouteLoading: () => void;
  stopRouteLoading: () => void;
  startApiLoading: () => void;
  stopApiLoading: () => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  routeLoading: false,
  apiInFlight: 0,
  startRouteLoading: () => set({ routeLoading: true }),
  stopRouteLoading: () => set({ routeLoading: false }),
  startApiLoading: () =>
    set((state) => ({
      apiInFlight: state.apiInFlight + 1,
    })),
  stopApiLoading: () =>
    set((state) => ({
      apiInFlight: Math.max(0, state.apiInFlight - 1),
    })),
}));
