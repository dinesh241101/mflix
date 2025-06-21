
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import UniversalHeader from "@/components/universal/UniversalHeader";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import LoadingScreen from "@/components/LoadingScreen";

const Anime = () => {
  const isMobile = useIsMobile();
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      
      const { data: animeData, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(24);
      
      if (animeError) throw animeError;
      setAnime(animeData || []);
      
    } catch (error: any) {
      console.error("Error fetching anime:", error);
      toast({
        title: "Error",
        description: "Failed to load anime",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Anime..." />;
  }

  return (
    <UniversalAdsWrapper>
      <UniversalHeader />

      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Content Top Ad */}
        <ClickableAdBanner position="content-top" />
        
        {/* Anime Grid */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">Latest Anime</h1>
          
          {anime.length > 0 ? (
            <EnhancedMovieGrid 
              movies={anime} 
              title="" 
              showAds={true}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No anime found</p>
            </div>
          )}
        </div>
        
        {/* Content Bottom Ad */}
        <ClickableAdBanner position="content-bottom" />
      </main>
    </UniversalAdsWrapper>
  );
};

export default Anime;
