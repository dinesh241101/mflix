import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  year: number;
  imdb_rating: number;
  genre: string[];
  content_type: string;
  country: string;
}

interface RelatedMoviesSectionProps {
  currentMovie: {
    movie_id: string;
    genre: string[];
    content_type: string;
    title: string;
  };
}

const RelatedMoviesSection = ({ currentMovie }: RelatedMoviesSectionProps) => {
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchRelatedMovies();
  }, [currentMovie.movie_id]);

  const fetchRelatedMovies = async () => {
    try {
      setLoading(true);
      
      // First try to get movies with matching genres
      let { data: genreMatches, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, imdb_rating, genre, content_type, country')
        .neq('movie_id', currentMovie.movie_id)
        .limit(12);

      if (error) throw error;

      // Filter movies that share at least one genre
      const moviesWithSharedGenres = genreMatches?.filter(movie => 
        movie.genre && currentMovie.genre && 
        movie.genre.some(genre => currentMovie.genre.includes(genre))
      ) || [];

      // If we have enough genre matches, use them
      if (moviesWithSharedGenres.length >= 8) {
        setRelatedMovies(moviesWithSharedGenres.slice(0, 12));
      } else {
        // Otherwise, get movies of the same content type
        const { data: contentTypeMatches } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, year, imdb_rating, genre, content_type, country')
          .eq('content_type', currentMovie.content_type)
          .neq('movie_id', currentMovie.movie_id)
          .limit(12);

        // Combine genre matches with content type matches
        const allMatches = [...moviesWithSharedGenres, ...(contentTypeMatches || [])];
        const uniqueMovies = allMatches.filter((movie, index, self) => 
          self.findIndex(m => m.movie_id === movie.movie_id) === index
        );

        setRelatedMovies(uniqueMovies.slice(0, 12));
      }
    } catch (error) {
      console.error('Error fetching related movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRouteForMovie = (movie: Movie) => {
    switch (movie.content_type) {
      case 'anime':
        return `/anime/${movie.movie_id}`;
      case 'series':
        return `/series/${movie.movie_id}`;
      default:
        return `/movie/${movie.movie_id}`;
    }
  };

  const itemsPerPage = 6;
  const maxIndex = Math.max(0, relatedMovies.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + itemsPerPage, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - itemsPerPage, 0));
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Related {currentMovie.content_type === 'movie' ? 'Movies' : currentMovie.content_type === 'series' ? 'Series' : 'Content'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedMovies.length === 0) {
    return null;
  }

  const visibleMovies = relatedMovies.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-8 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Related {currentMovie.content_type === 'movie' ? 'Movies' : currentMovie.content_type === 'series' ? 'Series' : 'Content'}
          </h2>
          
          {relatedMovies.length > itemsPerPage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {visibleMovies.map((movie) => (
            <Link key={movie.movie_id} to={getRouteForMovie(movie)}>
              <Card className="group cursor-pointer bg-gray-700 border-gray-600 hover:border-blue-500 transition-all duration-300 hover:scale-105 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-400 text-sm text-center p-2">{movie.title}</span>
                      </div>
                    )}
                    
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
                        <Star size={10} fill="currentColor" />
                        {movie.imdb_rating}
                      </Badge>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center text-white">
                        <div className="text-sm font-medium">Watch Now</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-1">
                    <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      {movie.year && (
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          {movie.year}
                        </div>
                      )}
                      {movie.country && (
                        <span className="truncate text-xs">{movie.country}</span>
                      )}
                    </div>
                    
                    {/* Genres - show max 2 */}
                    {movie.genre && movie.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {movie.genre.slice(0, 1).map((g, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs text-gray-300 border-gray-600 px-1 py-0"
                          >
                            {g}
                          </Badge>
                        ))}
                        {movie.genre.length > 1 && (
                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 px-1 py-0">
                            +{movie.genre.length - 1}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination dots */}
        {relatedMovies.length > itemsPerPage && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(relatedMovies.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerPage) === index 
                    ? 'bg-blue-500' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedMoviesSection;
