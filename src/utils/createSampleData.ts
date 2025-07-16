
import { supabase } from "@/integrations/supabase/client";

export const createComprehensiveSampleData = async () => {
  try {
    console.log("Creating comprehensive sample data...");

    // Create admin user role for demo user
    const { error: adminRoleError } = await supabase
      .from('user_roles')
      .upsert({
        auth_user_id: '00000000-0000-0000-0000-000000000000', // Demo user ID
        role_name: 'admin'
      }, { onConflict: 'auth_user_id,role_name' });

    if (adminRoleError && !adminRoleError.message.includes('duplicate')) {
      console.error("Error creating admin role:", adminRoleError);
    }

    // Sample Genres
    const genres = [
      { name: "Action", description: "High-energy movies with intense sequences", color: "#ef4444" },
      { name: "Comedy", description: "Funny and entertaining content", color: "#f59e0b" },
      { name: "Drama", description: "Character-driven stories with emotional depth", color: "#3b82f6" },
      { name: "Horror", description: "Scary and suspenseful content", color: "#7c3aed" },
      { name: "Sci-Fi", description: "Science fiction and futuristic themes", color: "#06b6d4" },
      { name: "Romance", description: "Love stories and romantic themes", color: "#ec4899" },
      { name: "Thriller", description: "Suspenseful and edge-of-your-seat content", color: "#dc2626" },
      { name: "Fantasy", description: "Magical and fantastical worlds", color: "#059669" },
      { name: "Adventure", description: "Exciting journeys and quests", color: "#d97706" },
      { name: "Crime", description: "Criminal activities and investigations", color: "#4338ca" }
    ];

    const { error: genresError } = await supabase
      .from('genres')
      .upsert(genres, { onConflict: 'name' });

    if (genresError) {
      console.error("Error inserting genres:", genresError);
    }

    // Sample Movies
    const movies = [
      {
        title: "The Matrix Reloaded",
        content_type: "movie",
        genre: ["Action", "Sci-Fi"],
        year: 1999,
        imdb_rating: 8.7,
        poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
        storyline: "A computer programmer discovers that reality as he knows it is actually a simulation.",
        director: "The Wachowskis",
        production_house: "Warner Bros",
        country: "USA",
        quality: "4K",
        featured: true,
        is_visible: true,
        downloads: 15420,
        screenshots: [
          "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ],
        seo_tags: ["matrix", "keanu reeves", "sci-fi", "action", "cyberpunk"]
      },
      {
        title: "Inception Dreams",
        content_type: "movie",
        genre: ["Action", "Thriller", "Sci-Fi"],
        year: 2010,
        imdb_rating: 8.8,
        poster_url: "https://images.unsplash.com/photo-1489599797906-352149e54b21?w=400&h=600&fit=crop",
        storyline: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        director: "Christopher Nolan",
        production_house: "Warner Bros",
        country: "USA",
        quality: "4K",
        featured: true,
        is_visible: true,
        downloads: 23150,
        screenshots: [
          "https://images.unsplash.com/photo-1489599797906-352149e54b21?w=800&h=450&fit=crop",
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
        ],
        seo_tags: ["inception", "leonardo dicaprio", "nolan", "dreams", "thriller"]
      },
      {
        title: "Galactic Warriors",
        content_type: "movie",
        genre: ["Action", "Adventure", "Sci-Fi"],
        year: 2023,
        imdb_rating: 7.9,
        poster_url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
        storyline: "In a distant galaxy, warriors fight against an evil empire to restore peace.",
        director: "Alex Johnson",
        production_house: "Cosmic Studios",
        country: "USA",
        quality: "4K",
        featured: false,
        is_visible: true,
        downloads: 12890,
        screenshots: [
          "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=450&fit=crop"
        ],
        seo_tags: ["space", "warriors", "galaxy", "empire", "adventure"]
      },
      {
        title: "Comedy Central",
        content_type: "movie",
        genre: ["Comedy"],
        year: 2022,
        imdb_rating: 7.2,
        poster_url: "https://images.unsplash.com/photo-1594736797933-d0d7e6999f2a?w=400&h=600&fit=crop",
        storyline: "A hilarious comedy about everyday situations that go hilariously wrong.",
        director: "Sarah Wilson",
        production_house: "Laugh Factory",
        country: "USA",
        quality: "1080p",
        featured: false,
        is_visible: true,
        downloads: 8750,
        screenshots: [
          "https://images.unsplash.com/photo-1594736797933-d0d7e6999f2a?w=800&h=450&fit=crop"
        ],
        seo_tags: ["comedy", "funny", "humor", "entertainment"]
      }
    ];

    // Sample Web Series
    const series = [
      {
        title: "Breaking Boundaries",
        content_type: "series",
        genre: ["Crime", "Drama", "Thriller"],
        year: 2008,
        imdb_rating: 9.5,
        poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        storyline: "A chemistry teacher diagnosed with cancer turns to manufacturing drugs to secure his family's future.",
        director: "Vince Gilligan",
        production_house: "AMC",
        country: "USA",
        quality: "4K",
        featured: true,
        is_visible: true,
        downloads: 42300,
        screenshots: [
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop"
        ],
        seo_tags: ["crime", "drama", "teacher", "family", "chemistry"]
      },
      {
        title: "Stranger Dimensions",
        content_type: "series",
        genre: ["Horror", "Sci-Fi", "Thriller"],
        year: 2016,
        imdb_rating: 8.7,
        poster_url: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=600&fit=crop",
        storyline: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
        director: "The Duffer Brothers",
        production_house: "Netflix",
        country: "USA",
        quality: "4K",
        featured: true,
        is_visible: true,
        downloads: 35600,
        screenshots: [
          "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=450&fit=crop"
        ],
        seo_tags: ["horror", "sci-fi", "mystery", "experiments", "supernatural"]
      },
      {
        title: "Crown of Thrones",
        content_type: "series",
        genre: ["Drama", "Fantasy", "Adventure"],
        year: 2019,
        imdb_rating: 8.9,
        poster_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        storyline: "Noble families fight for control of the mythical land of Westeros.",
        director: "David Benioff",
        production_house: "HBO",
        country: "USA",
        quality: "4K",
        featured: false,
        is_visible: true,
        downloads: 28900,
        screenshots: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop"
        ],
        seo_tags: ["fantasy", "medieval", "dragons", "politics", "war"]
      }
    ];

    // Sample Anime
    const anime = [
      {
        title: "Titan Fighters",
        content_type: "anime",
        genre: ["Action", "Drama", "Fantasy"],
        year: 2013,
        imdb_rating: 9.0,
        poster_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop",
        storyline: "Humanity fights for survival against giant humanoid creatures called Titans.",
        director: "Tetsuro Araki",
        production_house: "Studio Pierrot",
        country: "Japan",
        quality: "1080p",
        featured: true,
        is_visible: true,
        downloads: 28900,
        screenshots: [
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=450&fit=crop"
        ],
        seo_tags: ["anime", "titans", "survival", "action", "japan"]
      },
      {
        title: "Demon Hunter",
        content_type: "anime",
        genre: ["Action", "Adventure", "Fantasy"],
        year: 2019,
        imdb_rating: 8.7,
        poster_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        storyline: "A young boy becomes a demon slayer to avenge his family and cure his sister.",
        director: "Haruo Sotozaki",
        production_house: "Ufotable",
        country: "Japan",
        quality: "1080p",
        featured: false,
        is_visible: true,
        downloads: 21400,
        screenshots: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop"
        ],
        seo_tags: ["anime", "demons", "family", "sword", "japan"]
      }
    ];

    // Insert all content
    const allContent = [...movies, ...series, ...anime];
    
    for (const content of allContent) {
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .upsert(content, { onConflict: 'title' })
        .select('movie_id')
        .single();

      if (movieError) {
        console.error(`Error inserting ${content.title}:`, movieError);
        continue;
      }

      // Add download links
      if (movieData?.movie_id) {
        await supabase.from('download_links').upsert([
          {
            movie_id: movieData.movie_id,
            quality: "4K",
            file_size: "8.5 GB",
            download_url: `https://example.com/download/${content.title.replace(/\s+/g, '-').toLowerCase()}/4k`,
            resolution: "3840x2160"
          },
          {
            movie_id: movieData.movie_id,
            quality: "1080p",
            file_size: "2.5 GB",
            download_url: `https://example.com/download/${content.title.replace(/\s+/g, '-').toLowerCase()}/1080p`,
            resolution: "1920x1080"
          },
          {
            movie_id: movieData.movie_id,
            quality: "720p",
            file_size: "1.2 GB",
            download_url: `https://example.com/download/${content.title.replace(/\s+/g, '-').toLowerCase()}/720p`,
            resolution: "1280x720"
          }
        ], { onConflict: 'movie_id,quality' });

        // Add trailer
        await supabase.from('media_clips').upsert({
          movie_id: movieData.movie_id,
          clip_title: `${content.title} - Official Trailer`,
          clip_type: 'trailer',
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url: content.poster_url
        }, { onConflict: 'movie_id,clip_type' });
      }
    }

    // Sample Shorts
    const shorts = [
      {
        title: "Epic Action Compilation",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        duration: 120,
        is_visible: true
      },
      {
        title: "Comedy Highlights",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop",
        duration: 90,
        is_visible: true
      },
      {
        title: "Behind the Scenes Magic",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        duration: 150,
        is_visible: true
      },
      {
        title: "Sci-Fi Special Effects",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
        duration: 75,
        is_visible: true
      }
    ];

    const { error: shortsError } = await supabase
      .from('shorts')
      .upsert(shorts, { onConflict: 'title' });

    if (shortsError) {
      console.error("Error inserting shorts:", shortsError);
    }

    // Sample Ads
    const ads = [
      {
        ad_name: "Premium Movies Banner",
        ad_type: "banner",
        position: "header",
        content_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=200&fit=crop",
        target_url: "https://example.com/premium",
        is_active: true,
        description: "Promote premium movie content"
      },
      {
        ad_name: "New Releases Sidebar",
        ad_type: "banner",
        position: "sidebar",
        content_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=600&fit=crop",
        target_url: "https://example.com/new-releases",
        is_active: true,
        description: "Highlight new movie releases"
      },
      {
        ad_name: "Streaming Service Footer",
        ad_type: "banner",
        position: "footer",
        content_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=100&fit=crop",
        target_url: "https://example.com/streaming",
        is_active: true,
        description: "Promote streaming services"
      }
    ];

    const { error: adsError } = await supabase
      .from('ads')
      .upsert(ads, { onConflict: 'ad_name' });

    if (adsError) {
      console.error("Error inserting ads:", adsError);
    }

    console.log("Comprehensive sample data created successfully!");
    return { success: true, message: "All sample data created successfully!" };

  } catch (error) {
    console.error("Error creating sample data:", error);
    return { success: false, message: "Failed to create sample data" };
  }
};
