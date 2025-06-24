
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGenreFiltering = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoviesByGenre = async (genreName: string, contentType?: string) => {
    try {
      let query = supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .contains('genre', [genreName])
        .order('created_at', { ascending: false });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  };

  return {
    genres,
    isLoading,
    getMoviesByGenre,
    refetchGenres: fetchGenres
  };
};
