
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ad } from "lucide-react";

interface AdBannerProps {
  position: string;
  className?: string;
}

const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const [adContent, setAdContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

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
        
        if (error) {
          console.error("Error fetching ad:", error);
          setShowPlaceholder(true);
          return;
        }
        
        if (data) {
          // Check display frequency (simplified implementation)
          const viewCount = parseInt(localStorage.getItem(`ad_view_count_${position}`) || '0');
          if (viewCount % data.display_frequency === 0) {
            setAdContent(data);
            
            // Log ad impression (in a real app, you'd send this to analytics)
            console.log(`Ad impression: ${data.name} in position ${position}`);
          } else {
            setShowPlaceholder(true);
          }
          
          // Update view count
          localStorage.setItem(`ad_view_count_${position}`, (viewCount + 1).toString());
        } else {
          // No ad found for this position, show placeholder
          setShowPlaceholder(true);
        }
      } catch (error) {
        console.error("Error in ad banner:", error);
        setShowPlaceholder(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAd();
  }, [position]);

  const handleAdClick = () => {
    if (adContent) {
      // Track ad click (in a real app, send to analytics)
      console.log(`Ad clicked: ${adContent.name}`);
      
      // Open target URL in new tab
      window.open(adContent.target_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={`ad-banner-placeholder ${className} h-24 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center`}>
        <Ad className="text-gray-700" size={24} />
      </div>
    );
  }

  if (adContent) {
    return (
      <div 
        className={`ad-banner ${className} cursor-pointer overflow-hidden rounded-lg`}
        onClick={handleAdClick}
      >
        <div className="relative">
          <img 
            src={adContent.content_url} 
            alt={`${adContent.name} - Advertisement`} 
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-1 right-1 bg-gray-800/70 text-xs px-1 rounded">
            Ad
          </div>
        </div>
      </div>
    );
  }

  if (showPlaceholder) {
    return (
      <div className={`ad-banner-placeholder ${className} bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center`}>
        <Ad className="text-gray-700 mb-2" size={24} />
        <p className="text-gray-600 text-sm text-center">Ad Space Available</p>
        <p className="text-gray-600 text-xs text-center">Position: {position}</p>
      </div>
    );
  }

  return null;
};

export default AdBanner;
