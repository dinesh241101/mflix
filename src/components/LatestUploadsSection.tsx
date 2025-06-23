
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MovieCarousel from "./MovieCarousel";

interface LatestUploadsSectionProps {
  movies?: any[];
}

const LatestUploadsSection = ({ movies }: LatestUploadsSectionProps) => {
  const [latestUploads, setLatestUploads] = useState<any[]>([]);

  useEffect(() => {
    if (movies && movies.length > 0) {
      setLatestUploads(movies);
    } else {
      fetchLatestUploads();
    }
  }, [movies]);

  const fetchLatestUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setLatestUploads(data || []);
    } catch (error) {
      console.error('Error fetching latest uploads:', error);
    }
  };

  return (
    <MovieCarousel 
      title="📈 Latest Uploads" 
      movies={latestUploads}
      viewAllLink="/movies?sort=latest"
    />
  );
};

export default LatestUploadsSection;
