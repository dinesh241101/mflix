
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading-animation.json";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="relative w-40 h-40 mb-4">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          style={{ width: 160, height: 160 }}
        />
      </div>
      <p className="text-xl font-medium text-white">
        {message}{dots}
      </p>
    </div>
  );
};

export default LoadingScreen;
