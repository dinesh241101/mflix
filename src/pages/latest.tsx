import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import MovieCarousel from "@/components/MovieCarousel";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 12;

const LatestPage = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMore(page);
  }, [page]);

  const fetchMore = async (pageNum: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("movies")
        .select("movie_id, title, poster_url, year, genre, content_type, imdb_rating")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range((pageNum - 1) * ITEMS_PER_PAGE, pageNum * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        setMovies(prev => [...prev, ...data]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("latest fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-900 text-white p-4"
    >
      <Header />
      <h1 className="text-2xl font-bold mb-4">Latest Uploads</h1>
      <MovieCarousel title="Latest" movies={movies} />

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setPage(p => p + 1)} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LatestPage;
