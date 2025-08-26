import { Canvas } from "@react-three/fiber";
import Demo from "./sence/demo"; // 改为命名导入
// import { useCameraStore } from "./stores/cameraStore";
import { EffectComposer, FXAA } from "@react-three/postprocessing";

export default function App() {
  return (
    <div className="w-screen h-screen relative">
      {/* <div className="absolute top-4 left-4 z-50 pointer-events-auto">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          onClick={resetCamera}
        >
          重置相机
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={focusOnObject}
        >
          聚焦物体
        </button>
      </div> */}

      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-25, 16, 50], fov: 35 }}
        onCreated={({ camera }) => {
          camera.lookAt(2.5, 0, -2.5);
        }}
      >
        <Demo />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
