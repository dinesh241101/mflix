
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';
import { shouldShowAd, shouldShowNavigationAd } from '@/utils/adLogic';
import { toast } from '@/components/ui/use-toast';

interface AdPlaceholderProps {
  type?: 'banner' | 'sidebar' | 'popup';
  position?: 'top' | 'bottom' | 'side';
  onAdClick?: () => void;
  isNavigation?: boolean;
  adContent?: {
    imageUrl?: string;
    title?: string;
    description?: string;
    targetUrl?: string;
  };
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

  useEffect(() => {
    // Determine whether to show ad based on navigation or click
    const shouldDisplay = isNavigation ? shouldShowNavigationAd() : shouldShowAd();
    setShowAd(shouldDisplay && !dismissed);
  }, [isNavigation, dismissed]);

  if (!showAd) return null;

  const handleAdClick = () => {
    if (onAdClick) onAdClick();
    toast({
      title: "Ad clicked",
      description: "Redirecting to advertiser...",
    });
    // In a real implementation, this would track the click for analytics
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
  const defaultContent = {
    imageUrl: "https://via.placeholder.com/600x200?text=Advertisement",
    title: "Special Offer",
    description: "Check out our latest products and services!",
    targetUrl: "#"
  };

  const content = adContent || defaultContent;

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

  // Banner ad
  return (
    <div className={`w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden ${
      position === 'top' ? 'mb-4' : 'mt-4'
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
