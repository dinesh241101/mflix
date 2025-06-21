
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import UniversalHeader from "@/components/universal/UniversalHeader";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import LoadingScreen from "@/components/LoadingScreen";

const Movies = () => {
  const isMobile = useIsMobile();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(24);
      
      if (moviesError) throw moviesError;
      setMovies(moviesData || []);
      
    } catch (error: any) {
      console.error("Error fetching movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Movies..." />;
  }

  return (
    <UniversalAdsWrapper>
      <UniversalHeader />

      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Content Top Ad */}
        <ClickableAdBanner position="content-top" />
        
        {/* Movies Grid */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">Latest Movies</h1>
          
          {movies.length > 0 ? (
            <EnhancedMovieGrid 
              movies={movies} 
              title="" 
              showAds={true}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies found</p>
            </div>
          )}
        </div>
        
        {/* Content Bottom Ad */}
        <ClickableAdBanner position="content-bottom" />
      </main>
    </UniversalAdsWrapper>
  );
};

export default Movies;
