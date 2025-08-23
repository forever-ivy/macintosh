import { Environment } from "@react-three/drei";
import { Suspense } from "react";

export default function EnvironmentComponent() {
  return (
    <Suspense fallback={null}>
      <Environment
        files="/static/models/World/background.exr"
        background={true}
      />
    </Suspense>
  );
}
