
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ClickableAdBannerProps {
  position: string;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'responsive';
  showLabel?: boolean;
}

const ClickableAdBanner = ({ 
  position, 
  className = "", 
  size = 'responsive',
  showLabel = true 
}: ClickableAdBannerProps) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [position]);

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString().split('T')[0])
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString().split('T')[0]}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setAd(data);
        trackAdImpression(data.ad_id);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackAdImpression = async (adId: string) => {
    try {
      await supabase.from('analytics').insert({
        page_visited: `ad_impression/${adId}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const handleAdClick = async () => {
    if (!ad?.target_url) return;
    
    try {
      // Track ad click
      await supabase.from('ad_clicks').insert({
        ad_id: ad.ad_id,
        user_ip: null, // Will be handled by server
        user_agent: navigator.userAgent,
        referrer_page: window.location.pathname
      });

      // Update ad clicks count
      await supabase
        .from('ads')
        .update({ clicks: (ad.clicks || 0) + 1 })
        .eq('ad_id', ad.ad_id);

      // Open target URL
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking ad click:', error);
      // Still open the link even if tracking fails
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading || !ad) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-16 max-w-sm';
      case 'medium':
        return 'h-32 max-w-md';
      case 'large':
        return 'h-48 max-w-lg';
      default:
        return 'min-h-20 w-full';
    }
  };

  return (
    <div className={`clickable-ad-banner ${className}`}>
      <div 
        className={`${getSizeClasses()} cursor-pointer rounded-lg overflow-hidden border border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300`}
        onClick={handleAdClick}
      >
        {ad.content_url ? (
          <img 
            src={ad.content_url} 
            alt={ad.ad_name || "Advertisement"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="font-semibold text-gray-800 mb-2">{ad.ad_name}</h3>
            <p className="text-sm text-gray-600">{ad.description || "Click to learn more"}</p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            Click to visit
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">Advertisement</span>
        </div>
      )}
    </div>
  );
};

export default ClickableAdBanner;
