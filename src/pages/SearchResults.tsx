
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get("q");
  const genre = searchParams.get("genre");
  const searchTerm = query || genre || "";

  useEffect(() => {
    if (searchTerm) {
      searchMovies();
    }
  }, [searchTerm, query, genre]);

  const searchMovies = async () => {
    try {
      setIsLoading(true);
      let searchQuery;

      if (genre) {
        // Genre-based search
        searchQuery = supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .contains('genre', [genre])
          .order('created_at', { ascending: false });
      } else {
        // Text-based search
        searchQuery = supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .or(`title.ilike.%${searchTerm}%,storyline.ilike.%${searchTerm}%,director.ilike.%${searchTerm}%,production_house.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false });
      }

      const { data, error } = await searchQuery;

      if (error) throw error;

      // Additional filtering for genre search to ensure exact matches
      let filteredData = data || [];
      if (genre) {
        filteredData = data?.filter(movie => 
          movie.genre && movie.genre.includes(genre)
        ) || [];
      }

      setMovies(filteredData);
      setTotalResults(filteredData.length);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Searching content..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {genre ? `${genre} Movies & Series` : `Search Results`}
            </h1>
            {genre && (
              <Badge className="bg-blue-600 text-white">
                {genre}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </span>
            {query && (
              <>
                <span>for</span>
                <span className="text-white font-semibold">"{query}"</span>
              </>
            )}
          </div>
        </div>

        {movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No results found
            </h2>
            <p className="text-gray-400 mb-6">
              {genre 
                ? `No content found in the ${genre} category.`
                : `No results found for "${searchTerm}". Try searching with different keywords.`
              }
            </p>
            <div className="text-sm text-gray-500">
              <p>Search suggestions:</p>
              <ul className="mt-2 space-y-1">
                <li>• Check your spelling</li>
                <li>• Try different keywords</li>
                <li>• Use more general terms</li>
                <li>• Browse by genre or category</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
