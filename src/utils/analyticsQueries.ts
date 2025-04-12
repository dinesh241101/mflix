
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsCountResult {
  state?: string;
  city?: string;
  device?: string;
  count: number;
}

export const fetchStateAnalytics = async (country: string): Promise<AnalyticsCountResult[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('state, count')
    .eq('country', country)
    .not('state', 'is', null)
    .order('count', { ascending: false })
    .groupBy('state');
    
  if (error) throw error;
  
  return data?.map(item => ({
    state: item.state,
    count: item.count || 0
  })) || [];
};

export const fetchCityAnalytics = async (country: string): Promise<AnalyticsCountResult[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('city, count')
    .eq('country', country)
    .not('city', 'is', null)
    .order('count', { ascending: false })
    .groupBy('city')
    .limit(10);
    
  if (error) throw error;
  
  return data?.map(item => ({
    city: item.city,
    count: item.count || 0
  })) || [];
};

export const fetchDeviceAnalytics = async (country: string): Promise<AnalyticsCountResult[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('device, count')
    .eq('country', country)
    .groupBy('device')
    .order('count', { ascending: false });
    
  if (error) throw error;
  
  return data?.map(item => ({
    device: item.device,
    count: item.count || 0
  })) || [];
};
