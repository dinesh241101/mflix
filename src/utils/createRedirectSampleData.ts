
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const createRedirectSampleData = async () => {
  try {
    console.log("Creating redirect loop sample data...");

    // Sample redirect links for different positions
    const redirectLinks = [
      {
        ad_name: "Download Page 1 Redirect",
        ad_type: "redirect_link",
        position: "download_cta_1",
        target_url: "https://example.com/redirect1",
        is_active: true,
        display_frequency: 1,
        description: "First redirect for download button"
      },
      {
        ad_name: "Download Page 2 Redirect",
        ad_type: "redirect_link", 
        position: "download_cta_2",
        target_url: "https://example.com/redirect2",
        is_active: true,
        display_frequency: 1,
        description: "Second redirect for download button"
      },
      {
        ad_name: "Download Page 3 Redirect",
        ad_type: "redirect_link",
        position: "download_cta_3", 
        target_url: "https://example.com/redirect3",
        is_active: true,
        display_frequency: 1,
        description: "Third redirect for download button"
      },
      {
        ad_name: "Page Switch Redirect",
        ad_type: "redirect_link",
        position: "page_switch",
        target_url: "https://example.com/page-switch",
        is_active: true,
        display_frequency: 1,
        description: "Redirect when switching pages"
      },
      {
        ad_name: "Same Page Click Redirect",
        ad_type: "redirect_link",
        position: "same_page_click",
        target_url: "https://example.com/same-page",
        is_active: true,
        display_frequency: 1,
        description: "Redirect for same page interactions"
      }
    ];

    // Insert redirect links
    const { data: redirectData, error: redirectError } = await supabase
      .from('ads')
      .insert(redirectLinks)
      .select();

    if (redirectError) throw redirectError;

    // Create sample movies with download links for testing
    const sampleMovies = [
      {
        title: "Test Movie for Download Page 1",
        content_type: "movie",
        genre: ["Action", "Thriller"],
        year: 2024,
        country: "USA",
        storyline: "A test movie for testing download page 1 redirection",
        is_visible: true,
        poster_url: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Test+Movie+1"
      },
      {
        title: "Test Movie for Download Page 2", 
        content_type: "movie",
        genre: ["Comedy", "Drama"],
        year: 2024,
        country: "USA",
        storyline: "A test movie for testing download page 2 redirection",
        is_visible: true,
        poster_url: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Test+Movie+2"
      },
      {
        title: "Test Movie for Download Page 3",
        content_type: "movie", 
        genre: ["Sci-Fi", "Adventure"],
        year: 2024,
        country: "USA",
        storyline: "A test movie for testing download page 3 redirection",
        is_visible: true,
        poster_url: "https://via.placeholder.com/300x450/1f2937/ffffff?text=Test+Movie+3"
      }
    ];

    const { data: movieData, error: movieError } = await supabase
      .from('movies')
      .insert(sampleMovies)
      .select();

    if (movieError) throw movieError;

    // Create download links for each test movie
    const downloadLinks = [];
    movieData?.forEach((movie, index) => {
      downloadLinks.push(
        {
          movie_id: movie.movie_id,
          quality: "1080p",
          file_size: "2.5GB",
          download_url: `https://example.com/download/1080p/test-movie-${index + 1}`
        },
        {
          movie_id: movie.movie_id,
          quality: "720p", 
          file_size: "1.2GB",
          download_url: `https://example.com/download/720p/test-movie-${index + 1}`
        },
        {
          movie_id: movie.movie_id,
          quality: "480p",
          file_size: "800MB", 
          download_url: `https://example.com/download/480p/test-movie-${index + 1}`
        }
      );
    });

    const { error: linksError } = await supabase
      .from('download_links')
      .insert(downloadLinks);

    if (linksError) throw linksError;

    return {
      success: true,
      message: `Created ${redirectLinks.length} redirect links, ${sampleMovies.length} test movies, and ${downloadLinks.length} download links for testing redirection loops.`
    };

  } catch (error: any) {
    console.error("Error creating redirect sample data:", error);
    return {
      success: false,
      message: `Failed to create sample data: ${error.message}`
    };
  }
};
