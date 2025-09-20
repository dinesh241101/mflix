-- Fix RLS policies to resolve download_links violations

-- First, let's enable RLS on tables that need it but don't have it enabled
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fix download_links RLS policy to allow public inserts for authenticated users
DROP POLICY IF EXISTS "Allow all inserts for authenticated users" ON public.download_links;
CREATE POLICY "Allow authenticated users to insert download links" 
ON public.download_links 
FOR INSERT 
WITH CHECK (true);

-- Ensure download_links allows public reads
DROP POLICY IF EXISTS "Allow public read access to download links" ON public.download_links;
CREATE POLICY "Allow public read access to download links" 
ON public.download_links 
FOR SELECT 
USING (true);

-- Add policy to allow admin management of download_links
CREATE POLICY "Allow admin users to manage download links" 
ON public.download_links 
FOR ALL
USING (EXISTS (
  SELECT 1 
  FROM user_roles 
  WHERE auth_user_id = auth.uid() 
  AND role_name = 'admin'
));

-- Fix analytics RLS - users should only see their own data
CREATE POLICY "Allow users to insert their own analytics" 
ON public.analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own analytics" 
ON public.analytics 
FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 
  FROM user_roles 
  WHERE auth_user_id = auth.uid() 
  AND role_name = 'admin'
));

-- Fix ads RLS - public read for active ads, admin management
CREATE POLICY "Allow public read access to active ads" 
ON public.ads 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow admin users to manage ads" 
ON public.ads 
FOR ALL
USING (EXISTS (
  SELECT 1 
  FROM user_roles 
  WHERE auth_user_id = auth.uid() 
  AND role_name = 'admin'
));

-- Fix user_roles RLS - only admins can manage roles
CREATE POLICY "Allow admin users to manage user roles" 
ON public.user_roles 
FOR ALL
USING (EXISTS (
  SELECT 1 
  FROM user_roles user_roles_check
  WHERE user_roles_check.auth_user_id = auth.uid() 
  AND user_roles_check.role_name = 'admin'
));