import Notice from "../components/Notice";
import TimeDisplay from "../components/TimeDisplay";

interface TittleBarProps {
  className?: string;
}

export default function TittleBar({ className }: TittleBarProps) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Notice message="Ziggy Xuan" cursorCharacter="" />
      <Notice message="R3F Portfolio" cursorCharacter="" />
      <TimeDisplay />
    </div>
  );
}
