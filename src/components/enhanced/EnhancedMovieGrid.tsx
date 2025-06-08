
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedMovies.map((item, index) => {
          if (isAdItem(item)) {
            return (
              <div key={item.id} className="col-span-1">
                <ResponsiveAdPlaceholder position="in-content" />
              </div>
            );
          }

          const movie = item;
          return (
            <Card 
              key={movie.movie_id}
              className="group cursor-pointer bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105"
              onClick={() => handleMovieClick(movie.movie_id, movie.content_type)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
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
                  
                  {/* Content type badge */}
                  <Badge 
                    className="absolute top-2 left-2 bg-blue-600 text-white text-xs"
                    variant="secondary"
                  >
                    {movie.content_type.toUpperCase()}
                  </Badge>
                  
                  {/* Rating badge */}
                  {movie.imdb_rating && (
                    <Badge 
                      className="absolute top-2 right-2 bg-yellow-600 text-black text-xs flex items-center gap-1"
                      variant="secondary"
                    >
                      <Star size={12} fill="currentColor" />
                      {movie.imdb_rating}
                    </Badge>
                  )}
                </div>
                
                <div className="p-3 space-y-2">
                  <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {movie.title}
                  </h3>
                  
                  {/* Year and Country */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    {movie.year && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {movie.year}
                      </div>
                    )}
                    {movie.country && (
                      <span className="truncate">{movie.country}</span>
                    )}
                  </div>
                  
                  {/* Genres */}
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {movie.genre.slice(0, 2).map((g, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs text-gray-300 border-gray-600"
                        >
                          {g}
                        </Badge>
                      ))}
                      {movie.genre.length > 2 && (
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                          +{movie.genre.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Downloads count */}
                  {movie.downloads > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Download size={12} />
                      {movie.downloads.toLocaleString()} downloads
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Bottom ad if showAds is enabled */}
      {showAds && movies.length > 0 && (
        <div className="mt-8">
          <ResponsiveAdPlaceholder position="content-bottom" />
        </div>
      )}
    </div>
  );
};

export default EnhancedMovieGrid;
