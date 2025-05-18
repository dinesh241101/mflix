
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdBannerProps {
  position: string;
  className?: string;
}

const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const [adContent, setAdContent] = useState<any>(null);
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
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Error fetching ad:", error);
          }
          return;
        }
        
        if (data) {
          // Check display frequency (simplified implementation)
          const viewCount = parseInt(localStorage.getItem(`ad_view_count_${position}`) || '0');
          if (viewCount % data.display_frequency === 0) {
            setAdContent(data);
            
            // Log ad impression (in a real app, you'd send this to analytics)
            console.log(`Ad impression: ${data.name} in position ${position}`);
          }
          
          // Update view count
          localStorage.setItem(`ad_view_count_${position}`, (viewCount + 1).toString());
        }
      } catch (error) {
        console.error("Error in ad banner:", error);
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

  if (loading || !adContent) {
    return null;
  }

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
};

export default AdBanner;
