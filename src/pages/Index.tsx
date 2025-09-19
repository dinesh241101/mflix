import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ImprovedFeaturedSlider from "@/components/ImprovedFeaturedSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Upload, Shield } from "lucide-react";
import Header from "@/components/Header";
import ScrollableHeader from "@/components/universal/ScrollableHeader";

const Index = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [animeMovies, setAnimeMovies] = useState<any[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<any[]>([]);
  const [latestMovies, setLatestMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      // Fetch all visible movies (fetch only necessary fields for performance)
      const { data: allMovies, error: moviesError } = await supabase
        .from("movies")
        .select("id, title, content_type, featured, trending, posterUrl, created_at")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (moviesError) throw moviesError;

      setMovies(allMovies || []);

      // Filter different types
      const featured = allMovies?.filter((movie) => movie) || [];
      const anime = animeMovies?.filter((anime) => anime.content_type === "anime") || [];
      const series = allMovies?.filter((movie) => series.content_type === "series") || [];
      const latest = allMovies?.slice(0, 12) || [];
      const trending = allMovies?.filter((movie) => movie) || [];

      setFeaturedMovies(featured);
      setAnimeMovies(anime);
      setSeriesMovies(series);
      setLatestMovies(latest);
      setTrendingMovies(trending);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />

    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Featured Movies */}
      {featuredMovies.length > 0 && (
        <section className="mb-8">
          <ImprovedFeaturedSlider movies={featuredMovies} />
        </section>
      )}

      {/* Latest Uploads */}
      <LatestUploadsSection movie={latestMovies} />

      {/* Anime Carousel */}
      {animeMovies.length > 0 && (
        <MovieCarousel title="Popular Anime" movies={animeMovies} viewAllLink="/anime" />
      )}

      {/* Series Carousel */} 
      {seriesMovies.length > 0 && (
        <MovieCarousel title="Web Series" movies={seriesMovies} viewAllLink="/web-series" />
      )}

      {/* All Movies Carousel */}
      {movies.length > 0 && (
        <MovieCarousel
          title="All Movies"
          movies={movies.filter((m) => m.content_type === "movie")}
          viewAllLink="/movies"
        />
      )}

      {/* Trending Movies */}
      {trendingMovies.length > 0 && (
        <section>
          <MovieCarousel
            title="Trending Now"
            movies={trendingMovies}
            viewAllLink="/trending"
          />
        </section>
        )}
    </div>
    </div>
  );
};

export default Index;
