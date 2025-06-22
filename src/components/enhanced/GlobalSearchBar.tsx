
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Gamepad2, Clock } from 'lucide-react';
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
  imdb_rating: number;
  downloads: number;
}

interface GlobalSearchBarProps {
  placeholder?: string;
  className?: string;
}

const GlobalSearchBar = ({ 
  placeholder = "Search movies, series, anime...", 
  className = "" 
}: GlobalSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const searchContent = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        if (query.trim().length === 0) {
          setIsOpen(recentSearches.length > 0);
        }
        return;
      }

      setLoading(true);
      try {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        // Multi-layered search for best results
        const { data: titleResults, error: titleError } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, year, content_type, genre, country, imdb_rating, downloads')
          .eq('is_visible', true)
          .ilike('title', `%${query}%`)
          .order('downloads', { ascending: false })
          .limit(5);

        const { data: partialResults, error: partialError } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, year, content_type, genre, country, imdb_rating, downloads')
          .eq('is_visible', true)
          .or(searchTerms.map(term => `title.ilike.%${term}%`).join(','))
          .order('downloads', { ascending: false })
          .limit(8);

        const { data: genreResults, error: genreError } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, year, content_type, genre, country, imdb_rating, downloads')
          .eq('is_visible', true)
          .overlaps('genre', searchTerms.map(term => term.charAt(0).toUpperCase() + term.slice(1)))
          .order('downloads', { ascending: false })
          .limit(6);

        // Combine and deduplicate results
        const allResults = [
          ...(titleResults || []),
          ...(partialResults || []),
          ...(genreResults || [])
        ];

        const uniqueResults = allResults.filter(
          (movie, index, self) => self.findIndex(m => m.movie_id === movie.movie_id) === index
        );

        // Score and sort results
        const scoredResults = uniqueResults.map(movie => {
          let score = 0;
          const title = movie.title.toLowerCase();
          const queryLower = query.toLowerCase();

          if (title === queryLower) score += 100;
          else if (title.startsWith(queryLower)) score += 80;
          else if (title.includes(queryLower)) score += 60;

          searchTerms.forEach(term => {
            if (title.includes(term)) score += 20;
          });

          if (movie.genre) {
            searchTerms.forEach(term => {
              if (movie.genre.some(g => g.toLowerCase().includes(term))) {
                score += 15;
              }
            });
          }

          score += Math.log(movie.downloads + 1);
          if (movie.imdb_rating) score += movie.imdb_rating;

          return { ...movie, score };
        });

        const sortedResults = scoredResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);

        setResults(sortedResults);
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
  }, [query, recentSearches.length]);

  const handleResultClick = (result: SearchResult) => {
    const route = result.content_type === 'anime' ? `/anime/${result.movie_id}` : 
                  result.content_type === 'series' ? `/series/${result.movie_id}` : 
                  `/movie/${result.movie_id}`;
    navigate(route);
    setIsOpen(false);
    setQuery('');
    addToRecentSearches(result.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      addToRecentSearches(query.trim());
      setQuery('');
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'anime': return <Gamepad2 size={16} className="text-purple-400" />;
      case 'series': return <Tv size={16} className="text-blue-400" />;
      default: return <Film size={16} className="text-green-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            onFocus={() => (query.length >= 2 || recentSearches.length > 0) && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-600 z-50 max-h-96 overflow-y-auto shadow-xl">
          <CardContent className="p-2">
            {loading ? (
              <div className="text-center py-4 text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs text-gray-500 uppercase tracking-wide">
                  Search Results
                </div>
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
                        <div className="w-full h-full flex items-center justify-center bg-gray-600">
                          {getContentIcon(result.content_type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate flex-1">{result.title}</h4>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {result.content_type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {result.year && <span>{result.year}</span>}
                        {result.country && <span>• {result.country}</span>}
                        {result.imdb_rating && (
                          <span className="flex items-center">
                            • ⭐ {result.imdb_rating}
                          </span>
                        )}
                      </div>
                      
                      {result.genre && result.genre.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {result.genre.slice(0, 2).map((genre, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-400">
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
            ) : recentSearches.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Recent Searches</span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer rounded transition-colors"
                  >
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-gray-300">{search}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearchBar;
