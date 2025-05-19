
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdBanner from "./AdBanner";

/**
 * AdManager component handles ad tracking, placement rules, and analytics.
 * It doesn't render anything visually but coordinates ad placements throughout the app.
 */
const AdManager = () => {
  const location = useLocation();
  const viewTrackedRef = useRef<Record<string, boolean>>({});
  
  // Reset view counts when changing pages
  useEffect(() => {
    const trackPageChange = async () => {
      try {
        // Reset view count tracking for this page visit
        viewTrackedRef.current = {};
        
        // Track page view with more detailed info
        const deviceInfo = {
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        };
        
        console.log(`Page changed to: ${location.pathname}`, deviceInfo);
        
        // Track page view in analytics
        await supabase.from('analytics').insert({
          page_visited: location.pathname,
          browser: deviceInfo.browser,
          device: deviceInfo.device,
          os: deviceInfo.os
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };
    
    trackPageChange();
  }, [location.pathname]);

  // This component defines ad zones throughout the app
  // The actual ad content is managed by individual AdBanner components
  const adZones = [
    // Home page ads
    { path: '/', positions: ['home_hero', 'home_trending', 'home_featured', 'home_category'] },
    // Movie page ads
    { path: '/movie/', positions: ['movie_top', 'movie_details', 'movie_related'] },
    // Movies list page ads
    { path: '/movies', positions: ['movies_top', 'movies_grid', 'movies_bottom'] },
    // Series page ads
    { path: '/series', positions: ['series_top', 'series_grid', 'series_bottom'] },
    // General content ads (inserted every 3 items)
    { path: '*', positions: Array.from({length: 10}, (_, i) => `content_after_${(i+1)*3}`) }
  ];
  
  // This component is invisible and manages ad placements dynamically
  // For specific ad placements, use the AdBanner component directly in the relevant pages
  return null;
};

export default AdManager;
