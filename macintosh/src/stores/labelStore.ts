import { create } from "zustand";

interface NoticeState {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  visible: false,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));
