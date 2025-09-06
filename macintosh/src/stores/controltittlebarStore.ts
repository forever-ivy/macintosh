import { create } from "zustand";

interface ControlTittlebarState {
  isVisible: boolean;
  BarShow: () => void;
  BarHide: () => void;
}
export const useControlTittlebarStore = create<ControlTittlebarState>(
  (set) => ({
    isVisible: false,
    BarShow: () => set({ isVisible: true }),
    BarHide: () => set({ isVisible: false }),
  })
);
