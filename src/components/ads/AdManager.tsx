
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdBanner from "./AdBanner";

const AdManager = () => {
  const location = useLocation();
  
  // Reset view counts when changing pages
  useEffect(() => {
    // Do nothing for now, but in a real app you might want to track page changes
  }, [location.pathname]);

  // This component is invisible and manages ad placements dynamically
  // For specific ad placements, use the AdBanner component directly in the relevant pages
  return null;
};

export default AdManager;
