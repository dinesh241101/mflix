import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Calendar, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  year: number;
  imdb_rating: number;
  genre: string[];
  content_type: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
}

const MovieCarousel = ({ title, movies, viewAllLink }: MovieCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(movies.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.movie_id}`);
  };

  const getCurrentMovies = () => {
    const start = currentSlide * itemsPerSlide;
    return movies.slice(start, start + itemsPerSlide);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-4">
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="outline" size="sm" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          )}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((movie) => (
                  <Card 
                    key={movie.movie_id}
                    className="group cursor-pointer bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                        <img
                          src={movie.poster_url || '/placeholder.svg'}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Watch Now
                          </Button>
                        </div>
                        
                        <Badge 
                          className="absolute top-2 left-2 bg-blue-600 text-white text-xs"
                          variant="secondary"
                        >
                          {movie.content_type.toUpperCase()}
                        </Badge>
                        
                        {movie.imdb_rating && (
                          <Badge 
                            className="absolute top-2 right-2 bg-yellow-600 text-black text-xs flex items-center gap-1"
                            variant="secondary"
                          >
                            <Star size={10} fill="currentColor" />
                            {movie.imdb_rating}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-3 space-y-2">
                        <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {movie.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            {movie.year}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSlides > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCarousel;