import { useState, useEffect, useRef } from "react";
import Noise from "../components/Noise";
import TextType from "../components/Texttype";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGLTF } from "@react-three/drei";

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

export default function Loadingpage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const audio = new Audio("/audio/startup/StartupIntelT2Mac.wav");
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    useGLTF.preload("/models/Computer/macintosh_classic_1991.glb");

    // 倒计时动画
    const startTime = Date.now();
    const duration = 2500; // 2秒

    const updateCountdown = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCountdown(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(updateCountdown);
      } else {
        setModelLoaded(true);
      }
    };

    requestAnimationFrame(updateCountdown);
  }, []);

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
                          style={{ width: `${countdown}%` }}
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
                  disabled={isTransitioning}
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
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={() => navigate("/scene")}
        />
      )}
    </>
  );
}
