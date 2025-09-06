import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, forwardRef } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber"; // 导入 ThreeEvent 类型

interface ComputerProps {
  onModelClick?: () => void;
}

const ComputerModel = forwardRef<THREE.Object3D, ComputerProps>(
  ({ onModelClick }, ref) => {
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
        scale={8}
        position={[3, -0.1, -3]}
        rotation={[0, -Math.PI / 4, 0]}
        ref={ref}
        castShadow={true}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation(); // 防止事件冒泡
          onModelClick?.(); // 调用点击回调
        }}
      />
    );
  }
);

ComputerModel.displayName = "ComputerModel";

const Computer = forwardRef<THREE.Object3D, ComputerProps>(
  ({ onModelClick }, ref) => {
    return (
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="gray" />
          </mesh>
        }
      >
        <ComputerModel ref={ref} onModelClick={onModelClick} />
      </Suspense>
    );
  }
);

Computer.displayName = "Computer";

export default Computer;
