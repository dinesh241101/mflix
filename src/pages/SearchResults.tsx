import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      
      if (genre) {
        // Genre-based search
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .contains('genre', [genre])
          .order('created_at', { ascending: false });

        if (error) throw error;

        const filteredData = data?.filter(movie => 
          movie.genre && movie.genre.includes(genre)
        ) || [];

        setMovies(filteredData);
        setTotalResults(filteredData.length);
      } else {
        // Enhanced text-based search with SEO tags and fuzzy matching
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        const searchQueries = [];

        // 1. Direct title search
        searchQueries.push(
          supabase
            .from('movies')
            .select('*')
            .eq('is_visible', true)
            .ilike('title', `%${searchTerm}%`)
            .order('downloads', { ascending: false })
        );

        // 2. Individual word matches
        for (const term of searchTerms) {
          if (term.length > 1) {
            searchQueries.push(
              supabase
                .from('movies')
                .select('*')
                .eq('is_visible', true)
                .ilike('title', `%${term}%`)
                .order('downloads', { ascending: false })
            );
          }
        }

        // 3. SEO tags search
        for (const term of searchTerms) {
          searchQueries.push(
            supabase
              .from('movies')
              .select('*')
              .eq('is_visible', true)
              .contains('seo_tags', [term])
              .order('downloads', { ascending: false })
          );
        }

        // 4. Director and other fields
        searchQueries.push(
          supabase
            .from('movies')
            .select('*')
            .eq('is_visible', true)
            .or(`director.ilike.%${searchTerm}%,production_house.ilike.%${searchTerm}%,storyline.ilike.%${searchTerm}%`)
            .order('downloads', { ascending: false })
        );

        // Execute all searches
        const searchResults = await Promise.all(
          searchQueries.map(search => search.then(({ data, error }) => {
            if (error) {
              console.error('Search error:', error);
              return [];
            }
            return data || [];
          }))
        );

        // Combine and deduplicate results
        const allResults = searchResults.flat();
        const uniqueResults = allResults.filter(
          (movie, index, self) => self.findIndex(m => m.movie_id === movie.movie_id) === index
        );

        // Score and sort results for relevance
        const scoredResults = uniqueResults.map(movie => {
          let score = 0;
          const title = movie.title.toLowerCase();
          const queryLower = searchTerm.toLowerCase();

          // Title matching
          if (title === queryLower) score += 100;
          else if (title.startsWith(queryLower)) score += 80;
          else if (title.includes(queryLower)) score += 60;

          // Word-by-word matching for better "the big bang" -> "The Big Bang Theory" results
          searchTerms.forEach(term => {
            if (title.includes(term)) score += 25;
            const titleWords = title.split(' ');
            titleWords.forEach(titleWord => {
              if (titleWord.includes(term)) score += 15;
              if (term.includes(titleWord) && titleWord.length > 2) score += 10;
            });
          });

          // SEO tags matching
          if (movie.seo_tags) {
            searchTerms.forEach(term => {
              movie.seo_tags.forEach((tag: string) => {
                if (tag.toLowerCase().includes(term)) score += 20;
              });
            });
          }

          // Boost popular content
          score += Math.log(movie.downloads + 1);
          if (movie.imdb_rating) score += movie.imdb_rating;

          return { ...movie, score };
        });

        const sortedResults = scoredResults
          .sort((a, b) => b.score - a.score);

        setMovies(sortedResults);
        setTotalResults(sortedResults.length);
      }
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
