import { Canvas } from "@react-three/fiber";
import Scene from "./sence/Sence";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import Loadingpage from "./ui/Loadingpage";
import { useUIStore } from "./stores/uiStore";

export default function App() {
  // const { resetCamera, focusOnObject } = useCameraStore();
  const started = useUIStore((s) => s.started);

  return (
    <div className="w-screen h-screen bg-[#122] fixed inset-0 overflow-hidden">
      {started ? (
        // 主界面：3D Canvas 场景
        <>
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
            <Scene />
            <EffectComposer>
              <FXAA />
            </EffectComposer>
          </Canvas>
        </>
      ) : (
        <Loadingpage />
      )}
    </div>
  );
}
