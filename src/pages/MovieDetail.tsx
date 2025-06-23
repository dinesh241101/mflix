
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, Download, Play, Eye, Users, Globe, Film } from "lucide-react";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import RelatedMoviesSection from "@/components/RelatedMoviesSection";
import ShareLinks from "@/components/ShareLinks";
import ImprovedYouTubePlayer from "@/components/ImprovedYouTubePlayer";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const MovieDetail = () => {
  const { id } = useParams();
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
      
      <SmartAdManager>
        <div className="container mx-auto px-4 py-8">
          {/* Top Ad Banner */}
          <div className="mb-8">
            <AdBanner position="movie_detail_top" />
          </div>

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
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genre.map((g: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
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
                  <h3 className="text-lg font-semibold mb-2">Storyline</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Ad Banner */}
          <div className="mb-8">
            <AdBanner position="movie_detail_middle" />
          </div>

          {/* Trailer Section */}
          {trailerUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Play className="text-red-500" />
                Official Trailer
              </h2>
              <ImprovedYouTubePlayer videoUrl={trailerUrl} />
            </div>
          )}

          {/* Screenshots */}
          {movie.screenshots && movie.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movie.screenshots.map((screenshot: string, index: number) => (
                  <div key={index} className="aspect-video bg-gray-800 rounded overflow-hidden">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="text-blue-500" />
                Cast & Crew
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cast.map((member) => (
                  <Card key={member.cast_id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold">{member.actor_name}</h4>
                      {member.actor_role && (
                        <p className="text-sm text-gray-400">{member.actor_role}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Download Links */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Download className="text-green-500" />
              Download Links
            </h2>
            {downloadLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadLinks.map((link) => (
                  <Card key={link.link_id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-blue-600 text-white">
                          {link.quality}
                        </Badge>
                        <span className="text-sm text-gray-400">{link.file_size}</span>
                      </div>
                      <Link to={`/download/${movie.movie_id}?quality=${link.quality}`}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Download size={16} className="mr-2" />
                          Download {link.quality}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Film size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Download links will be available soon!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Share Links */}
          <div className="mb-8">
            <ShareLinks movieTitle={movie.title} />
          </div>

          {/* Bottom Ad Banner */}
          <div className="mb-8">
            <AdBanner position="movie_detail_bottom" />
          </div>

          {/* Related Movies */}
          <RelatedMoviesSection 
            currentMovieId={movie.movie_id}
            genres={movie.genre || []}
            contentType={movie.content_type}
          />
        </div>
      </SmartAdManager>
    </div>
  );
};

export default MovieDetail;
