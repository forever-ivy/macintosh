import { useState, useEffect } from "react";

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
export default DeviceCompatibilityWarning;
