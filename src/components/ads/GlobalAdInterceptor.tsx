
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import InterstitialAd from './InterstitialAd';

interface GlobalAdInterceptorProps {
  children: React.ReactNode;
}

const GlobalAdInterceptor = ({ children }: GlobalAdInterceptorProps) => {
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [adSettings, setAdSettings] = useState<any>({});

  useEffect(() => {
    fetchAdSettings();
    
    // Override global click events
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickable = target.closest('a, button, [role="button"]');
      
      if (isClickable && shouldShowInterstitialAd()) {
        event.preventDefault();
        event.stopPropagation();
        
        // Store the original action
        const originalHref = (isClickable as HTMLAnchorElement).href;
        const originalOnClick = (isClickable as HTMLElement).onclick;
        
        setPendingAction(() => () => {
          if (originalHref) {
            window.location.href = originalHref;
          } else if (originalOnClick) {
            originalOnClick.call(isClickable, event as any);
          }
        });
        
        setShowInterstitialAd(true);
        setClickCount(prev => prev + 1);
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [clickCount, adSettings]);

  const fetchAdSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_settings')
        .select('*');
      
      if (!error && data) {
        const settings = data.reduce((acc: any, setting: any) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {});
        setAdSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching ad settings:', error);
    }
  };

  const shouldShowInterstitialAd = () => {
    const frequency = parseInt(adSettings.interstitial_frequency || '3');
    return clickCount > 0 && clickCount % frequency === 0;
  };

  const handleAdClose = () => {
    setShowInterstitialAd(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <>
      {children}
      {showInterstitialAd && (
        <InterstitialAd
          isOpen={showInterstitialAd}
          onClose={handleAdClose}
          triggerEvent="global_click"
        />
      )}
    </>
  );
};

export default GlobalAdInterceptor;
