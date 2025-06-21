
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";
import EnhancedAdBanner from "./EnhancedAdBanner";

interface UniversalAdsWrapperProps {
  children: React.ReactNode;
  showHeaderAd?: boolean;
  showFooterAd?: boolean;
  showSidebarAd?: boolean;
  showFloatingAd?: boolean;
}

const UniversalAdsWrapper = ({ 
  children, 
  showHeaderAd = true, 
  showFooterAd = true, 
  showSidebarAd = true,
  showFloatingAd = true 
}: UniversalAdsWrapperProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Header Ad */}
      {showHeaderAd && (
        <div className="w-full">
          <ResponsiveAdPlaceholder position="header-banner" />
          <EnhancedAdBanner position="home_top" className="mb-4" />
        </div>
      )}

      {/* Main Content with Sidebar Ad */}
      <div className="flex relative">
        {/* Sidebar Ad (Desktop only) */}
        {!isMobile && showSidebarAd && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30">
            <EnhancedAdBanner position="sidebar" size="small" />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Right Sidebar Ad (Desktop only) */}
        {!isMobile && showSidebarAd && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
            <ResponsiveAdPlaceholder position="sidebar" />
          </div>
        )}
      </div>

      {/* Footer Ad */}
      {showFooterAd && (
        <div className="w-full mt-8">
          <ResponsiveAdPlaceholder position="footer" />
          <EnhancedAdBanner position="footer" className="mt-4" />
        </div>
      )}

      {/* Mobile Sticky Ad */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <ResponsiveAdPlaceholder position="mobile-sticky" />
        </div>
      )}

      {/* Floating Ad */}
      {showFloatingAd && (
        <div className="fixed bottom-20 right-4 z-30">
          <EnhancedAdBanner position="floating" size="small" />
        </div>
      )}
    </div>
  );
};

export default UniversalAdsWrapper;
