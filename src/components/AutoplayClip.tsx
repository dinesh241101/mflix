
import { useEffect, useRef } from 'react';

interface AutoplayClipProps {
  src: string;
  thumbnailUrl?: string;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

const AutoplayClip = ({ 
  src, 
  thumbnailUrl,
  muted = true, 
  loop = true, 
  className = "w-full h-auto rounded"
}: AutoplayClipProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTubeUrl = src.includes('youtube.com') || src.includes('youtu.be');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          
          if (entry.isIntersecting) {
            // Play when in viewport
            video.play().catch(err => {
              console.error('Error autoplay:', err);
              // Some browsers require user interaction before playing,
              // we can handle this gracefully
            });
          } else {
            // Pause when out of viewport
            video.pause();
          }
        });
      },
      {
        threshold: 0.5 // At least 50% of the element is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [src]);

  // For YouTube embeds 
  if (isYouTubeUrl) {
    const embedParams = new URLSearchParams({
      autoplay: '1',
      mute: muted ? '1' : '0',
      loop: loop ? '1' : '0',
      playsinline: '1',
      controls: '0',
      modestbranding: '1',
      rel: '0'
    }).toString();
    
    return (
      <iframe
        className={className}
        src={`${src}?${embedParams}`}
        title="Autoplay clip"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={thumbnailUrl}
      muted={muted}
      loop={loop}
      playsInline
      autoPlay
    />
  );
};

export default AutoplayClip;
