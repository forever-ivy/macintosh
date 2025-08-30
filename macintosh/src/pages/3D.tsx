import { Canvas } from "@react-three/fiber";
import Scene from "../sence/Sence";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";

export default function ScenePage() {
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <motion.div className="w-full h-full" exit={{ opacity: 0 }}>
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-25, 16, 50], fov: 35 }}
      >
        <CameraControls
          ref={cameraControlsRef}
          enabled={true}
          minDistance={5}
          maxDistance={30}
          infinityDolly={false}
          dollySpeed={0.1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          smoothTime={0.25}
          truck={false}
          setOrbitPoint={[2.5, 0, -2.5]}
        />

        <Scene
          cameraControlsRef={
            cameraControlsRef as React.RefObject<CameraControls>
          }
        />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </motion.div>
  );
}
