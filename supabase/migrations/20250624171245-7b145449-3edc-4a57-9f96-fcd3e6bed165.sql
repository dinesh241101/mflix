
-- First, let's populate the countries table
INSERT INTO countries (name) VALUES 
('India'), ('USA'), ('UK'), ('Japan'), ('Korea'), ('France'), ('Germany'), ('Italy'), ('Spain'), ('Canada'), ('Australia'), ('China'), ('Russia'), ('Brazil'), ('Mexico');

-- Populate the genres table with comprehensive movie genres
INSERT INTO genres (name, description, color) VALUES 
('Action', 'High-energy movies with intense sequences', '#dc2626'),
('Adventure', 'Exciting journeys and quests', '#ea580c'),
('Comedy', 'Humorous and entertaining films', '#facc15'),
('Drama', 'Serious narrative-driven stories', '#7c3aed'),
('Horror', 'Scary and suspenseful films', '#000000'),
('Romance', 'Love stories and romantic plots', '#ec4899'),
('Thriller', 'Suspenseful and tension-filled movies', '#6b7280'),
('Sci-Fi', 'Science fiction and futuristic themes', '#0ea5e9'),
('Fantasy', 'Magical and supernatural elements', '#8b5cf6'),
('Mystery', 'Puzzling and investigative stories', '#374151'),
('Crime', 'Criminal activities and investigations', '#991b1b'),
('War', 'Military conflicts and battles', '#92400e'),
('Biography', 'Life stories of real people', '#059669'),
('History', 'Historical events and periods', '#ca8a04'),
('Documentary', 'Non-fiction informational films', '#0d9488'),
('Animation', 'Animated movies and cartoons', '#f97316'),
('Bollywood', 'Indian Hindi cinema', '#ff6b6b'),
('Hollywood', 'American mainstream cinema', '#4ecdc4'),
('Tamil', 'Tamil language cinema', '#45b7d1'),
('Telugu', 'Telugu language cinema', '#96ceb4'),
('Malayalam', 'Malayalam language cinema', '#ffeaa7'),
('Kannada', 'Kannada language cinema', '#dda0dd'),
('Punjabi', 'Punjabi language cinema', '#98fb98'),
('Bengali', 'Bengali language cinema', '#f0e68c'),
('Dual Audio', 'Movies with multiple language tracks', '#20b2aa'),
('Hindi Dubbed', 'Foreign movies dubbed in Hindi', '#ff7f50'),
('English', 'English language content', '#87ceeb'),
('Latest Movies', 'Recently released films', '#ff1493'),
('Popular Movies', 'Trending and popular content', '#ffd700'),
('Classic Movies', 'Timeless and vintage films', '#daa520'),
('Web Series', 'Online streaming series', '#32cd32'),
('TV Shows', 'Television series content', '#ff6347'),
('Netflix', 'Netflix original content', '#e50914'),
('Amazon Prime', 'Amazon Prime originals', '#00a8e1'),
('Disney+', 'Disney Plus content', '#113ccf'),
('Hotstar', 'Hotstar streaming content', '#1f80e0'),
('720p', '720p video quality', '#28a745'),
('1080p', '1080p HD video quality', '#007bff'),
('480p', '480p video quality', '#6c757d'),
('4K', '4K Ultra HD quality', '#dc3545'),
('BluRay', 'BluRay disc quality', '#17a2b8'),
('HDRip', 'HD ripped content', '#ffc107'),
('DVDRip', 'DVD ripped content', '#6f42c1'),
('WEBRip', 'Web ripped content', '#e83e8c'),
('300MB', 'Small file size movies', '#fd7e14'),
('500MB', 'Medium file size movies', '#20c997'),
('700MB', 'Standard file size movies', '#6610f2'),
('1GB', 'Large file size movies', '#e91e63'),
('2GB', 'Extra large file size movies', '#795548'),
('America', 'American movies and shows', '#2196f3'),
('2024 Movies', '2024 released movies', '#4caf50'),
('2023 Movies', '2023 released movies', '#ff9800'),
('2022 Movies', '2022 released movies', '#9c27b0'),
('New Release', 'Newly released content', '#f44336'),
('Trending', 'Currently trending content', '#00bcd4');

-- Insert comprehensive movie data (25+ movies)
INSERT INTO movies (title, year, content_type, genre, quality, country, director, production_house, imdb_rating, storyline, seo_tags, poster_url, featured, is_visible, downloads) VALUES 

-- Bollywood Movies
('Dangal', 2016, 'movie', ARRAY['Bollywood', 'Drama', 'Biography', 'Hindi', '1080p', 'Latest Movies', 'Popular Movies'], '1080p', 'India', 'Nitesh Tiwari', 'Aamir Khan Productions', 8.4, 'Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.', ARRAY['dangal', 'aamir khan', 'wrestling', 'bollywood', 'biography'], 'https://images.unsplash.com/photo-1489599578870-e8cd0aab5c19?w=400', true, true, 125000),

('3 Idiots', 2009, 'movie', ARRAY['Bollywood', 'Comedy', 'Drama', 'Hindi', '1080p', 'Popular Movies', 'Classic Movies'], '1080p', 'India', 'Rajkumar Hirani', 'Vidhu Vinod Chopra Productions', 8.4, 'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.', ARRAY['3 idiots', 'aamir khan', 'comedy', 'bollywood', 'engineering'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', true, true, 98000),

('RRR', 2022, 'movie', ARRAY['Action', 'Drama', 'Telugu', 'Dual Audio', 'Hindi Dubbed', '4K', '1080p', '2022 Movies', 'Latest Movies', 'Popular Movies'], '4K', 'India', 'S.S. Rajamouli', 'DVV Entertainment', 7.9, 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', ARRAY['rrr', 'rajamouli', 'ram charan', 'jr ntr', 'action'], 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', true, true, 187000),

('Baahubali 2', 2017, 'movie', ARRAY['Action', 'Adventure', 'Telugu', 'Tamil', 'Hindi Dubbed', 'Dual Audio', '1080p', 'Popular Movies'], '1080p', 'India', 'S.S. Rajamouli', 'Arka Media Works', 8.2, 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.', ARRAY['baahubali', 'prabhas', 'rajamouli', 'action', 'telugu'], 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', true, true, 156000),

('KGF Chapter 2', 2022, 'movie', ARRAY['Action', 'Kannada', 'Hindi Dubbed', 'Dual Audio', '1080p', '2022 Movies', 'Latest Movies'], '1080p', 'India', 'Prashanth Neel', 'Hombale Films', 8.4, 'In the blood-soaked Kolar Gold Fields, Rocky''s name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.', ARRAY['kgf', 'yash', 'kannada', 'action', 'gold'], 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', true, true, 167000),

-- Hollywood Movies
('Avengers: Endgame', 2019, 'movie', ARRAY['Action', 'Adventure', 'Sci-Fi', 'Hollywood', 'English', '4K', '1080p', 'Popular Movies'], '4K', 'USA', 'Russo Brothers', 'Marvel Studios', 8.4, 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos'' actions.', ARRAY['avengers', 'marvel', 'superhero', 'action', 'endgame'], 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400', true, true, 245000),

('The Dark Knight', 2008, 'movie', ARRAY['Action', 'Crime', 'Drama', 'Hollywood', 'English', '1080p', 'Classic Movies', 'Popular Movies'], '1080p', 'USA', 'Christopher Nolan', 'Warner Bros', 9.0, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', ARRAY['batman', 'joker', 'dark knight', 'nolan', 'superhero'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', true, true, 198000),

('Inception', 2010, 'movie', ARRAY['Action', 'Sci-Fi', 'Thriller', 'Hollywood', 'English', '1080p', 'Popular Movies'], '1080p', 'USA', 'Christopher Nolan', 'Warner Bros', 8.8, 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', ARRAY['inception', 'nolan', 'dreams', 'sci-fi', 'leonardo dicaprio'], 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', true, true, 178000),

('Spider-Man: No Way Home', 2021, 'movie', ARRAY['Action', 'Adventure', 'Sci-Fi', 'Hollywood', 'English', '4K', '1080p', '2021 Movies', 'Latest Movies'], '4K', 'USA', 'Jon Watts', 'Sony Pictures', 8.2, 'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', ARRAY['spiderman', 'tom holland', 'marvel', 'multiverse', 'action'], 'https://images.unsplash.com/photo-1635863138275-d9864d481825?w=400', true, true, 201000),

('Interstellar', 2014, 'movie', ARRAY['Adventure', 'Drama', 'Sci-Fi', 'Hollywood', 'English', '1080p', 'Popular Movies'], '1080p', 'USA', 'Christopher Nolan', 'Paramount Pictures', 8.6, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', ARRAY['interstellar', 'nolan', 'space', 'sci-fi', 'matthew mcconaughey'], 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', false, true, 145000),

-- Tamil Movies
('Vikram', 2022, 'movie', ARRAY['Action', 'Thriller', 'Tamil', 'Hindi Dubbed', 'Dual Audio', '1080p', '2022 Movies', 'Latest Movies'], '1080p', 'India', 'Lokesh Kanagaraj', 'Raaj Kamal Films International', 8.4, 'Members of a black ops team must track and eliminate a gang of masked murderers.', ARRAY['vikram', 'kamal haasan', 'tamil', 'action', 'lokesh'], 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', true, true, 134000),

('Master', 2021, 'movie', ARRAY['Action', 'Drama', 'Tamil', 'Hindi Dubbed', 'Dual Audio', '1080p', '2021 Movies'], '1080p', 'India', 'Lokesh Kanagaraj', 'Seven Screen Studio', 7.3, 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the school children for criminal activities.', ARRAY['master', 'vijay', 'vijay sethupathi', 'tamil', 'action'], 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', false, true, 89000),

('Pushpa', 2021, 'movie', ARRAY['Action', 'Crime', 'Telugu', 'Tamil', 'Hindi Dubbed', 'Dual Audio', '1080p', '2021 Movies', 'Popular Movies'], '1080p', 'India', 'Sukumar', 'Mythri Movie Makers', 7.6, 'A labourer rises through the ranks of a red sandalwood smuggling syndicate, making some powerful enemies in the process.', ARRAY['pushpa', 'allu arjun', 'telugu', 'action', 'smuggling'], 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', true, true, 176000),

-- Web Series
('Sacred Games', 2018, 'series', ARRAY['Crime', 'Drama', 'Thriller', 'Web Series', 'Netflix', 'Hindi', '1080p', 'Popular Movies'], '1080p', 'India', 'Vikramaditya Motwane', 'Netflix', 8.7, 'A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.', ARRAY['sacred games', 'netflix', 'crime', 'mumbai', 'thriller'], 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', true, true, 87000),

('The Family Man', 2019, 'series', ARRAY['Action', 'Drama', 'Thriller', 'Web Series', 'Amazon Prime', 'Hindi', '1080p', 'Popular Movies'], '1080p', 'India', 'Raj Nidimoru', 'Amazon Prime Video', 8.7, 'A working man from the National Investigation Agency tries to protect the nation from terrorism, but also needs to keep his family safe from his secret job.', ARRAY['family man', 'amazon prime', 'spy', 'terrorism', 'manoj bajpayee'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', true, true, 92000),

('Stranger Things', 2016, 'series', ARRAY['Drama', 'Fantasy', 'Horror', 'Web Series', 'Netflix', 'English', '4K', '1080p', 'Popular Movies'], '4K', 'USA', 'The Duffer Brothers', 'Netflix', 8.7, 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', ARRAY['stranger things', 'netflix', 'horror', 'supernatural', 'sci-fi'], 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400', true, true, 156000),

-- Anime/Animation
('Your Name', 2016, 'movie', ARRAY['Animation', 'Romance', 'Drama', 'Japanese', 'Hindi Dubbed', 'Dual Audio', '1080p'], '1080p', 'Japan', 'Makoto Shinkai', 'CoMix Wave Films', 8.2, 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.', ARRAY['your name', 'anime', 'romance', 'body swap', 'japanese'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', false, true, 45000),

('Spirited Away', 2001, 'movie', ARRAY['Animation', 'Adventure', 'Family', 'Japanese', 'Hindi Dubbed', 'Dual Audio', '1080p', 'Classic Movies'], '1080p', 'Japan', 'Hayao Miyazaki', 'Studio Ghibli', 9.2, 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.', ARRAY['spirited away', 'miyazaki', 'ghibli', 'animation', 'fantasy'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', true, true, 67000),

-- More Recent Movies
('Oppenheimer', 2023, 'movie', ARRAY['Biography', 'Drama', 'History', 'Hollywood', 'English', '4K', '1080p', '2023 Movies', 'Latest Movies'], '4K', 'USA', 'Christopher Nolan', 'Universal Pictures', 8.4, 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', ARRAY['oppenheimer', 'nolan', 'biography', 'atomic bomb', 'history'], 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', true, true, 189000),

('Barbie', 2023, 'movie', ARRAY['Adventure', 'Comedy', 'Fantasy', 'Hollywood', 'English', '4K', '1080p', '2023 Movies', 'Latest Movies'], '4K', 'USA', 'Greta Gerwig', 'Warner Bros', 6.9, 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.', ARRAY['barbie', 'margot robbie', 'comedy', 'fantasy', 'pink'], 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', true, true, 167000),

('Dune', 2021, 'movie', ARRAY['Adventure', 'Drama', 'Sci-Fi', 'Hollywood', 'English', '4K', '1080p', '2021 Movies', 'Popular Movies'], '4K', 'USA', 'Denis Villeneuve', 'Warner Bros', 8.0, 'Feature adaptation of Frank Herbert''s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.', ARRAY['dune', 'timothee chalamet', 'sci-fi', 'desert', 'spice'], 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', true, true, 145000),

-- More Bollywood
('Zindagi Na Milegi Dobara', 2011, 'movie', ARRAY['Adventure', 'Comedy', 'Drama', 'Bollywood', 'Hindi', '1080p', 'Popular Movies'], '1080p', 'India', 'Zoya Akhtar', 'Excel Entertainment', 8.2, 'Three friends decide to turn their fantasy vacation into reality after one of their friends gets engaged.', ARRAY['znmd', 'hrithik roshan', 'adventure', 'friendship', 'spain'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', false, true, 78000),

('Gully Boy', 2019, 'movie', ARRAY['Drama', 'Music', 'Romance', 'Bollywood', 'Hindi', '1080p', 'Latest Movies'], '1080p', 'India', 'Zoya Akhtar', 'Excel Entertainment', 7.9, 'A coming-of-age story based on the lives of street rappers in Mumbai.', ARRAY['gully boy', 'ranveer singh', 'rap', 'mumbai', 'music'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', false, true, 89000),

-- Korean Movies
('Parasite', 2019, 'movie', ARRAY['Comedy', 'Drama', 'Thriller', 'Korean', 'Hindi Dubbed', 'Dual Audio', '1080p', 'Popular Movies'], '1080p', 'Korea', 'Bong Joon-ho', 'CJ Entertainment', 8.5, 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', ARRAY['parasite', 'korean', 'class', 'thriller', 'oscar'], 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', true, true, 123000),

('Train to Busan', 2016, 'movie', ARRAY['Action', 'Horror', 'Thriller', 'Korean', 'Hindi Dubbed', 'Dual Audio', '1080p'], '1080p', 'Korea', 'Yeon Sang-ho', 'Next Entertainment World', 7.6, 'While a zombie virus breaks out in South Korea, passengers struggle to survive on the train from Seoul to Busan.', ARRAY['train to busan', 'zombie', 'korean', 'horror', 'survival'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', false, true, 67000),

-- More Web Series
('Money Heist', 2017, 'series', ARRAY['Crime', 'Drama', 'Thriller', 'Web Series', 'Netflix', 'Spanish', 'Hindi Dubbed', 'Dual Audio', '1080p'], '1080p', 'Spain', 'Alex Pina', 'Netflix', 8.2, 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.', ARRAY['money heist', 'la casa de papel', 'heist', 'netflix', 'spanish'], 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', true, true, 134000),

('Breaking Bad', 2008, 'series', ARRAY['Crime', 'Drama', 'Thriller', 'TV Shows', 'English', '1080p', 'Popular Movies', 'Classic Movies'], '1080p', 'USA', 'Vince Gilligan', 'Sony Pictures Television', 9.5, 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family''s future.', ARRAY['breaking bad', 'walter white', 'drugs', 'crime', 'drama'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', true, true, 189000);

-- Insert download links for movies
INSERT INTO download_links (movie_id, quality, file_size, download_url, resolution) 
SELECT 
    m.movie_id,
    '1080p',
    CASE 
        WHEN random() < 0.3 THEN '2.5 GB'
        WHEN random() < 0.6 THEN '1.8 GB'
        ELSE '3.2 GB'
    END,
    'https://example-download-server.com/movies/' || m.movie_id || '/1080p',
    '1920x1080'
FROM movies m;

INSERT INTO download_links (movie_id, quality, file_size, download_url, resolution) 
SELECT 
    m.movie_id,
    '720p',
    CASE 
        WHEN random() < 0.3 THEN '1.2 GB'
        WHEN random() < 0.6 THEN '900 MB'
        ELSE '1.5 GB'
    END,
    'https://example-download-server.com/movies/' || m.movie_id || '/720p',
    '1280x720'
FROM movies m;

INSERT INTO download_links (movie_id, quality, file_size, download_url, resolution) 
SELECT 
    m.movie_id,
    '480p',
    CASE 
        WHEN random() < 0.3 THEN '600 MB'
        WHEN random() < 0.6 THEN '400 MB'
        ELSE '800 MB'
    END,
    'https://example-download-server.com/movies/' || m.movie_id || '/480p',
    '854x480'
FROM movies m;

-- Add some 4K downloads for featured movies
INSERT INTO download_links (movie_id, quality, file_size, download_url, resolution) 
SELECT 
    m.movie_id,
    '4K',
    CASE 
        WHEN random() < 0.3 THEN '8.2 GB'
        WHEN random() < 0.6 THEN '6.5 GB'
        ELSE '9.8 GB'
    END,
    'https://example-download-server.com/movies/' || m.movie_id || '/4k',
    '3840x2160'
FROM movies m 
WHERE m.featured = true
LIMIT 10;

-- Add media clips (trailers) for some movies
INSERT INTO media_clips (movie_id, clip_type, clip_title, video_url, thumbnail_url)
SELECT 
    m.movie_id,
    'trailer',
    m.title || ' - Official Trailer',
    'https://youtube.com/watch?v=' || substr(md5(m.movie_id::text), 1, 11),
    m.poster_url
FROM movies m
WHERE random() < 0.6;

-- Add some cast members for popular movies
INSERT INTO movie_cast (movie_id, actor_name, actor_role)
SELECT movie_id, 'Shah Rukh Khan', 'Lead Actor' FROM movies WHERE title = '3 Idiots'
UNION ALL
SELECT movie_id, 'Aamir Khan', 'Rancho' FROM movies WHERE title = '3 Idiots'
UNION ALL
SELECT movie_id, 'R. Madhavan', 'Farhan' FROM movies WHERE title = '3 Idiots'
UNION ALL
SELECT movie_id, 'Aamir Khan', 'Mahavir Singh Phogat' FROM movies WHERE title = 'Dangal'
UNION ALL
SELECT movie_id, 'Fatima Sana Shaikh', 'Geeta Phogat' FROM movies WHERE title = 'Dangal'
UNION ALL
SELECT movie_id, 'Robert Downey Jr.', 'Iron Man' FROM movies WHERE title = 'Avengers: Endgame'
UNION ALL
SELECT movie_id, 'Chris Evans', 'Captain America' FROM movies WHERE title = 'Avengers: Endgame'
UNION ALL
SELECT movie_id, 'Scarlett Johansson', 'Black Widow' FROM movies WHERE title = 'Avengers: Endgame'
UNION ALL
SELECT movie_id, 'Christian Bale', 'Batman' FROM movies WHERE title = 'The Dark Knight'
UNION ALL
SELECT movie_id, 'Heath Ledger', 'Joker' FROM movies WHERE title = 'The Dark Knight'
UNION ALL
SELECT movie_id, 'Leonardo DiCaprio', 'Dom Cobb' FROM movies WHERE title = 'Inception'
UNION ALL
SELECT movie_id, 'Marion Cotillard', 'Mal' FROM movies WHERE title = 'Inception';
