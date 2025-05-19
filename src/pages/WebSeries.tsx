
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tv, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MFlixLogo from "@/components/MFlixLogo";
import LoadingScreen from "@/components/LoadingScreen";
import AdBanner from "@/components/ads/AdBanner";

const ITEMS_PER_PAGE = 12;

const WebSeries = () => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Load web series
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchSeries(1, selectedGenre);
        await fetchGenres();
      } catch (error) {
        console.error("Error loading web series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenre]);

  // Fetch web series with pagination
  const fetchSeries = async (page = 1, genre: string | null = null) => {
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('movies')
        .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
        .eq('content_type', 'series');
        
      if (genre) {
        query = query.contains('genre', [genre]);
      }
      
      // Get total count for pagination
      const { count, error: countError } = await query.select('id', { count: 'exact' });
        
      if (countError) throw countError;
      
      // Calculate total pages
      const totalPageCount = Math.ceil((count || 0) / ITEMS_PER_PAGE);
      setTotalPages(totalPageCount || 1);
      
      // Fetch paginated data
      const { data, error } = await query.range(from, to);
      
      if (error) throw error;
      setSeries(data || []);
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Error loading web series:", error);
    }
  };

  // Fetch unique genres
  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('genre')
        .eq('content_type', 'series');
        
      if (error) throw error;
      
      // Extract and flatten all genres
      const allGenres = data?.flatMap(item => item.genre || []) || [];
      
      // Get unique genres
      const uniqueGenres = [...new Set(allGenres)].filter(Boolean).sort();
      setGenres(uniqueGenres);
      
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  // Handle genre selection
  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MFlixLogo />
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
                <li><Link to="/series" className="hover:text-blue-400 font-bold text-blue-400">Web Series</Link></li>
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
              placeholder="Search web series..." 
              className="w-full py-2 pl-10 pr-20 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Ad banner top */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner position="series_top" />
      </div>

      {/* Genres Filter */}
      <section className="py-4 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2">
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

      {/* Page Title */}
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold">
          {selectedGenre ? `${selectedGenre} Web Series` : 'Web Series'}
        </h1>
        <p className="text-gray-400 mt-2">
          Watch the latest and most popular web series online
        </p>
      </div>

      {/* Web Series Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {series.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {series.map((item) => (
                <Link key={item.id} to={`/movie/${item.id}`}>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tv size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl">No web series found</h3>
              <p className="text-gray-400 mt-2">
                {selectedGenre 
                  ? `No web series found in the ${selectedGenre} genre.` 
                  : 'Try adjusting your filters or search'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => fetchSeries(Math.max(1, currentPage - 1), selectedGenre)}
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
                        onClick={() => fetchSeries(pageNum, selectedGenre)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => fetchSeries(Math.min(totalPages, currentPage + 1), selectedGenre)}
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
