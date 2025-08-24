import { CameraControls, Stage } from "@react-three/drei";
import { useRef, useEffect } from "react";
import Computer from "./Computer";
import { useCameraStore } from "../stores/cameraStore";

export default function Demo() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const setCameraControlsRef = useCameraStore(
    (state) => state.setCameraControlsRef
  );

  useEffect(() => {
    if (cameraControlsRef.current) {
      setCameraControlsRef({ current: cameraControlsRef.current });
    }
  }, [setCameraControlsRef]);

  return (
    <>
      {/* 替换 OrbitControls */}
      <CameraControls
        ref={cameraControlsRef}
        // 基本控制
        enabled={true}
        truckSpeed={1.0}
        enableZoom={true}
        enableRotate={true}
        // 距离限制
        minDistance={2}
        maxDistance={50}
        // 角度限制
        minPolarAngle={Math.PI / 6} // 30度
        maxPolarAngle={(Math.PI * 5) / 6} // 150度
        // 平滑效果
        dampingFactor={0.05}
        smoothTime={0.25}
        // 自动旋转
        autoRotate={false}
        autoRotateSpeed={1.0}
        // 事件处理
        onChange={(e) => console.log("相机改变:", e)}
      />

      <Stage
        intensity={0.4}
        preset="rembrandt"
        shadows={{
          type: "accumulative",
          color: "#896C6C",
          colorBlend: 2,
          opacity: 1,
        }}
        adjustCamera={4}
        environment="night"
      >
        <Computer />
      </Stage>
    </>
  );
}
