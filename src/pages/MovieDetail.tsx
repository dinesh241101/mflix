import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Star, Calendar, Globe, User, Building } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import RelatedMoviesSection from "@/components/RelatedMoviesSection";
import ShareLinks from "@/components/ShareLinks";
import ImprovedYouTubePlayer from "@/components/ImprovedYouTubePlayer";
import EnhancedAdPlacements from "@/components/ads/EnhancedAdPlacements";
import { toast } from "@/components/ui/use-toast";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
    fetchDownloadLinks();
    fetchRelatedMovies();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();

      if (error) {
        console.error('Error fetching movie:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details.",
          variant: "destructive"
        });
      }

      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', id);

      if (error) {
        console.error('Error fetching download links:', error);
        return;
      }

      setDownloadLinks(data || []);
    } catch (error) {
      console.error('Error fetching download links:', error);
    }
  };

  const fetchRelatedMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .neq('movie_id', id)
        .limit(10);

      if (error) {
        console.error('Error fetching related movies:', error);
        return;
      }

      setRelatedMovies(data || []);
    } catch (error) {
      console.error('Error fetching related movies:', error);
    }
  };

  const handleDownloadClick = (linkId: string) => {
    navigate(`/download/${linkId}`);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return <LoadingScreen message="Loading movie details..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(movie.trailer_url);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Ad Banner */}
      <EnhancedAdPlacements 
        pageType="movie_detail" 
        position="top_banner" 
        className="mb-4"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Movie Header */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.poster_url || '/placeholder.svg'}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre?.map((g: string) => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>
                </div>

                {/* Movie Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {movie.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{movie.year}</span>
                    </div>
                  )}
                  {movie.country && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span>{movie.country}</span>
                    </div>
                  )}
                  {movie.imdb_rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{movie.imdb_rating}/10</span>
                    </div>
                  )}
                  {movie.quality && (
                    <div className="text-purple-400 font-semibold">
                      {movie.quality}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {movie.director && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Director: {movie.director}</span>
                  </div>
                )}
                {movie.production_house && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Studio: {movie.production_house}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {videoId && (
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Trailer
                    </Button>
                  )}
                  {downloadLinks.length > 0 && (
                    <Button 
                      onClick={() => handleDownloadClick(downloadLinks[0].link_id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Ad placement after movie header */}
            <EnhancedAdPlacements 
              pageType="movie_detail" 
              position="after_header" 
              className="my-6"
            />

            {/* Trailer */}
            {videoId && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                  <ImprovedYouTubePlayer 
                    videoId={videoId} 
                    title={`${movie.title} Trailer`}
                  />
                </CardContent>
              </Card>
            )}

            {/* Ad placement after trailer */}
            <EnhancedAdPlacements 
              pageType="movie_detail" 
              position="after_trailer" 
              className="my-6"
            />

            {/* Storyline */}
            {movie.storyline && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Storyline</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
                </CardContent>
              </Card>
            )}

            {/* Download Links */}
            {downloadLinks.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Download Links</h3>
                  <div className="grid gap-3">
                    {downloadLinks.map((link) => (
                      <div key={link.link_id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium">{link.quality}</div>
                          <div className="text-sm text-gray-400">{link.file_size}</div>
                        </div>
                        <Button 
                          onClick={() => handleDownloadClick(link.link_id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share Section */}
            <ShareLinks 
              title={movie.title} 
              url={window.location.href}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ad */}
            <EnhancedAdPlacements 
              pageType="movie_detail" 
              position="sidebar_top" 
              className="mb-6"
            />

            {/* Screenshots */}
            {movie.screenshots && movie.screenshots.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Screenshots</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {movie.screenshots.slice(0, 4).map((screenshot: string, index: number) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Another Sidebar Ad */}
            <EnhancedAdPlacements 
              pageType="movie_detail" 
              position="sidebar_bottom" 
              className="my-6"
            />
          </div>
        </div>

        {/* Bottom Ad before related movies */}
        <EnhancedAdPlacements 
          pageType="movie_detail" 
          position="before_related" 
          className="my-8"
        />

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-12">
            <RelatedMoviesSection 
              movies={relatedMovies} 
              currentMovieId={movie.movie_id}
            />
          </div>
        )}

        {/* Final bottom ad */}
        <EnhancedAdPlacements 
          pageType="movie_detail" 
          position="bottom_banner" 
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default MovieDetail;
