import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "static", // 确保静态资源目录正确
  assetsInclude: ["**/*.glb", "**/*.gltf"], // 包含 3D 模型文件
});
