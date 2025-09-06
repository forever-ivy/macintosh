import Notice from "../components/Notice";
import TimeDisplay from "../components/TimeDisplay";
import { useRef, useState, useEffect } from "react";
import { useControlTittlebarStore } from "../stores/controltittlebarStore";

interface TittleBarProps {
  className?: string;
}

export default function TittleBar({ className }: TittleBarProps) {
  const { isVisible } = useControlTittlebarStore();

  const noticeRef1 = useRef<HTMLDivElement>(null);
  const noticeRef2 = useRef<HTMLDivElement>(null);
  const noticeRef3 = useRef<HTMLDivElement>(null);
  const [showStep, setShowStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowStep(1), 0),
      setTimeout(() => setShowStep(2), 1300),
      setTimeout(() => setShowStep(3), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (isVisible === false) {
    return null;
  }
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Notice
        message="Ziggy Xuan"
        cursorCharacter=""
        className={`rounded transition-all duration-500 ease-out ${
          showStep >= 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
        ref={noticeRef1}
      />
      <Notice
        message="Macintosh Portfolio"
        cursorCharacter=""
        className={`rounded transition-all duration-500 ease-out ${
          showStep >= 2
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
        ref={noticeRef2}
      />
      <TimeDisplay
        className={`transition-all duration-500 ease-out ${
          showStep >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
        ref={noticeRef3}
      />
    </div>
  );
}
