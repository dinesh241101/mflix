
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ImprovedFeaturedSlider from "@/components/ImprovedFeaturedSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Upload, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [animeMovies, setAnimeMovies] = useState<any[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      // Fetch all visible movies
      const { data: allMovies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (moviesError) throw moviesError;

      setMovies(allMovies || []);

      // Filter different types
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
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Featured Movies */}
      {featuredMovies.length > 0 && (
        <section className="mb-8">
          <ImprovedFeaturedSlider movies={featuredMovies} />
        </section>
      )}

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Quick Access for Bulk Upload */}
        <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Upload className="text-blue-400" size={28} />
                Admin Quick Access
              </h2>
              <p className="text-gray-400">
                Access the CRM admin panel for bulk upload and content management
              </p>
            </div>
            <Button
              onClick={() => navigate('/crm-admin')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Shield size={18} />
              CRM Admin
            </Button>
          </div>
        </section>

        {/* Latest Uploads */}
        <LatestUploadsSection />

        {/* Movie Carousels */}
        {animeMovies.length > 0 && (
          <MovieCarousel
            title="Popular Anime"
            movies={animeMovies}
            viewAllLink="/anime"
          />
        )}

        {seriesMovies.length > 0 && (
          <MovieCarousel
            title="Web Series"
            movies={seriesMovies}
            viewAllLink="/web-series"
          />
        )}

        {movies.length > 0 && (
          <MovieCarousel
            title="All Movies"
            movies={movies.filter(m => m.content_type === 'movie')}
            viewAllLink="/movies"
          />
        )}
      </div>
    </div>
  );
};

export default Index;
