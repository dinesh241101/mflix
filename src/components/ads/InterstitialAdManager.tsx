
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InterstitialAd {
  id: string;
  ad_name: string;
  ad_content_url: string;
  target_url: string;
  display_duration: number;
  skip_after: number;
  trigger_event: string;
  is_active: boolean;
}

interface InterstitialAdManagerProps {
  triggerEvent: string;
  onAdClosed?: () => void;
}

const InterstitialAdManager = ({ triggerEvent, onAdClosed }: InterstitialAdManagerProps) => {
  const [currentAd, setCurrentAd] = useState<InterstitialAd | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    fetchInterstitialAd();
  }, [triggerEvent]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showAd && currentAd) {
      setCanSkip(true);
    }
  }, [countdown, showAd, currentAd]);

  const fetchInterstitialAd = async () => {
    try {
      const { data, error } = await supabase
        .from('interstitial_ads')
        .select('*')
        .eq('trigger_event', triggerEvent)
        .eq('is_active', true)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const ad = data[0];
        setCurrentAd(ad);
        setShowAd(true);
        setCountdown(ad.skip_after || 3);
        setCanSkip(false);
      }
    } catch (error) {
      console.error('Error fetching interstitial ad:', error);
    }
  };

  const handleAdClick = async () => {
    if (!currentAd) return;

    try {
      // Log the ad click
      await supabase.from('ad_clicks').insert({
        interstitial_ad_id: currentAd.id,
        referrer_page: window.location.pathname,
        user_agent: navigator.userAgent,
      });

      // Open target URL
      if (currentAd.target_url) {
        window.open(currentAd.target_url, '_blank');
      }
    } catch (error) {
      console.error('Error logging ad click:', error);
    }
  };

  const handleCloseAd = () => {
    setShowAd(false);
    setCurrentAd(null);
    setCountdown(0);
    setCanSkip(false);
    onAdClosed?.();
  };

  const handleSkipAd = () => {
    if (canSkip) {
      handleCloseAd();
    }
  };

  if (!currentAd || !showAd) {
    return null;
  }

  return (
    <Dialog open={showAd} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl w-full mx-4 p-0">
        <div className="relative">
          {/* Skip/Close Button */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
            {countdown > 0 && (
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Skip in {countdown}s
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={canSkip ? handleSkipAd : undefined}
              className={`text-white hover:bg-gray-800 ${!canSkip ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canSkip}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Ad Content */}
          <div 
            className="cursor-pointer"
            onClick={handleAdClick}
          >
            {currentAd.ad_content_url ? (
              <img
                src={currentAd.ad_content_url}
                alt={currentAd.ad_name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            ) : (
              <div className="bg-gray-800 p-12 text-center">
                <div className="text-white text-2xl font-bold mb-4">
                  {currentAd.ad_name}
                </div>
                <div className="text-gray-400">
                  Click to learn more
                </div>
              </div>
            )}
          </div>

          {/* Ad Label */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
              Advertisement
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterstitialAdManager;
