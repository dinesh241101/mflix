
import { X } from 'lucide-react';
import { useClickAds } from '@/hooks/useClickAds';

const ClickAdModal = () => {
  const { showAd, currentAd, closeAd, handleAdClick } = useClickAds({
    clicksBeforeAd: 1,
    enabled: true
  });

  if (!showAd || !currentAd) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <button
          onClick={closeAd}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>
        
        <div 
          className="cursor-pointer"
          onClick={handleAdClick}
        >
          {currentAd.content_url ? (
            <img 
              src={currentAd.content_url} 
              alt={currentAd.ad_name || "Advertisement"}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="bg-gray-200 p-8 text-center text-gray-600 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{currentAd.ad_name}</h3>
              <p>Click to learn more</p>
            </div>
          )}
        </div>
        
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">Advertisement</p>
        </div>
      </div>
    </div>
  );
};

export default ClickAdModal;
