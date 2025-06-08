
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ClickAdModal from './ClickAdModal';

const GlobalAdTracker = () => {
  const location = useLocation();
  const [showClickAd, setShowClickAd] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [currentClickAd, setCurrentClickAd] = useState<any>(null);

  useEffect(() => {
    // Reset click count on page change
    setClickCount(0);
    
    // Track page view
    trackPageView();
    
    // Set up click tracking
    const handleClick = () => {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // Check if we should show click-based ad (every 3 clicks)
      if (newCount % 3 === 0) {
        showClickBasedAd();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname, clickCount]);

  const trackPageView = async () => {
    try {
      await supabase.from('analytics').insert({
        page_visited: location.pathname,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const showClickBasedAd = async () => {
    try {
      const { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', 'click_based')
        .eq('is_active', true)
        .limit(1);

      if (!error && ads && ads.length > 0) {
        setCurrentClickAd(ads[0]);
        setShowClickAd(true);
        
        // Track click-based ad impression
        await supabase.from('analytics').insert({
          page_visited: `click_ad_impression/${ads[0].ad_id}`,
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          operating_system: navigator.platform
        });
      }
    } catch (error) {
      console.error('Error showing click-based ad:', error);
    }
  };

  const closeClickAd = () => {
    setShowClickAd(false);
    setCurrentClickAd(null);
  };

  return (
    <>
      {showClickAd && currentClickAd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            <button
              onClick={closeClickAd}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full z-10 text-gray-600"
            >
              ✕
            </button>
            
            <div 
              className="cursor-pointer"
              onClick={() => {
                if (currentClickAd.target_url) {
                  window.open(currentClickAd.target_url, '_blank');
                  closeClickAd();
                }
              }}
            >
              {currentClickAd.content_url ? (
                <img 
                  src={currentClickAd.content_url} 
                  alt={currentClickAd.ad_name || "Advertisement"}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 p-8 text-center text-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{currentClickAd.ad_name}</h3>
                  <p>Click to learn more</p>
                </div>
              )}
            </div>
            
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Advertisement - Click count: {clickCount}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAdTracker;
