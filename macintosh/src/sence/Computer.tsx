import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function ComputerModel() {
  const gltf = useGLTF("/static/models/Computer/macintosh_classic_1991.glb");
  return <primitive object={gltf.scene} scale={10} position={[0, 0, 0]} />;
}

export default function Computer() {
  return (
    <Suspense
      fallback={
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="gray" />
        </mesh>
      }
    >
      <ComputerModel />
    </Suspense>
  );
}
