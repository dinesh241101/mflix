
import { supabase } from "@/integrations/supabase/client";

export const createSampleData = async () => {
  try {
    console.log("Creating sample data...");

    // Sample Movies
    const sampleMovies = [
      {
        title: "The Matrix",
        year: 1999,
        content_type: "movie",
        genre: ["Action", "Sci-Fi"],
        quality: "1080p",
        country: "USA",
        director: "The Wachowskis",
        production_house: "Warner Bros",
        imdb_rating: 8.7,
        storyline: "A computer programmer discovers that reality as he knows it is actually a simulation, and he must fight to save humanity from machines.",
        seo_tags: ["matrix", "keanu reeves", "sci-fi", "action"],
        poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
        featured: true,
        is_visible: true,
        downloads: 15420,
        screenshots: [
          "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      },
      {
        title: "Inception",
        year: 2010,
        content_type: "movie",
        genre: ["Action", "Thriller", "Sci-Fi"],
        quality: "1080p",
        country: "USA",
        director: "Christopher Nolan",
        production_house: "Warner Bros",
        imdb_rating: 8.8,
        storyline: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        seo_tags: ["inception", "leonardo dicaprio", "nolan", "dreams"],
        poster_url: "https://images.unsplash.com/photo-1489599797906-352149e54b21?w=400&h=600&fit=crop",
        featured: true,
        is_visible: true,
        downloads: 23150,
        screenshots: [
          "https://images.unsplash.com/photo-1489599797906-352149e54b21?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      },
      {
        title: "Interstellar",
        year: 2014,
        content_type: "movie",
        genre: ["Drama", "Sci-Fi"],
        quality: "4K",
        country: "USA",
        director: "Christopher Nolan",
        production_house: "Paramount Pictures",
        imdb_rating: 8.6,
        storyline: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        seo_tags: ["interstellar", "matthew mcconaughey", "space", "nolan"],
        poster_url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
        featured: false,
        is_visible: true,
        downloads: 18750,
        screenshots: [
          "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=450&fit=crop"
        ]
      }
    ];

    // Sample Web Series
    const sampleSeries = [
      {
        title: "Breaking Bad",
        year: 2008,
        content_type: "series",
        genre: ["Crime", "Drama", "Thriller"],
        quality: "1080p",
        country: "USA",
        director: "Vince Gilligan",
        production_house: "AMC",
        imdb_rating: 9.5,
        storyline: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
        seo_tags: ["breaking bad", "walter white", "bryan cranston", "drama"],
        poster_url: "https://images.unsplash.com/photo-1594736797933-d0d7e6999f2a?w=400&h=600&fit=crop",
        featured: true,
        is_visible: true,
        downloads: 42300,
        screenshots: [
          "https://images.unsplash.com/photo-1594736797933-d0d7e6999f2a?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      },
      {
        title: "Stranger Things",
        year: 2016,
        content_type: "series",
        genre: ["Horror", "Sci-Fi", "Thriller"],
        quality: "4K",
        country: "USA",
        director: "The Duffer Brothers",
        production_house: "Netflix",
        imdb_rating: 8.7,
        storyline: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.",
        seo_tags: ["stranger things", "netflix", "horror", "sci-fi"],
        poster_url: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=600&fit=crop",
        featured: true,
        is_visible: true,
        downloads: 35600,
        screenshots: [
          "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      }
    ];

    // Sample Anime
    const sampleAnime = [
      {
        title: "Attack on Titan",
        year: 2013,
        content_type: "anime",
        genre: ["Action", "Drama", "Fantasy"],
        quality: "1080p",
        country: "Japan",
        director: "Tetsuro Araki",
        production_house: "Studio Pierrot",
        imdb_rating: 9.0,
        storyline: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
        seo_tags: ["attack on titan", "shingeki no kyojin", "titans", "anime"],
        poster_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        featured: true,
        is_visible: true,
        downloads: 28900,
        screenshots: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      },
      {
        title: "Demon Slayer",
        year: 2019,
        content_type: "anime",
        genre: ["Action", "Adventure", "Supernatural"],
        quality: "1080p",
        country: "Japan",
        director: "Haruo Sotozaki",
        production_house: "Ufotable",
        imdb_rating: 8.7,
        storyline: "A young boy becomes a demon slayer to avenge his family and cure his sister.",
        seo_tags: ["demon slayer", "kimetsu no yaiba", "tanjiro", "anime"],
        poster_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop",
        featured: false,
        is_visible: true,
        downloads: 21400,
        screenshots: [
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ]
      }
    ];

    // Insert sample movies
    for (const movie of sampleMovies) {
      const { data, error } = await supabase
        .from('movies')
        .insert(movie)
        .select('movie_id')
        .single();
      
      if (error) {
        console.error("Error inserting movie:", error);
        continue;
      }

      // Add download links for each movie
      if (data?.movie_id) {
        await supabase.from('download_links').insert([
          {
            movie_id: data.movie_id,
            quality: "1080p",
            file_size: "2.5 GB",
            download_url: "https://example.com/download/1080p"
          },
          {
            movie_id: data.movie_id,
            quality: "720p",
            file_size: "1.2 GB",
            download_url: "https://example.com/download/720p"
          }
        ]);

        // Add trailer
        await supabase.from('media_clips').insert({
          movie_id: data.movie_id,
          clip_title: `${movie.title} - Trailer`,
          clip_type: 'trailer',
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        });
      }
    }

    // Insert sample series
    for (const series of sampleSeries) {
      const { data, error } = await supabase
        .from('movies')
        .insert(series)
        .select('movie_id')
        .single();
      
      if (error) {
        console.error("Error inserting series:", error);
        continue;
      }

      if (data?.movie_id) {
        await supabase.from('download_links').insert([
          {
            movie_id: data.movie_id,
            quality: "1080p",
            file_size: "15.5 GB",
            download_url: "https://example.com/download/series/1080p"
          }
        ]);
      }
    }

    // Insert sample anime
    for (const anime of sampleAnime) {
      const { data, error } = await supabase
        .from('movies')
        .insert(anime)
        .select('movie_id')
        .single();
      
      if (error) {
        console.error("Error inserting anime:", error);
        continue;
      }

      if (data?.movie_id) {
        await supabase.from('download_links').insert([
          {
            movie_id: data.movie_id,
            quality: "1080p",
            file_size: "8.2 GB",
            download_url: "https://example.com/download/anime/1080p"
          }
        ]);
      }
    }

    // Sample Shorts
    const sampleShorts = [
      {
        title: "Epic Action Short",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        duration: 45,
        is_visible: true
      },
      {
        title: "Comedy Moments",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1594736797933-d0d7e6999f2a?w=400&h=600&fit=crop",
        duration: 30,
        is_visible: true
      },
      {
        title: "Behind the Scenes",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        duration: 60,
        is_visible: true
      }
    ];

    // Insert sample shorts
    for (const short of sampleShorts) {
      const { error } = await supabase
        .from('shorts')
        .insert(short);
      
      if (error) {
        console.error("Error inserting short:", error);
      }
    }

    // Sample genres
    const sampleGenres = [
      { name: "Action", description: "High-energy movies with intense sequences", color: "#ef4444" },
      { name: "Comedy", description: "Funny and entertaining content", color: "#f59e0b" },
      { name: "Drama", description: "Character-driven stories with emotional depth", color: "#3b82f6" },
      { name: "Horror", description: "Scary and suspenseful content", color: "#7c3aed" },
      { name: "Sci-Fi", description: "Science fiction and futuristic themes", color: "#06b6d4" },
      { name: "Romance", description: "Love stories and romantic themes", color: "#ec4899" },
      { name: "Thriller", description: "Suspenseful and edge-of-your-seat content", color: "#dc2626" },
      { name: "Fantasy", description: "Magical and fantastical worlds", color: "#059669" }
    ];

    for (const genre of sampleGenres) {
      const { error } = await supabase
        .from('genres')
        .insert(genre);
      
      if (error) {
        console.error("Error inserting genre:", error);
      }
    }

    console.log("Sample data created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating sample data:", error);
    return false;
  }
};
