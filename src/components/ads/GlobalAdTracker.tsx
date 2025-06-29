
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Set up click tracking for every click
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickableElement = target.closest('a, button, [role="button"], [onclick]');
      
      if (isClickableElement) {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        
        // Show ad on every click (reduced frequency for better UX)
        if (newCount % 2 === 0) { // Every 2nd click instead of every click
          event.preventDefault();
          event.stopPropagation();
          showClickBasedAd();
          
          // Store the original action to execute after ad
          setTimeout(() => {
            const originalHref = (isClickableElement as HTMLAnchorElement).href;
            const originalClick = (isClickableElement as HTMLElement).onclick;
            
            if (originalHref && originalHref !== '#') {
              window.location.href = originalHref;
            } else if (originalClick) {
              originalClick.call(isClickableElement, event as any);
            }
          }, 3000); // Execute after 3 seconds
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
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

  const handleAdClick = async () => {
    if (currentClickAd?.target_url) {
      // Track ad click
      await supabase.from('analytics').insert({
        page_visited: `click_ad_click/${currentClickAd.ad_id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });

      window.open(currentClickAd.target_url, '_blank');
      closeClickAd();
    }
  };

  return (
    <>
      {showClickAd && currentClickAd && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeClickAd}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full z-10 text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
            
            <div 
              className="cursor-pointer"
              onClick={handleAdClick}
            >
              {currentClickAd.content_url ? (
                <img 
                  src={currentClickAd.content_url} 
                  alt={currentClickAd.ad_name || "Advertisement"}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 p-8 text-center text-gray-600 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{currentClickAd.ad_name || "Special Offer"}</h3>
                  <p>Click to learn more</p>
                </div>
              )}
            </div>
            
            <div className="p-4 text-center border-t">
              <p className="text-sm text-gray-500">Advertisement</p>
              <p className="text-xs text-gray-400 mt-1">Closes automatically in 3 seconds</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAdTracker;
