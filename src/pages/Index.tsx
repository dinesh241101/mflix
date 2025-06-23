
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieCarousel from "@/components/MovieCarousel";
import LatestUploadsSection from "@/components/LatestUploadsSection";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [latestMovies, setLatestMovies] = useState<any[]>([]);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [bollywoodMovies, setBollywoodMovies] = useState<any[]>([]);
  const [hollywoodMovies, setHollywoodMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Featured movies
      const { data: featured } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(5);

      // Latest movies
      const { data: latest } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);

      // Popular movies (by downloads)
      const { data: popular } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('downloads', { ascending: false })
        .limit(12);

      // Bollywood movies
      const { data: bollywood } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .contains('seo_tags', ['bollywood'])
        .order('created_at', { ascending: false })
        .limit(12);

      // Hollywood movies
      const { data: hollywood } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .contains('seo_tags', ['hollywood'])
        .order('created_at', { ascending: false })
        .limit(12);

      setFeaturedMovies(featured || []);
      setLatestMovies(latest || []);
      setPopularMovies(popular || []);
      setBollywoodMovies(bollywood || []);
      setHollywoodMovies(hollywood || []);

    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <SmartAdManager position="home_page">
        {/* Hero Section with Featured Movies */}
        <section className="relative">
          <FeaturedMovieSlider movies={featuredMovies} />
          
          {/* Ad Banner after hero */}
          <div className="my-8">
            <AdBanner position="home_top" />
          </div>
        </section>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-8 space-y-12">
          
          {/* Latest Movies */}
          <section>
            <MovieCarousel 
              title="🔥 Latest Movies" 
              movies={latestMovies}
              viewAllLink="/movies?sort=latest"
            />
          </section>

          {/* Ad Banner */}
          <div className="my-8">
            <AdBanner position="home_middle" />
          </div>

          {/* Popular Movies */}
          <section>
            <MovieCarousel 
              title="⭐ Popular Movies" 
              movies={popularMovies}
              viewAllLink="/movies?sort=popular"
            />
          </section>

          {/* Bollywood Movies */}
          <section>
            <MovieCarousel 
              title="🎬 Bollywood Movies" 
              movies={bollywoodMovies}
              viewAllLink="/movies?category=bollywood"
            />
          </section>

          {/* Ad Banner */}
          <div className="my-8">
            <AdBanner position="home_middle_2" />
          </div>

          {/* Hollywood Movies */}
          <section>
            <MovieCarousel 
              title="🌟 Hollywood Movies" 
              movies={hollywoodMovies}
              viewAllLink="/movies?category=hollywood"
            />
          </section>

          {/* Latest Uploads Section */}
          <section>
            <LatestUploadsSection movies={latestMovies} />
          </section>

          {/* Bottom Ad Banner */}
          <div className="my-8">
            <AdBanner position="home_bottom" />
          </div>
        </div>
      </SmartAdManager>
    </div>
  );
};

export default Index;
