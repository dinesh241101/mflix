
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Star, Globe, User, Building, Download, Play, Share2, Eye, Heart } from "lucide-react";
import UniversalHeader from "@/components/universal/UniversalHeader";
import LoadingScreen from "@/components/LoadingScreen";
import DownloadLinksSection from "@/components/movie/DownloadLinksSection";
import RelatedMoviesSection from "@/components/RelatedMoviesSection";
import ShareLinks from "@/components/ShareLinks";
import ImprovedYouTubePlayer from "@/components/ImprovedYouTubePlayer";
import { checkReturnFromRedirect } from "@/utils/redirectLoop";
import Movies from "./Movies";

interface Movie {
  movie_id: string;
  title: string;
  poster_url?: string;
  year?: number;
  imdb_rating?: number;
  user_rating?: number;
  genre?: string[];
  country?: string;
  director?: string;
  production_house?: string;
  storyline?: string;
  content_type: string;
  quality?: string;
  trailer_url?: string;
  screenshots?: string[];
  downloads: number;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Check for redirect returns
    checkReturnFromRedirect();
    
    if (id) {
      fetchMovie(id);
    }
  }, [id]);

  const fetchMovie = async (movieId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, imdb_rating, genre, country, quality, director, production_house, trailer_url, storyline, screenshots, content_type, downloads')
        .eq('movie_id', movieId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError('Movie not found or has been removed.');
        return;
      }
      setMovie(data);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Movie not found or has been removed.');
    } finally {
      setTimeout(() => setLoading(false), 2000); // 2-second loading
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading movie details..." />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <UniversalHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Movie Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">No Poster Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.year && (
                  <div className="flex items-center text-gray-300">
                    <CalendarDays size={16} className="mr-2" />
                    {movie.year}
                  </div>
                )}
                {movie.imdb_rating && (
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="mr-2" />
                    {movie.imdb_rating}/10 IMDB
                  </div>
                )}
                {movie.country && (
                  <div className="flex items-center text-gray-300">
                    <Globe size={16} className="mr-2" />
                    {movie.country}
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <Download size={16} className="mr-2" />
                  {movie.downloads} downloads
                </div>
              </div>

              {/* Genres */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-600/20 text-blue-300">
                      {g}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.trailer_url && (
                  <Button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Play size={16} className="mr-2" />
                    {showTrailer ? 'Hide' : 'Watch'} Trailer
                  </Button>
                )}
                <ShareLinks
                  title={movie.title}
                  url={window.location.href}
                />
              </div>

              {/* Trailer */}
              {showTrailer && movie.trailer_url && (
                <div className="mb-6">
                  <ImprovedYouTubePlayer
                    videoUrl={movie.trailer_url}
                    title={`${movie.title} - Trailer`}
                  />
                </div>
              )}
            </div>

            {/* Additional Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                {movie.director && (
                  <div className="flex items-center mb-4">
                    <User size={16} className="mr-3 text-gray-400" />
                    <div>
                      <span className="text-gray-400">Director:</span>
                      <span className="text-white ml-2">{movie.director}</span>
                    </div>
                  </div>
                )}
                
                {movie.production_house && (
                  <div className="flex items-center mb-4">
                    <Building size={16} className="mr-3 text-gray-400" />
                    <div>
                      <span className="text-gray-400">Production:</span>
                      <span className="text-white ml-2">{movie.production_house}</span>
                    </div>
                  </div>
                )}

                {movie.quality && (
                  <div className="flex items-center">
                    <Eye size={16} className="mr-3 text-gray-400" />
                    <div>
                      <span className="text-gray-400">Quality:</span>
                      <span className="text-white ml-2">{movie.quality}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Storyline */}
            {movie.storyline && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Storyline</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Download Links */}
        <DownloadLinksSection movieId={movie.movie_id} />

        {/* Related Movies */}
        <RelatedMoviesSection
          currentMovie={movie.movie_id}
          genres={movie.genre || []}
          contentType={movie.content_type}
        />
      </div>

      
    </div>
  );
};

export default MovieDetail;
