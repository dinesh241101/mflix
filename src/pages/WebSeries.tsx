
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { Search, Home, Film, Tv, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import MFlixLogo from "@/components/MFlixLogo";
import MovieGrid from "@/components/MovieGrid";
import { Input } from "@/components/ui/input";

const WebSeries = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState<string[]>([]);
  const [showShorts, setShowShorts] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch web series data
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('content_type', 'series')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setSeries(data || []);
        
        // Extract unique genres
        const allGenres = data?.flatMap(series => series.genre || []) || [];
        const uniqueGenres = [...new Set(allGenres)];
        setGenres(["All", ...uniqueGenres]);
        
        // Track analytics
        await supabase.from('analytics').insert({
          page_visited: 'web-series',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
      } catch (error) {
        console.error("Error fetching web series:", error);
        toast({
          title: "Error",
          description: "Failed to load web series. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeries();
  }, [toast]);

  // Filter series by genre
  const filteredSeries = selectedGenre === "All"
    ? series
    : series.filter(s => s.genre?.includes(selectedGenre));

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    toast({
      title: "Search",
      description: `Searching for: ${searchQuery}`,
    });
    
    // Filter series by search query
    const results = series.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.storyline && s.storyline.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: `No web series found matching '${searchQuery}'`,
      });
    } else {
      setSeries(results);
      setSelectedGenre("All");
    }
  };

  // Reset search
  const handleResetSearch = async () => {
    setSearchQuery("");
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSeries(data || []);
      setSelectedGenre("All");
    } catch (error) {
      console.error("Error resetting search:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
            <Link to="/" className="flex justify-center">
              <MFlixLogo />
            </Link>
            <nav className={isMobile ? "overflow-x-auto" : ""}>
              <ul className={`flex ${isMobile ? 'justify-between space-x-4' : 'space-x-6'}`}>
                <li><Link to="/" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Home className="mr-1" size={16} /> Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Film className="mr-1" size={16} /> Movies</Link></li>
                <li><Link to="/web-series" className="text-blue-400 flex items-center whitespace-nowrap"><Tv className="mr-1" size={16} /> Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Tv className="mr-1" size={16} /> Anime</Link></li>
                <li>
                  <Link to="/shorts" className="hover:text-blue-400 flex items-center whitespace-nowrap">
                    <Video className="mr-1" size={16} /> Shorts
                  </Link>
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
            <Input 
              type="text" 
              placeholder="Search web series by title, description..." 
              className="w-full py-2 pl-10 pr-20 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              {searchQuery && (
                <Button 
                  type="button"
                  onClick={handleResetSearch}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              )}
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Genre Filter */}
      <section className="py-4 container mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">Filter by Genre</h2>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>

      {/* Web Series Grid */}
      <div className="container mx-auto px-4">
        <MovieGrid 
          movies={filteredSeries} 
          title="All Web Series" 
        />
        
        {filteredSeries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-lg mb-4">No web series found</p>
            <Button onClick={handleResetSearch} variant="outline">
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Ads Placement Example */}
      <div className="container mx-auto px-4 my-6">
        <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4 flex justify-center items-center h-28">
          <p className="text-blue-300">Banner Ad Placement</p>
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

export default WebSeries;
