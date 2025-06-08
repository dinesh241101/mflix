
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Star, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import ShareLinks from "@/components/ShareLinks";
import MFlixLogo from "@/components/MFlixLogo";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import ImprovedFeaturedSlider from "@/components/ImprovedFeaturedSlider";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <MFlixLogo />
            
            {/* Enhanced Search Bar */}
            <EnhancedSearchBar className="flex-1 max-w-2xl mx-8" />

            {/* Navigation - Hidden on small screens */}
            {!isMobile && (
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
            )}
          </div>
          
          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex justify-center mt-4 space-x-4 overflow-x-auto">
              <Button variant="ghost" onClick={() => navigate("/movies")} className="text-white hover:text-blue-400 whitespace-nowrap">
                Movies
              </Button>
              <Button variant="ghost" onClick={() => navigate("/anime")} className="text-white hover:text-blue-400 whitespace-nowrap">
                Anime
              </Button>
              <Button variant="ghost" onClick={() => navigate("/web-series")} className="text-white hover:text-blue-400 whitespace-nowrap">
                TV Series
              </Button>
              <Button variant="ghost" onClick={() => navigate("/shorts")} className="text-white hover:text-blue-400 whitespace-nowrap">
                Shorts
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Header Banner Ad */}
      <ResponsiveAdPlaceholder position="header-banner" />

      {/* Hero Section with Featured Content */}
      {settings.showFeaturedContent && featuredMovies.length > 0 && (
        <section className="relative">
          <ImprovedFeaturedSlider movies={featuredMovies} />
        </section>
      )}

      {/* Content Top Ad */}
      <div className="container mx-auto px-4 py-4">
        <ResponsiveAdPlaceholder position="content-top" />
      </div>

      {/* Quick Access CTA Buttons */}
      <section className="container mx-auto px-4 py-8">
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          <Button 
            onClick={() => navigate("/movies")} 
            className="h-20 md:h-24 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex flex-col items-center justify-center space-y-2"
          >
            <Play size={isMobile ? 24 : 32} />
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'}`}>Browse Movies</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/anime")} 
            className="h-20 md:h-24 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex flex-col items-center justify-center space-y-2"
          >
            <Star size={isMobile ? 24 : 32} />
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'}`}>Watch Anime</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/web-series")} 
            className="h-20 md:h-24 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex flex-col items-center justify-center space-y-2"
          >
            <TrendingUp size={isMobile ? 24 : 32} />
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'}`}>TV Series</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/shorts")} 
            className="h-20 md:h-24 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex flex-col items-center justify-center space-y-2"
          >
            <Clock size={isMobile ? 24 : 32} />
            <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'}`}>Short Videos</span>
          </Button>
        </div>
      </section>

      {/* In-Content Ad */}
      <div className="container mx-auto px-4 py-4">
        <ResponsiveAdPlaceholder position="in-content" />
      </div>

      {/* Latest Uploads */}
      {settings.showLatestUploads && (
        <section className="container mx-auto px-4 py-8">
          <LatestUploadsSection 
            movies={latestMovies} 
            title="Latest Uploads"
          />
        </section>
      )}

      {/* Content Middle Ad */}
      <div className="container mx-auto px-4 py-4">
        <ResponsiveAdPlaceholder position="content-middle" />
      </div>

      {/* Trending Movies */}
      {settings.showTrendingMovies && trendingMovies.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-bold flex items-center ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              <TrendingUp className="mr-2" size={isMobile ? 20 : 24} />
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
          
          {/* Trending Movies Grid */}
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}`}>
            {trendingMovies.map((movie: any) => (
              <div 
                key={movie.movie_id}
                onClick={() => navigate(`/movie/${movie.movie_id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                  {movie.poster_url ? (
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="text-gray-500" size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className={`text-white font-semibold mb-1 line-clamp-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {movie.title}
                      </h3>
                      {movie.year && (
                        <p className="text-gray-300 text-xs">{movie.year}</p>
                      )}
                      {movie.genre && movie.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {movie.genre.slice(0, 2).map((g: string, i: number) => (
                            <span key={i} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Bottom Ad */}
      <div className="container mx-auto px-4 py-4">
        <ResponsiveAdPlaceholder position="content-bottom" />
      </div>

      {/* Floating Ad */}
      <ResponsiveAdPlaceholder position="floating" />

      {/* Mobile Sticky Ad */}
      {isMobile && <ResponsiveAdPlaceholder position="mobile-sticky" />}

      {/* Footer */}
      <footer className="bg-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
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
              <ShareLinks 
                url={window.location.href}
                title="MFlix - Movies, Anime & Web Series"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MFlix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Footer Banner Ad */}
      <ResponsiveAdPlaceholder position="footer" />
    </div>
  );
};

export default Index;
