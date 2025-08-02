-- Fix remaining RLS issues identified by security linter

-- Check if RLS is properly enabled on ads table and enable it if not
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Update ads table policies to allow admin management and public read of active ads
DROP POLICY IF EXISTS "Allow select on ads" ON public.ads;

CREATE POLICY "Allow admin users to manage ads" ON public.ads
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow public read access to active ads" ON public.ads
FOR SELECT
TO public
USING (is_active = true);

-- Fix video_ads table RLS policies
DROP POLICY IF EXISTS "Allow public read access to video ads" ON public.video_ads;

CREATE POLICY "Allow admin users to manage video ads" ON public.video_ads
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow public read access to active video ads" ON public.video_ads
FOR SELECT
TO public
USING (is_active = true);

-- Fix uploaded_images table policies
DROP POLICY IF EXISTS "Allow users to upload images" ON public.uploaded_images;
DROP POLICY IF EXISTS "Allow public read access to uploaded images" ON public.uploaded_images;

CREATE POLICY "Allow admin users to manage uploaded images" ON public.uploaded_images
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow authenticated users to upload images" ON public.uploaded_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Allow public read access to uploaded images" ON public.uploaded_images
FOR SELECT
TO public
USING (true);

-- Fix analytics table policies to be more secure
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.analytics;
DROP POLICY IF EXISTS "Insert own analytics" ON public.analytics;
DROP POLICY IF EXISTS "select_own_data" ON public.analytics;

CREATE POLICY "Allow admin users to manage analytics" ON public.analytics
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow users to insert their own analytics" ON public.analytics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own analytics" ON public.analytics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);