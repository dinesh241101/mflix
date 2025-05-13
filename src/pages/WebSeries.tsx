
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { Search, Home, Film, Tv, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import MFlixLogo from "@/components/MFlixLogo";
import MovieGrid from "@/components/MovieGrid";

const WebSeries = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState<string[]>([]);
  const [showShorts, setShowShorts] = useState(false);

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

  if (loading) {
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
                <li><Link to="/movies" className="hover:text-blue-400 flex items-center"><Film className="mr-1" size={16} /> Movies</Link></li>
                <li><Link to="/web-series" className="text-blue-400 flex items-center"><Tv className="mr-1" size={16} /> Web Series</Link></li>
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
              placeholder="Search web series by title, description..." 
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

      {/* Genre Filter */}
      <section className="py-4 container mx-auto px-4">
        <h2 className="text-xl font-bold mb-3">Filter by Genre</h2>
        <div className="flex flex-wrap gap-2">
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
      <MovieGrid 
        movies={filteredSeries} 
        title="All Web Series" 
      />

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
