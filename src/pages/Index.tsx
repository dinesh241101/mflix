
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import LoadingScreen from "@/components/LoadingScreen";
import EnhancedAdPlacements from "@/components/ads/EnhancedAdPlacements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [animeMovies, setAnimeMovies] = useState<any[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data: allMovies, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching movies:', error);
        return;
      }

      // Filter movies by type
      const featured = allMovies?.filter(movie => movie.featured) || [];
      const anime = allMovies?.filter(movie => movie.content_type === 'anime') || [];
      const series = allMovies?.filter(movie => movie.content_type === 'series') || [];

      setFeaturedMovies(featured);
      setAnimeMovies(anime);
      setSeriesMovies(series);

    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading MFlix..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Banner Ad */}
      <EnhancedAdPlacements 
        pageType="home" 
        position="top_banner" 
        className="mb-4"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Welcome to MFlix
            </h1>
            <p className="text-xl text-gray-300">
              Stream and download the latest movies, web series, and anime
            </p>
          </div>

          {/* Ad placement after hero text */}
          <EnhancedAdPlacements 
            pageType="home" 
            position="hero_bottom" 
            className="mb-8"
          />

          {/* Featured Movies Slider */}
          {featuredMovies.length > 0 && (
            <FeaturedMovieSlider movies={featuredMovies} />
          )}
        </section>

        {/* Side Ad */}
        <EnhancedAdPlacements 
          pageType="home" 
          position="sidebar" 
          className="mb-8"
        />

        {/* Latest Uploads */}
        <LatestUploadsSection />

        {/* Mid-page Ad */}
        <EnhancedAdPlacements 
          pageType="home" 
          position="mid_content" 
          className="my-8"
        />

        {/* Movie Carousels */}
        {animeMovies.length > 0 && (
          <div className="mb-12">
            <MovieCarousel
              title="Latest Anime"
              movies={animeMovies}
              onMovieClick={(id) => navigate(`/anime/${id}`)}
            />
          </div>
        )}

        {/* Another Ad placement */}
        <EnhancedAdPlacements 
          pageType="home" 
          position="between_carousels" 
          className="my-8"
        />

        {seriesMovies.length > 0 && (
          <div className="mb-12">
            <MovieCarousel
              title="Popular Web Series"
              movies={seriesMovies}
              onMovieClick={(id) => navigate(`/series/${id}`)}
            />
          </div>
        )}

        {/* Bottom Ad */}
        <EnhancedAdPlacements 
          pageType="home" 
          position="bottom_banner" 
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default Index;
