
-- Add is_visible column to movies table
ALTER TABLE public.movies 
ADD COLUMN is_visible boolean DEFAULT true;

-- Update existing movies to be visible by default
UPDATE public.movies 
SET is_visible = true 
WHERE is_visible IS NULL;
