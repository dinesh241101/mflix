
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Star, Calendar, Eye, Download, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import UniversalHeader from "@/components/universal/UniversalHeader";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieCarousel from "@/components/MovieCarousel";
import AdPlacement from "@/components/ads/AdPlacement";

// Use the database Movie type from Supabase
interface DatabaseMovie {
  movie_id: string;
  title: string;
  poster_url?: string;
  year?: number;
  imdb_rating?: number;
  genre?: string[];
  content_type: string;
  featured?: boolean;
  storyline?: string;
  downloads?: number;
  created_at: string;
}

interface DatabaseShort {
  short_id: string;
  title: string;
  thumbnail_url?: string;
  video_url: string;
  duration?: number;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<DatabaseMovie[]>([]);
  const [latestMovies, setLatestMovies] = useState<DatabaseMovie[]>([]);
  const [latestSeries, setLatestSeries] = useState<DatabaseMovie[]>([]);
  const [latestAnime, setLatestAnime] = useState<DatabaseMovie[]>([]);
  const [latestShorts, setLatestShorts] = useState<DatabaseShort[]>([]);
  const [allContent, setAllContent] = useState<DatabaseMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);

      // Fetch all movies, series, and anime
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (moviesError) throw moviesError;

      // Fetch shorts separately
      const { data: shortsData, error: shortsError } = await supabase
        .from('shorts')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (shortsError) throw shortsError;

      const movies = moviesData || [];
      const shorts = shortsData || [];

      // Set all content
      setAllContent(movies);

      // Filter featured content
      setFeaturedMovies(movies.filter(movie => movie.featured).slice(0, 5));

      // Filter by content type
      setLatestMovies(movies.filter(movie => movie.content_type === 'movie').slice(0, 12));
      setLatestSeries(movies.filter(movie => movie.content_type === 'series').slice(0, 12));  
      setLatestAnime(movies.filter(movie => movie.content_type === 'anime').slice(0, 12));
      setLatestShorts(shorts);

    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: DatabaseMovie) => {
    const path = movie.content_type === 'series' ? 'series' : 
                 movie.content_type === 'anime' ? 'anime' : 'movie';
    navigate(`/${path}/${movie.movie_id}`);
  };

  const handleSeeMore = (type: string) => {
    navigate(`/${type}`);
  };

  // Transform for FeaturedMovieSlider
  const transformMovieForSlider = (movie: DatabaseMovie) => ({
    id: movie.movie_id,
    title: movie.title,
    poster_url: movie.poster_url || '/placeholder-movie.jpg',
    year: movie.year,
    genre: movie.genre
  });

  // Transform for MovieCarousel - ensure all required properties are present
  const transformMovieForCarousel = (movies: DatabaseMovie[]) => 
    movies.map(movie => ({
      movie_id: movie.movie_id,
      title: movie.title,
      poster_url: movie.poster_url || '/placeholder-movie.jpg',
      year: movie.year || new Date().getFullYear(), // Provide default year if missing
      imdb_rating: movie.imdb_rating,
      genre: movie.genre || [],
      content_type: movie.content_type,
      featured: movie.featured,
      storyline: movie.storyline,
      downloads: movie.downloads,
      created_at: movie.created_at
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading amazing content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <UniversalHeader />
      
      {/* Top Ad Placement */}
      <div className="container mx-auto px-4 py-4">
        <AdPlacement position="header" pageType="home" className="mb-6" />
      </div>

      {/* Featured Content Slider */}
      {featuredMovies.length > 0 && (
        <section className="mb-12">
          <FeaturedMovieSlider 
            movies={featuredMovies.map(transformMovieForSlider)} 
            onMovieClick={handleMovieClick} 
          />
        </section>
      )}

      {/* Mid-page Ad */}
      <div className="container mx-auto px-4 py-4">
        <AdPlacement position="middle" pageType="home" className="mb-8" />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* All Content Grid */}
        {allContent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">All Content</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {allContent.slice(0, 24).map((movie) => (
                <Card 
                  key={movie.movie_id} 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleMovieClick(movie)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={movie.poster_url || '/placeholder-movie.jpg'}
                        alt={movie.title}
                        className="w-full h-48 md:h-64 lg:h-72 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-movie.jpg';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-t-lg flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                      </div>

                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                          {movie.content_type.toUpperCase()}
                        </Badge>
                      </div>

                      {movie.imdb_rating && (
                        <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Star size={12} className="mr-1" />
                          {movie.imdb_rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                        {movie.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        {movie.year && (
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {movie.year}
                          </div>
                        )}
                        {movie.downloads && (
                          <div className="flex items-center">
                            <Download size={12} className="mr-1" />
                            {movie.downloads}
                          </div>
                        )}
                      </div>

                      {movie.genre && movie.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {movie.genre.slice(0, 2).map((g: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovieClick(movie);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Latest Movies */}
        {latestMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Latest Movies</h2>
              <Button 
                variant="ghost" 
                onClick={() => handleSeeMore('movies')}
                className="text-blue-400 hover:text-blue-300"
              >
                See More <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <MovieCarousel title="Latest Movies" movies={transformMovieForCarousel(latestMovies)} />
          </section>
        )}

        {/* Ad between sections */}
        <AdPlacement position="between-sections" pageType="home" className="my-8" />

        {/* Latest Web Series */}
        {latestSeries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Latest Web Series</h2>
              <Button 
                variant="ghost" 
                onClick={() => handleSeeMore('series')}
                className="text-blue-400 hover:text-blue-300"
              >
                See More <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <MovieCarousel title="Latest Web Series" movies={transformMovieForCarousel(latestSeries)} />
          </section>
        )}

        {/* Latest Anime */}
        {latestAnime.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Latest Anime</h2>
              <Button 
                variant="ghost" 
                onClick={() => handleSeeMore('anime')}
                className="text-blue-400 hover:text-blue-300"
              >
                See More <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <MovieCarousel title="Latest Anime" movies={transformMovieForCarousel(latestAnime)} />
          </section>
        )}

        {/* Latest Shorts */}
        {latestShorts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Latest Shorts</h2>
              <Button 
                variant="ghost" 
                onClick={() => handleSeeMore('shorts')}
                className="text-blue-400 hover:text-blue-300"
              >
                See More <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {latestShorts.map((short) => (
                <Card 
                  key={short.short_id} 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate('/shorts')}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={short.thumbnail_url || '/placeholder-movie.jpg'}
                        alt={short.title}
                        className="w-full h-32 md:h-40 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-movie.jpg';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-t-lg flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                      </div>

                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-pink-600 text-white text-xs">
                          SHORT
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-white group-hover:text-pink-400 transition-colors">
                        {short.title}
                      </h3>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-pink-600 hover:bg-pink-700 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/shorts');
                        }}
                      >
                        <Play size={14} className="mr-1" />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Ad */}
        <AdPlacement position="footer" pageType="home" className="mt-12" />
      </div>
    </div>
  );
};

export default Index;
