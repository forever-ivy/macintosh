import { create } from "zustand";

interface TimeState {
  currentTime: string;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
}

let alignTimer: number | null = null;
let intervalTimer: number | null = null;

const updateTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const useTimeStore = create<TimeState>((set, get) => ({
  currentTime: updateTime(),
  isRunning: false,

  startTimer: () => {
    const state = get();
    if (alignTimer || intervalTimer || state.isRunning) return;

    set({ isRunning: true });

    const update = () => {
      const newTime = updateTime();
      console.log("时间更新:", newTime); // 调试日志
      set({ currentTime: newTime });
    };

    update(); // 立即更新一次

    // 对齐到下一个整秒
    const delay = 1000 - (Date.now() % 1000);
    alignTimer = window.setTimeout(() => {
      update();
      intervalTimer = window.setInterval(update, 1000);
      alignTimer = null;
    }, delay);
  },

  stopTimer: () => {
    if (alignTimer) {
      window.clearTimeout(alignTimer);
      alignTimer = null;
    }
    if (intervalTimer) {
      window.clearInterval(intervalTimer);
      intervalTimer = null;
    }
    set({ isRunning: false });
  },
}));

// 自动启动定时器
setTimeout(() => {
  useTimeStore.getState().startTimer();
}, 100);
