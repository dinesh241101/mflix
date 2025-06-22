
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Download, Calendar, Play, Clock, Globe } from "lucide-react";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";
import ClickableAdBanner from "@/components/ads/ClickableAdBanner";
import LoadingScreen from "@/components/LoadingScreen";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [mediaClips, setMediaClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchDownloadLinks();
      fetchMediaClips();
      trackPageView();
    }
  }, [id]);

  const trackPageView = async () => {
    try {
      await supabase.from('analytics').insert({
        page_visited: `movie_detail/${id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();

      if (error) throw error;
      setMovie(data);

      // Fetch related movies based on genre
      if (data.genre && data.genre.length > 0) {
        const { data: related } = await supabase
          .from('movies')
          .select('*')
          .overlaps('genre', data.genre)
          .neq('movie_id', id)
          .eq('is_visible', true)
          .limit(6);
        
        setRelatedMovies(related || []);
      }
    } catch (error: any) {
      console.error("Error fetching movie:", error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
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

      if (!error && data) {
        setDownloadLinks(data);
      }
    } catch (error) {
      console.error('Error fetching download links:', error);
    }
  };

  const fetchMediaClips = async () => {
    try {
      const { data, error } = await supabase
        .from('media_clips')
        .select('*')
        .eq('movie_id', id);

      if (!error && data) {
        setMediaClips(data);
      }
    } catch (error) {
      console.error('Error fetching media clips:', error);
    }
  };

  const handleDownload = (link: any) => {
    // Track download
    supabase.from('analytics').insert({
      page_visited: `download_start/${movie.movie_id}`,
      browser: navigator.userAgent,
      device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      operating_system: navigator.platform
    });

    // Increment download count
    supabase
      .from('movies')
      .update({ downloads: (movie.downloads || 0) + 1 })
      .eq('movie_id', movie.movie_id);

    // Open download page
    window.open(`/download/${movie.movie_id}/${link.link_id}`, '_blank');
  };

  if (loading) {
    return <LoadingScreen message="Loading Movie Details..." />;
  }

  if (!movie) {
    return (
      <UniversalAdsWrapper>
        <HeaderWithAds />
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-gray-400">The requested movie could not be found.</p>
          </div>
        </div>
      </UniversalAdsWrapper>
    );
  }

  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Top Ad Banner */}
          <ClickableAdBanner position="content-top" className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <img
                  src={movie.poster_url || `https://via.placeholder.com/400x600?text=${encodeURIComponent(movie.title)}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                />
                
                {/* Sidebar Ad */}
                <div className="mt-6">
                  <ResponsiveAdPlaceholder position="sidebar" />
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-blue-600 text-white">
                    {movie.content_type.toUpperCase()}
                  </Badge>
                  {movie.featured && (
                    <Badge className="bg-yellow-600 text-yellow-100">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                  {movie.year && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{movie.year}</span>
                    </div>
                  )}
                  
                  {movie.imdb_rating && (
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" />
                      <span>{movie.imdb_rating}/10</span>
                    </div>
                  )}
                  
                  {movie.quality && (
                    <div className="flex items-center">
                      <span className="bg-green-600 px-2 py-1 rounded text-xs">
                        {movie.quality}
                      </span>
                    </div>
                  )}

                  {movie.country && (
                    <div className="flex items-center">
                      <Globe size={16} className="mr-1" />
                      <span>{movie.country}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Download size={16} className="mr-1" />
                    <span>{(movie.downloads || 0).toLocaleString()} downloads</span>
                  </div>
                </div>

                {/* Genres */}
                {movie.genre && movie.genre.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genre.map((genre: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director & Production */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {movie.director && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Director</h3>
                      <p className="text-gray-300">{movie.director}</p>
                    </div>
                  )}
                  
                  {movie.production_house && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Production</h3>
                      <p className="text-gray-300">{movie.production_house}</p>
                    </div>
                  )}
                </div>

                {/* Storyline */}
                {movie.storyline && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Storyline</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.storyline}</p>
                  </div>
                )}

                {/* Mid-content Ad */}
                <div className="my-8">
                  <ClickableAdBanner position="content-middle" />
                </div>

                {/* Download Links */}
                {downloadLinks.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Download Links</h3>
                    <div className="grid gap-3">
                      {downloadLinks.map((link) => (
                        <Card key={link.link_id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-white">
                                  {link.quality} - {link.file_size}
                                </p>
                                {link.resolution && (
                                  <p className="text-sm text-gray-400">{link.resolution}</p>
                                )}
                              </div>
                              <Button
                                onClick={() => handleDownload(link)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Download size={16} className="mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Clips */}
                {mediaClips.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Trailers & Clips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mediaClips.map((clip) => (
                        <Card key={clip.clip_id} className="bg-gray-800 border-gray-700 overflow-hidden">
                          <div className="aspect-video relative">
                            <img
                              src={clip.thumbnail_url || `https://via.placeholder.com/320x180?text=${encodeURIComponent(clip.clip_title || 'Video')}`}
                              alt={clip.clip_title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors cursor-pointer">
                              <Play size={48} className="text-white" />
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-white">{clip.clip_title}</h4>
                            <p className="text-sm text-gray-400 capitalize">{clip.clip_type}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Movies */}
                {relatedMovies.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">You Might Also Like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {relatedMovies.map((relatedMovie) => (
                        <Card key={relatedMovie.movie_id} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                          <div className="aspect-[3/4]">
                            <img
                              src={relatedMovie.poster_url || `https://via.placeholder.com/200x300?text=${encodeURIComponent(relatedMovie.title)}`}
                              alt={relatedMovie.title}
                              className="w-full h-full object-cover"
                              onClick={() => window.location.href = `/${relatedMovie.content_type}/${relatedMovie.movie_id}`}
                            />
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-white text-sm line-clamp-1">{relatedMovie.title}</h4>
                            <p className="text-xs text-gray-400">{relatedMovie.year}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Ad */}
          <div className="mt-12">
            <ClickableAdBanner position="content-bottom" />
          </div>
        </div>
      </div>
    </UniversalAdsWrapper>
  );
};

export default MovieDetail;
