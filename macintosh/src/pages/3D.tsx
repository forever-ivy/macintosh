import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import { CameraControls } from "@react-three/drei";
import { useClickStore } from "../stores/clickStore";
import { useNoticeStore } from "../stores/labelStore";
import Scene from "../sence/Sence";
import Notice from "../components/Notice";

export default function ScenePage() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { clicked, setClicked } = useClickStore();
  const { hide } = useNoticeStore();

  const handleClick = () => {
    setClicked(!clicked);
    hide();
  };

  return (
    <div className="w-full h-full bg-[#222]" onClick={handleClick}>
      <Notice
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10"
        message=" Click  anywhere  to  begin"
      />

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
        />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
