import {
  CameraControls,
  Stage,
  useDepthBuffer,
  SpotLight,
} from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import Computer from "./Computer";
import { useNoticeStore } from "../stores/labelStore";
import { useClickStore } from "../stores/clickStore";
import { moveCamera } from "../utils/cameraMove";

interface SceneProps {
  cameraControlsRef: React.RefObject<CameraControls>;
}

export default function Scene({ cameraControlsRef }: SceneProps) {
  const depthBuffer = useDepthBuffer({ size: 256 });
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const mac = useRef<THREE.Object3D>(null);
  const tl = gsap.timeline();
  const { show } = useNoticeStore();
  const { clicked, setClicked } = useClickStore();
  const [isRotated, setIsRotated] = useState(false);
  const [smoothSpeed, setSmoothSpeed] = useState(10);

  useEffect(() => {
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
        new THREE.Vector3(-10, 0, 10),
      ],
      false,
      "centripetal",
      0.3
    );

    const _tmp = new THREE.Vector3();
    const animationProgress = { value: 0 };

    curve.getPoint(0, _tmp);
    if (cameraControlsRef.current) {
      cameraControlsRef.current.enabled = false;
      cameraControlsRef.current.setLookAt(
        _tmp.x,
        _tmp.y,
        _tmp.z,
        2.5,
        0,
        -2.5,
        false
      );
    }

    animationRef.current = tl.fromTo(
      animationProgress,
      { value: 0 },
      {
        value: 1,
        duration: 10,
        delay: 1.5,
        ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        onUpdate() {
          const value = animationProgress.value;
          curve.getPoint(value, _tmp);
          const cameraX = _tmp.x;
          const cameraY = _tmp.y;
          const cameraZ = _tmp.z;

          if (cameraControlsRef.current) {
            cameraControlsRef.current
              .normalizeRotations()
              .setLookAt(cameraX, cameraY, cameraZ, 0, 0, 0, false);
          }
        },
        onStart() {
          if (cameraControlsRef.current) {
            cameraControlsRef.current.enabled = false;
          }
        },
        onComplete() {
          if (cameraControlsRef.current) {
            cameraControlsRef.current.enabled = true;
            cameraControlsRef.current.setTarget(0, 0, 0, true);

            if (spotLightRef.current) {
              spotLightRef.current.position.set(3, 25, -3);
              spotLightRef.current.target.position.set(0, 0, 0);
            }
          }
        },
      }
    );

    if (mac.current?.rotation) {
      // const vector = new THREE.Vector3();
      tl.set(
        {},
        {
          onComplete() {
            show();
          },
        }
      );

      tl.call(
        () => {
          const controls = cameraControlsRef.current;
          const polarAngle = controls.polarAngle;
          const azimuthAngle = controls.azimuthAngle;
          if (controls) {
            controls.rotateTo(azimuthAngle + Math.PI / 9, polarAngle, true);
            setIsRotated(true);
            setSmoothSpeed(1.5);
          }
        },
        [],
        "+=5"
      );
    }

    animationRef.current.play();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const [isZoomedIn, setZoomedIn] = useState(false);
  const [controlListener, setControlListener] = useState<(() => void) | null>(
    null
  );
  useEffect(() => {
    if (clicked && !isZoomedIn) {
      if (isRotated === true) {
        // 直接设置到初始位置而不是使用 reset
        cameraControlsRef.current.setLookAt(
          -10,
          0,
          10, // 初始相机位置
          0,
          0,
          0, // 目标位置
          true // 启用动画
        );

        // 等待重置完成后再进行缩放
        setTimeout(() => {
          cameraControlsRef.current.saveState();
          moveCamera({ cameraControlsRef, x: 0, y: 7.3, z: 0, zoomRate: 4 });

          const handleControl = () => {
            setZoomedIn(true);
          };

          cameraControlsRef.current.addEventListener("control", handleControl);
          setControlListener(() => handleControl);
        }, 1000); // 等待1秒让重置动画完成

        return;
      }

      cameraControlsRef.current.saveState();
      moveCamera({ cameraControlsRef, x: 0, y: 7.3, z: 0, zoomRate: 4 });

      const handleControl = () => {
        setZoomedIn(true);
      };

      cameraControlsRef.current.addEventListener("control", handleControl);
      setControlListener(() => handleControl);

      return () => {
        if (cameraControlsRef.current) {
          cameraControlsRef.current.removeEventListener(
            "control",
            handleControl
          );
        }
      };
    }
  }, [clicked]);

  useEffect(() => {
    if (isZoomedIn === true) {
      if (controlListener && cameraControlsRef.current) {
        cameraControlsRef.current.removeEventListener(
          "control",
          controlListener
        );
      }

      cameraControlsRef.current.reset(true);

      setZoomedIn(false);
      setControlListener(null);
      setClicked(!clicked);
      return;
    }
  }, [isZoomedIn, controlListener]);

  return (
    <>
      <color attach="background" args={["#222"]} />
      <SpotLight
        ref={spotLightRef}
        position={[-10, 25, -0.5]}
        castShadow={false}
        penumbra={0.7}
        distance={45}
        angle={0.4}
        attenuation={30}
        decay={1.8}
        anglePower={15.0}
        intensity={1.5}
        radiusTop={0.5}
        radiusBottom={20.0}
        color="#fff8e7"
        opacity={0.3}
        volumetric={true}
        depthBuffer={depthBuffer}
      />

      <CameraControls
        ref={cameraControlsRef}
        minDistance={5}
        maxDistance={30}
        infinityDolly={false}
        dollySpeed={0.1}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        smoothTime={smoothSpeed}
        truck={false}
        setOrbitPoint={[2.5, 0, -2.5]}
      />

      <Stage
        intensity={3}
        preset="rembrandt"
        shadows={false}
        adjustCamera={false}
        environment={{ files: "/environment/dikhololo_night_4k.hdr" }}
      >
        <Computer ref={mac} />
      </Stage>
    </>
  );
}
