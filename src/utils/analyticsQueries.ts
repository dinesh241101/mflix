
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
    .select('state, count(*)')
    .eq('country', country)
    .not('state', 'is', null)
    .order('count', { ascending: false });
    
  if (error) throw error;
  
  return data?.map(item => ({
    state: item.state,
    count: parseInt(item.count, 10)
  })) || [];
};

export const fetchCityAnalytics = async (country: string): Promise<AnalyticsCountResult[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('city, count(*)')
    .eq('country', country)
    .not('city', 'is', null)
    .order('count', { ascending: false })
    .limit(10);
    
  if (error) throw error;
  
  return data?.map(item => ({
    city: item.city,
    count: parseInt(item.count, 10)
  })) || [];
};

export const fetchDeviceAnalytics = async (country: string): Promise<AnalyticsCountResult[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('device, count(*)')
    .eq('country', country)
    .order('count', { ascending: false });
    
  if (error) throw error;
  
  return data?.map(item => ({
    device: item.device,
    count: parseInt(item.count, 10)
  })) || [];
};
