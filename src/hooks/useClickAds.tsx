
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClickAdConfig {
  clicksBeforeAd: number;
  enabled: boolean;
}

export const useClickAds = (config: ClickAdConfig = { clicksBeforeAd: 1, enabled: true }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);

  useEffect(() => {
    if (!config.enabled) return;

    const handleClick = async () => {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      if (newClickCount >= config.clicksBeforeAd) {
        await fetchAndShowAd();
        setClickCount(0);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [clickCount, config]);

  const fetchAndShowAd = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .eq('position', 'click_based')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setCurrentAd(data);
        setShowAd(true);
        
        // Track ad impression
        await supabase.from('analytics').insert({
          page_visited: 'click_ad_impression',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          operating_system: navigator.platform
        });
      }
    } catch (error) {
      console.error('Error fetching click ad:', error);
    }
  };

  const closeAd = () => {
    setShowAd(false);
    setCurrentAd(null);
  };

  const handleAdClick = async () => {
    if (currentAd?.target_url) {
      // Track ad click
      await supabase.from('analytics').insert({
        page_visited: 'click_ad_click',
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });

      window.open(currentAd.target_url, '_blank');
      closeAd();
    }
  };

  return {
    showAd,
    currentAd,
    closeAd,
    handleAdClick,
    clickCount
  };
};
