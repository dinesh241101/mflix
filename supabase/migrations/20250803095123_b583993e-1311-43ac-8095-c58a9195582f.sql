-- First, let's check if download sources exist and add them properly
INSERT INTO download_sources (name, icon_url) 
SELECT name, icon_url FROM (VALUES
  ('Google Drive', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg'),
  ('MEGA', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mega.svg'),
  ('MediaFire', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mediafire.svg'),
  ('Torrent', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bittorrent.svg')
) AS v(name, icon_url)
WHERE NOT EXISTS (SELECT 1 FROM download_sources WHERE download_sources.name = v.name);

-- Update Demon Slayer movie with comprehensive data
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

-- Clear existing download data for Demon Slayer to rebuild it properly
DELETE FROM download_mirrors WHERE link_id IN (
  SELECT link_id FROM download_links WHERE movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d'
);
DELETE FROM download_links WHERE movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d';

-- Insert download links for each quality
INSERT INTO download_links (movie_id, quality, file_size, resolution, download_url)
VALUES
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', '480p', '650 MB', '854x480', 'https://download-server.mflix.com/demon-slayer/480p/main.mkv'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', '720p', '1.2 GB', '1280x720', 'https://download-server.mflix.com/demon-slayer/720p/main.mkv'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', '1080p', '2.5 GB', '1920x1080', 'https://download-server.mflix.com/demon-slayer/1080p/main.mkv'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', '4K', '8.5 GB', '3840x2160', 'https://download-server.mflix.com/demon-slayer/4k/main.mkv');

-- Add multiple download mirrors for each link
INSERT INTO download_mirrors (link_id, source_name, mirror_url, display_order)
SELECT 
  dl.link_id,
  m.source_name,
  CASE m.source_name
    WHEN 'Google Drive' THEN 'https://drive.google.com/file/d/1DemonSlayer' || dl.quality || 'Link/view'
    WHEN 'MEGA' THEN 'https://mega.nz/file/DemonSlayer' || dl.quality || '#AbcDef123'
    WHEN 'MediaFire' THEN 'https://mediafire.com/file/demon-slayer-' || LOWER(dl.quality) || '/file'
    WHEN 'Torrent' THEN 'https://torrent-site.com/demon-slayer-' || LOWER(dl.quality) || '.torrent'
  END,
  m.display_order
FROM download_links dl
CROSS JOIN (VALUES
  ('Google Drive', 1),
  ('MEGA', 2), 
  ('MediaFire', 3),
  ('Torrent', 4)
) AS m(source_name, display_order)
WHERE dl.movie_id = '4d16c63d-9018-4309-8177-ae7a1c1a3b4d';

-- Add movie cast
INSERT INTO movie_cast (movie_id, actor_name, actor_role)
VALUES
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Natsuki Hanae', 'Tanjiro Kamado (Voice)'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Satomi Sato', 'Nezuko Kamado (Voice)'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Hiro Shimono', 'Zenitsu Agatsuma (Voice)'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Yoshitsugu Matsuoka', 'Inosuke Hashibira (Voice)'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Takahiro Sakurai', 'Giyu Tomioka (Voice)'),
  ('4d16c63d-9018-4309-8177-ae7a1c1a3b4d', 'Hochu Otsuka', 'Sakonji Urokodaki (Voice)');