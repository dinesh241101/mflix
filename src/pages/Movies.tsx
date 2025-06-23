
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const Movies = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get query parameters
  const category = searchParams.get('category');
  const genre = searchParams.get('genre');
  const quality = searchParams.get('quality');
  const year = searchParams.get('year');
  const country = searchParams.get('country');
  const language = searchParams.get('language');
  const audio = searchParams.get('audio');
  const sort = searchParams.get('sort');

  useEffect(() => {
    fetchMovies();
  }, [searchParams]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .eq('is_visible', true);

      // Apply filters based on URL parameters
      if (category) {
        query = query.contains('seo_tags', [category]);
      }

      if (genre) {
        query = query.contains('genre', [genre]);
      }

      if (quality) {
        query = query.eq('quality', quality);
      }

      if (year) {
        query = query.eq('year', parseInt(year));
      }

      if (country) {
        query = query.ilike('country', `%${country}%`);
      }

      if (language) {
        query = query.contains('seo_tags', [language]);
      }

      if (audio === 'dual') {
        query = query.contains('seo_tags', ['dual audio']);
      }

      // Apply sorting
      if (sort === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'popular') {
        query = query.order('downloads', { ascending: false });
      } else if (sort === 'rating') {
        query = query.order('imdb_rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setMovies(data || []);

    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Movies`;
    if (genre) return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
    if (quality) return `${quality} Movies`;
    if (year) return `${year} Movies`;
    if (country) return `${country.charAt(0).toUpperCase() + country.slice(1)} Movies`;
    if (language) return `${language.charAt(0).toUpperCase() + language.slice(1)} Movies`;
    if (audio === 'dual') return 'Dual Audio Movies';
    return 'All Movies';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <SmartAdManager>
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
            <p className="text-gray-400">
              Showing {movies.length} movies
            </p>
          </div>

          {/* Top Ad Banner */}
          <div className="mb-8">
            <AdBanner position="movies_top" />
          </div>

          {/* Movies Grid */}
          <EnhancedMovieGrid movies={movies} loading={loading} />

          {/* Bottom Ad Banner */}
          <div className="mt-8">
            <AdBanner position="movies_bottom" />
          </div>
        </div>
      </SmartAdManager>
    </div>
  );
};

export default Movies;
