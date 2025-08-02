-- Phase 1: Critical Database Security Fixes

-- Enable RLS on all tables that currently have it disabled
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interstitial_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_sources ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for ad_clicks (admin only access)
CREATE POLICY "Allow admin users to manage ad clicks" ON public.ad_clicks
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

-- Create secure RLS policies for ad_settings (admin only access)
CREATE POLICY "Allow admin users to manage ad settings" ON public.ad_settings
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

-- Create secure RLS policies for user_roles (admin only access)
CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

-- Create secure RLS policies for interstitial_ads (admin manage, public read active)
CREATE POLICY "Allow admin users to manage interstitial ads" ON public.interstitial_ads
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow public read access to active interstitial ads" ON public.interstitial_ads
FOR SELECT
TO public
USING (is_active = true);

-- Create secure RLS policies for download_sources (admin manage, public read)
CREATE POLICY "Allow admin users to manage download sources" ON public.download_sources
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE auth_user_id = auth.uid() AND role_name = 'admin'
));

CREATE POLICY "Allow public read access to download sources" ON public.download_sources
FOR SELECT
TO public
USING (true);

-- Fix the is_admin function to use proper search_path and security
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM public.user_roles
    WHERE auth_user_id = user_id
      AND role_name = 'admin'
  );
END;
$$;

-- Create proper admin role for demo user
INSERT INTO public.user_roles (auth_user_id, role_name)
SELECT 
  au.id,
  'admin'
FROM auth.users au
WHERE au.email = 'dinesh001kaushik@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.auth_user_id = au.id AND ur.role_name = 'admin'
  );

-- Update other database functions to use secure search_path
CREATE OR REPLACE FUNCTION public.search_movies(search_term text)
RETURNS SETOF movies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.movies
  WHERE 
    content_type = 'movie' AND
    is_visible = true AND
    (title ILIKE '%' || search_term || '%' OR
    CASE WHEN storyline IS NOT NULL THEN storyline ILIKE '%' || search_term || '%' ELSE FALSE END OR
    CASE WHEN genre IS NOT NULL THEN 
      EXISTS (SELECT 1 FROM unnest(genre) AS g WHERE g ILIKE '%' || search_term || '%') 
    ELSE FALSE END OR
    CASE WHEN seo_tags IS NOT NULL THEN 
      EXISTS (SELECT 1 FROM unnest(seo_tags) AS tag WHERE tag ILIKE '%' || search_term || '%')
    ELSE FALSE END OR
    CASE WHEN director IS NOT NULL THEN director ILIKE '%' || search_term || '%' ELSE FALSE END OR
    CASE WHEN production_house IS NOT NULL THEN production_house ILIKE '%' || search_term || '%' ELSE FALSE END)
  ORDER BY 
    CASE WHEN title ILIKE '%' || search_term || '%' THEN 0
         WHEN director ILIKE '%' || search_term || '%' THEN 1
         WHEN production_house ILIKE '%' || search_term || '%' THEN 2
         ELSE 3
    END,
    created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_series(search_term text)
RETURNS SETOF movies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.movies
  WHERE 
    content_type = 'series' AND
    is_visible = true AND
    (title ILIKE '%' || search_term || '%' OR
    CASE WHEN storyline IS NOT NULL THEN storyline ILIKE '%' || search_term || '%' ELSE FALSE END OR
    CASE WHEN genre IS NOT NULL THEN 
      EXISTS (SELECT 1 FROM unnest(genre) AS g WHERE g ILIKE '%' || search_term || '%') 
    ELSE FALSE END OR
    CASE WHEN seo_tags IS NOT NULL THEN 
      EXISTS (SELECT 1 FROM unnest(seo_tags) AS tag WHERE tag ILIKE '%' || search_term || '%')
    ELSE FALSE END OR
    CASE WHEN director IS NOT NULL THEN director ILIKE '%' || search_term || '%' ELSE FALSE END OR
    CASE WHEN production_house IS NOT NULL THEN production_house ILIKE '%' || search_term || '%' ELSE FALSE END)
  ORDER BY 
    CASE WHEN title ILIKE '%' || search_term || '%' THEN 0
         WHEN director ILIKE '%' || search_term || '%' THEN 1
         WHEN production_house ILIKE '%' || search_term || '%' THEN 2
         ELSE 3
    END,
    created_at DESC;
END;
$$;