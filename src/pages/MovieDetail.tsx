
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, Download, Play, Eye, Users, Globe } from "lucide-react";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import RelatedMoviesSection from "@/components/RelatedMoviesSection";
import ShareLinks from "@/components/ShareLinks";
import ImprovedYouTubePlayer from "@/components/ImprovedYouTubePlayer";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";
import DownloadLinksSection from "@/components/movie/DownloadLinksSection";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);

      // Fetch movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();

      if (movieError) throw movieError;

      // Fetch download links
      const { data: linksData, error: linksError } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', id);

      // Fetch cast
      const { data: castData, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', id);

      // Fetch trailer
      const { data: trailerData, error: trailerError } = await supabase
        .from('media_clips')
        .select('*')
        .eq('movie_id', id)
        .eq('clip_type', 'trailer')
        .limit(1);

      setMovie(movieData);
      setDownloadLinks(linksData || []);
      setCast(castData || []);
      
      if (trailerData && trailerData.length > 0) {
        setTrailerUrl(trailerData[0].video_url);
      }

      // Update download count
      await supabase
        .from('movies')
        .update({ 
          downloads: (movieData.downloads || 0) + 1 
        })
        .eq('movie_id', id);

    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre: string) => {
    // Navigate to search results with genre filter
    navigate(`/search?genre=${encodeURIComponent(genre.toLowerCase())}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ScrollableHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ScrollableHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <Link to="/movies">
              <Button>Back to Movies</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <div className="bg-gray-900">
        <SmartAdManager position="movie_detail">
          <div className="container mx-auto px-4 py-8">
            {/* Top Ad Banner */}
            <div className="mb-8">
              <AdBanner position="movie_detail_top" />
            </div>

            {/* Screenshots Section */}
            {movie.screenshots && movie.screenshots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
                  Screenshots: (Must See Before Downloading)...
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {movie.screenshots.map((screenshot: string, index: number) => (
                    <div key={index} className="relative aspect-video bg-gray-800 rounded overflow-hidden">
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movie Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={movie.poster_url || '/placeholder.svg'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4 text-white">{movie.title}</h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {movie.content_type?.toUpperCase()}
                    </Badge>
                    {movie.quality && (
                      <Badge className="bg-green-600 text-white">
                        {movie.quality}
                      </Badge>
                    )}
                    {movie.featured && (
                      <Badge className="bg-yellow-600 text-yellow-100">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                    {movie.year && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{movie.year}</span>
                      </div>
                    )}
                    {movie.imdb_rating && (
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        <span>{movie.imdb_rating}/10</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Download size={16} className="text-gray-400" />
                      <span>{(movie.downloads || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-gray-400" />
                      <span>Views: {(movie.downloads || 0) * 3}</span>
                    </div>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  {movie.director && (
                    <div>
                      <span className="text-gray-400">Director:</span>
                      <span className="ml-2">{movie.director}</span>
                    </div>
                  )}
                  {movie.production_house && (
                    <div>
                      <span className="text-gray-400">Production:</span>
                      <span className="ml-2">{movie.production_house}</span>
                    </div>
                  )}
                  {movie.country && (
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-400" />
                      <span>{movie.country}</span>
                    </div>
                  )}
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="text-gray-400">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genre.map((g: string, idx: number) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-blue-600 hover:text-white transition-colors bg-gray-700 text-gray-300"
                            onClick={() => handleGenreClick(g)}
                          >
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Storyline */}
                {movie.storyline && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Storyline</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Ad Banner */}
            <div className="mb-8">
              <AdBanner position="movie_detail_middle" />
            </div>

            {/* Download Links Section */}
            <div className="mb-8">
              <DownloadLinksSection 
                downloadLinks={downloadLinks} 
                movieId={movie.movie_id} 
              />
            </div>

            {/* Trailer Section */}
            {trailerUrl && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Play className="text-red-500" />
                  Official Trailer
                </h2>
                <ImprovedYouTubePlayer videoUrl={trailerUrl} />
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Users className="text-blue-500" />
                  Cast & Crew
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cast.map((member) => (
                    <Card key={member.cast_id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <h4 className="font-semibold text-white">{member.actor_name}</h4>
                        {member.actor_role && (
                          <p className="text-sm text-gray-400">{member.actor_role}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Share Links */}
            <div className="mb-8">
              <ShareLinks title={movie.title} />
            </div>

            {/* Bottom Ad Banner */}
            <div className="mb-8">
              <AdBanner position="movie_detail_bottom" />
            </div>
          </div>
        </SmartAdManager>

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
