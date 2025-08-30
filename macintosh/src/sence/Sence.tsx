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

export default function Scene() {
  const depthBuffer = useDepthBuffer({ size: 256 });
  const cameraControlsRef = useRef<CameraControls>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false); // 添加动画状态标记

  // const setCameraControlsRef = useCameraStore(
  //   (state) => state.setCameraControlsRef
  // );

  // useEffect(() => {
  //   if (cameraControlsRef.current) {
  //     setCameraControlsRef({ current: cameraControlsRef.current });
  //   }
  // }, [setCameraControlsRef]);

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    const controls = cameraControlsRef.current;

    // 强制重置相机状态
    controls.enabled = false;
    isAnimatingRef.current = true;

    // 立即设置初始位置，不等待下一帧
    controls.setLookAt(-25, 16, 50, 2.5, 0, -2.5, false);

    // 确保相机位置立即生效
    controls.update(0);

    if (animationRef.current) {
      animationRef.current.kill();
    }

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

    // 减少延迟时间，避免用户在等待期间操作
    animationRef.current = gsap.fromTo(
      animationProgress,
      { value: 0 },
      {
        value: 1,
        duration: 6,
        delay: 0.5, // 从2.5秒减少到1秒
        ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        onUpdate() {
          if (!isAnimatingRef.current) return; // 检查动画状态
          curve.getPoint(animationProgress.value, _tmp);
          controls.setLookAt(_tmp.x, _tmp.y, _tmp.z, 2.5, 0, -2.5, false);
        },
        onComplete() {
          isAnimatingRef.current = false;
          controls.enabled = true;
          controls.setTarget(2.5, 0, -2.5, true);
          if (spotLightRef.current) {
            spotLightRef.current.position.set(2.5, 25, -2.5);
            spotLightRef.current.target.position.set(2.5, 0, -2.5);
          }
        },
      }
    );

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      isAnimatingRef.current = false;
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#222"]} />

      <SpotLight
        ref={spotLightRef}
        position={[-10, 25, -0.5]} // 提高光源位置，更像从天而降的圣光
        castShadow={false}
        penumbra={0.7} // 稍微增加边缘硬度，让光束更清晰
        distance={45} // 大幅增加照射距离
        angle={0.4} // 进一步减小光锥角度，形成更集中的光束
        attenuation={30} // 增加衰减距离，让光照得更远
        decay={1.8} // 减少衰减率，保持远距离亮度
        anglePower={15.0} // 增加边缘衰减强度，突出中心光束
        intensity={1.5} // 提高强度，增强神圣感
        radiusTop={0.5} // 减小顶部半径，形成更集中的光源
        radiusBottom={20.0} // 增加底部半径，扩大照射范围
        color="#fff8e7" // 更温暖的金白色，增强神圣感
        opacity={0.3} // 稍微增加透明度，让光效更明显
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
        enabled={false} // 初始设为false，由动画控制
        minDistance={5}
        maxDistance={30}
        infinityDolly={false}
        dollySpeed={0.1}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        smoothTime={0.25}
        truck={false}
      />

      <Stage
        intensity={3}
        preset="rembrandt"
        shadows={false}
        adjustCamera={false}
        environment={{ files: "/environment/dikhololo_night_4k.hdr" }}
      >
        <Computer />
      </Stage>
    </>
  );
}
