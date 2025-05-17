
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdPlaceholder from './AdPlaceholder';
import { resetClickCounters, getDownloadClickCount } from '@/utils/adLogic';

// Enhanced ad data structure
interface Ad {
  id: string;
  type: 'banner' | 'sidebar' | 'popup' | 'floating' | 'video' | 'native';
  position: string;
  imageUrl: string;
  title: string;
  description: string;
  targetUrl: string;
  videoUrl?: string;
  pages: string[];
  targetCountries?: string[];
  targetDevices?: string[];
  startDate?: string;
  endDate?: string | null;
  displayFrequency: number;
  lastShownTimestamp?: number;
}

// In a real app, these would come from your database
const MOCK_ADS: Ad[] = [
  {
    id: '1',
    type: 'banner',
    position: 'bottom',
    imageUrl: 'https://via.placeholder.com/800x200?text=Movie+Streaming+Service',
    title: 'Premium Streaming',
    description: 'Get unlimited access to thousands of movies',
    targetUrl: 'https://example.com/premium',
    pages: ['/', '/movies', '/web-series'],
    targetCountries: ['US', 'CA', 'UK'],
    targetDevices: ['desktop', 'mobile'],
    displayFrequency: 2
  },
  {
    id: '2',
    type: 'sidebar',
    position: 'side',
    imageUrl: 'https://via.placeholder.com/300x600?text=New+Release',
    title: 'New Releases',
    description: 'Check out the latest movies added this week',
    targetUrl: 'https://example.com/new-releases',
    pages: ['/', '/movies', '/movie/*'],
    targetCountries: ['US', 'UK', 'AU'],
    targetDevices: ['mobile'],
    displayFrequency: 3
  },
  {
    id: '3',
    type: 'floating',
    position: 'bottom',
    imageUrl: 'https://via.placeholder.com/400x300?text=Special+Offer',
    title: 'Limited Time Offer',
    description: 'Subscribe now and get 30% off your first month!',
    targetUrl: 'https://example.com/special-offer',
    pages: ['/', '/movies', '/web-series', '/anime'],
    displayFrequency: 1
  },
  {
    id: '4',
    type: 'video',
    position: 'center',
    imageUrl: 'https://via.placeholder.com/640x360?text=Video+Ad',
    videoUrl: 'https://example.com/sample-ad-video.mp4',
    title: 'New Movie Trailer',
    description: 'Watch the trailer for the latest blockbuster',
    targetUrl: 'https://example.com/movie-trailer',
    pages: ['/movies', '/movie/*'],
    displayFrequency: 4
  },
  {
    id: '5',
    type: 'native',
    position: 'inline',
    imageUrl: 'https://via.placeholder.com/200x200?text=Recommended',
    title: 'Recommended Content',
    description: 'Based on your viewing history, you might enjoy these movies',
    targetUrl: 'https://example.com/recommendations',
    pages: ['/', '/movies', '/web-series', '/movie/*'],
    displayFrequency: 2
  }
];

const AdManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('');
  const [triggerNavAd, setTriggerNavAd] = useState(false);
  const [displayedAds, setDisplayedAds] = useState<Record<string, number>>({});
  
  // Reset counters when component mounts
  useEffect(() => {
    // In a real app, you might want to persist the counters
    resetClickCounters();
  }, []);
  
  // Track navigation changes
  useEffect(() => {
    if (currentPath && currentPath !== location.pathname) {
      setTriggerNavAd(true);
      setTimeout(() => setTriggerNavAd(false), 100);
    }
    setCurrentPath(location.pathname);
  }, [location.pathname, currentPath]);
  
  // Get user's country based on browser language (in a real app, use geolocation API or IP-based detection)
  const getUserCountry = (): string => {
    const lang = navigator.language;
    if (lang.includes('-')) {
      return lang.split('-')[1];
    }
    return 'US'; // Default
  };
  
  // Get user's device type
  const getUserDevice = (): string => {
    return /mobile|tablet|android|iphone|ipad|ipod/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  };
  
  // Check if ad should be shown based on targeting
  const isAdEligibleForUser = (ad: Ad): boolean => {
    const userCountry = getUserCountry();
    const userDevice = getUserDevice();
    
    // Country targeting
    if (ad.targetCountries && ad.targetCountries.length > 0) {
      if (!ad.targetCountries.includes(userCountry)) {
        return false;
      }
    }
    
    // Device targeting
    if (ad.targetDevices && ad.targetDevices.length > 0) {
      if (!ad.targetDevices.includes(userDevice)) {
        return false;
      }
    }
    
    // Date range targeting
    const now = new Date();
    if (ad.startDate && new Date(ad.startDate) > now) {
      return false;
    }
    if (ad.endDate && new Date(ad.endDate) < now) {
      return false;
    }
    
    // Frequency capping
    if (displayedAds[ad.id]) {
      const timeSinceLastShown = Date.now() - displayedAds[ad.id];
      // Don't show the same ad more than once every 5 minutes (300000ms)
      const minimumInterval = 300000 / ad.displayFrequency;
      if (timeSinceLastShown < minimumInterval) {
        return false;
      }
    }
    
    return true;
  };
  
  // Filter ads based on current path and targeting
  const getAdsForCurrentPage = () => {
    return MOCK_ADS.filter(ad => {
      // First check if ad is eligible based on targeting rules
      if (!isAdEligibleForUser(ad)) {
        return false;
      }
      
      // Then check if the ad is eligible for current page
      return ad.pages.some(page => {
        if (page.endsWith('*')) {
          // Handle wildcard paths like '/movie/*'
          const basePath = page.slice(0, -1);
          return location.pathname.startsWith(basePath);
        }
        return page === location.pathname;
      });
    });
  };
  
  const handleAdDisplay = (adId: string) => {
    setDisplayedAds(prev => ({
      ...prev,
      [adId]: Date.now()
    }));
  };
  
  const eligibleAds = getAdsForCurrentPage();
  
  // Only render on frontend pages, not admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <>
      {/* Navigation triggered ad */}
      {triggerNavAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AdPlaceholder 
            type="banner"
            isNavigation={true}
            adContent={{
              id: "nav-ad",
              imageUrl: "https://via.placeholder.com/800x400?text=Special+Offer",
              title: "Special Navigation Offer",
              description: "This appears when you navigate between pages",
              targetUrl: "#"
            }}
            onAdClick={() => {
              // In a real app, track this click
              setTriggerNavAd(false);
            }}
          />
        </div>
      )}
      
      {/* Regular ads for current page */}
      {eligibleAds.map(ad => {
        // Display ad and track it
        handleAdDisplay(ad.id);
        
        return (
          <AdPlaceholder 
            key={ad.id}
            type={ad.type}
            position={ad.position as 'top' | 'bottom' | 'side' | 'center'}
            adContent={{
              id: ad.id,
              imageUrl: ad.imageUrl,
              title: ad.title,
              description: ad.description,
              targetUrl: ad.targetUrl,
              videoUrl: ad.videoUrl
            }}
          />
        );
      })}
    </>
  );
};

export default AdManager;
