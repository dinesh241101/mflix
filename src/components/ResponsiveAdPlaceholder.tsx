
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

export type AdPosition = 
  | 'header-banner' 
  | 'content-top' 
  | 'content-middle' 
  | 'content-bottom' 
  | 'sidebar' 
  | 'footer' 
  | 'mobile-sticky' 
  | 'interstitial'
  | 'floating'
  | 'in-content'
  | 'top-banner'
  | 'bottom-banner';

interface ResponsiveAdPlaceholderProps {
  position: AdPosition;
  className?: string;
  title?: string;
}

const ResponsiveAdPlaceholder = ({ 
  position, 
  className = '', 
  title = 'Advertisement' 
}: ResponsiveAdPlaceholderProps) => {
  const isMobile = useIsMobile();
  
  let placeholderClass = "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 flex flex-col items-center justify-center rounded-lg border border-gray-600 transition-all duration-300 hover:border-gray-500";
  
  // Responsive dimensions based on position and device
  switch (position) {
    case 'header-banner':
    case 'top-banner':
      placeholderClass += isMobile ? " h-16 w-full" : " h-20 w-full";
      break;
    case 'content-top':
    case 'content-bottom':
      placeholderClass += isMobile ? " h-20 w-full" : " h-24 w-full";
      break;
    case 'content-middle':
    case 'in-content':
      placeholderClass += isMobile ? " h-32 w-full" : " h-40 w-full";
      break;
    case 'sidebar':
      placeholderClass += isMobile ? " h-40 w-full" : " h-80 w-64";
      break;
    case 'footer':
    case 'bottom-banner':
      placeholderClass += isMobile ? " h-20 w-full" : " h-24 w-full";
      break;
    case 'mobile-sticky':
      placeholderClass += " h-14 w-full fixed bottom-0 left-0 z-40 rounded-none";
      break;
    case 'floating':
      placeholderClass += isMobile ? " h-20 w-20 fixed bottom-20 right-4 z-30 rounded-full" : " h-24 w-24 fixed bottom-8 right-8 z-30 rounded-full";
      break;
    case 'interstitial':
      placeholderClass += " h-80 w-full max-w-md mx-auto";
      break;
    default:
      placeholderClass += " h-40 w-full";
  }
  
  return (
    <div className={`${placeholderClass} ${className}`}>
      <div className="text-center p-4">
        <div className={`font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {title}
        </div>
        <div className={`opacity-70 ${isMobile ? 'text-xxs' : 'text-xs'}`}>
          {isMobile ? 'Mobile Ad Space' : 'Your ad could be here'}
        </div>
        {!isMobile && (
          <div className="text-xxs mt-1 opacity-50">
            Position: {position}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveAdPlaceholder;
