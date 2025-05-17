
export interface AdAnalytics {
  id: string;
  adId: string;
  adName: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number; // Click-through rate
  cpm: number; // Cost per mille (thousand impressions)
  startDate: string;
  endDate: string | null;
  adType: string;
  position: string;
  country?: string;
  device?: string;
  browser?: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  adType: string;
  position: string;
  contentUrl: string;
  targetUrl: string;
  displayFrequency: number;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  targetCountries: string[];
  targetDevices: string[];
  createdAt: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  ctr?: number;
  cpm?: number;
}

export interface AffiliateLink {
  id: string;
  name: string;
  originalUrl: string;
  shortCode: string;
  trackingParams: Record<string, string>;
  program: string;
  commission: number;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  createdAt: string;
}

// Ad interaction tracking
export interface AdInteraction {
  id: string;
  adId: string;
  type: 'impression' | 'click' | 'conversion';
  timestamp: string;
  country?: string;
  device?: string;
  browser?: string;
  userId?: string;
  value?: number; // For conversion value
}
