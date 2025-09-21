
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import LoadingScreen from "@/components/LoadingScreen";

interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  year: number;
  content_type: string;
  genre: string[];
  country: string;
  imdb_rating: number;
  downloads: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      searchMovies(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchMovies = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .or(`title.ilike.%${searchTerm}%,storyline.ilike.%${searchTerm}%,director.ilike.%${searchTerm}%,production_house.ilike.%${searchTerm}%`)
        .order('downloads', { ascending: false })
        .limit(50);

      if (error) throw error;

      setMovies(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setTimeout(() => setLoading(false), 2000); // 2-second loading
    }
  };

  if (loading) {
    return <LoadingScreen message={`Searching for "${query}"...`} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400">
            Found {movies.length} result{movies.length !== 1 ? 's' : ''}
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : movies.length > 0 ? (
          <EnhancedMovieGrid movies={movies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No results found for "{query}"
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
