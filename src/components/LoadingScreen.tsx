
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading-animation.json";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // Faster increment for 2-second loading
      });
    }, 100); // Update every 100ms for 2 seconds total

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className="w-full h-full"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">{message}</h2>
          
          <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-gray-400 text-sm">{progress}% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
