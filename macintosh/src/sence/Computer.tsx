import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

function ComputerModel() {
  const gltf = useGLTF("/models/Computer/macintosh_classic_1991.glb");

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        child.material.flatShading = false;
      }
    });
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      scale={10}
      position={[2.6, 0.1, -2.6]}
      rotation={[0, -Math.PI / 4, 0]}
    />
  );
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
