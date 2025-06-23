
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import EnhancedMovieGrid from "@/components/enhanced/EnhancedMovieGrid";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const Anime = () => {
  const [searchParams] = useSearchParams();
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const genre = searchParams.get('genre');
  const quality = searchParams.get('quality');
  const year = searchParams.get('year');
  const country = searchParams.get('country');
  const sort = searchParams.get('sort');

  useEffect(() => {
    fetchAnime();
  }, [searchParams]);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
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
      setAnime(data || []);

    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (genre) return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Anime`;
    if (quality) return `${quality} Anime`;
    if (year) return `${year} Anime`;
    if (country) return `${country.charAt(0).toUpperCase() + country.slice(1)} Anime`;
    return 'Anime Collection';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <SmartAdManager position="anime_page">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
            <p className="text-gray-400">
              {loading ? 'Loading...' : `Showing ${anime.length} anime titles`}
            </p>
          </div>

          <div className="mb-8">
            <AdBanner position="anime_top" />
          </div>

          <EnhancedMovieGrid movies={anime} />

          <div className="mt-8">
            <AdBanner position="anime_bottom" />
          </div>
        </div>
      </SmartAdManager>
    </div>
  );
};

export default Anime;
