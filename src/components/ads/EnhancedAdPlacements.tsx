
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdPlacement from "./AdPlacement";

interface EnhancedAdPlacementsProps {
  pageType: string;
  position: string;
  className?: string;
}

const EnhancedAdPlacements = ({ pageType, position, className = "" }: EnhancedAdPlacementsProps) => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [pageType, position]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .or(`position.eq.${position},position.eq.global`)
        .order('display_frequency', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || ads.length === 0) {
    return null;
  }

  return (
    <div className={`ad-placements ${className}`}>
      {ads.map((ad) => (
        <AdPlacement
          key={ad.ad_id}
          position={position}
          pageType={pageType}
        />
      ))}
    </div>
  );
};

export default EnhancedAdPlacements;
