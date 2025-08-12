
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";

const Movies = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMovies, setTotalMovies] = useState(0);

  const category = searchParams.get("category");
  const pageTitle = category ? `${category} Movies` : "All Movies";

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .eq('content_type', 'movie')
        .eq('is_visible', true);

      // Apply category filter
      if (category) {
        switch (category.toLowerCase()) {
          case 'bollywood':
            query = query.contains('seo_tags', ['bollywood']);
            break;
          case 'hollywood':
            query = query.contains('seo_tags', ['hollywood']);
            break;
          case 'dual audio':
            query = query.contains('seo_tags', ['dual audio']);
            break;
          case 'telugu':
            query = query.or('country.ilike.%telugu%,seo_tags.cs.{telugu}');
            break;
          case 'tamil':
            query = query.or('country.ilike.%tamil%,seo_tags.cs.{tamil}');
            break;
          default:
            // For other categories, search in genre or seo_tags
            query = query.or(`genre.cs.{${category}},seo_tags.cs.{${category.toLowerCase()}}`);
        }
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setMovies(data || []);
      setTotalMovies(count || 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
      setTotalMovies(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading movies..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {pageTitle}
            </h1>
            {category && (
              <Badge className="bg-blue-600 text-white">
                {category}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>
              {totalMovies} movie{totalMovies !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="pb-8">
            <MovieGrid movies={movies} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No movies found
            </h2>
            <p className="text-gray-400 mb-6">
              {category 
                ? `No movies found in the ${category} category.`
                : "No movies available at the moment."
              }
            </p>
            <div className="text-sm text-gray-500">
              <p>Try browsing other categories or check back later for new content.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
