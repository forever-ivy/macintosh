import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import ScenePage from "./pages/3D";
import Loadingpage from "./pages/Loadingpage";

export default function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="w-screen h-screen bg-[#122] fixed inset-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<Loadingpage />} />
          <Route path="/scene" element={<ScenePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
