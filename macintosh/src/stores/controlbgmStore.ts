import { create } from "zustand";

interface ControlBGMState {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
}

export const useControlBGMStore = create<ControlBGMState>((set) => ({
  isPlaying: false,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));
