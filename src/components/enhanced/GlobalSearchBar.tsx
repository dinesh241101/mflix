
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Gamepad2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  movie_id: string;
  title: string;
  poster_url: string;
  year: number;
  content_type: string;
  genre: string[];
  country: string;
}

const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, year, content_type, genre, country')
          .or(`title.ilike.%${query}%,genre.cs.{${query}},country.ilike.%${query}%,seo_tags.cs.{${query}}`)
          .limit(8);

        if (error) throw error;
        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    const route = result.content_type === 'anime' ? `/anime/${result.movie_id}` : 
                  result.content_type === 'series' ? `/series/${result.movie_id}` : 
                  `/movie/${result.movie_id}`;
    navigate(route);
    setIsOpen(false);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'anime': return <Gamepad2 size={16} />;
      case 'series': return <Tv size={16} />;
      default: return <Film size={16} />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, anime..."
            className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-600 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="text-center py-4 text-gray-400">Searching...</div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <div
                    key={result.movie_id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="w-12 h-16 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                      {result.poster_url ? (
                        <img
                          src={result.poster_url}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getContentIcon(result.content_type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate">{result.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {result.content_type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {result.year && <span>{result.year}</span>}
                        {result.country && <span>• {result.country}</span>}
                      </div>
                      
                      {result.genre && result.genre.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {result.genre.slice(0, 2).map((genre, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {query.trim() && (
                  <div
                    onClick={handleSubmit}
                    className="p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors border-t border-gray-600 mt-2"
                  >
                    <div className="flex items-center gap-2 text-blue-400">
                      <Search size={16} />
                      <span>Search for "{query}" in all results</span>
                    </div>
                  </div>
                )}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="text-center py-4 text-gray-400">
                No results found for "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearchBar;
