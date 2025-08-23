import * as THREE from "three";

export default function Background() {
  return (
    <>
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          color="#222"
          //   wireframe={true}
        />
      </mesh>
    </>
  );
}
