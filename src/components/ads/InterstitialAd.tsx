
import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  triggerEvent: string;
}

const InterstitialAd = ({ isOpen, onClose, onComplete, triggerEvent }: InterstitialAdProps) => {
  const [ad, setAd] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInterstitialAd();
    }
  }, [isOpen, triggerEvent]);

  useEffect(() => {
    if (ad && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown - 1 <= 0) {
          setCanClose(true);
        }
        if (countdown - 1 <= (ad.display_duration - ad.skip_after)) {
          setCanSkip(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, ad]);

  const fetchInterstitialAd = async () => {
    try {
      const { data, error } = await supabase
        .from('interstitial_ads')
        .select('*')
        .eq('trigger_event', triggerEvent)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setAd(data);
        setCountdown(data.display_duration || 5);
        setCanSkip(false);
        setCanClose(false);
        
        // Track impression
        await supabase.from('ad_clicks').insert({
          interstitial_ad_id: data.id,
          user_agent: navigator.userAgent,
          referrer_page: window.location.pathname
        });
      } else {
        // No ad found, allow immediate completion
        onComplete();
      }
    } catch (error) {
      console.error('Error fetching interstitial ad:', error);
      onComplete();
    }
  };

  const handleAdClick = async () => {
    if (ad?.target_url) {
      try {
        await supabase.from('ad_clicks').insert({
          interstitial_ad_id: ad.id,
          user_agent: navigator.userAgent,
          referrer_page: window.location.pathname
        });
        
        window.open(ad.target_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error tracking ad click:', error);
      }
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      onComplete();
    }
  };

  const handleClose = () => {
    if (canClose) {
      onComplete();
    } else {
      onClose();
    }
  };

  if (!isOpen || !ad) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 relative">
        {/* Close button - only show if can close */}
        {canClose && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={handleClose}
          >
            <X size={20} />
          </Button>
        )}
        
        {/* Countdown timer */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
          <Clock size={14} />
          {countdown}s
        </div>
        
        {/* Ad content */}
        <div 
          className="w-full h-80 bg-gray-100 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleAdClick}
        >
          {ad.ad_content_url ? (
            <img 
              src={ad.ad_content_url} 
              alt={ad.ad_name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{ad.ad_name}</h2>
              <p className="text-gray-600">Click to learn more</p>
            </div>
          )}
        </div>
        
        {/* Skip button */}
        <div className="p-4 flex justify-center">
          <Button
            onClick={handleSkip}
            disabled={!canSkip}
            className={`${canSkip ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {canSkip ? 'Skip Ad' : `Skip in ${countdown}s`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;
