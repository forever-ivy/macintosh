import { Vector3 } from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { SpotLight as ThreeSpotLight } from "three";

interface MovingSpotProps {
  vec?: Vector3;
  [key: string]: unknown;
}

export default function MovingSpot({
  vec = new Vector3(),
  ...props
}: MovingSpotProps) {
  const light = useRef<ThreeSpotLight>(null);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    if (light.current) {
      light.current.target.position.lerp(
        vec.set(
          (state.mouse.x * viewport.width) / 2,
          (state.mouse.y * viewport.height) / 2,
          0
        ),
        0.1
      );
      light.current.target.updateMatrixWorld();
    }
  });

  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={0}
      distance={30}
      angle={2.5}
      attenuation={5}
      decay={0.1}
      anglePower={6}
      intensity={30}
      radiusTop={0.5}
      radiusBottom={15}
      {...props}
    />
  );
}
