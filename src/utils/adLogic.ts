
// Ad display tracking
let downloadClickCount = 0;
let navigationCount = 0;

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
