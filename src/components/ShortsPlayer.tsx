
import { X } from "lucide-react";
import { useState } from "react";

interface Short {
  id: string | number;
  title: string;
  video_url: string;
  thumbnail_url?: string;
}

interface ShortsPlayerProps {
  shorts: Short[];
  onClose: () => void;
}

const ShortsPlayer = ({ shorts, onClose }: ShortsPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!shorts.length) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-3xl h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-10"
        >
          <X size={24} />
        </button>
        
        <div className="relative h-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={shorts[currentIndex]?.video_url + "?autoplay=1"}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={shorts[currentIndex]?.title}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {shorts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortsPlayer;
