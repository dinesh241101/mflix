
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  poster_url: string;
  year?: number;
  genre?: string[];
}

interface FeaturedMovieSliderProps {
  movies: Movie[];
  autoSlideInterval?: number;
  onMovieClick?: (movie: any) => void;
}

const FeaturedMovieSlider = ({ 
  movies, 
  autoSlideInterval = 5000,
  onMovieClick 
}: FeaturedMovieSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Auto slide functionality
  useEffect(() => {
    if (movies.length <= 1) return;
    
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [currentIndex, movies.length, autoSlideInterval]);
  
  if (!movies.length) {
    return <div className="h-96 bg-gray-800 flex items-center justify-center">No featured movies</div>;
  }
  
  const currentMovie = movies[currentIndex];
  
  const handleMovieClick = () => {
    if (onMovieClick) {
      // Convert back to DatabaseMovie format for the callback
      const dbMovie = {
        movie_id: currentMovie.id,
        title: currentMovie.title,
        poster_url: currentMovie.poster_url,
        year: currentMovie.year,
        genre: currentMovie.genre,
        content_type: 'movie' // default for featured content
      };
      onMovieClick(dbMovie);
    } else {
      navigate(`/movie/${currentMovie.id}`);
    }
  };
  
  return (
    <div className="relative h-96 overflow-hidden rounded-lg">
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
        style={{ backgroundImage: `url(${currentMovie.poster_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 z-10">
        <h2 className="text-4xl font-bold mb-2 text-white">{currentMovie.title}</h2>
        <div className="flex items-center mb-4 text-gray-300">
          {currentMovie.year && <span className="mr-3">{currentMovie.year}</span>}
          {currentMovie.genre && currentMovie.genre.length > 0 && (
            <span>{currentMovie.genre.slice(0, 3).join(', ')}</span>
          )}
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={handleMovieClick}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <Play size={16} className="mr-2" />
            Watch Now
          </Button>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMovieSlider;
