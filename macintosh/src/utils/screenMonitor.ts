import * as THREE from "three";

export interface ScreenArea {
  center: THREE.Vector3;
  size: number;
  bounds: {
    min: THREE.Vector3;
    max: THREE.Vector3;
  };
}

export class ScreenMonitor {
  private computerObject: THREE.Object3D | null = null;
  private screenLocalPosition = new THREE.Vector3(0, 0.5, 0.3); // 屏幕在模型中的相对位置

  setComputerObject(object: THREE.Object3D) {
    this.computerObject = object;
  }

  getScreenWorldPosition(): THREE.Vector3 {
    if (!this.computerObject) return new THREE.Vector3();

    const worldPos = this.screenLocalPosition.clone();
    this.computerObject.localToWorld(worldPos);
    return worldPos;
  }

  createScreenArea(size: number = 0.5): ScreenArea {
    const center = this.getScreenWorldPosition();
    const halfSize = size / 2;

    return {
      center,
      size,
      bounds: {
        min: new THREE.Vector3(
          center.x - halfSize,
          center.y - halfSize,
          center.z - 0.1
        ),
        max: new THREE.Vector3(
          center.x + halfSize,
          center.y + halfSize,
          center.z + 0.1
        ),
      },
    };
  }

  isPointInScreenArea(point: THREE.Vector3, areaSize: number = 0.5): boolean {
    const area = this.createScreenArea(areaSize);

    return (
      point.x >= area.bounds.min.x &&
      point.x <= area.bounds.max.x &&
      point.y >= area.bounds.min.y &&
      point.y <= area.bounds.max.y &&
      point.z >= area.bounds.min.z &&
      point.z <= area.bounds.max.z
    );
  }

  // 射线检测是否击中屏幕区域
  raycastScreenArea(
    raycaster: THREE.Raycaster,
    areaSize: number = 0.5
  ): boolean {
    if (!this.computerObject) return false;

    const intersects = raycaster.intersectObject(this.computerObject, true);

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;
      return this.isPointInScreenArea(hitPoint, areaSize);
    }

    return false;
  }
}
