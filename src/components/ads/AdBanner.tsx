
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdBannerProps {
  position: string;
  className?: string;
}

const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setAd(data);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [position]);

  const handleAdClick = () => {
    if (ad?.target_url) {
      // Track ad click
      supabase.from('analytics').insert({
        page_visited: `ad_click/${ad.ad_id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });

      window.open(ad.target_url, '_blank');
    }
  };

  if (loading || !ad) {
    return null;
  }

  return (
    <div className={`ad-banner ${className}`}>
      <div 
        className="cursor-pointer"
        onClick={handleAdClick}
      >
        {ad.content_url ? (
          <img 
            src={ad.content_url} 
            alt={ad.ad_name || "Advertisement"}
            className="w-full h-auto"
          />
        ) : (
          <div className="bg-gray-200 p-4 text-center text-gray-600">
            {ad.ad_name || "Advertisement"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
