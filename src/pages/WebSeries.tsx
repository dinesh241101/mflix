import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import MFlixLogo from "@/components/MFlixLogo";
import LoadingScreen from "@/components/LoadingScreen";
import AdBanner from "@/components/ads/AdBanner";

const ITEMS_PER_PAGE = 12;

const WebSeries = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get query from URL if exists
  useEffect(() => {
    const query = searchParams.get("q");
    const genre = searchParams.get("genre");
    
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
    }
    
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [searchParams]);

  // Load all web series initially
  useEffect(() => {
    const fetchAllSeries = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('content_type', 'series');
          
        if (error) throw error;
        
        setAllSeries(data || []);
        
        // Extract unique genres
        const allGenres = data?.flatMap(item => item.genre || []) || [];
        const uniqueGenres = [...new Set(allGenres)].filter(Boolean).sort();
        setGenres(uniqueGenres);
        
        // Track analytics
        await supabase.from('analytics').insert({
          page_visited: 'web-series',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
        
        // Apply initial pagination
        const totalItems = data?.length || 0;
        setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
        
        const initialSeries = data?.slice(0, ITEMS_PER_PAGE) || [];
        setSeries(initialSeries);
      } catch (error) {
        console.error("Error loading web series:", error);
        toast({
          title: "Error",
          description: "Failed to load web series. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchAllSeries();
  }, [toast]);

  // Filter and paginate series whenever filters change
  useEffect(() => {
    if (initialLoading) return;
    
    let filteredSeries = [...allSeries];
    
    // Apply genre filter
    if (selectedGenre) {
      filteredSeries = filteredSeries.filter(item => 
        item.genre && item.genre.includes(selectedGenre)
      );
    }
    
    // Apply search filter
    if (searchQuery && isSearching) {
      filteredSeries = filteredSeries.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.storyline && item.storyline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.genre && item.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (item.seo_tags && item.seo_tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Update total pages
    const totalItems = filteredSeries.length;
    setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedSeries = filteredSeries.slice(startIndex, endIndex);
    setSeries(paginatedSeries);
  }, [selectedGenre, searchQuery, isSearching, currentPage, initialLoading, allSeries]);

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
          const localSuggestions = allSeries
            .filter(series => 
              series.title.toLowerCase().includes(query.toLowerCase()) ||
              (series.genre && series.genre.some((g: string) => g.toLowerCase().includes(query.toLowerCase()))) ||
              (series.seo_tags && series.seo_tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())))
            )
            .slice(0, 5);
            
          setSearchSuggestions(localSuggestions);
          
          // Then fetch from API for more comprehensive results
          const { data: searchResults, error } = await supabase.rpc<any>('search_series', { 
            search_term: query.toLowerCase()
          });
          
          if (!error && searchResults && Array.isArray(searchResults)) {
            setSearchSuggestions(searchResults.slice(0, 5));
          }
        } catch (error) {
          console.error("Error searching series:", error);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Update search params in URL
      if (selectedGenre) {
        setSearchParams({ q: searchQuery, genre: selectedGenre });
      } else {
        setSearchParams({ q: searchQuery });
      }
      
      setIsSearching(true);
      setCurrentPage(1);
      
      try {
        setLoading(true);
        toast({
          title: "Searching",
          description: `Finding results for: "${searchQuery}"`,
        });
        
        // API call for search using the stored procedure
        const { data: searchResults, error } = await supabase.rpc<any>('search_series', { 
          search_term: searchQuery.toLowerCase()
        });
        
        if (error) {
          console.error("Search error:", error);
          
          // Fallback to client-side filtering
          const results = allSeries.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.storyline && item.storyline.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.genre && item.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (item.seo_tags && item.seo_tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          );
          
          // Apply genre filter if selected
          let filteredResults = results;
          if (selectedGenre) {
            filteredResults = results.filter(item => 
              item.genre && item.genre.includes(selectedGenre)
            );
          }
          
          setSeries(filteredResults.slice(0, ITEMS_PER_PAGE));
          setTotalPages(Math.ceil(filteredResults.length / ITEMS_PER_PAGE));
          
          if (filteredResults.length === 0) {
            toast({
              title: "No Results",
              description: `No web series found matching '${searchQuery}' ${selectedGenre ? `in ${selectedGenre} genre` : ''}`,
            });
          }
        } else if (searchResults && Array.isArray(searchResults)) {
          // Use API results
          let filteredData = searchResults;
          
          // Apply genre filter if selected
          if (selectedGenre) {
            filteredData = searchResults.filter((item: any) => 
              item.genre && item.genre.includes(selectedGenre)
            );
          }
          
          setSeries(filteredData.slice(0, ITEMS_PER_PAGE));
          setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
          
          if (filteredData.length === 0) {
            toast({
              title: "No Results",
              description: selectedGenre 
                ? `No web series found matching '${searchQuery}' in ${selectedGenre} genre`
                : `No web series found matching '${searchQuery}'`,
            });
          } else {
            toast({
              title: "Search Results",
              description: `Found ${filteredData.length} results for "${searchQuery}"`,
            });
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
        setSearchSuggestions([]);
      }
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Handle genre selection
  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    
    // Update URL params
    if (genre) {
      if (searchQuery) {
        setSearchParams({ q: searchQuery, genre });
      } else {
        setSearchParams({ genre });
      }
    } else if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    if (selectedGenre) {
      setSearchParams({ genre: selectedGenre });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSelectedGenre(null);
    setSearchParams({});
    setCurrentPage(1);
  };

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <MFlixLogo />
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
                <li><Link to="/web-series" className="hover:text-blue-400 font-bold text-blue-400">Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400">Anime</Link></li>
              </ul>
            </nav>
            <div className="md:hidden">
              <button className="text-white">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
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
              placeholder="Search web series by title, genre, tags..." 
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
                          <Tv size={16} className="text-gray-500" />
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

      {/* Ad banner top */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner position="series_top" />
      </div>

      {/* Page Title & Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isSearching ? `Results for: "${searchQuery}"` : selectedGenre ? `${selectedGenre} Web Series` : 'Web Series'}
          </h1>
          
          {/* Mobile Filter Toggle */}
          <button 
            className="md:hidden flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-lg"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={16} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <p className="text-gray-400 mt-2">
          Watch the latest and most popular web series online
        </p>
      </div>

      {/* Genres Filter - Mobile Variant */}
      <section className={`md:hidden py-4 overflow-x-auto ${filtersOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold mb-2">Select Genre</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                selectedGenre === null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All Series
            </button>
            
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                  selectedGenre === genre ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Genres Filter - Desktop */}
      <section className="hidden md:block py-4 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                selectedGenre === null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              All Series
            </button>
            
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                  selectedGenre === genre ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Filters */}
      {(isSearching || selectedGenre !== null) && (
        <section className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400">Active filters:</span>
            {isSearching && (
              <div className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                <span>Search: {searchQuery}</span>
                <button onClick={clearSearch} className="ml-1 text-blue-300 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedGenre && (
              <div className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                <span>Genre: {selectedGenre}</span>
                <button onClick={() => handleGenreSelect(null)} className="ml-1 text-blue-300 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}
            {(isSearching || selectedGenre) && (
              <button 
                onClick={clearAllFilters} 
                className="text-sm text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>
      )}

      {/* Loading indicator */}
      {loading && !initialLoading && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        </div>
      )}

      {/* Web Series Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {series.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {series.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  {/* Insert ad banner after every 3 items */}
                  {index > 0 && index % 3 === 0 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 h-24 my-2">
                      <AdBanner position={`series_after_${index}`} className="w-full h-full" />
                    </div>
                  )}
                
                  <Link to={`/movie/${item.id}`}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                      <div className="h-56 bg-gray-700 relative">
                        {item.poster_url ? (
                          <img 
                            src={item.poster_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tv size={32} className="text-gray-500" />
                          </div>
                        )}
                        {item.imdb_rating && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                            IMDb {item.imdb_rating}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white truncate">{item.title}</h3>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                          <div>
                            {item.year && <span>{item.year}</span>}
                          </div>
                          {item.downloads > 0 && (
                            <div>{item.downloads.toLocaleString()} downloads</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tv size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl">No web series found</h3>
              <p className="text-gray-400 mt-2">
                {selectedGenre 
                  ? `No web series found in the ${selectedGenre} genre.` 
                  : isSearching 
                    ? `No results found for "${searchQuery}".` 
                    : 'Try adjusting your filters or search'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
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
          )}
        </div>
      </section>

      {/* Ad banner bottom */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner position="series_bottom" />
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

export default WebSeries;
