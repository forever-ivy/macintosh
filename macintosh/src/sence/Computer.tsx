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
            position={[1.9, 0.7, -1.91]}
            rotation={[-0.1, -0.78, -0.07]}
            transform
            occlude
            distanceFactor={1.75}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                // 点击后跳转到新页面
                window.open(
                  " https://splendid-starlight-6c6ffb.netlify.app/",
                  "_blank"
                );
                onModelClick?.();
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              <iframe
                src="https://splendid-starlight-6c6ffb.netlify.app/"
                style={{
                  width: 717,
                  height: 550,
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #E6D8C3",
                  boxShadow: [
                    "0 10px 28px rgba(0, 0, 0, 0.35)",
                    "0 0 0 1px rgba(255, 255, 255, 0.28) inset",
                    "0 1px 0 rgba(255, 255, 255, 0.65) inset",
                    "0 -1px 0 rgba(0, 0, 0, 0.06) inset",
                  ].join(", "),
                  backgroundColor: "#FDFBF7",
                  pointerEvents: "none", // 保持none，防止iframe拦截点击
                }}
              />
            </div>
          </Html>
        </ComputerModel>
      </Suspense>
    );
  }
);

Computer.displayName = "Computer";

export default Computer;
