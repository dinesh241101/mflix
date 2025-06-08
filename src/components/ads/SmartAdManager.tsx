
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdBanner from './AdBanner';
import ClickAdModal from './ClickAdModal';

interface SmartAdManagerProps {
  position: string;
  className?: string;
  children?: React.ReactNode;
}

const SmartAdManager = ({ position, className = "", children }: SmartAdManagerProps) => {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    checkAdDisplay();
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
      const shouldDisplay = currentViews % ad.display_frequency === 0;
      
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

  if (!shouldShowAd || !adData) {
    return <>{children}</>;
  }

  // Handle different ad types
  if (adData.ad_type === 'inline' || adData.ad_type === 'native') {
    return (
      <div className={`ad-container ${className}`}>
        {children}
        <AdBanner position={position} className="my-4" />
      </div>
    );
  }

  if (adData.ad_type === 'popup' || adData.ad_type === 'modal') {
    return (
      <>
        {children}
        <ClickAdModal />
      </>
    );
  }

  // Default banner ad
  return (
    <div className={`ad-container ${className}`}>
      <AdBanner position={position} />
      {children}
    </div>
  );
};

export default SmartAdManager;
