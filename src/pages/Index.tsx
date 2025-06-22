import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import EnhancedHeader from "@/components/universal/EnhancedHeader";
import GlobalAdInterceptor from "@/components/ads/GlobalAdInterceptor";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import ImprovedFeaturedSlider from "@/components/ImprovedFeaturedSlider";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

const Index = () => {
  const isMobile = useIsMobile();
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        .eq('is_visible', true)
        .limit(5);
      
      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);
      
      // Fetch latest movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (moviesError) throw moviesError;
      setMovies(moviesData || []);
      
      // Fetch latest series
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (seriesError) throw seriesError;
      setSeries(seriesData || []);
      
      // Fetch latest anime
      const { data: animeData, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .eq('is_visible', true)
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
    <GlobalAdInterceptor>
      <UniversalAdsWrapper>
        <EnhancedHeader />

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
      </UniversalAdsWrapper>
    </GlobalAdInterceptor>
  );
};

export default Index;
