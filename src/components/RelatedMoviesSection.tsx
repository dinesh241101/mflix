
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MovieCarousel from "./MovieCarousel";

interface RelatedMoviesSectionProps {
  currentMovie?: string;
  genres?: string[];
  contentType?: string;
}

const RelatedMoviesSection = ({ currentMovie, genres = [], contentType = "movie" }: RelatedMoviesSectionProps) => {
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (currentMovie) {
      fetchRelatedMovies();
    }
  }, [currentMovie, genres, contentType]);

  const fetchRelatedMovies = async () => {
    try {
      let query = supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .neq('movie_id', currentMovie)
        .limit(12);

      // Filter by content type
      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      // Filter by genres if available
      if (genres.length > 0) {
        query = query.overlaps('genre', genres);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRelatedMovies(data || []);
    } catch (error) {
      console.error('Error fetching related movies:', error);
    }
  };

  if (relatedMovies.length === 0) {
    return null;
  }

  return (
    <MovieCarousel 
      title="🎬 Related Content" 
      movies={relatedMovies}
      viewAllLink={`/${contentType}s`}
    />
  );
};

export default RelatedMoviesSection;
