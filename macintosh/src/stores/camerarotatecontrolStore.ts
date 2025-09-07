import { create } from "zustand";

interface CameraRotateControlStore {
  isRotate: boolean;
  setIsRotate: (isRotate: boolean) => void;
}

export const useCameraRotateControlStore = create<CameraRotateControlStore>()(
  (set) => ({
    isRotate: true,
    setIsRotate: (isRotate) => set({ isRotate }),
  })
);
