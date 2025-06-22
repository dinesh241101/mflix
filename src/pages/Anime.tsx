import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import GlobalAdInterceptor from "@/components/ads/GlobalAdInterceptor";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 24;

const Anime = () => {
  const isMobile = useIsMobile();
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchAnime(currentPage);
  }, [currentPage]);

  const fetchAnime = async (page: number = 1) => {
    try {
      setLoading(true);
      
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data: animeData, error: animeError, count } = await supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .eq('content_type', 'anime')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (animeError) throw animeError;
      
      setAnime(animeData || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      
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

  if (loading && currentPage === 1) {
    return <LoadingScreen message="Loading Anime..." />;
  }

  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Content Top Ad */}
        <ClickableAdBanner position="content-top" />
        
        {/* Anime Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Latest Anime</h1>
            <span className="text-gray-400 text-sm">
              {totalCount} anime found
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : anime.length > 0 ? (
            <>
              <EnhancedMovieGrid 
                movies={anime} 
                title="" 
                showAds={true}
              />
              
              {/* Pagination */}
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
