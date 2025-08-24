import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import type { CameraControlsRef } from "@react-three/drei";
import Computer from "./Computer";

export default function Demo2() {
  const cameraControls = useRef<CameraControlsRef>(null);
  return (
    <>
      <CameraControls
        ref={cameraControls}
        minPolarAngle={0} // 0°
        maxPolarAngle={Math.PI} // 180°
        minAzimuthAngle={-Infinity} // 无限制
        maxAzimuthAngle={Infinity} // 无限制
        infinityDolly={false}
        minDistance={0.1} // 极近距离观察细节
        maxDistance={20} // 整体产品视图
        dollyToCursor={true}
      />
      <Computer />
    </>
  );
}
