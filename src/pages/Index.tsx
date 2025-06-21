
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Play, Film, Tv, Gamepad2, Video, Users, User, LogIn, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImprovedFeaturedSlider from "@/components/ImprovedFeaturedSlider";
import GlobalSearchBar from "@/components/enhanced/GlobalSearchBar";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch featured movies
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .limit(5);
      
      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);
      
      // Fetch latest movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (moviesError) throw moviesError;
      setMovies(moviesData || []);
      
      // Fetch latest series
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (seriesError) throw seriesError;
      setSeries(seriesData || []);
      
      // Fetch latest anime
      const { data: animeData, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (animeError) throw animeError;
      setAnime(animeData || []);
      
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-400">MFlix</h1>
              
              {!isMobile && (
                <nav className="flex space-x-6">
                  <Button variant="ghost" onClick={() => navigate('/movies')}>
                    <Film className="mr-2" size={16} />
                    Movies
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/web-series')}>
                    <Tv className="mr-2" size={16} />
                    Series
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/anime')}>
                    <Gamepad2 className="mr-2" size={16} />
                    Anime
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/shorts')}>
                    <Video className="mr-2" size={16} />
                    Shorts
                  </Button>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {!isMobile && <GlobalSearchBar />}
              
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              )}
              
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-gray-700 pt-4">
              <div className="mb-4">
                <GlobalSearchBar />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/movies');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Film size={24} className="mb-2" />
                  <span className="text-sm">Movies</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/web-series');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Tv size={24} className="mb-2" />
                  <span className="text-sm">Series</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/anime');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Gamepad2 size={24} className="mb-2" />
                  <span className="text-sm">Anime</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigate('/shorts');
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Video size={24} className="mb-2" />
                  <span className="text-sm">Shorts</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Top Banner Ad */}
      <ResponsiveAdPlaceholder position="header-banner" />

      {/* Featured Movies Slider */}
      {featuredMovies.length > 0 && (
        <ImprovedFeaturedSlider movies={featuredMovies} />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Content Top Ad */}
        <ResponsiveAdPlaceholder position="content-top" />
        
        {/* Latest Movies */}
        {movies.length > 0 && (
          <EnhancedMovieGrid 
            movies={movies} 
            title="Latest Movies" 
            showAds={true}
          />
        )}
        
        {/* Content Middle Ad */}
        <ResponsiveAdPlaceholder position="content-middle" />
        
        {/* Latest Series */}
        {series.length > 0 && (
          <EnhancedMovieGrid 
            movies={series} 
            title="Latest Web Series" 
            showAds={true}
          />
        )}
        
        {/* Latest Anime */}
        {anime.length > 0 && (
          <EnhancedMovieGrid 
            movies={anime} 
            title="Latest Anime" 
            showAds={true}
          />
        )}
        
        {/* Content Bottom Ad */}
        <ResponsiveAdPlaceholder position="content-bottom" />
      </main>

      {/* Sidebar Ad (Desktop only) */}
      {!isMobile && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
          <ResponsiveAdPlaceholder position="sidebar" />
        </div>
      )}

      {/* Mobile Sticky Ad */}
      {isMobile && (
        <ResponsiveAdPlaceholder position="mobile-sticky" />
      )}

      {/* Floating Ad */}
      <ResponsiveAdPlaceholder position="floating" />

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <ResponsiveAdPlaceholder position="footer" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 MFlix. All rights reserved.</p>
            <p className="text-sm mt-2">
              Watch and download the latest movies, TV series, and anime.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
