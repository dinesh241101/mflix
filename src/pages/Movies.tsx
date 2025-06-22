import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import LoadingScreen from "@/components/LoadingScreen";
import Pagination from "@/components/Pagination";
import GlobalAdInterceptor from "@/components/ads/GlobalAdInterceptor";

const ITEMS_PER_PAGE = 24;

const Movies = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get filters from URL params
  const category = searchParams.get('category');
  const quality = searchParams.get('quality');
  const language = searchParams.get('language');
  const genre = searchParams.get('genre');
  const year = searchParams.get('year');
  const sort = searchParams.get('sort');

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
    fetchMovies(1);
  }, [category, quality, language, genre, year, sort]);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .eq('content_type', 'movie')
        .eq('is_visible', true);

      // Apply filters
      if (category) {
        // Filter by category logic would go here
        // For now, we'll use genre as a proxy
        if (category === 'bollywood') {
          query = query.contains('genre', ['Bollywood']);
        } else if (category === 'hollywood') {
          query = query.contains('genre', ['Hollywood']);
        }
      }

      if (quality) {
        query = query.eq('quality', quality);
      }

      if (language) {
        query = query.eq('country', language);
      }

      if (genre) {
        query = query.contains('genre', [genre]);
      }

      if (year) {
        query = query.eq('year', parseInt(year));
      }

      // Apply sorting
      if (sort === 'latest' || sort === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'popular') {
        query = query.order('downloads', { ascending: false });
      } else if (sort === 'rating') {
        query = query.order('imdb_rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data: moviesData, error: moviesError, count } = await query
        .range(from, to);
      
      if (moviesError) throw moviesError;
      
      setMovies(moviesData || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      
    } catch (error: any) {
      console.error("Error fetching movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    let title = "Latest Movies";
    if (category) {
      title = `${category.charAt(0).toUpperCase() + category.slice(1)} Movies`;
    }
    if (quality) {
      title += ` (${quality.toUpperCase()})`;
    }
    if (language) {
      title += ` - ${language.charAt(0).toUpperCase() + language.slice(1)}`;
    }
    if (genre) {
      title += ` - ${genre.charAt(0).toUpperCase() + genre.slice(1)}`;
    }
    if (year) {
      title += ` (${year})`;
    }
    return title;
  };

  if (loading && currentPage === 1) {
    return <LoadingScreen message="Loading Movies..." />;
  }

  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Content Top Ad */}
        <ClickableAdBanner position="content-top" />
        
        {/* Movies Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{getPageTitle()}</h1>
            <span className="text-gray-400 text-sm">
              {totalCount} movies found
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : movies.length > 0 ? (
            <>
              <EnhancedMovieGrid 
                movies={movies} 
                title="" 
                showAds={true}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
        
        {/* Content Bottom Ad */}
        <ClickableAdBanner position="content-bottom" />
      </main>
    </UniversalAdsWrapper>
  );
};

export default Movies;
