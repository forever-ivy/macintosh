import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import { CameraControls } from "@react-three/drei";
import Scene from "../sence/Sence";
import Notice from "../components/Notice";

export default function ScenePage() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    if (!started) {
      setStarted(true);
    }
  };

  return (
    <div className="w-full h-full bg-[#222]" onClick={handleStart}>
      {!started && (
        <Notice
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10"
          message=" Click  anywhere  to  begin"
        />
      )}
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-25, 16, 50], fov: 35 }}
      >
        <Scene
          cameraControlsRef={
            cameraControlsRef as React.RefObject<CameraControls>
          }
          started={started}
        />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
