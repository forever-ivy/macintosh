import { useGLTF, Html } from "@react-three/drei";
import { Suspense, useEffect, forwardRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useControls } from "leva";

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
          // child.material.wireframe = true;
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
    // Leva 控制器
    const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } =
      useControls("Html Screen Position & Rotation", {
        positionX: { value: 1.93, min: -5, max: 5, step: 0.01 },
        positionY: { value: 0.73, min: -5, max: 5, step: 0.01 },
        positionZ: { value: -1.96, min: -5, max: 5, step: 0.01 },
        rotationX: { value: -0.1, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotationY: { value: -0.78, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotationZ: { value: -0.08, min: -Math.PI, max: Math.PI, step: 0.01 },
      });

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
            position={[positionX, positionY, positionZ]}
            rotation={[rotationX, rotationY, rotationZ]}
            transform
            occlude
            distanceFactor={1.5}
          >
            <iframe
              src="https://localhost:3000"
              style={{
                width: 730,
                height: 530,
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
