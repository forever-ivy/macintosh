import { Canvas } from "@react-three/fiber";
import Scene from "../sence/Sence";
import { EffectComposer, FXAA } from "@react-three/postprocessing";

export default function ScenePage() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      camera={{ position: [-25, 16, 50], fov: 35 }}
      onCreated={({ camera }) => {
        camera.lookAt(2.5, 0, -2.5);
      }}
    >
      <Scene />
      <EffectComposer>
        <FXAA />
      </EffectComposer>
    </Canvas>
  );
}
