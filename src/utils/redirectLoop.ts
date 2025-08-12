
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

  async getRedirectLinks(position: string): Promise<RedirectLink[]> {
    try {
      const { data, error } = await supabase
        .from('redirect_links')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching redirect links:', error);
      return [];
    }
  }

  async handleRedirect(position: string): Promise<string | null> {
    const links = await this.getRedirectLinks(position);
    
    if (links.length === 0) {
      return null;
    }

    // Get current redirect count for this position
    const currentCount = this.redirectCounts.get(position) || 0;
    
    // If this is the first click, redirect to a random link
    if (currentCount === 0) {
      const randomIndex = Math.floor(Math.random() * links.length);
      const selectedLink = links[randomIndex];
      
      // Increment the count
      this.redirectCounts.set(position, 1);
      
      // Store the redirect info in sessionStorage for persistence
      sessionStorage.setItem(`redirect_count_${position}`, '1');
      sessionStorage.setItem(`last_redirect_${position}`, selectedLink.redirect_url);
      
      return selectedLink.redirect_url;
    }
    
    // If user has already been redirected once, allow normal flow
    return null;
  }

  resetRedirectCount(position: string): void {
    this.redirectCounts.delete(position);
    sessionStorage.removeItem(`redirect_count_${position}`);
    sessionStorage.removeItem(`last_redirect_${position}`);
  }

  getRedirectCount(position: string): number {
    // Check sessionStorage first for persistence
    const storedCount = sessionStorage.getItem(`redirect_count_${position}`);
    if (storedCount) {
      const count = parseInt(storedCount);
      this.redirectCounts.set(position, count);
      return count;
    }
    
    return this.redirectCounts.get(position) || 0;
  }

  async shouldRedirect(position: string): Promise<boolean> {
    const count = this.getRedirectCount(position);
    return count === 0;
  }
}

export const redirectLoopManager = new RedirectLoopManager();

// Helper function to handle download button clicks
export const handleDownloadClick = async (
  position: 'download_cta_1' | 'download_cta_2' | 'download_cta_3',
  originalUrl: string
): Promise<void> => {
  const redirectUrl = await redirectLoopManager.handleRedirect(position);
  
  if (redirectUrl) {
    // Store the original URL for later use
    sessionStorage.setItem(`original_url_${position}`, originalUrl);
    window.location.href = redirectUrl;
  } else {
    // Normal flow - redirect to original URL
    window.location.href = originalUrl;
  }
};

// Helper function to handle page navigation
export const handlePageNavigation = async (
  position: 'page_switch' | 'same_page_click',
  originalAction: () => void
): Promise<void> => {
  const redirectUrl = await redirectLoopManager.handleRedirect(position);
  
  if (redirectUrl) {
    window.location.href = redirectUrl;
  } else {
    // Normal flow
    originalAction();
  }
};

// Function to check if user is returning from a redirect
export const checkReturnFromRedirect = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const returnFrom = urlParams.get('return_from_redirect');
  
  if (returnFrom) {
    // User returned from a redirect, reset the count
    redirectLoopManager.resetRedirectCount(returnFrom);
    
    // Clean up the URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('return_from_redirect');
    window.history.replaceState({}, '', newUrl.toString());
  }
};
