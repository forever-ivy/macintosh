import { Canvas } from "@react-three/fiber";
import Scene from "../sence/Sence";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import { motion } from "framer-motion";
export default function ScenePage() {
  return (
    <motion.div className="w-full h-full" exit={{ opacity: 0 }}>
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-25, 16, 50], fov: 35 }}
      >
        <Scene />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </motion.div>
  );
}
