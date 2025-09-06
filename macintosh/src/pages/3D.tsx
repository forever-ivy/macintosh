import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, FXAA } from "@react-three/postprocessing";
import { Howl } from "howler";
import { CameraControls } from "@react-three/drei";
import { useClickStore } from "../stores/clickStore";
import { useNoticeStore } from "../stores/labelStore";
import { useControlBGMStore } from "../stores/controlbgmStore";
import { useControlTittlebarStore } from "../stores/controltittlebarStore";
import Scene from "../sence/Sence";
import Notice from "../components/Notice";
import TittleBar from "../ui/tittleBar";

export default function ScenePage() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const { clicked, setClicked } = useClickStore();
  const { isPlaying } = useControlBGMStore();
  const { hide, visible } = useNoticeStore();
  const { BarHide } = useControlTittlebarStore();

  const handleClick = () => {
    setClicked(!clicked);
    hide();
    BarHide();
  };

  useEffect(() => {
    const BGM = new Howl({
      src: ["/audio/atmosphere/office.mp3"],
      loop: true,
      volume: 0, // 初始音量设为0
      preload: true,
      html5: false, // 使用 Web Audio API
    });

    // 播放音频
    if (isPlaying === true) {
      BGM.play();
      // 从0音量淡入到0.2，持续2秒
      BGM.fade(0, 0.2, 2000);
    } else {
      // 淡出到0音量，持续1秒后暂停
      BGM.fade(0.2, 0, 1000);
      setTimeout(() => {
        BGM.pause();
      }, 1000);
    }

    // 清理函数
    return () => {
      BGM.stop();
      BGM.unload();
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full bg-[#222]">
      {" "}
      {visible && (
        <Notice
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10"
          message=" Click  Macintosh  to  begin"
          cursorCharacter="_"
        />
      )}
      <TittleBar className="fixed top-12 left-12 z-10" />
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-25, 16, 50], fov: 35 }}
      >
        <Scene
          cameraControlsRef={
            cameraControlsRef as React.RefObject<CameraControls>
          }
          onModelClick={handleClick}
        />
        <EffectComposer>
          <FXAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
