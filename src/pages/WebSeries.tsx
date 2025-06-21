
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import UniversalHeader from "@/components/universal/UniversalHeader";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import LoadingScreen from "@/components/LoadingScreen";

const WebSeries = () => {
  const isMobile = useIsMobile();
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(24);
      
      if (seriesError) throw seriesError;
      setSeries(seriesData || []);
      
    } catch (error: any) {
      console.error("Error fetching series:", error);
      toast({
        title: "Error",
        description: "Failed to load web series",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Web Series..." />;
  }

  return (
    <UniversalAdsWrapper>
      <UniversalHeader />

      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Content Top Ad */}
        <ClickableAdBanner position="content-top" />
        
        {/* Series Grid */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">Latest Web Series</h1>
          
          {series.length > 0 ? (
            <EnhancedMovieGrid 
              movies={series} 
              title="" 
              showAds={true}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No web series found</p>
            </div>
          )}
        </div>
        
        {/* Content Bottom Ad */}
        <ClickableAdBanner position="content-bottom" />
      </main>
    </UniversalAdsWrapper>
  );
};

export default WebSeries;
