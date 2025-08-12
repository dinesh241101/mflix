
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedMovieGrid from '@/components/enhanced/EnhancedMovieGrid';
import FeaturedMovieSlider from '@/components/FeaturedMovieSlider';
import ResponsiveAdPlaceholder from '@/components/ResponsiveAdPlaceholder';

const LatestUploadsSection = () => {
  const { data: featuredMovies, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .eq('is_visible', true)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: latestMovies, isLoading: latestLoading } = useQuery({
    queryKey: ['latest-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(18);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Transform featured movies to match FeaturedMovieSlider interface
  const transformedFeaturedMovies = featuredMovies?.map(movie => ({
    id: movie.movie_id,
    title: movie.title,
    poster_url: movie.poster_url || '',
    year: movie.year,
    genre: movie.genre
  })) || [];

  return (
    <div className="container mx-auto px-4">
      {/* Top Banner Ad */}
      <div className="mb-8">
        <ResponsiveAdPlaceholder position="top-banner" />
      </div>

      {/* Featured Movies Slider */}
      {!featuredLoading && transformedFeaturedMovies.length > 0 && (
        <div className="mb-12">
          <FeaturedMovieSlider movies={transformedFeaturedMovies} />
        </div>
      )}

      {/* Latest Movies Grid */}
      {!latestLoading && latestMovies && latestMovies.length > 0 && (
        <div className="mb-8">
          <EnhancedMovieGrid 
            movies={latestMovies} 
            title="Latest Uploads" 
            showAds={true} 
          />
        </div>
      )}

      {/* Bottom Banner Ad */}
      <div className="mt-8">
        <ResponsiveAdPlaceholder position="bottom-banner" />
      </div>
    </div>
  );
};

export default LatestUploadsSection;
