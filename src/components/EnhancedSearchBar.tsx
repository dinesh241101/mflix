
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  movie_id: string;
  title: string;
  poster_url: string;
  content_type: string;
  year: number;
  genre: string[];
  imdb_rating: number;
}

interface EnhancedSearchBarProps {
  placeholder?: string;
  className?: string;
}

const EnhancedSearchBar = ({ placeholder = "Search movies, anime, web series...", className = "" }: EnhancedSearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, content_type, year, genre, imdb_rating')
          .or(`title.ilike.%${searchQuery}%,storyline.ilike.%${searchQuery}%,director.ilike.%${searchQuery}%,production_house.ilike.%${searchQuery}%`)
          .limit(8);

        if (error) throw error;

        // Enhanced search with SEO tags
        const { data: seoResults, error: seoError } = await supabase
          .from('movies')
          .select('movie_id, title, poster_url, content_type, year, genre, imdb_rating, seo_tags')
          .contains('seo_tags', [searchQuery.toLowerCase()])
          .limit(5);

        if (!seoError && seoResults) {
          const combinedResults = [...(data || []), ...seoResults].filter(
            (movie, index, self) => self.findIndex(m => m.movie_id === movie.movie_id) === index
          );
          setSearchResults(combinedResults);
        } else {
          setSearchResults(data || []);
        }
        
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full"
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Button 
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-6"
        >
          Search
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map((movie) => (
                <div
                  key={movie.movie_id}
                  onClick={() => handleResultClick(movie.movie_id)}
                  className="flex items-center p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                >
                  <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                    {movie.poster_url ? (
                      <img 
                        src={movie.poster_url} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={16} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{movie.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="capitalize">{movie.content_type}</span>
                      {movie.year && <span>• {movie.year}</span>}
                      {movie.imdb_rating && <span>• ⭐ {movie.imdb_rating}</span>}
                    </div>
                    {movie.genre && movie.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genre.slice(0, 3).map((g, i) => (
                          <span key={i} className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-3 border-t border-gray-700">
                <Button 
                  onClick={handleSearch}
                  variant="ghost" 
                  className="w-full text-blue-400 hover:text-blue-300"
                >
                  View all results for "{searchQuery}"
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
