import { useState, useEffect, useRef } from "react";
import Noise from "../components/Noise";
import TextType from "../components/Texttype";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGLTF } from "@react-three/drei";
import { useProgress } from "@react-three/drei";

interface WarningProps {
  show: boolean;
  message: string;
  className?: string;
}

const Warning: React.FC<WarningProps> = ({ show, message, className = "" }) => {
  if (!show) return null;

  return (
    <div className={`text-red-400 text-sm mb-4 ${className}`}>{message}</div>
  );
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const DeviceCompatibilityWarning: React.FC = () => {
  const isMobile = useMobileDetection();

  return (
    <Warning
      show={isMobile}
      message="This experience is optimized for desktop. Mobile support is limited."
    />
  );
};

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, CameraControls } from "@react-three/drei";
import Scene from "../sence/Sence";

export default function Loadingpage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { active, progress } = useProgress(); // 声明真实加载进度

  // 用于隐形 Canvas 传递给 Scene（避免类型报错）
  const preloadCameraRef = useRef<CameraControls>(null);

  useEffect(() => {
    const audio = new Audio("/audio/startup/StartupIntelT2Mac.wav");
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    // 直接预加载主 GLTF（其余资源由隐形 Canvas + Scene 触发）
    useGLTF.preload("/models/Computer/macintosh_classic_1991.glb");
  }, []);

  useEffect(() => {
    if (!active && progress >= 100) {
      setModelLoaded(true);
    }
  }, [active, progress]);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleStartClick = () => {
    if (!modelLoaded) return;
    playClickSound(); // 先播放音效
    setIsTransitioning(true); // 触发转场
  };

  return (
    <>
      {/* 隐形 Canvas：提前挂载 Scene，触发 Environment HDR / 纹理 / GLTF 等资源的真实加载 */}
      <div
        className="fixed -z-10 pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0, left: 0, top: 0 }}
      >
        <Canvas
          gl={{ antialias: false }}
          dpr={[1, 1]}
          camera={{ position: [-25, 16, 50], fov: 35 }}
        >
          <Suspense fallback={null}>
            <Scene
              cameraControlsRef={
                preloadCameraRef as React.RefObject<CameraControls>
              }
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* 可见的 UI */}
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        color="black"
      >
        <div className="w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="standard-dialog center scale-down flex flex-col items-center justify-center"
              style={{ width: "30rem", height: "15rem" }}
            >
              <div className="flex flex-col items-center justify-between h-full py-8">
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 pb-4">
                  <h1 className="dialog-text font-bold text-lg mb-2">
                    Macintosh Portfolio
                  </h1>

                  <div className="h-8 flex items-center justify-center">
                    {!modelLoaded ? (
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-75 ease-out"
                          style={{ width: `${Math.floor(progress)}%` }}
                        ></div>
                      </div>
                    ) : (
                      <TextType
                        text={["Click start to begin"]}
                        typingSpeed={70}
                        pauseDuration={1500}
                        showCursor={true}
                        cursorCharacter="_"
                        textColors={["black"]}
                        className="dialog-text font-bold"
                      />
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-default hover:bg-gray-800 hover:text-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleStartClick}
                  disabled={!modelLoaded || isTransitioning} // 未加载完成或转场中禁用
                >
                  Start
                </button>
              </div>

              <p className="dialog-text ">© 1984 Apple Computer</p>
            </div>
          </div>
          <Noise
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={30}
          />
          <DeviceCompatibilityWarning />
        </div>
      </div>

      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {/* 背景图：淡入 + 去模糊 + Ken Burns 微缩放 */}
          <motion.img
            src="/static/transition/Transition.jpg"
            alt="Transition"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{
              scale: 1.05,
              rotate: -0.3,
              filter: "blur(10px) brightness(0.9)",
              opacity: 0.0,
            }}
            animate={{
              scale: 1.12,
              rotate: 0,
              filter: "blur(0px) brightness(1)",
              opacity: 1,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* 径向暗角：从无到有，聚焦视觉中心 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* 柔和高光扫过：顶部到下方的微光，用于增加层次 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 40%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          />

          {/* 最终黑场：在图片展示后淡入至黑，然后完成导航 */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => navigate("/scene")}
          />
        </motion.div>
      )}
    </>
  );
}
