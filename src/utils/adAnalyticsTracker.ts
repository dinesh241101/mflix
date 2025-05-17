
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
    const interaction: AdInteraction = {
      id: crypto.randomUUID(),
      adId,
      type: 'impression',
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    // In a real app, batch these for performance
    await supabase.from('ad_interactions').insert(interaction);
    
    console.log('Ad impression tracked:', adId);
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
    const interaction: AdInteraction = {
      id: crypto.randomUUID(),
      adId,
      type: 'click',
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    await supabase.from('ad_interactions').insert(interaction);
    
    console.log('Ad click tracked:', adId);
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
    const interaction: AdInteraction = {
      id: crypto.randomUUID(),
      adId,
      type: 'conversion',
      timestamp: new Date().toISOString(),
      value,
      ...metadata
    };
    
    await supabase.from('ad_interactions').insert(interaction);
    
    console.log('Ad conversion tracked:', adId, 'value:', value);
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
