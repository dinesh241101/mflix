-- Create comprehensive download sources for Demon Slayer
INSERT INTO download_sources (name, icon_url) VALUES 
('Google Drive', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg'),
('MEGA', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mega.svg'),
('MediaFire', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mediafire.svg'),
('Torrent', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bittorrent.svg')
ON CONFLICT (name) DO NOTHING;

-- Update Demon Slayer movie with better data
UPDATE movies 
SET 
  title = 'Demon Slayer: Kimetsu no Yaiba',
  storyline = 'Tanjiro Kamado is a kind-hearted and intelligent boy who lives with his family in the mountains. After his father''s death, he became his family''s breadwinner and travels to the nearby village to sell charcoal. When he returns home, he finds his family slaughtered by a demon. His sister Nezuko is the sole survivor, but she has been transformed into a demon herself.',
  seo_tags = ARRAY['demon slayer', 'kimetsu no yaiba', 'tanjiro', 'nezuko', 'anime', 'supernatural', 'action', 'adventure', 'Japanese', 'shounen'],
  director = 'Haruo Sotozaki',
  production_house = 'Ufotable',
  genre = ARRAY['Action', 'Adventure', 'Supernatural', 'Historical', 'Shounen'],
  year = 2019,
  imdb_rating = 8.7,
  downloads = 25000,
  featured = true,
  quality = '4K',
  country = 'Japan',
  poster_url = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
  trailer_url = 'https://www.youtube.com/watch?v=VQGCKyvzIM4',
  screenshots = ARRAY[
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1542736705-53f0131d1e98?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop'
  ]
WHERE title ILIKE '%demon slayer%' AND movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d';

-- Clear existing download links for Demon Slayer
DELETE FROM download_mirrors WHERE link_id IN (
  SELECT link_id FROM download_links WHERE movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d'
);
DELETE FROM download_links WHERE movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d';

-- Insert comprehensive download links for Demon Slayer
WITH demon_slayer_movie AS (
  SELECT movie_id FROM movies WHERE title ILIKE '%demon slayer%' AND movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d'
),
download_links_data AS (
  INSERT INTO download_links (movie_id, quality, file_size, resolution, download_url)
  SELECT 
    dm.movie_id,
    quality,
    file_size,
    resolution,
    'https://download-server.mflix.com/demon-slayer/' || quality || '/main.mkv'
  FROM demon_slayer_movie dm
  CROSS JOIN (VALUES
    ('480p', '650 MB', '854x480'),
    ('720p', '1.2 GB', '1280x720'),
    ('1080p', '2.5 GB', '1920x1080'),
    ('4K', '8.5 GB', '3840x2160')
  ) AS qualities(quality, file_size, resolution)
  RETURNING link_id, quality
)
-- Insert multiple download mirrors for each quality
INSERT INTO download_mirrors (link_id, source_name, mirror_url, display_order)
SELECT 
  dl.link_id,
  sources.source_name,
  'https://' || 
  CASE sources.source_name
    WHEN 'Google Drive' THEN 'drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view'
    WHEN 'MEGA' THEN 'mega.nz/file/A1b2C3d4#xyz789abc123def456ghi'
    WHEN 'MediaFire' THEN 'mediafire.com/file/a1b2c3d4e5f6g7h/demon_slayer_' || LOWER(dl.quality) || '.mkv'
    WHEN 'Torrent' THEN 'torrent-site.com/download/demon-slayer-' || LOWER(dl.quality) || '.torrent'
  END,
  sources.display_order
FROM download_links_data dl
CROSS JOIN (VALUES
  ('Google Drive', 1),
  ('MEGA', 2),
  ('MediaFire', 3),
  ('Torrent', 4)
) AS sources(source_name, display_order);

-- Add movie cast for Demon Slayer
INSERT INTO movie_cast (movie_id, actor_name, actor_role)
SELECT 
  movie_id,
  actor_name,
  actor_role
FROM (SELECT movie_id FROM movies WHERE title ILIKE '%demon slayer%' AND movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d') dm
CROSS JOIN (VALUES
  ('Natsuki Hanae', 'Tanjiro Kamado (Voice)'),
  ('Satomi Sato', 'Nezuko Kamado (Voice)'),
  ('Hiro Shimono', 'Zenitsu Agatsuma (Voice)'),
  ('Yoshitsugu Matsuoka', 'Inosuke Hashibira (Voice)'),
  ('Takahiro Sakurai', 'Giyu Tomioka (Voice)'),
  ('Hochu Otsuka', 'Sakonji Urokodaki (Voice)')
) AS cast_data(actor_name, actor_role);