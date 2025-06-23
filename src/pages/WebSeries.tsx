
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const WebSeries = () => {
  const [searchParams] = useSearchParams();
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const genre = searchParams.get('genre');
  const quality = searchParams.get('quality');
  const year = searchParams.get('year');
  const country = searchParams.get('country');
  const language = searchParams.get('language');
  const sort = searchParams.get('sort');

  useEffect(() => {
    fetchSeries();
  }, [searchParams]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .eq('is_visible', true);

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
      setSeries(data || []);

    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (genre) return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Web Series`;
    if (quality) return `${quality} Web Series`;
    if (year) return `${year} Web Series`;
    if (country) return `${country.charAt(0).toUpperCase() + country.slice(1)} Web Series`;
    if (language) return `${language.charAt(0).toUpperCase() + language.slice(1)} Web Series`;
    return 'Web Series';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <SmartAdManager>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
            <p className="text-gray-400">
              Showing {series.length} web series
            </p>
          </div>

          <div className="mb-8">
            <AdBanner position="series_top" />
          </div>

          <EnhancedMovieGrid movies={series} loading={loading} />

          <div className="mt-8">
            <AdBanner position="series_bottom" />
          </div>
        </div>
      </SmartAdManager>
    </div>
  );
};

export default WebSeries;
