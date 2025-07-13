
-- Fix the screenshots column issue and add other required columns
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS screenshots TEXT[];

-- Add missing columns for enhanced functionality
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS trailer_url TEXT;
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS release_date DATE;

-- Create ad_placements table for managing ad positions
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL,
  position TEXT NOT NULL,
  ad_type TEXT NOT NULL DEFAULT 'banner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ad_placements
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;

-- Create policies for ad_placements
CREATE POLICY "Allow public read access to ad placements" 
  ON public.ad_placements 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin users to manage ad placements" 
  ON public.ad_placements 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE auth_user_id = auth.uid() AND role_name = 'admin'
  ));

-- Update shorts table for video uploads
ALTER TABLE public.shorts ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.shorts ADD COLUMN IF NOT EXISTS video_file_url TEXT;
ALTER TABLE public.shorts ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE public.shorts ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Enable RLS on shorts table
ALTER TABLE public.shorts ENABLE ROW LEVEL SECURITY;

-- Create policies for shorts
CREATE POLICY "Allow public read access to shorts" 
  ON public.shorts 
  FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Allow admin users to manage shorts" 
  ON public.shorts 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE auth_user_id = auth.uid() AND role_name = 'admin'
  ));

-- Fix visibility toggle by updating RLS policies on movies
DROP POLICY IF EXISTS "Allow public read access to movies" ON public.movies;
CREATE POLICY "Allow public read access to visible movies" 
  ON public.movies 
  FOR SELECT 
  USING (is_visible = true);

-- Add video ads table
CREATE TABLE IF NOT EXISTS public.video_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_name TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  skip_after INTEGER DEFAULT 5,
  target_url TEXT,
  is_active BOOLEAN DEFAULT true,
  trigger_events TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on video_ads
ALTER TABLE public.video_ads ENABLE ROW LEVEL SECURITY;

-- Create policies for video_ads
CREATE POLICY "Allow public read access to video ads" 
  ON public.video_ads 
  FOR SELECT 
  USING (is_active = true);

-- Add image storage table for local uploads
CREATE TABLE IF NOT EXISTS public.uploaded_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on uploaded_images
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

-- Create policies for uploaded_images
CREATE POLICY "Allow users to upload images" 
  ON public.uploaded_images 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Allow public read access to uploaded images" 
  ON public.uploaded_images 
  FOR SELECT 
  USING (true);
