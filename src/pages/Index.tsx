
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
import AdPlacementManager from "@/components/ads/AdPlacementManager";
import InterstitialAdManager from "@/components/ads/InterstitialAdManager";
import { Button } from "@/components/ui/button";
import { Film, Tv, Play, Video } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [recentSeries, setRecentSeries] = useState<any[]>([]);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [recentShorts, setRecentShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);

  useEffect(() => {
    fetchAllContent();
    
    // Show interstitial ad on page load after a delay
    const timer = setTimeout(() => {
      setShowInterstitialAd(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);

      // Fetch featured content
      const { data: featured, error: featuredError } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .eq('is_visible', true)
        .limit(5);

      if (featuredError) throw featuredError;
      setFeaturedContent(featured || []);

      // Fetch recent movies
      const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (moviesError) throw moviesError;
      setRecentMovies(movies || []);

      // Fetch recent series
      const { data: series, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (seriesError) throw seriesError;
      setRecentSeries(series || []);

      // Fetch recent anime
      const { data: anime, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (animeError) throw animeError;
      setRecentAnime(anime || []);

      // Fetch recent shorts
      const { data: shorts, error: shortsError } = await supabase
        .from('shorts')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (shortsError) throw shortsError;
      setRecentShorts(shorts || []);

    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Homepage" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <UniversalHeader />
      
      {/* Interstitial Ad */}
      {showInterstitialAd && (
        <InterstitialAdManager 
          triggerEvent="page_load"
          onAdClosed={() => setShowInterstitialAd(false)}
        />
      )}

      <main className="pt-20">
        {/* Hero Section with Featured Content */}
        {featuredContent.length > 0 && (
          <section className="mb-8">
            <FeaturedMovieSlider movies={featuredContent} />
          </section>
        )}

        {/* Ad Placement - Top Banner */}
        <section className="container mx-auto px-4 mb-8">
          <AdPlacementManager 
            pageType="home" 
            position="top_banner" 
            className="w-full"
          />
        </section>

        <div className="container mx-auto px-4 space-y-12">
          {/* Recent Movies Section */}
          {recentMovies.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Film className="text-blue-500" size={24} />
                  <h2 className="text-2xl font-bold">Latest Movies</h2>
                </div>
                <Link to="/movies">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
              <MovieGrid movies={recentMovies} />
            </section>
          )}

          {/* Ad Placement - Middle Banner */}
          <section>
            <AdPlacementManager 
              pageType="home" 
              position="middle_banner" 
              className="w-full"
            />
          </section>

          {/* Recent Web Series Section */}
          {recentSeries.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Tv className="text-green-500" size={24} />
                  <h2 className="text-2xl font-bold">Latest Web Series</h2>
                </div>
                <Link to="/web-series">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
              <MovieGrid movies={recentSeries} />
            </section>
          )}

          {/* Recent Anime Section */}
          {recentAnime.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Play className="text-pink-500" size={24} />
                  <h2 className="text-2xl font-bold">Latest Anime</h2>
                </div>
                <Link to="/anime">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
              <MovieGrid movies={recentAnime} />
            </section>
          )}

          {/* Recent Shorts Section */}
          {recentShorts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Video className="text-orange-500" size={24} />
                  <h2 className="text-2xl font-bold">Latest Shorts</h2>
                </div>
                <Link to="/shorts">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recentShorts.map((short: any) => (
                  <div key={short.short_id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                    <div className="aspect-[9/16] bg-gray-700 relative">
                      {short.thumbnail_url ? (
                        <img
                          src={short.thumbnail_url}
                          alt={short.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {short.duration ? `${short.duration}s` : 'Short'}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-white truncate">
                        {short.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ad Placement - Bottom Banner */}
          <section>
            <AdPlacementManager 
              pageType="home" 
              position="bottom_banner" 
              className="w-full"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
