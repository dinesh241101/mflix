import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import SampleDataForm from "@/components/SampleDataForm";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Separate queries for different content types
  const { data: featuredMovies, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, genre, content_type, imdb_rating, storyline')
        .eq('featured', true)
        .eq('is_visible', true)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: latestMovies, isLoading: latestLoading } = useQuery({
    queryKey: ['latest-movies', currentPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: totalCount } = useQuery({
    queryKey: ['movies-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })
        .eq('is_visible', true);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: animeMovies, isLoading: animeLoading } = useQuery({
    queryKey: ['anime-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, genre, content_type, imdb_rating')
        .eq('content_type', 'anime')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: seriesMovies, isLoading: seriesLoading } = useQuery({
    queryKey: ['series-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, genre, content_type, imdb_rating')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, genre, content_type, imdb_rating')
        .eq('trending', true)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Transform featured movies for slider
  const transformedFeaturedMovies = featuredMovies?.map(movie => ({
    id: movie.movie_id,
    title: movie.title,
    poster_url: movie.poster_url || '',
    year: movie.year,
    genre: movie.genre
  })) || [];

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  if (latestLoading && currentPage === 1) {
    return <LoadingScreen message="Loading latest content..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <div className="container mx-auto px-4">
        {/* Top Banner Ad */}
        <div className="mb-8">
          <ResponsiveAdPlaceholder position="top-banner" />
        </div>

        {/* Featured Movies Slider */}
        {!featuredLoading && transformedFeaturedMovies.length > 0 && (
          <section className="mb-12">
            <FeaturedMovieSlider movies={transformedFeaturedMovies} />
          </section>
        )}

        {/* Latest Uploads Section with Pagination */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Latest Uploads</h2>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages} • {totalCount} items
            </span>
          </div>

          {/* 2x10 Grid Layout */}
          {latestMovies && latestMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 mb-8">
              {latestMovies.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-400 text-center p-2">
                          {movie.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-white text-xs font-medium text-center p-2">
                        {movie.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No content available</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = currentPage <= 3 ? i + 1 : 
                                currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                currentPage - 2 + i;
                    
                    if (page < 1 || page > totalPages) return null;
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>

        {/* Middle Banner Ad */}
        <div className="mb-12">
          <ResponsiveAdPlaceholder position="top-banner" />
        </div>

        {/* Simple Movie Grids for Other Content Types */}
        {!trendingLoading && trendingMovies && trendingMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingMovies.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-400 text-center p-2">
                          {movie.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-white text-xs font-medium text-center p-2">
                        {movie.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Anime Section */}
        {!animeLoading && animeMovies && animeMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Popular Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeMovies.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-400 text-center p-2">
                          {movie.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-white text-xs font-medium text-center p-2">
                        {movie.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Web Series Section */}
        {!seriesLoading && seriesMovies && seriesMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Web Series</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {seriesMovies.map((movie) => (
                <div
                  key={movie.movie_id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-400 text-center p-2">
                          {movie.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-white text-xs font-medium text-center p-2">
                        {movie.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Banner Ad */}
        <div className="mt-12">
          <ResponsiveAdPlaceholder position="bottom-banner" />
        </div>
      </div>

      {/* Sample Data Form */}
      <SampleDataForm />
    </div>
  );
};

export default Index;