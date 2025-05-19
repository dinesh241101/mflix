

import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { Search, Home, Film, Tv, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import MFlixLogo from "@/components/MFlixLogo";
import MovieGrid from "@/components/MovieGrid";
import AdBanner from "@/components/ads/AdBanner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const Movies = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState<string[]>([]);
  const [showShorts, setShowShorts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get query from URL if exists
  useEffect(() => {
    const query = searchParams.get("q");
    const genre = searchParams.get("genre");
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (genre && genre !== "All") {
      setSelectedGenre(genre);
    }
  }, [searchParams]);

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('content_type', 'movie')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAllMovies(data || []);
        
        // Apply pagination
        const totalItems = data?.length || 0;
        setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
        
        // Apply initial pagination
        const paginatedMovies = data?.slice(0, ITEMS_PER_PAGE) || [];
        setMovies(paginatedMovies);
        
        // Extract unique genres
        const allGenres = data?.flatMap(movie => movie.genre || []) || [];
        const uniqueGenres = [...new Set(allGenres)];
        setGenres(["All", ...uniqueGenres]);
        
        // Track analytics
        await supabase.from('analytics').insert({
          page_visited: 'movies',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    
    fetchMovies();
  }, [toast]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // If we're searching or filtering by genre, paginate the filtered results
    let dataToSlice = allMovies;
    
    if (selectedGenre !== "All") {
      dataToSlice = allMovies.filter(movie => movie.genre?.includes(selectedGenre));
    }
    
    if (searchQuery && isSearching) {
      dataToSlice = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (movie.storyline && movie.storyline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.genre && movie.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (movie.seo_tags && movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    const paginatedMovies = dataToSlice.slice(startIndex, endIndex);
    setMovies(paginatedMovies);
    
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Filter movies by genre
  useEffect(() => {
    if (initialLoading) return;
    
    let filteredMovies = [...allMovies];
    
    if (selectedGenre !== "All") {
      filteredMovies = filteredMovies.filter(movie => movie.genre?.includes(selectedGenre));
    }
    
    if (searchQuery && isSearching) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (movie.storyline && movie.storyline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.genre && movie.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (movie.seo_tags && movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    const totalFilteredItems = filteredMovies.length;
    setTotalPages(Math.ceil(totalFilteredItems / ITEMS_PER_PAGE));
    
    // Reset to first page when filters change
    setCurrentPage(1);
    setMovies(filteredMovies.slice(0, ITEMS_PER_PAGE));
  }, [selectedGenre, isSearching, searchQuery, initialLoading, allMovies]);

  // Handle search suggestions
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length >= 2) {
      // Set timeout for search suggestions to avoid too many API calls
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Generate search suggestions from local data first (for quick response)
          const localSuggestions = allMovies
            .filter(movie => 
              movie.title.toLowerCase().includes(query.toLowerCase()) ||
              (movie.genre && movie.genre.some((g: string) => g.toLowerCase().includes(query.toLowerCase()))) ||
              (movie.seo_tags && movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())))
            )
            .slice(0, 5);
            
          setSearchSuggestions(localSuggestions);
          
          // Then fetch from API for more comprehensive results
          const { data: searchResults, error } = await supabase.rpc<any[]>('search_movies', { 
            search_term: query.toLowerCase()
          });
          
          if (error) {
            console.error("Error in search suggestions:", error);
            return;
          }
          
          if (searchResults && Array.isArray(searchResults)) {
            // Search for movies by title
            const titleMatches = searchResults.filter(movie => 
              movie.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            
            // Search for movies by genre
            const genreMatches = searchResults.filter(movie =>
              movie.genre && movie.genre.some((g: string) => g.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 3);
            
            // Search for movies by content_type
            const typeMatches = searchResults.filter(movie =>
              movie.content_type.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3);
            
            // Search for movies by seo_tags
            const tagMatches = searchResults.filter(movie =>
              movie.seo_tags && movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 3);
            
            // Combine results, remove duplicates by id
            const allMatches = [...titleMatches, ...genreMatches, ...typeMatches, ...tagMatches];
            const uniqueMatches = Array.from(new Map(allMatches.map(item => [item.id, item])).values());
            
            setSearchSuggestions(uniqueMatches.slice(0, 5));
          }
        } catch (error) {
          console.error("Error searching movies:", error);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params in URL
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setIsSearching(true);
      
      try {
        setLoading(true);
        toast({
          title: "Searching",
          description: `Finding results for: "${searchQuery}"`,
        });
        
        // API call for search using the stored procedure
        const { data: searchResults, error } = await supabase.rpc<any[]>('search_movies', { 
          search_term: searchQuery.toLowerCase()
        });
        
        if (error) {
          console.error("Search error:", error);
          
          // Fallback to client-side filtering if API fails
          const results = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (movie.storyline && movie.storyline.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (movie.genre && movie.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (movie.seo_tags && movie.seo_tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          );
          
          setMovies(results.slice(0, ITEMS_PER_PAGE));
          setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
          
          if (results.length === 0) {
            toast({
              title: "No Results",
              description: `No movies found matching '${searchQuery}'`,
            });
          } else {
            toast({
              title: "Search Results",
              description: `Found ${results.length} results for "${searchQuery}"`,
            });
          }
        } else if (searchResults && Array.isArray(searchResults)) {
          // Use API results
          setMovies(searchResults.slice(0, ITEMS_PER_PAGE));
          setTotalPages(Math.ceil(searchResults.length / ITEMS_PER_PAGE));
          
          if (searchResults.length === 0) {
            toast({
              title: "No Results",
              description: `No movies found matching '${searchQuery}'`,
            });
          } else {
            toast({
              title: "Search Results",
              description: `Found ${searchResults.length} results for "${searchQuery}"`,
            });
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Search Error",
          description: "Failed to perform search. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setSearchSuggestions([]);
      }
    }
  };

  // Handle genre filter change
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    if (genre !== "All") {
      setSearchParams({ genre: genre });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchParams({});
    handlePageChange(1);
  };

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <MFlixLogo />
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400 flex items-center"><Home className="mr-1" size={16} /> Home</Link></li>
                <li><Link to="/movies" className="text-blue-400 flex items-center"><Film className="mr-1" size={16} /> Movies</Link></li>
                <li><Link to="/web-series" className="hover:text-blue-400 flex items-center"><Tv className="mr-1" size={16} /> Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400 flex items-center"><Tv className="mr-1" size={16} /> Anime</Link></li>
                <li>
                  <button 
                    onClick={() => setShowShorts(true)} 
                    className="hover:text-blue-400 flex items-center"
                  >
                    <Video className="mr-1" size={16} /> Shorts
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="py-4 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search movies by title, description..." 
              className="w-full py-2 pl-10 pr-20 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
            >
              Search
            </Button>
            
            {/* Search Suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                {searchSuggestions.map((item) => (
                  <Link 
                    key={item.id}
                    to={`/movie/${item.id}`}
                    className="flex items-center p-3 hover:bg-gray-700 border-b border-gray-700 last:border-0"
                  >
                    <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden mr-3">
                      {item.poster_url ? (
                        <img 
                          src={item.poster_url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={16} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <div className="text-xs text-gray-400">
                        {item.year && <span>{item.year} • </span>}
                        <span className="capitalize">{item.content_type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <div className="p-2 text-center border-t border-gray-700">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearch(e as unknown as React.FormEvent);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner position="movies_top" />
      </div>

      {/* Genre Filter */}
      <section className="py-4 container mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">Filter by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreChange(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>

      {/* Active Filters */}
      {(isSearching || selectedGenre !== "All") && (
        <section className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Active filters:</span>
            {isSearching && (
              <div className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                <span>Search: {searchQuery}</span>
                <button onClick={clearSearch} className="ml-1 text-blue-300 hover:text-white">×</button>
              </div>
            )}
            {selectedGenre !== "All" && (
              <div className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                <span>Genre: {selectedGenre}</span>
                <button onClick={() => handleGenreChange("All")} className="ml-1 text-blue-300 hover:text-white">×</button>
              </div>
            )}
            {(isSearching || selectedGenre !== "All") && (
              <button 
                onClick={() => {
                  clearSearch();
                  handleGenreChange("All");
                }} 
                className="text-sm text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="container mx-auto px-4">
        <MovieGrid 
          movies={movies} 
          title={isSearching ? `Search Results for "${searchQuery}"` : selectedGenre !== "All" ? `${selectedGenre} Movies` : "All Movies"} 
        />

        {/* Ad Banner */}
        <div className="my-8">
          <AdBanner position="movies_grid" />
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="py-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => handlePageChange(pageNum)} 
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner position="movies_bottom" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2025 MFlix. All rights reserved.</p>
            <p className="mt-2">Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Movies;
