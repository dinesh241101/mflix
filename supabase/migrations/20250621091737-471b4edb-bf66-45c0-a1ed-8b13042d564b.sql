
-- Create interstitial_ads table for ads shown during user interactions
CREATE TABLE public.interstitial_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_name TEXT NOT NULL,
  ad_content_url TEXT,
  target_url TEXT,
  trigger_event TEXT NOT NULL, -- 'download_click', 'page_navigation', 'time_based', etc.
  display_duration INTEGER DEFAULT 5, -- seconds
  skip_after INTEGER DEFAULT 3, -- seconds before skip button appears
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ad_clicks table to track ad interactions
CREATE TABLE public.ad_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID REFERENCES public.ads(ad_id),
  interstitial_ad_id UUID REFERENCES public.interstitial_ads(id),
  user_ip TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  referrer_page TEXT
);

-- Add new columns to existing ads table for better tracking
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS view_duration INTEGER DEFAULT 0;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS skip_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS skip_delay INTEGER DEFAULT 5;

-- Create ad_settings table for global ad configuration
CREATE TABLE public.ad_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default ad settings
INSERT INTO public.ad_settings (setting_key, setting_value, description) VALUES
('download_ad_required', 'true', 'Whether ads are required before downloads'),
('interstitial_frequency', '3', 'Show interstitial ad every N page views'),
('ad_click_tracking', 'true', 'Enable ad click tracking');
