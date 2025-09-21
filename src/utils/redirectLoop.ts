
import { supabase } from "@/integrations/supabase/client";

interface RedirectLink {
  id: string;
  position: string;
  redirect_url: string;
  is_active: boolean;
  display_order: number;
}

class RedirectLoopManager {
  private redirectCounts: Map<string, number> = new Map();
  private redirectHistory: Map<string, string> = new Map();

  async getRedirectLinks(position: string): Promise<RedirectLink[]> {
    try {
      console.log('Fetching redirect links for position:', position);
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('ad_type', 'redirect_link')
        .eq('position', position)
        .eq('is_active', true)
        .order('display_frequency');

      if (error) {
        console.error('Error fetching redirect links:', error);
        return [];
      }
      
      const links = data?.map(ad => ({
        id: ad.ad_id,
        position: ad.position || position,
        redirect_url: ad.target_url || '',
        is_active: ad.is_active,
        display_order: ad.display_frequency || 1
      })) || [];

      console.log('Found redirect links:', links);
      return links;
    } catch (error) {
      console.error('Error fetching redirect links:', error);
      return [];
    }
  }

  async handleRedirect(position: string, originalUrl?: string): Promise<string | null> {
    try {
      console.log('Handling redirect for position:', position);
      
      const links = await this.getRedirectLinks(position);
      
      if (links.length === 0) {
        console.log('No redirect links found for position:', position);
        return null;
      }

      // Check if user has already been redirected for this position in this session
      const sessionKey = `redirect_${position}_${Date.now().toString().slice(0, -5)}000`; // Round to nearest 10 seconds
      const hasBeenRedirected = sessionStorage.getItem(sessionKey);
      
      if (hasBeenRedirected) {
        console.log('User already redirected for this position in current session');
        return null;
      }

      // Select a random redirect link
      const randomIndex = Math.floor(Math.random() * links.length);
      const selectedLink = links[randomIndex];
      
      console.log('Selected redirect link:', selectedLink);

      // Mark as redirected in session
      sessionStorage.setItem(sessionKey, 'true');
      
      // Store original URL and redirect info
      if (originalUrl) {
        sessionStorage.setItem(`original_url_${position}`, originalUrl);
      }
      sessionStorage.setItem(`redirect_from_${position}`, window.location.href);
      
      // Set up cleanup after 5 minutes
      setTimeout(() => {
        sessionStorage.removeItem(sessionKey);
      }, 5 * 60 * 1000);
      
      return selectedLink.redirect_url;
    } catch (error) {
      console.error('Error in handleRedirect:', error);
      return null;
    }
  }

  handleBackNavigation(): void {
    // Check if user came back from a redirect
    const urlParams = new URLSearchParams(window.location.search);
    const fromPosition = urlParams.get('from_redirect');
    
    if (fromPosition) {
      console.log('User came back from redirect position:', fromPosition);
      
      // Get original URL
      const originalUrl = sessionStorage.getItem(`original_url_${fromPosition}`);
      const redirectFrom = sessionStorage.getItem(`redirect_from_${fromPosition}`);
      
      // Clean up session storage
      sessionStorage.removeItem(`original_url_${fromPosition}`);
      sessionStorage.removeItem(`redirect_from_${fromPosition}`);
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('from_redirect');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Redirect to original URL if available
      if (originalUrl && originalUrl !== window.location.href) {
        console.log('Redirecting back to original URL:', originalUrl);
        window.location.href = originalUrl;
      } else if (redirectFrom && redirectFrom !== window.location.href) {
        console.log('Redirecting back to redirect source:', redirectFrom);
        window.location.href = redirectFrom;
      }
    }
  }

  async shouldRedirect(position: string): Promise<boolean> {
    const links = await this.getRedirectLinks(position);
    if (links.length === 0) return false;
    
    const sessionKey = `redirect_${position}_${Date.now().toString().slice(0, -5)}000`;
    const hasBeenRedirected = sessionStorage.getItem(sessionKey);
    
    return !hasBeenRedirected;
  }

  reset(position: string): void {
    // Clear all session storage for this position
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes(position)) {
        sessionStorage.removeItem(key);
      }
    });
    
    this.redirectCounts.delete(position);
    this.redirectHistory.delete(position);
  }
}

export const redirectLoopManager = new RedirectLoopManager();

// Helper function to handle download button clicks
export const handleDownloadClick = async (
  position: 'download_cta_1' | 'download_cta_2' | 'download_cta_3',
  originalUrl: string
): Promise<void> => {
  console.log('Download click for position:', position, 'originalUrl:', originalUrl);
  
  const redirectUrl = await redirectLoopManager.handleRedirect(position, originalUrl);
  
  if (redirectUrl) {
    console.log('Redirecting to:', redirectUrl);
    
    // Add return parameter to redirect URL
    const separator = redirectUrl.includes('?') ? '&' : '?';
    const redirectWithReturn = `${redirectUrl}${separator}from_redirect=${position}`;
    
    // Perform the redirect
    window.location.href = redirectWithReturn;
  } else {
    console.log('No redirect needed, going to original URL:', originalUrl);
    // Normal flow - redirect to original URL
    window.location.href = originalUrl;
  }
};

// Helper function to handle page navigation clicks
export const handlePageNavigation = async (
  position: 'page_switch' | 'same_page_click',
  originalAction: () => void
): Promise<void> => {
  console.log('Page navigation for position:', position);
  
  const redirectUrl = await redirectLoopManager.handleRedirect(position);
  
  if (redirectUrl) {
    console.log('Redirecting to:', redirectUrl);
    
    const separator = redirectUrl.includes('?') ? '&' : '?';
    const redirectWithReturn = `${redirectUrl}${separator}from_redirect=${position}`;
    window.location.href = redirectWithReturn;
  } else {
    console.log('No redirect needed, executing original action');
    // Normal flow
    originalAction();
  }
};

// Function to check if user is returning from a redirect
export const checkReturnFromRedirect = (): void => {
  // Handle back navigation immediately
  redirectLoopManager.handleBackNavigation();
};

// Initialize redirect loop manager on page load
if (typeof window !== 'undefined') {
  // Check for returns from redirects on page load
  window.addEventListener('load', checkReturnFromRedirect);
  
  // Also check on navigation changes
  window.addEventListener('popstate', checkReturnFromRedirect);
  
  // Check immediately when script loads
  setTimeout(checkReturnFromRedirect, 100);
}
