
// Ad display tracking
let downloadClickCount = 0;

/**
 * Determines whether to show ads based on click count
 * Shows ads on odd-numbered clicks for downloads
 * @returns boolean
 */
export const shouldShowAd = (): boolean => {
  downloadClickCount++;
  // Show ad on odd numbered clicks (1, 3, 5, ...)
  return downloadClickCount % 2 === 1;
};

/**
 * Determines if a page navigation should show an ad
 * Shows ads on even-numbered navigation events
 * @param navigationCount - Current navigation count
 * @returns boolean
 */
export const shouldShowNavigationAd = (navigationCount: number): boolean => {
  // Show ad on even numbered navigations (2, 4, 6, ...)
  return navigationCount % 2 === 0 && navigationCount > 0;
};

/**
 * Reset click counter (e.g. when user session ends)
 */
export const resetClickCounter = (): void => {
  downloadClickCount = 0;
};
