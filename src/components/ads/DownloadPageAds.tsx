
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

interface DownloadPageAdsProps {
  page: 'download-1' | 'download-2' | 'download-3';
  className?: string;
}

const DownloadPageAds = ({ page, className = "" }: DownloadPageAdsProps) => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageAds();
  }, [page]);

  const fetchPageAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .or(`position.eq.${page},position.eq.global`)
        .order('display_frequency', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching download page ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-700 h-32 rounded-lg"></div>;
  }

  return (
    <div className={`download-page-ads space-y-4 ${className}`}>
      {/* Top Banner Ad */}
      <ResponsiveAdPlaceholder 
        position="top-banner" 
        title="Download Page Advertisement"
        className="mb-6"
      />

      {/* Side Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponsiveAdPlaceholder 
          position="sidebar" 
          title="Sponsored Content"
        />
        <ResponsiveAdPlaceholder 
          position="sidebar" 
          title="Featured Offers"
        />
      </div>

      {/* Content Middle Ad */}
      <ResponsiveAdPlaceholder 
        position="content-middle" 
        title="Special Promotion"
        className="my-8"
      />

      {/* Floating Ad for Mobile */}
      <div className="lg:hidden">
        <ResponsiveAdPlaceholder 
          position="mobile-sticky" 
          title="Mobile Ad"
        />
      </div>

      {/* Bottom Banner */}
      <ResponsiveAdPlaceholder 
        position="bottom-banner" 
        title="Download Page Footer Ad"
        className="mt-6"
      />
    </div>
  );
};

export default DownloadPageAds;
