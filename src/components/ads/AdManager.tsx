
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdPlaceholder from './AdPlaceholder';
import { resetClickCounters, getDownloadClickCount } from '@/utils/adLogic';

// In a real app, these would come from your database
const MOCK_ADS = [
  {
    id: '1',
    type: 'banner',
    position: 'bottom',
    imageUrl: 'https://via.placeholder.com/800x200?text=Movie+Streaming+Service',
    title: 'Premium Streaming',
    description: 'Get unlimited access to thousands of movies',
    targetUrl: 'https://example.com/premium',
    pages: ['/', '/movies', '/web-series']
  },
  {
    id: '2',
    type: 'sidebar',
    position: 'side',
    imageUrl: 'https://via.placeholder.com/300x600?text=New+Release',
    title: 'New Releases',
    description: 'Check out the latest movies added this week',
    targetUrl: 'https://example.com/new-releases',
    pages: ['/', '/movies', '/movie/*']
  },
];

const AdManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('');
  const [triggerNavAd, setTriggerNavAd] = useState(false);
  
  // Reset counters when component mounts
  useEffect(() => {
    // In a real app, you might want to persist the counters
    // resetClickCounters();
  }, []);
  
  // Track navigation changes
  useEffect(() => {
    if (currentPath && currentPath !== location.pathname) {
      setTriggerNavAd(true);
      setTimeout(() => setTriggerNavAd(false), 100);
    }
    setCurrentPath(location.pathname);
  }, [location.pathname, currentPath]);
  
  // Filter ads based on current path
  const getAdsForCurrentPage = () => {
    return MOCK_ADS.filter(ad => {
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
      {eligibleAds.map(ad => (
        <AdPlaceholder 
          key={ad.id}
          type={ad.type as 'banner' | 'sidebar'}
          position={ad.position as 'top' | 'bottom' | 'side'}
          adContent={{
            imageUrl: ad.imageUrl,
            title: ad.title,
            description: ad.description,
            targetUrl: ad.targetUrl
          }}
        />
      ))}
    </>
  );
};

export default AdManager;
