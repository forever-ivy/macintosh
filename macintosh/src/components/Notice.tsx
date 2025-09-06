import TextType from "./Texttype";
import type { ForwardedRef } from "react";

interface NoticeProps {
  className?: string;
  message: string;
  cursorCharacter?: string;
  ref?: ForwardedRef<HTMLDivElement>;
  enableTypingSound?: boolean;
}

export default function Notice({
  className,
  message,
  cursorCharacter,
  ref,
  enableTypingSound = true,
}: NoticeProps) {
  return (
    <div ref={ref}>
      <div
        className={`w-fit h-fit px-3 py-2 
          bg-white/5 backdrop-blur-md backdrop-saturate-150
          text-white/90 ring-1 ring-white/10
          shadow-lg shadow-black/40 
          ${className}`}
      >
        <TextType
          text={[message]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter={cursorCharacter}
          textColors={["white"]}
          className=" font-bold text-xl"
          enableTypingSound={enableTypingSound}
          typingSoundUrl="/static/audio/cc/type.wav"
          typingSoundVolume={0.3}
        />
      </div>
    </div>
  );
}
