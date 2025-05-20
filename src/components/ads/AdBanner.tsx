
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdPlaceholder from './AdPlaceholder';

// Define valid position types
type AdPosition = 'top' | 'bottom' | 'side' | 'center';

interface AdBannerProps {
  position: string;
  className?: string;
}

const AdBanner = ({ position, className = '' }: AdBannerProps) => {
  const [ad, setAd] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .order('display_frequency', { ascending: false })
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Select a random ad from the results, weighted by display_frequency
          const totalWeight = data.reduce((sum: number, ad: any) => sum + (ad.display_frequency || 1), 0);
          let randomWeight = Math.random() * totalWeight;
          
          let selectedAd = data[0];
          for (const adItem of data) {
            randomWeight -= (adItem.display_frequency || 1);
            if (randomWeight <= 0) {
              selectedAd = adItem;
              break;
            }
          }
          
          setAd(selectedAd);
          
          // Track ad impression
          await supabase.from('analytics').insert({
            page_visited: `ad_impression_${position}`,
            browser: navigator.userAgent,
            device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            operating_system: navigator.platform
          });
        }
      } catch (err: any) {
        console.error("Error loading ad:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadAds();
  }, [position]);

  const handleAdClick = async () => {
    if (!ad) return;
    
    try {
      // Track ad click
      await supabase.from('analytics').insert({
        page_visited: `ad_click_${position}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
    } catch (err) {
      console.error("Error tracking ad click:", err);
    }
  };

  if (loading) {
    return <AdPlaceholder position={position as AdPosition} className={className} />;
  }

  if (error || !ad) {
    return <AdPlaceholder position={position as AdPosition} className={className} />;
  }

  return (
    <div className={`ad-container ${className}`}>
      <a 
        href={ad.target_url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="block w-full"
      >
        {ad.ad_type === 'banner' && ad.content_url && (
          <img 
            src={ad.content_url} 
            alt={ad.ad_name} 
            className="w-full rounded-lg shadow-lg"
          />
        )}
        
        {ad.ad_type === 'text' && (
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg text-center">
            <p className="font-semibold">{ad.ad_name}</p>
            <p className="text-sm text-blue-400 mt-2">{ad.content_url}</p>
          </div>
        )}
      </a>
      <div className="text-xs text-gray-500 text-right mt-1">Advertisement</div>
    </div>
  );
};

export default AdBanner;
