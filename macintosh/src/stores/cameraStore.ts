import { create } from "zustand";
import type { CameraControls } from "@react-three/drei";

interface CameraStore {
  cameraControlsRef: React.RefObject<CameraControls> | null;
  setCameraControlsRef: (ref: React.RefObject<CameraControls>) => void;
  resetCamera: () => void;
  focusOnObject: () => void;
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  cameraControlsRef: null,
  setCameraControlsRef: (ref) => set({ cameraControlsRef: ref }),
  resetCamera: () => {
    const { cameraControlsRef } = get();
    cameraControlsRef?.current?.reset(true);
  },
  focusOnObject: () => {
    const { cameraControlsRef } = get();
    cameraControlsRef?.current?.setLookAt(5, 5, 5, 0, 0, 0, true);
  },
}));
