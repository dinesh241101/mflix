
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import LoadingScreen from "@/components/LoadingScreen";
import { checkReturnFromRedirect } from "@/utils/redirectLoop";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkReturnFromRedirect();
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch featured movies
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .eq('is_visible', true)
        .limit(5);

      if (featuredError) throw featuredError;
      setFeaturedMovies(featured || []);

      // Fetch latest movies
      const { data: latest, error: latestError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (latestError) throw latestError;
      setLatestMovies(latest || []);

      // Fetch trending movies (using downloads as trending metric)
      const { data: trending, error: trendingError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('downloads', { ascending: false })
        .limit(8);

      if (trendingError) throw trendingError;
      setTrendingMovies(trending || []);

    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading MFlix..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Movies Slider */}
        {featuredMovies.length > 0 && (
          <section>
            <FeaturedMovieSlider movies={featuredMovies} />
          </section>
        )}

        {/* Latest Uploads */}
        <section>
          <LatestUploadsSection />
        </section>

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <section>
            <MovieCarousel
              title="Trending Now"
              movies={trendingMovies}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
