import {
  CameraControls,
  Stage,
  useDepthBuffer,
  SpotLight,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import Computer from "./Computer";
import { useCameraStore } from "../stores/cameraStore";

export default function Demo() {
  const depthBuffer = useDepthBuffer({ size: 256 });
  const cameraControlsRef = useRef<CameraControls>(null);

  const setCameraControlsRef = useCameraStore(
    (state) => state.setCameraControlsRef
  );

  useEffect(() => {
    if (cameraControlsRef.current) {
      setCameraControlsRef({ current: cameraControlsRef.current });
    }
  }, [setCameraControlsRef]);

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.rotateAzimuthTo({});
    }
  }, []);

  return (
    <>
      <color attach="background" args={["#121212"]} />

      <SpotLight
        position={[-2.5, 14, -0.5]}
        castShadow={false}
        penumbra={0.9} // 降低边缘硬度
        distance={25} // 稍微减少距离
        angle={0.6} // 减小光锥角度
        attenuation={15} // 减少衰减距离
        decay={2.5} // 增加衰减率
        anglePower={10.0} // 减少边缘衰减强度
        intensity={1} // 降低强度
        radiusTop={0.8} // 减小顶部半径
        radiusBottom={15.0} // 减小底部半径
        color="#fff8dc" // 柔和的米白色
        opacity={0.2} // 添加透明度
        volumetric={true} // 启用体积光
        depthBuffer={depthBuffer}
      />

      {/* <MovingSpot
        depthBuffer={depthBuffer}
        color={"#aaa8a8"}
        position={[-4.5, 4.5, 12.5]}
      /> */}
      {/* <MovingSpot
        depthBuffer={depthBuffer,4.5,}
        color={spot2Color}
        position={spot2Position}
      /> */}

      <CameraControls
        ref={cameraControlsRef}
        enabled={true}
        truckSpeed={1.0}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        infinityDolly={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        dampingFactor={0.05}
        smoothTime={0.25}
        autoRotate={true}
        autoRotateSpeed={10.0}
      />

      <Stage
        intensity={0.4}
        preset="rembrandt"
        shadows={{
          type: "",
          color: "#000000",
          colorBlend: 1,
          opacity: 0.4,
          blur: 2,
          far: 10,
          smooth: true,
          resolution: 1024,
        }}
        adjustCamera={6}
        environment="night"
      >
        <Computer />
      </Stage>
    </>
  );
}
