
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, Star, Download, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const EnhancedSearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchContent();
    }
  }, [query]);

  const searchContent = async () => {
    try {
      setLoading(true);
      
      // Enhanced search with better fuzzy matching
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      // Build multiple search queries for better results
      const searches = [];

      // 1. Exact title match (highest priority)
      searches.push(
        supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .ilike('title', `%${query}%`)
          .order('downloads', { ascending: false })
          .limit(10)
      );

      // 2. Partial title matches
      for (const term of searchTerms) {
        if (term.length > 2) {
          searches.push(
            supabase
              .from('movies')
              .select('*')
              .eq('is_visible', true)
              .ilike('title', `%${term}%`)
              .order('downloads', { ascending: false })
              .limit(5)
          );
        }
      }

      // 3. SEO tags search
      searches.push(
        supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .contains('seo_tags', searchTerms)
          .order('downloads', { ascending: false })
          .limit(8)
      );

      // 4. Genre search
      searches.push(
        supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .overlaps('genre', searchTerms)
          .order('downloads', { ascending: false })
          .limit(8)
      );

      // 5. Director and production house search
      const directorSearch = searchTerms.map(term => 
        supabase
          .from('movies')
          .select('*')
          .eq('is_visible', true)
          .or(`director.ilike.%${term}%,production_house.ilike.%${term}%`)
          .order('downloads', { ascending: false })
          .limit(5)
      );

      searches.push(...directorSearch);

      // Execute all searches
      const searchResults = await Promise.all(
        searches.map(search => search.then(({ data, error }) => {
          if (error) {
            console.error('Search error:', error);
            return [];
          }
          return data || [];
        }))
      );

      // Flatten and deduplicate results
      const allResults = searchResults.flat();
      const uniqueResults = allResults.filter(
        (movie, index, self) => self.findIndex(m => m.movie_id === movie.movie_id) === index
      );

      // Advanced scoring system for relevance
      const scoredResults = uniqueResults.map(movie => {
        let score = 0;
        const title = movie.title.toLowerCase();
        const queryLower = query.toLowerCase();

        // Exact title match gets highest score
        if (title === queryLower) score += 100;
        
        // Title starts with query
        else if (title.startsWith(queryLower)) score += 80;
        
        // Title contains full query
        else if (title.includes(queryLower)) score += 60;

        // Individual word matches in title
        searchTerms.forEach(term => {
          if (title.includes(term)) score += 20;
        });

        // Genre matches
        if (movie.genre) {
          searchTerms.forEach(term => {
            if (movie.genre.some((g: string) => g.toLowerCase().includes(term))) {
              score += 15;
            }
          });
        }

        // SEO tags matches
        if (movie.seo_tags) {
          searchTerms.forEach(term => {
            if (movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(term))) {
              score += 10;
            }
          });
        }

        // Director/Production matches
        if (movie.director && searchTerms.some(term => movie.director.toLowerCase().includes(term))) {
          score += 25;
        }
        if (movie.production_house && searchTerms.some(term => movie.production_house.toLowerCase().includes(term))) {
          score += 20;
        }

        // Boost popular content
        score += Math.log(movie.downloads + 1) * 2;

        // Boost recent content
        const daysSinceCreation = (new Date().getTime() - new Date(movie.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation < 30) score += 10;
        if (daysSinceCreation < 7) score += 20;

        // Boost featured content
        if (movie.featured) score += 15;

        return { ...movie, relevance_score: score };
      });

      // Sort by relevance score and limit results
      const sortedResults = scoredResults
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 50); // Limit to 50 results

      setResults(sortedResults);

      // Track search
      await supabase.from('analytics').insert({
        page_visited: `search/${encodeURIComponent(query)}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });

    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: "Failed to search content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Searching for "{query}"...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-400">
            Found {results.length} results for "<span className="text-white font-medium">{query}</span>"
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <Film size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <div className="text-gray-400 space-y-1">
              <p>Try different keywords or check spelling</p>
              <p>Search suggestions:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Use movie titles like "The Big Bang Theory"</li>
                <li>Try genre names like "Action", "Comedy", "Drama"</li>
                <li>Search by actor or director names</li>
                <li>Use quality terms like "1080p", "720p"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <Card key={item.movie_id} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="aspect-[3/4] relative">
                  <img
                    src={item.poster_url || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.title)}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-600 text-yellow-100">
                      Featured
                    </Badge>
                  )}
                  {item.quality && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                      {item.quality}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-white">{item.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {item.content_type.toUpperCase()}
                    </Badge>
                    {item.year && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        {item.year}
                      </div>
                    )}
                  </div>

                  {item.imdb_rating && (
                    <div className="flex items-center mb-2">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span className="text-sm text-white">{item.imdb_rating}</span>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-400 mb-3">
                    <Download size={12} className="mr-1" />
                    {(item.downloads || 0).toLocaleString()} downloads
                  </div>

                  {item.genre && item.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.genre.slice(0, 2).map((genre: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {genre}
                        </Badge>
                      ))}
                      {item.genre.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          +{item.genre.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {item.storyline && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {item.storyline}
                    </p>
                  )}

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = `/${item.content_type}/${item.movie_id}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearchResults;
