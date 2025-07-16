
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdBanner from "./AdBanner";
import InterstitialAd from "./InterstitialAd";
import { cn } from "@/lib/utils";

interface AdPlacementProps {
  position: string;
  pageType: string;
  className?: string;
}

const AdPlacement = ({ position, pageType, className }: AdPlacementProps) => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [position, pageType]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString().split('T')[0])
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString().split('T')[0]}`);

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleAdClick = (ad: any) => {
    // Track ad click
    supabase
      .from('ad_clicks')
      .insert({
        ad_id: ad.ad_id,
        referrer_page: window.location.pathname,
        user_ip: 'unknown', // Would need IP detection service
        user_agent: navigator.userAgent
      })
      .then(() => {
        // Update click count
        supabase
          .from('ads')
          .update({ clicks: (ad.clicks || 0) + 1 })
          .eq('ad_id', ad.ad_id);
      });

    // Open target URL
    if (ad.target_url) {
      window.open(ad.target_url, '_blank');
    }
  };

  const showNextAd = () => {
    if (ads.length > 1) {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }
  };

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(showNextAd, 10000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  // Show interstitial ads on certain actions
  const triggerInterstitialAd = () => {
    const interstitialAds = ads.filter(ad => ad.ad_type === 'interstitial');
    if (interstitialAds.length > 0) {
      setShowInterstitial(true);
    }
  };

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  if (!currentAd) {
    return null;
  }

  return (
    <div className={cn("ad-placement", className)}>
      {currentAd.ad_type === 'banner' && (
        <AdBanner
          src={currentAd.content_url}
          alt={currentAd.ad_name}
          href={currentAd.target_url}
          onClick={() => handleAdClick(currentAd)}
        />
      )}
      
      {currentAd.ad_type === 'video' && (
        <div className="relative">
          <video
            src={currentAd.content_url}
            autoPlay
            muted
            controls
            className="w-full rounded-lg"
            onEnded={showNextAd}
          >
            Your browser does not support video playback.
          </video>
          {currentAd.target_url && (
            <button
              onClick={() => handleAdClick(currentAd)}
              className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Learn More
            </button>
          )}
        </div>
      )}

      {showInterstitial && (
        <InterstitialAd
          isOpen={showInterstitial}
          onClose={() => setShowInterstitial(false)}
          onComplete={() => setShowInterstitial(false)}
          triggerEvent="page_load"
        />
      )}
    </div>
  );
};

export default AdPlacement;
