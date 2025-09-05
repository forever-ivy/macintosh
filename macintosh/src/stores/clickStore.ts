import { create } from "zustand";

interface ClickStore {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}

export const useClickStore = create<ClickStore>((set) => ({
  clicked: false,
  setClicked: (clicked) => set({ clicked }),
}));
