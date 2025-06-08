
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedAdBannerProps {
  position: string;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'responsive';
  showLabel?: boolean;
}

const EnhancedAdBanner = ({ 
  position, 
  className = "", 
  size = 'responsive',
  showLabel = true 
}: EnhancedAdBannerProps) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [impressionTracked, setImpressionTracked] = useState(false);

  useEffect(() => {
    fetchAd();
  }, [position]);

  const fetchAd = async () => {
    try {
      // Get active ads for this position
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
        // Check targeting criteria
        const deviceType = /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
        const isTargeted = data.target_devices.includes('All') || data.target_devices.includes(deviceType);
        
        if (isTargeted) {
          setAd(data);
          
          // Track impression only once per page load
          if (!impressionTracked) {
            trackAdImpression(data.ad_id);
            setImpressionTracked(true);
          }
        }
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
    if (ad?.target_url) {
      // Track ad click
      await supabase.from('analytics').insert({
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

  const getAdTypeClasses = () => {
    switch (ad.ad_type) {
      case 'floating':
        return 'fixed bottom-4 right-4 z-40 shadow-lg';
      case 'sticky':
        return 'sticky top-0 z-30';
      case 'sidebar':
        return 'fixed left-4 top-1/2 transform -translate-y-1/2 z-30';
      default:
        return 'relative';
    }
  };

  return (
    <div className={`enhanced-ad-banner ${getAdTypeClasses()} ${className}`}>
      <div 
        className={`${getSizeClasses()} cursor-pointer rounded-lg overflow-hidden border border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50`}
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
        
        {/* Ad overlay with type indicator */}
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
            {ad.ad_type.toUpperCase()}
          </span>
        </div>

        {/* Click indicator */}
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

export default EnhancedAdBanner;
