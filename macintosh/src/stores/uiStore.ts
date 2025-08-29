import { create } from "zustand";

type UIState = {
  started: boolean;
  setStarted: (value: boolean) => void;
  reset: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  started: false,
  setStarted: (value) => set({ started: value }),
  reset: () => set({ started: false }),
}));
