
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
      
      // Enhanced search with fuzzy matching
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      let searchQuery = supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true);

      // Build complex search query
      const searchConditions = searchTerms.map(term => 
        `title.ilike.%${term}%, storyline.ilike.%${term}%, director.ilike.%${term}%, production_house.ilike.%${term}%`
      ).join(',');

      const { data: titleResults, error: titleError } = await searchQuery
        .or(searchConditions)
        .order('downloads', { ascending: false })
        .limit(20);

      if (titleError) throw titleError;

      // Search in SEO tags
      const { data: seoResults, error: seoError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .contains('seo_tags', searchTerms)
        .order('downloads', { ascending: false })
        .limit(10);

      // Search in genres
      const { data: genreResults, error: genreError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .contains('genre', searchTerms)
        .order('downloads', { ascending: false })
        .limit(10);

      // Combine and deduplicate results
      const allResults = [
        ...(titleResults || []),
        ...(seoResults || []),
        ...(genreResults || [])
      ];

      const uniqueResults = allResults.filter(
        (movie, index, self) => self.findIndex(m => m.movie_id === movie.movie_id) === index
      );

      // Sort by relevance (title matches first, then by downloads)
      const sortedResults = uniqueResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = query.toLowerCase();

        // Exact title match gets highest priority
        if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
        if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1;

        // Then sort by downloads
        return (b.downloads || 0) - (a.downloads || 0);
      });

      setResults(sortedResults);
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
            <p className="mt-4 text-gray-400">Searching...</p>
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
            Found {results.length} results for "{query}"
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <Film size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-400">Try adjusting your search terms or check spelling</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <Card key={item.movie_id} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors">
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
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.content_type}
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
                      <span className="text-sm">{item.imdb_rating}</span>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-400 mb-3">
                    <Download size={12} className="mr-1" />
                    {(item.downloads || 0).toLocaleString()} downloads
                  </div>

                  {item.storyline && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-3">
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
