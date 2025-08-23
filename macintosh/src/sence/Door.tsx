import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

export default function Door() {
  const gltf = useGLTF("/static/models/door.glb");

  return (
    <>
      <group>
        <mesh position={[0, 1.9, -0.2]}>
          <planeGeometry args={[15, 14.4]} />
          <MeshBasicMaterial
            toneMapped={false}
            side={THREE.DoubleSide}
            color="#ecf76b"
            emissive="#ecf76b"
            emissiveIntensity={0.3}
            mirror={1}
            resolution={1024}
            mixBlur={0}
            roughness={0}
          />
        </mesh>

        <Suspense fallback={null}>
          <primitive object={gltf.scene} />
        </Suspense>
      </group>
    </>
  );
}
