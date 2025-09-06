import TextType from "./Texttype";
import { useNoticeStore } from "../stores/labelStore";

interface NoticeProps {
  className?: string;
  message: string;
  cursorCharacter?: string;
}

export default function Notice({
  className,
  message,
  cursorCharacter,
}: NoticeProps) {
  const { visible } = useNoticeStore();

  if (visible === false) return null;

  return (
    <div>
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
        />
      </div>
    </div>
  );
}
