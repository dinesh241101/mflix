
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Movie {
  movie_id: string;
  title: string;
  storyline: string;
  poster_url: string;
  genre: string[];
  year: number;
  imdb_rating: number;
  content_type: string;
}

interface ImprovedFeaturedSliderProps {
  movies: Movie[];
}

const ImprovedFeaturedSlider = ({ movies }: ImprovedFeaturedSliderProps) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: currentMovie.poster_url 
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${currentMovie.poster_url})`
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
        }}
      />

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white border-0 h-12 w-12 rounded-full"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white border-0 h-12 w-12 rounded-full"
          >
            <ChevronRight size={24} />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize mb-2">
                {currentMovie.content_type}
              </span>
              {currentMovie.year && (
                <span className="ml-2 text-gray-300">({currentMovie.year})</span>
              )}
            </div>
            
            <h1 
              className="text-4xl lg:text-6xl font-bold mb-4 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleMovieClick(currentMovie.movie_id)}
            >
              {currentMovie.title}
            </h1>
            
            {currentMovie.storyline && (
              <p className="text-lg lg:text-xl text-gray-200 mb-6 line-clamp-3">
                {currentMovie.storyline}
              </p>
            )}
            
            {/* Movie Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {currentMovie.imdb_rating && (
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={20} />
                  <span className="font-semibold">{currentMovie.imdb_rating}</span>
                </div>
              )}
              {currentMovie.genre && currentMovie.genre.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentMovie.genre.slice(0, 3).map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700/80 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => handleMovieClick(currentMovie.movie_id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex items-center justify-center"
              >
                <Play className="mr-2" size={20} />
                Watch Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleMovieClick(currentMovie.movie_id)}
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
              >
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImprovedFeaturedSlider;
