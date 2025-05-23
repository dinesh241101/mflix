
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PopupAdProps {
  onClose: () => void;
}

const PopupAd = ({ onClose }: PopupAdProps) => {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchPopupAd = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('ad_type', 'popup')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setAd(data);
        }
      } catch (error) {
        console.error('Error fetching popup ad:', error);
      }
    };

    fetchPopupAd();
  }, []);

  const handleAdClick = () => {
    if (ad?.target_url) {
      // Track ad click
      supabase.from('analytics').insert({
        page_visited: `popup_ad_click/${ad.ad_id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });

      window.open(ad.target_url, '_blank');
    }
  };

  if (!ad) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div onClick={handleAdClick} className="cursor-pointer">
          {ad.content_url ? (
            <img 
              src={ad.content_url} 
              alt={ad.ad_name || "Advertisement"}
              className="w-full h-auto rounded"
            />
          ) : (
            <div className="bg-gray-200 p-8 text-center text-gray-600 rounded">
              {ad.ad_name || "Advertisement"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
