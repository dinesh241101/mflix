
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdBanner from './AdBanner';
import ClickAdModal from './ClickAdModal';

interface SmartAdManagerProps {
  children: React.ReactNode;
  position?: string;
  className?: string;
}

const SmartAdManager = ({ children, position = "general", className = "" }: SmartAdManagerProps) => {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    if (position) {
      checkAdDisplay();
    }
  }, [position]);

  const checkAdDisplay = async () => {
    try {
      // Get ad configuration for this position
      const { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .limit(1);

      if (error || !ads || ads.length === 0) return;

      const ad = ads[0];
      
      // Check display frequency
      const currentViews = parseInt(localStorage.getItem(`views_${position}`) || '0');
      const shouldDisplay = currentViews % (ad.display_frequency || 3) === 0;
      
      if (shouldDisplay) {
        setAdData(ad);
        setShouldShowAd(true);
        
        // Track impression
        await trackAdImpression(ad.ad_id);
      }
      
      // Update view count
      localStorage.setItem(`views_${position}`, (currentViews + 1).toString());
      
    } catch (error) {
      console.error('Error checking ad display:', error);
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
      console.error('Error tracking ad impression:', error);
    }
  };

  return (
    <div className={`ad-container ${className}`}>
      {children}
      {shouldShowAd && adData && (
        <div className="my-4">
          <AdBanner position={position} />
        </div>
      )}
      {shouldShowAd && adData?.ad_type === 'popup' && (
        <ClickAdModal />
      )}
    </div>
  );
};

export default SmartAdManager;
