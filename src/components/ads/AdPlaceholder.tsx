
import React from 'react';

// Define valid position types
export type AdPosition = 'top' | 'bottom' | 'side' | 'center';

interface AdPlaceholderProps {
  position: AdPosition;
  className?: string;
}

const AdPlaceholder = ({ position, className = '' }: AdPlaceholderProps) => {
  let placeholderClass = "bg-gray-800 text-gray-600 flex items-center justify-center rounded-lg overflow-hidden";
  
  // Set dimensions based on position
  switch (position) {
    case 'top':
      placeholderClass += " h-20 w-full";
      break;
    case 'bottom':
      placeholderClass += " h-20 w-full";
      break;
    case 'side':
      placeholderClass += " h-80 w-full";
      break;
    case 'center':
      placeholderClass += " h-60 w-full";
      break;
    default:
      placeholderClass += " h-40 w-full";
  }
  
  return (
    <div className={`${placeholderClass} ${className}`}>
      <div className="text-center p-4">
        <div className="text-xs mb-1">Advertisement</div>
        <div className="text-xxs opacity-70">Your ad could be here</div>
      </div>
    </div>
  );
};

export default AdPlaceholder;
