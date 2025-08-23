import { OrbitControls, Stage, useDepthBuffer } from "@react-three/drei";

import Computer from "./Computer";
import MovingSpot from "./Movingspot";

export default function Scene() {
  const depthBuffer = useDepthBuffer({ frames: 1 });

  return (
    <>
      <color attach="background" args={["#121212"]} />

      <MovingSpot
        depthBuffer={depthBuffer}
        color="#0c8cbf"
        position={[3, 3, 2]}
      />
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#b00c3f"
        position={[1, 3, 0]}
      />
      <Stage
        intensity={0.4}
        preset="rembrandt"
        shadows={{
          type: "accumulative",
          color: "#896C6C",
          colorBlend: 2,
          opacity: 1,
        }}
        adjustCamera={4}
        environment="night"
      >
        <Computer />
      </Stage>

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}
