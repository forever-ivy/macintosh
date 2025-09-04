import { CameraControls } from "@react-three/drei";
import * as THREE from "three";

interface CameraMoveProps {
  cameraControlsRef: React.RefObject<CameraControls>;
  x?: number;
  y?: number;
  z?: number;
  zoomRate?: number;
}

const moveCamera = ({
  cameraControlsRef,
  x,
  y,
  z,
  zoomRate,
}: CameraMoveProps) => {
  const originalCamera = cameraControlsRef.current;
  const vector = new THREE.Vector3();
  originalCamera.getPosition(vector);
  originalCamera.setPosition(
    vector.x + (x || 0),
    vector.y + (y || 0),
    vector.z + (z || 0),
    true
  );
  originalCamera.zoomTo(zoomRate || 1, true);
};

export { moveCamera };
