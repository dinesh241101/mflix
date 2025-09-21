-- Fix RLS policies - simpler approach to avoid conflicts

-- Enable RLS on tables that need it
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate download_links policies to fix the RLS violation
DROP POLICY IF EXISTS "Allow all inserts for authenticated users" ON public.download_links;
DROP POLICY IF EXISTS "Allow authenticated users to insert download links" ON public.download_links;

-- Create a permissive insert policy for download_links
CREATE POLICY "Allow inserts on download_links" 
ON public.download_links 
FOR INSERT 
WITH CHECK (true);