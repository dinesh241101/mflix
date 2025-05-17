
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';
import { shouldShowAd, shouldShowNavigationAd } from '@/utils/adLogic';
import { toast } from '@/components/ui/use-toast';
import { trackAdImpression, trackAdClick } from '@/utils/adAnalyticsTracker';

interface AdContent {
  id?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  targetUrl?: string;
  videoUrl?: string;
}

interface AdPlaceholderProps {
  type?: 'banner' | 'sidebar' | 'popup' | 'floating' | 'video' | 'native';
  position?: 'top' | 'bottom' | 'side' | 'center';
  onAdClick?: () => void;
  isNavigation?: boolean;
  adContent?: AdContent;
}

const AdPlaceholder = ({ 
  type = 'banner', 
  position = 'bottom',
  onAdClick,
  isNavigation = false,
  adContent
}: AdPlaceholderProps) => {
  const [showAd, setShowAd] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Determine whether to show ad based on navigation or click
    const shouldDisplay = isNavigation ? shouldShowNavigationAd() : shouldShowAd();
    setShowAd(shouldDisplay && !dismissed);
  }, [isNavigation, dismissed]);

  useEffect(() => {
    // Track impression when ad is shown
    if (showAd && adContent?.id && !hasTrackedImpression) {
      const metadata = {
        country: navigator.language.split('-')[1] || 'unknown',
        device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: getBrowserInfo(),
      };
      
      trackAdImpression(adContent.id, metadata);
      setHasTrackedImpression(true);
    }
  }, [showAd, adContent, hasTrackedImpression]);

  if (!showAd) return null;

  const handleAdClick = () => {
    if (onAdClick) onAdClick();
    
    if (adContent?.id) {
      const metadata = {
        country: navigator.language.split('-')[1] || 'unknown',
        device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: getBrowserInfo(),
      };
      
      trackAdClick(adContent.id, metadata);
    }
    
    toast({
      title: "Ad clicked",
      description: "Redirecting to advertiser...",
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    toast({
      title: "Ad dismissed",
      description: "You won't see this ad again in this session.",
    });
  };

  // Default ad content if none provided
  const defaultContent: AdContent = {
    id: "default-ad",
    imageUrl: "https://via.placeholder.com/600x200?text=Advertisement",
    title: "Special Offer",
    description: "Check out our latest products and services!",
    targetUrl: "#"
  };

  const content = adContent || defaultContent;

  // Get browser information
  const getBrowserInfo = (): string => {
    const ua = navigator.userAgent;
    let browser = 'unknown';
    
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';
    
    return browser;
  };

  // Floating ad
  if (type === 'floating') {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <X size={16} />
        </button>
        <Link 
          to={content.targetUrl || "#"} 
          target="_blank" 
          onClick={handleAdClick}
          className="block p-3"
        >
          <div className="text-xs text-gray-400 mb-1">Advertisement</div>
          <img 
            src={content.imageUrl} 
            alt="Ad" 
            className="w-full h-32 object-cover rounded mb-2"
          />
          <h3 className="text-sm font-medium text-white mb-1">{content.title}</h3>
          <p className="text-xs text-gray-300">{content.description}</p>
          <Button size="sm" className="w-full mt-2 text-xs">
            <ExternalLink size={12} className="mr-1" /> Learn More
          </Button>
        </Link>
      </div>
    );
  }

  // Video ad
  if (type === 'video' && content?.videoUrl) {
    return (
      <div className="relative w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <X size={16} />
        </button>
        <div className="text-xs text-gray-400 p-1">Video Advertisement</div>
        <div className="aspect-video">
          <video 
            src={content.videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
        <Link 
          to={content.targetUrl || "#"} 
          target="_blank" 
          onClick={handleAdClick}
          className="block p-3"
        >
          <h3 className="text-sm font-medium text-white">{content.title}</h3>
          <p className="text-xs text-gray-300">{content.description}</p>
        </Link>
      </div>
    );
  }

  // Native ad - matches site styling
  if (type === 'native') {
    return (
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden mb-4">
        <div className="flex items-start p-4">
          <img 
            src={content.imageUrl} 
            alt="Ad" 
            className="w-24 h-24 object-cover rounded-lg mr-4"
          />
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Sponsored Content</div>
            <h3 className="text-lg font-medium text-white mb-1">{content.title}</h3>
            <p className="text-sm text-gray-300 mb-2">{content.description}</p>
            <Link 
              to={content.targetUrl || "#"} 
              target="_blank" 
              onClick={handleAdClick}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
            >
              Learn More <ExternalLink size={12} className="ml-1" />
            </Link>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Sidebar ad
  if (type === 'sidebar') {
    return (
      <div className="fixed right-0 top-1/4 z-50 w-48 bg-gray-800 border border-gray-700 rounded-l-lg shadow-lg overflow-hidden">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <X size={16} />
        </button>
        <Link 
          to={content.targetUrl || "#"} 
          target="_blank" 
          onClick={handleAdClick}
          className="block p-3"
        >
          <div className="text-xs text-gray-400 mb-1">Advertisement</div>
          <img 
            src={content.imageUrl} 
            alt="Ad" 
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h3 className="text-sm font-medium text-white mb-1">{content.title}</h3>
          <p className="text-xs text-gray-300">{content.description}</p>
          <Button size="sm" className="w-full mt-2 text-xs">
            <ExternalLink size={12} className="mr-1" /> Learn More
          </Button>
        </Link>
      </div>
    );
  }

  // Banner ad (default)
  return (
    <div className={`w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden ${
      position === 'top' ? 'mb-4' : position === 'bottom' ? 'mt-4' : ''
    }`}>
      <div className="relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
        >
          <X size={16} />
        </button>
        <Link 
          to={content.targetUrl || "#"} 
          target="_blank" 
          onClick={handleAdClick}
          className="block"
        >
          <div className="text-xs text-gray-400 p-1">Advertisement</div>
          <img 
            src={content.imageUrl} 
            alt="Ad" 
            className="w-full h-24 sm:h-32 object-cover"
          />
          <div className="p-3">
            <h3 className="text-sm font-medium text-white">{content.title}</h3>
            <p className="text-xs text-gray-300">{content.description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdPlaceholder;
