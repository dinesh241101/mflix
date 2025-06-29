
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Play, Calendar } from 'lucide-react';
import ResponsiveAdPlaceholder from '@/components/ResponsiveAdPlaceholder';

interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  year: number;
  imdb_rating: number;
  genre: string[];
  content_type: string;
  country: string;
  downloads: number;
}

interface AdItem {
  isAd: true;
  adType: string;
  id: string;
}

interface EnhancedMovieGridProps {
  movies: Movie[];
  title?: string;
  showAds?: boolean;
}

const EnhancedMovieGrid = ({ movies, title = "Movies", showAds = true }: EnhancedMovieGridProps) => {
  const navigate = useNavigate();
  const [displayedMovies, setDisplayedMovies] = useState<(Movie | AdItem)[]>([]);

  useEffect(() => {
    // Insert ads every 6 movies if showAds is true
    if (showAds) {
      const moviesWithAds: (Movie | AdItem)[] = [];
      movies.forEach((movie, index) => {
        moviesWithAds.push(movie);
        
        // Add ad after every 6 movies
        if ((index + 1) % 6 === 0 && index < movies.length - 1) {
          moviesWithAds.push({
            isAd: true,
            adType: 'in-content',
            id: `ad-${index}`
          });
        }
      });
      setDisplayedMovies(moviesWithAds);
    } else {
      setDisplayedMovies(movies);
    }
  }, [movies, showAds]);

  const handleMovieClick = (movieId: string, contentType: string) => {
    const route = contentType === 'anime' ? `/anime/${movieId}` : 
                  contentType === 'series' ? `/series/${movieId}` : 
                  `/movie/${movieId}`;
    navigate(route);
  };

  const isAdItem = (item: Movie | AdItem): item is AdItem => {
    return 'isAd' in item && item.isAd;
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {/* Mobile-optimized grid layout - removed any black strips or spacing issues */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 w-full">
        {displayedMovies.map((item, index) => {
          if (isAdItem(item)) {
            return (
              <div key={item.id} className="col-span-1 w-full">
                <ResponsiveAdPlaceholder position="in-content" />
              </div>
            );
          }

          const movie = item;
          return (
            <Card 
              key={movie.movie_id}
              className="group cursor-pointer bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 overflow-hidden w-full"
              onClick={() => handleMovieClick(movie.movie_id, movie.content_type)}
            >
              <CardContent className="p-0 relative">
                <div className="relative aspect-[2/3] overflow-hidden">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Play className="text-gray-500" size={48} />
                    </div>
                  )}
                  
                  {/* Overlay with action buttons */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center space-y-2">
                      <Play className="mx-auto text-white" size={32} />
                      <div className="text-white text-sm font-medium">Watch Now</div>
                    </div>
                  </div>
                  
                  {/* Date overlay */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {movie.year && `${movie.year}`}
                  </div>
                  
                  {/* Quality/Content type badge */}
                  <Badge 
                    className="absolute top-2 right-2 bg-blue-600 text-white text-xs"
                    variant="secondary"
                  >
                    {movie.content_type.toUpperCase()}
                  </Badge>
                  
                  {/* Rating badge */}
                  {movie.imdb_rating && (
                    <Badge 
                      className="absolute bottom-2 right-2 bg-yellow-600 text-black text-xs flex items-center gap-1"
                      variant="secondary"
                    >
                      <Star size={10} fill="currentColor" />
                      {movie.imdb_rating}
                    </Badge>
                  )}
                </div>
                
                {/* Movie info overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-white">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  
                  {/* Quality info */}
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>HD CAMRip</span>
                    <span className="hidden sm:inline">720p - 480p - 1080p</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Bottom ad if showAds is enabled */}
      {showAds && movies.length > 0 && (
        <div className="mt-8 w-full">
          <ResponsiveAdPlaceholder position="content-bottom" />
        </div>
      )}
    </div>
  );
};

export default EnhancedMovieGrid;
