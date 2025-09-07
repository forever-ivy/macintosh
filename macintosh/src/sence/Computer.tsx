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
                onModelClick?.();
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              <iframe
                src="https://localhost:3000"
                style={{
                  width: 717,
                  height: 550,
                  borderRadius: "10px",
                  overflow: "hidden", // 保证圆角处不露白
                  border: "1px solid #E6D8C3", // 更细腻、偏低饱和度的米色描边
                  boxShadow: [
                    "0 10px 28px rgba(0, 0, 0, 0.35)", // 外部柔和阴影（层次感）
                    "0 0 0 1px rgba(255, 255, 255, 0.28) inset", // 内部高光描边（塑料/玻璃质感）
                    "0 1px 0 rgba(255, 255, 255, 0.65) inset", // 顶部内侧高光
                    "0 -1px 0 rgba(0, 0, 0, 0.06) inset", // 底部内侧微阴影
                  ].join(", "),
                  backgroundColor: "#FDFBF7", // 温和底色，增强整体观感
                  pointerEvents: "none", // 防止iframe内容拦截点击事件
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
