import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTimeStore } from "../stores/timeStore";
import { useNoticeStore } from "../stores/labelStore";

interface TimeDisplayProps {
  className?: string;
}
export default function TimeDisplay({ className }: TimeDisplayProps) {
  const currentTime = useTimeStore((state) => state.currentTime);
  const [initialTime] = useState(currentTime);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { visible } = useNoticeStore();
  const ifVisible = visible ? "visible" : "hidden";
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const container = containerRef.current;
    const text = textRef.current;

    // 初始状态：容器宽度为0，文字透明
    gsap.set(container, {
      width: 0,
      opacity: 0,
    });
    gsap.set(text, {
      opacity: 0,
    });

    // 创建展开动画时间线
    const tl = gsap.timeline({
      onComplete: () => {
        setIsExpanded(true);
      },
    });

    // 1. 容器淡入并展开宽度
    tl.to(container, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    })
      .to(container, {
        width: "auto",
        duration: 0.8,
        ease: "power2.out",
      })
      // 2. 文字逐渐显示（模仿打字效果）
      .to(
        text,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`h-fit px-3 py-2  bg-white/5 backdrop-blur-md backdrop-saturate-150 text-white/90 ring-1 ring-white/10 shadow-lg shadow-black/40 overflow-hidden ${className} ${ifVisible}`}
    >
      <span ref={textRef} className="font-bold text-xl whitespace-nowrap">
        {isExpanded ? currentTime : initialTime}
      </span>
    </div>
  );
}
