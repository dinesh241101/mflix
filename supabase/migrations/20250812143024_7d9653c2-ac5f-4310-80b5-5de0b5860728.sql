
-- First, let's create the Spider-Man No Way Home movie data
INSERT INTO public.movies (
  title, year, content_type, genre, quality, country, director, production_house, 
  imdb_rating, storyline, seo_tags, poster_url, featured, downloads, is_visible, 
  trailer_url, screenshots
) VALUES (
  'Spider-Man: No Way Home', 
  2021, 
  'movie',
  ARRAY['Action', 'Adventure', 'Sci-Fi'],
  '1080p',
  'USA',
  'Jon Watts',
  'Columbia Pictures',
  8.2,
  'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
  ARRAY['spiderman', 'marvel', 'superhero', 'action', 'adventure', 'tom holland', 'dual audio', 'hollywood'],
  'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop',
  true,
  15420,
  true,
  'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  ARRAY[
    'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=450&fit=crop'
  ]
) ON CONFLICT (title, year) DO UPDATE SET
  storyline = EXCLUDED.storyline,
  seo_tags = EXCLUDED.seo_tags,
  poster_url = EXCLUDED.poster_url,
  trailer_url = EXCLUDED.trailer_url,
  screenshots = EXCLUDED.screenshots;

-- Get the movie ID for Spider-Man
DO $$ 
DECLARE 
    spiderman_movie_id uuid;
BEGIN
    SELECT movie_id INTO spiderman_movie_id 
    FROM public.movies 
    WHERE title = 'Spider-Man: No Way Home' AND year = 2021;
    
    -- Clear existing download links for Spider-Man
    DELETE FROM public.download_links WHERE movie_id = spiderman_movie_id;
    
    -- Insert download links for different qualities
    INSERT INTO public.download_links (movie_id, quality, file_size, download_url) VALUES
    (spiderman_movie_id, '480p', '850MB', 'https://drive.google.com/file/d/spiderman-480p/view'),
    (spiderman_movie_id, '720p', '1.2GB', 'https://drive.google.com/file/d/spiderman-720p/view'),
    (spiderman_movie_id, '1080p', '2.5GB', 'https://drive.google.com/file/d/spiderman-1080p/view'),
    (spiderman_movie_id, '4K', '8.5GB', 'https://drive.google.com/file/d/spiderman-4k/view');
    
    -- Insert multiple mirror links for each quality
    INSERT INTO public.download_mirrors (link_id, source_name, mirror_url) 
    SELECT dl.link_id, 'Google Drive', dl.download_url FROM public.download_links dl WHERE dl.movie_id = spiderman_movie_id;
    
    INSERT INTO public.download_mirrors (link_id, source_name, mirror_url) 
    SELECT dl.link_id, 'MEGA', REPLACE(dl.download_url, 'drive.google.com', 'mega.nz') FROM public.download_links dl WHERE dl.movie_id = spiderman_movie_id;
    
    INSERT INTO public.download_mirrors (link_id, source_name, mirror_url) 
    SELECT dl.link_id, 'MediaFire', REPLACE(dl.download_url, 'drive.google.com', 'mediafire.com') FROM public.download_links dl WHERE dl.movie_id = spiderman_movie_id;
    
    -- Insert cast information
    INSERT INTO public.movie_cast (movie_id, actor_name, actor_role) VALUES
    (spiderman_movie_id, 'Tom Holland', 'Peter Parker / Spider-Man'),
    (spiderman_movie_id, 'Zendaya', 'MJ'),
    (spiderman_movie_id, 'Benedict Cumberbatch', 'Doctor Strange'),
    (spiderman_movie_id, 'Jacob Batalon', 'Ned Leeds'),
    (spiderman_movie_id, 'Jon Favreau', 'Happy Hogan'),
    (spiderman_movie_id, 'Willem Dafoe', 'Green Goblin / Norman Osborn'),
    (spiderman_movie_id, 'Alfred Molina', 'Doctor Octopus / Otto Octavius'),
    (spiderman_movie_id, 'Jamie Foxx', 'Electro / Max Dillon');
END $$;

-- Create redirect loop links table
CREATE TABLE IF NOT EXISTS public.redirect_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL, -- 'download_cta_1', 'download_cta_2', 'download_cta_3', 'page_switch', 'same_page_click'
  redirect_url text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for redirect links
ALTER TABLE public.redirect_links ENABLE ROW LEVEL SECURITY;

-- Create policies for redirect links
CREATE POLICY "Allow admin users to manage redirect links" 
ON public.redirect_links 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.auth_user_id = auth.uid() 
  AND user_roles.role_name = 'admin'
));

CREATE POLICY "Allow public read access to active redirect links" 
ON public.redirect_links 
FOR SELECT 
USING (is_active = true);

-- Create episodes table for web series
CREATE TABLE IF NOT EXISTS public.series_episodes (
  episode_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid REFERENCES public.movies(movie_id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  episode_title text,
  episode_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(series_id, episode_number)
);

-- Create episode download links table
CREATE TABLE IF NOT EXISTS public.episode_download_links (
  link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid REFERENCES public.series_episodes(episode_id) ON DELETE CASCADE,
  quality text NOT NULL,
  file_size text NOT NULL,
  download_url text NOT NULL,
  source_name text DEFAULT 'Direct Link',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for episodes tables
ALTER TABLE public.series_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_download_links ENABLE ROW LEVEL SECURITY;

-- Create policies for episodes
CREATE POLICY "Allow admin users to manage episodes" 
ON public.series_episodes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.auth_user_id = auth.uid() 
  AND user_roles.role_name = 'admin'
));

CREATE POLICY "Allow public read access to episodes" 
ON public.series_episodes 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin users to manage episode links" 
ON public.episode_download_links 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.auth_user_id = auth.uid() 
  AND user_roles.role_name = 'admin'
));

CREATE POLICY "Allow public read access to active episode links" 
ON public.episode_download_links 
FOR SELECT 
USING (is_active = true);

-- Create bulk upload tracking table
CREATE TABLE IF NOT EXISTS public.bulk_uploads (
  upload_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  total_rows integer DEFAULT 0,
  successful_rows integer DEFAULT 0,
  failed_rows integer DEFAULT 0,
  status text DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  error_details jsonb,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS for bulk uploads
ALTER TABLE public.bulk_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for bulk uploads
CREATE POLICY "Allow admin users to manage bulk uploads" 
ON public.bulk_uploads 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.auth_user_id = auth.uid() 
  AND user_roles.role_name = 'admin'
));

-- Insert some sample redirect links
INSERT INTO public.redirect_links (position, redirect_url, is_active, display_order) VALUES
('download_cta_1', 'https://ads.example.com/redirect1', true, 1),
('download_cta_1', 'https://ads.example.com/redirect2', true, 2),
('download_cta_2', 'https://ads.example.com/redirect3', true, 1),
('page_switch', 'https://ads.example.com/redirect4', true, 1),
('same_page_click', 'https://ads.example.com/redirect5', true, 1);
