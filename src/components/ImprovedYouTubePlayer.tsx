
import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface ImprovedYouTubePlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

const ImprovedYouTubePlayer = ({ videoUrl, title = "Video", className = "" }: ImprovedYouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-400">Invalid YouTube URL</p>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  if (isPlaying) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <div className="relative aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer ${className}`}>
      <div className="relative aspect-video">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        
        {/* Play Button Overlay */}
        <div 
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors"
        >
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transform transition-transform group-hover:scale-110 shadow-lg">
            <Play size={32} className="text-white ml-1" />
          </div>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-medium">{title} - Trailer</h3>
        </div>
      </div>
    </div>
  );
};

export default ImprovedYouTubePlayer;
