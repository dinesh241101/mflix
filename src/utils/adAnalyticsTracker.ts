
import { AdInteraction } from '@/models/adModels';
import { supabase } from '@/integrations/supabase/client';

// Track ad impression (when ad is shown to user)
export const trackAdImpression = async (adId: string, metadata?: {
  country?: string,
  device?: string,
  browser?: string,
  userId?: string
}) => {
  try {
    // Store the interaction in analytics table
    const analyticsData = {
      page_visited: 'ad_impression',
      country: metadata?.country,
      device: metadata?.device,
      browser: metadata?.browser,
      // Additional fields for ad tracking
      ad_id: adId,
      interaction_type: 'impression'
    };
    
    // In production, we'd use a real database table specifically for ad interactions
    console.log('Ad impression tracked:', adId, analyticsData);
    
    // For demo purposes, we'll store in analytics table
    await supabase.from('analytics').insert(analyticsData);
    
    return true;
  } catch (error) {
    console.error('Failed to track ad impression:', error);
    return false;
  }
};

// Track ad click (when user clicks on ad)
export const trackAdClick = async (adId: string, metadata?: {
  country?: string,
  device?: string,
  browser?: string,
  userId?: string
}) => {
  try {
    // Store the interaction in analytics table
    const analyticsData = {
      page_visited: 'ad_click',
      country: metadata?.country,
      device: metadata?.device,
      browser: metadata?.browser,
      // Additional fields for ad tracking
      ad_id: adId,
      interaction_type: 'click'
    };
    
    console.log('Ad click tracked:', adId, analyticsData);
    
    // For demo purposes, we'll store in analytics table
    await supabase.from('analytics').insert(analyticsData);
    
    return true;
  } catch (error) {
    console.error('Failed to track ad click:', error);
    return false;
  }
};

// Track ad conversion (when user completes desired action)
export const trackAdConversion = async (adId: string, value: number, metadata?: {
  country?: string,
  device?: string,
  browser?: string,
  userId?: string
}) => {
  try {
    // Store the interaction in analytics table
    const analyticsData = {
      page_visited: 'ad_conversion',
      country: metadata?.country,
      device: metadata?.device,
      browser: metadata?.browser,
      // Additional fields for ad tracking
      ad_id: adId,
      interaction_type: 'conversion',
      conversion_value: value
    };
    
    console.log('Ad conversion tracked:', adId, 'value:', value, analyticsData);
    
    // For demo purposes, we'll store in analytics table
    await supabase.from('analytics').insert(analyticsData);
    
    return true;
  } catch (error) {
    console.error('Failed to track ad conversion:', error);
    return false;
  }
};

// Calculate CTR (Click-Through Rate)
export const calculateCTR = (impressions: number, clicks: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

// Calculate CPM (Cost Per Mille - cost per thousand impressions)
export const calculateCPM = (revenue: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (revenue / impressions) * 1000;
};
