
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Star, Users, Play, Download, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UniversalHeader from "@/components/universal/UniversalHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import DownloadLinksSection from "@/components/movie/DownloadLinksSection";
import RelatedMoviesSection from "@/components/RelatedMoviesSection";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [clips, setClips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      // Fetch movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .eq('is_visible', true)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      // Fetch download links
      const { data: linksData } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', id)
        .order('quality', { ascending: false });

      setDownloadLinks(linksData || []);

      // Fetch cast
      const { data: castData } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', id);

      setCast(castData || []);

      // Fetch media clips
      const { data: clipsData } = await supabase
        .from('media_clips')
        .select('*')
        .eq('movie_id', id);

      setClips(clipsData || []);

    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = (genre: string) => {
    navigate(`/search?genre=${encodeURIComponent(genre)}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading movie details..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <UniversalHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
          {movie.poster_url && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover blur-sm"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.poster_url || 'https://images.unsplash.com/photo-1489599578870-e8cd0aab5c19?w=300'}
                  alt={movie.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    {movie.year && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{movie.year}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" />
                      <span>{movie.imdb_rating || 'N/A'}</span>
                    </div>
                    {movie.downloads && (
                      <div className="flex items-center gap-1">
                        <Download size={16} />
                        <span>{movie.downloads.toLocaleString()} downloads</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genres - Now Clickable */}
                <div className="flex flex-wrap gap-2">
                  {movie.genre && movie.genre.map((genre: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                      onClick={() => handleGenreClick(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {clips.length > 0 && (
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Play size={16} className="mr-2" />
                      Watch Trailer
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-gray-600 text-gray-300"
                  >
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                </div>

                {/* Movie Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {movie.director && (
                    <div>
                      <span className="text-gray-400">Director:</span>
                      <p className="text-white font-medium">{movie.director}</p>
                    </div>
                  )}
                  {movie.production_house && (
                    <div>
                      <span className="text-gray-400">Studio:</span>
                      <p className="text-white font-medium">{movie.production_house}</p>
                    </div>
                  )}
                  {movie.country && (
                    <div>
                      <span className="text-gray-400">Country:</span>
                      <p className="text-white font-medium">{movie.country}</p>
                    </div>
                  )}
                  {movie.quality && (
                    <div>
                      <span className="text-gray-400">Quality:</span>
                      <p className="text-white font-medium">{movie.quality}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Storyline */}
        {movie.storyline && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Storyline</h2>
              <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
            </CardContent>
          </Card>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                Cast & Crew
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cast.map((member) => (
                  <div key={member.cast_id} className="text-center">
                    <p className="text-white font-medium">{member.actor_name}</p>
                    {member.actor_role && (
                      <p className="text-gray-400 text-sm">{member.actor_role}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download Links */}
        <DownloadLinksSection downloadLinks={downloadLinks} movieId={movie.movie_id} />

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
