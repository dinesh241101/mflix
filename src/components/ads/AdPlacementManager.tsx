
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface AdPlacement {
  id: string;
  page_type: string;
  position: string;
  ad_type: string;
  is_active: boolean;
}

interface AdContent {
  ad_id: string;
  ad_name: string;
  ad_type: string;
  content_url: string;
  target_url: string;
  is_active: boolean;
}

interface AdPlacementManagerProps {
  pageType: string;
  position: string;
  className?: string;
}

const AdPlacementManager = ({ pageType, position, className = "" }: AdPlacementManagerProps) => {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const [adContent, setAdContent] = useState<AdContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdPlacements();
    fetchAdContent();
  }, [pageType, position]);

  const fetchAdPlacements = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .eq('page_type', pageType)
        .eq('position', position)
        .eq('is_active', true);

      if (error) throw error;
      setAdPlacements(data || []);
    } catch (error) {
      console.error('Error fetching ad placements:', error);
    }
  };

  const fetchAdContent = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setAdContent(data || []);
    } catch (error) {
      console.error('Error fetching ad content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (adId: string, targetUrl?: string) => {
    try {
      // Log the ad click
      await supabase.from('ad_clicks').insert({
        ad_id: adId,
        referrer_page: window.location.pathname,
        user_agent: navigator.userAgent,
        user_ip: null // This would need to be set server-side
      });

      // Redirect if target URL exists
      if (targetUrl) {
        window.open(targetUrl, '_blank');
      }
    } catch (error) {
      console.error('Error logging ad click:', error);
    }
  };

  if (loading || adPlacements.length === 0) {
    return null;
  }

  const activeAd = adContent.find(ad => 
    adPlacements.some(placement => placement.ad_type === ad.ad_type)
  );

  if (!activeAd) {
    return null;
  }

  return (
    <div className={`ad-placement ${className}`}>
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">Advertisement</div>
            {activeAd.content_url && (
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleAdClick(activeAd.ad_id, activeAd.target_url)}
              >
                <img
                  src={activeAd.content_url}
                  alt={activeAd.ad_name}
                  className="w-full h-auto rounded-md"
                  loading="lazy"
                />
              </div>
            )}
            {!activeAd.content_url && (
              <div 
                className="bg-gray-700 p-6 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleAdClick(activeAd.ad_id, activeAd.target_url)}
              >
                <div className="text-white font-semibold">{activeAd.ad_name}</div>
                <div className="text-gray-400 text-sm mt-1">Click to learn more</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPlacementManager;
