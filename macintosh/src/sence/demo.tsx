import {
  CameraControls,
  Stage,
  useDepthBuffer,
  SpotLight,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import Computer from "./Computer";
import { gsap } from "gsap";
import * as THREE from "three";
// import { useCameraStore } from "../stores/cameraStore";

export default function Demo() {
  const depthBuffer = useDepthBuffer({ size: 256 });
  const cameraControlsRef = useRef<CameraControls>(null);

  // const setCameraControlsRef = useCameraStore(
  //   (state) => state.setCameraControlsRef
  // );

  // useEffect(() => {
  //   if (cameraControlsRef.current) {
  //     setCameraControlsRef({ current: cameraControlsRef.current });
  //   }
  // }, [setCameraControlsRef]);

  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-25, 16, 50),
      new THREE.Vector3(-15, 14, 55),
      new THREE.Vector3(-5, 12, 50),
      new THREE.Vector3(6, 10, 35),
      new THREE.Vector3(12, 8, 15),
      new THREE.Vector3(14, 6, 0),
      new THREE.Vector3(10, 4, -7),
      new THREE.Vector3(0, 2, -13),
      new THREE.Vector3(-6, -5, -8),
      new THREE.Vector3(-8, -3, -4),
      new THREE.Vector3(-6, -1, 0),
      new THREE.Vector3(-2.15, 0, 2.15),
    ],
    false,
    "centripetal",
    0.3
  );

  const _tmp = new THREE.Vector3();
  const animationProgress = { value: 0 };
  const pathAnimation = gsap.fromTo(
    animationProgress,
    { value: 0 },
    {
      value: 1,
      duration: 6,
      delay: 1,
      ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      onUpdate() {
        const value = animationProgress.value;
        curve.getPoint(value, _tmp);
        const cameraX = _tmp.x;
        const cameraY = _tmp.y;
        const cameraZ = _tmp.z;

        if (cameraControlsRef.current) {
          cameraControlsRef.current.normalizeRotations().setLookAt(
            cameraX,
            cameraY,
            cameraZ,
            2.5,
            0,
            -2.5, // 始终看向原点
            false // 禁用 CameraControls 的过渡动画
          );
        }
      },
      onStart() {
        if (cameraControlsRef.current) {
          cameraControlsRef.current.enabled = false; // 动画开始时禁用手动控制
        }
      },
      onComplete() {
        if (cameraControlsRef.current) {
          cameraControlsRef.current.enabled = true; // 动画结束后恢复手动控制
          cameraControlsRef.current.setTarget(2.5, 0, -2.5, true);
        }
      },
    }
  );

  useEffect(() => {
    pathAnimation.play();
  }, [pathAnimation]);

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
        minDistance={5}
        maxDistance={40}
        infinityDolly={false}
        dollySpeed={0.1}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        smoothTime={0.25}
        truck={false}
        setOrbitPoint={[2.5, 0, -2.5]}
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
        adjustCamera={false}
        environment={{ files: "/environment/dikhololo_night_4k.hdr" }}
      >
        <Computer />
      </Stage>
    </>
  );
}
