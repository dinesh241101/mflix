
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import Pagination from "@/components/Pagination";

const WebSeries = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSeries();
  }, [currentPage]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'series')
        .eq('is_visible', true);

      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

      // Get paginated data
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setSeries(data || []);
    } catch (error: any) {
      console.error("Error fetching web series:", error);
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
      <HeaderWithAds />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Web Series</h1>
          </div>

          {/* Ad Banner */}
          <ClickableAdBanner position="series_top" className="mb-8" />

          {series.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No Web Series Found</h2>
              <p className="text-gray-400">Check back later for new series!</p>
            </div>
          ) : (
            <>
              <EnhancedMovieGrid 
                movies={series} 
                title="Latest Web Series"
                showTitle={false}
              />

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}

          {/* Bottom Ad */}
          <ClickableAdBanner position="series_bottom" className="mt-8" />
        </div>
      </div>
    </UniversalAdsWrapper>
  );
};

export default WebSeries;
