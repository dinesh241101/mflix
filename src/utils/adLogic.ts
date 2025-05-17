
// Ad display tracking
let downloadClickCount = 0;
let navigationCount = 0;
let sessionImpressions: Record<string, number> = {};
let sessionClicks: Record<string, number> = {};
let lastAdShownTimestamp: Record<string, number> = {};

/**
 * Determines whether to show ad based on click count
 * Shows ads on odd-numbered clicks for downloads (1, 3, 5, ...)
 * @returns boolean
 */
export const shouldShowAd = (): boolean => {
  downloadClickCount++;
  // Show ad on odd numbered clicks (1, 3, 5, ...)
  return downloadClickCount % 2 === 1;
};

/**
 * Determines if a page navigation should show an ad
 * Shows ads on even-numbered navigation events (2, 4, 6, ...)
 * @returns boolean
 */
export const shouldShowNavigationAd = (): boolean => {
  navigationCount++;
  // Show ad on even numbered navigations (2, 4, 6, ...)
  return navigationCount % 2 === 0 && navigationCount > 0;
};

/**
 * Reset click counters (e.g. when user session ends)
 */
export const resetClickCounters = (): void => {
  downloadClickCount = 0;
  navigationCount = 0;
  sessionImpressions = {};
  sessionClicks = {};
  lastAdShownTimestamp = {};
};

/**
 * Get the current download click count
 * @returns number
 */
export const getDownloadClickCount = (): number => {
  return downloadClickCount;
};

/**
 * Get the current navigation count
 * @returns number
 */
export const getNavigationCount = (): number => {
  return navigationCount;
};

/**
 * Determines whether to show an ad based on frequency capping
 * @param adId Unique identifier for the ad
 * @param frequency How often to show the ad (higher = more frequent)
 * @returns boolean
 */
export const shouldShowAdWithFrequencyCapping = (adId: string, frequency: number = 1): boolean => {
  const now = Date.now();
  const lastShown = lastAdShownTimestamp[adId] || 0;
  
  // Base interval between ads is 10 minutes (600000ms)
  // Frequency adjusts this interval (higher frequency = shorter interval)
  const intervalMs = 600000 / (frequency || 1);
  
  // If enough time has passed since the last showing
  if (now - lastShown >= intervalMs) {
    lastAdShownTimestamp[adId] = now;
    return true;
  }
  
  return false;
};

/**
 * Track an ad impression (view)
 * @param adId Unique identifier for the ad
 */
export const trackAdImpression = (adId: string): void => {
  if (!sessionImpressions[adId]) {
    sessionImpressions[adId] = 0;
  }
  sessionImpressions[adId]++;
  
  // In a real app, send this to analytics backend
  console.log(`Ad impression tracked. Ad ID: ${adId}, Total impressions: ${sessionImpressions[adId]}`);
};

/**
 * Track an ad click
 * @param adId Unique identifier for the ad
 */
export const trackAdClick = (adId: string): void => {
  if (!sessionClicks[adId]) {
    sessionClicks[adId] = 0;
  }
  sessionClicks[adId]++;
  
  // In a real app, send this to analytics backend
  console.log(`Ad click tracked. Ad ID: ${adId}, Total clicks: ${sessionClicks[adId]}`);
};

/**
 * Calculate CTR (Click-Through Rate) for an ad
 * @param adId Unique identifier for the ad
 * @returns number CTR as a percentage
 */
export const calculateCTR = (adId: string): number => {
  const impressions = sessionImpressions[adId] || 0;
  const clicks = sessionClicks[adId] || 0;
  
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

/**
 * Get all session analytics data
 * @returns Object with impressions and clicks by ad ID
 */
export const getSessionAnalytics = (): { impressions: Record<string, number>, clicks: Record<string, number> } => {
  return {
    impressions: { ...sessionImpressions },
    clicks: { ...sessionClicks }
  };
};
