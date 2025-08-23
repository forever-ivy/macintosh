import { Canvas } from "@react-three/fiber";
import Scene from "./sence/Stage";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [4, -1, 8], fov: 35 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
