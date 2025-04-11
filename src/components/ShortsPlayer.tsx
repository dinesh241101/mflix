
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Short {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
}

interface ShortsPlayerProps {
  shorts: Short[];
  onClose?: () => void;
}

const ShortsPlayer = ({ shorts, onClose }: ShortsPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentShort = shorts[currentIndex];
  
  const nextShort = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevShort = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => nextShort();
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, shorts.length]);
  
  // Reset video when changing shorts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentIndex]);
  
  // Handle YouTube URLs
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };
  
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      videoId = new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1`;
  };
  
  if (!shorts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-xl mb-4">No shorts available</p>
        {onClose && (
          <Button onClick={onClose}>Close</Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative h-full bg-black flex flex-col">
      {/* Player */}
      <div className="flex-grow relative">
        {isYouTubeUrl(currentShort.video_url) ? (
          <iframe
            src={getYouTubeEmbedUrl(currentShort.video_url)}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            autoPlay
            playsInline
            muted={isMuted}
          >
            <source src={currentShort.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Controls overlay */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top - Title and close */}
          <div className="p-4 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent">
            <h3 className="text-white text-lg font-medium">{currentShort.title}</h3>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20" 
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>
          
          {/* Center - Play/Pause */}
          <div className="flex-grow flex items-center justify-center" onClick={togglePlay}>
            {!isPlaying && (
              <div className="p-4 rounded-full bg-black/30">
                <Play size={40} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Bottom - Controls */}
          <div className="p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={prevShort}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={20} />
                </Button>
                <span className="text-white text-sm">
                  {currentIndex + 1}/{shorts.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={nextShort}
                  disabled={currentIndex === shorts.length - 1}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortsPlayer;
