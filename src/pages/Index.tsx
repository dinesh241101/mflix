
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, Download, Star, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import ShareLinks from "@/components/ShareLinks";
import AdBanner from "@/components/ads/AdBanner";
import MFlixLogo from "@/components/MFlixLogo";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [settings, setSettings] = useState({
    showLatestUploads: true,
    showTrendingMovies: true,
    showFeaturedContent: true,
    latestUploadsLimit: 12,
    trendingLimit: 8,
    featuredLimit: 6
  });

  useEffect(() => {
    // Load content display settings
    const savedSettings = localStorage.getItem('contentDisplaySettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
    
    fetchFeaturedMovies();
    fetchLatestMovies();
    fetchTrendingMovies();
  }, []);

  const fetchFeaturedMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .limit(settings.featuredLimit)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedMovies(data || []);
    } catch (error) {
      console.error("Error fetching featured movies:", error);
    }
  };

  const fetchLatestMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .limit(settings.latestUploadsLimit)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLatestMovies(data || []);
    } catch (error) {
      console.error("Error fetching latest movies:", error);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .limit(settings.trendingLimit)
        .order('downloads', { ascending: false });

      if (error) throw error;
      setTrendingMovies(data || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <MFlixLogo />
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, anime, web series..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Button 
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate("/movies")} className="text-white hover:text-blue-400">
                Movies
              </Button>
              <Button variant="ghost" onClick={() => navigate("/anime")} className="text-white hover:text-blue-400">
                Anime
              </Button>
              <Button variant="ghost" onClick={() => navigate("/web-series")} className="text-white hover:text-blue-400">
                TV Series
              </Button>
              <Button variant="ghost" onClick={() => navigate("/shorts")} className="text-white hover:text-blue-400">
                Shorts
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Featured Content */}
      {settings.showFeaturedContent && featuredMovies.length > 0 && (
        <section className="relative">
          <FeaturedMovieSlider movies={featuredMovies} />
        </section>
      )}

      {/* Quick Access CTA Buttons */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button 
            onClick={() => navigate("/movies")} 
            className="h-24 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex flex-col items-center justify-center space-y-2"
          >
            <Play size={32} />
            <span className="text-lg font-semibold">Browse Movies</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/anime")} 
            className="h-24 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex flex-col items-center justify-center space-y-2"
          >
            <Star size={32} />
            <span className="text-lg font-semibold">Watch Anime</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/web-series")} 
            className="h-24 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex flex-col items-center justify-center space-y-2"
          >
            <TrendingUp size={32} />
            <span className="text-lg font-semibold">TV Series</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/shorts")} 
            className="h-24 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex flex-col items-center justify-center space-y-2"
          >
            <Clock size={32} />
            <span className="text-lg font-semibold">Short Videos</span>
          </Button>
        </div>
      </section>

      <AdBanner position="banner" />

      {/* Latest Uploads */}
      {settings.showLatestUploads && (
        <section className="container mx-auto px-4 py-8">
          <LatestUploadsSection movies={latestMovies} />
        </section>
      )}

      {/* Trending Movies */}
      {settings.showTrendingMovies && trendingMovies.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="mr-2" size={24} />
              Trending Now
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/search?q=trending")}
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
            >
              View All
            </Button>
          </div>
          <MovieCarousel movies={trendingMovies} />
        </section>
      )}

      <AdBanner position="footer" />

      {/* Footer */}
      <footer className="bg-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <MFlixLogo />
              <p className="text-gray-400 mt-4">
                Your ultimate destination for movies, anime, and web series. Download and stream your favorite content in high quality.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto" onClick={() => navigate("/movies")}>
                  Movies
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto" onClick={() => navigate("/anime")}>
                  Anime
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto" onClick={() => navigate("/web-series")}>
                  Web Series
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto" onClick={() => navigate("/shorts")}>
                  Shorts
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Share & Connect</h3>
              <ShareLinks />
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MFlix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
