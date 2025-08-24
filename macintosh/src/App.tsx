import { Canvas } from "@react-three/fiber";
import Demo from "./sence/demo"; // 改为命名导入
import { useCameraStore } from "./stores/cameraStore";

export default function App() {
  const { resetCamera, focusOnObject } = useCameraStore();

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
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
      </div>

      <Canvas
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [4, -1, 8], fov: 35 }}
      >
        <Demo />
      </Canvas>
    </div>
  );
}
