
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import AdBanner from "./AdBanner";
import { supabase } from "@/integrations/supabase/client";

const AdManager = () => {
  const location = useLocation();
  const viewTrackedRef = useRef<Record<string, boolean>>({});
  
  // Reset view counts when changing pages
  useEffect(() => {
    const trackPageChange = async () => {
      try {
        // Reset view count tracking for this page visit
        viewTrackedRef.current = {};
        
        // In a real app, you might want to track page changes or sync with analytics
        console.log(`Page changed to: ${location.pathname}`);
        
        // Track page view
        await supabase.from('analytics').insert({
          page_visited: location.pathname,
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };
    
    trackPageChange();
  }, [location.pathname]);

  // This component is invisible and manages ad placements dynamically
  // For specific ad placements, use the AdBanner component directly in the relevant pages
  return null;
};

export default AdManager;
