import { useGLTF, Html } from "@react-three/drei";
import { Suspense, useEffect, forwardRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";

interface ComputerProps {
  onModelClick?: () => void;
  children?: ReactNode;
}

const ComputerModel = forwardRef<THREE.Object3D, ComputerProps>(
  ({ onModelClick, children }, ref) => {
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
      <>
        <primitive
          object={gltf.scene}
          scale={8}
          position={[3, -0.1, -3]}
          rotation={[0, -Math.PI / 4, 0]}
          ref={ref}
          castShadow={true}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onModelClick?.();
          }}
        />
        {children}
      </>
    );
  }
);

ComputerModel.displayName = "ComputerModel";

const Computer = forwardRef<THREE.Object3D, ComputerProps>(
  ({ onModelClick }, ref) => {
    // 在 iframe 中使用
    <iframe
      src="https://localhost:3000"
      title="YouTube video player"
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />;
    return (
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="gray" />
          </mesh>
        }
      >
        <ComputerModel ref={ref} onModelClick={onModelClick}>
          <Html
            position={[1.93, 0.73, -1.96]}
            rotation={[-0.1, -0.78, -0.08]}
            transform
            occlude
            style={{
              pointerEvents: "none",
              userSelect: "none",
              color: "white",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <iframe
              src="https://localhost:3000"
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: 114,
                height: 90,
                borderRadius: "4px",
              }}
            />
          </Html>
        </ComputerModel>
      </Suspense>
    );
  }
);

Computer.displayName = "Computer";

export default Computer;
