import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import ScenePage from "./pages/3D";
import Loadingpage from "./pages/Loadingpage";

export default function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="w-screen h-screen bg-[#122] fixed inset-0 overflow-hidden">
        <Routes>
          {/* Loading 页面作为首页 */}
          <Route path="/" element={<Loadingpage />} />

          {/* 3D 场景页面 */}
          <Route path="/scene" element={<ScenePage />} />

          {/* 所有其他路径都重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
