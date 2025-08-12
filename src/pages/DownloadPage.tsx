
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Play } from "lucide-react";
import { handleDownloadClick, checkReturnFromRedirect } from "@/utils/redirectLoop";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_url: string;
}

interface EpisodeLink {
  link_id: string;
  episode_number: number;
  episode_title: string;
  quality: string;
  file_size: string;
  download_url: string;
  source_name: string;
}

const DownloadPage = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [episodeLinks, setEpisodeLinks] = useState<EpisodeLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLinks, setShowLinks] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const quality = searchParams.get("quality") || "1080p";

  useEffect(() => {
    checkReturnFromRedirect();
    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if (!isLoading && !showLinks) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowLinks(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, showLinks]);

  const fetchMovieDetails = async () => {
    if (!movieId) return;

    try {
      setIsLoading(true);

      // Fetch movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', movieId)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      if (movieData.content_type === 'series') {
        // For series, fetch episodes stored in download_episodes table
        const { data: episodesData, error: episodesError } = await supabase
          .from('download_episodes')
          .select(`
            episode_id,
            episode_number,
            episode_title,
            download_mirrors (
              mirror_id,
              source_name,
              mirror_url
            )
          `)
          .eq('link_id', movieId)
          .order('episode_number');

        if (episodesError) {
          console.error('Episodes error:', episodesError);
          // Fallback to regular download links for series
          const { data: linksData, error: linksError } = await supabase
            .from('download_links')
            .select('*')
            .eq('movie_id', movieId)
            .eq('quality', quality);

          if (linksError) throw linksError;
          setDownloadLinks(linksData || []);
        } else {
          // Transform episodes data into episode links
          const transformedEpisodes: EpisodeLink[] = [];
          episodesData?.forEach(episode => {
            episode.download_mirrors?.forEach((mirror: any) => {
              transformedEpisodes.push({
                link_id: mirror.mirror_id,
                episode_number: parseInt(episode.episode_number),
                episode_title: episode.episode_title || `Episode ${episode.episode_number}`,
                quality: quality,
                file_size: '1.2GB', // Default size for now
                download_url: mirror.mirror_url,
                source_name: mirror.source_name
              });
            });
          });
          setEpisodeLinks(transformedEpisodes);
        }
      } else {
        // Fetch regular download links
        const { data: linksData, error: linksError } = await supabase
          .from('download_links')
          .select('*')
          .eq('movie_id', movieId)
          .eq('quality', quality);

        if (linksError) throw linksError;
        setDownloadLinks(linksData || []);
      }
    } catch (error) {
      console.error('Error fetching download details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLinkClick = async (downloadUrl: string, linkType: 'main' | 'episode' = 'main') => {
    const position = linkType === 'main' ? 'download_cta_1' : 'download_cta_2';
    await handleDownloadClick(position, downloadUrl);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading download page..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <UniversalHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p>The requested movie could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Movie Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 flex-shrink-0">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Play size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-600">{movie.content_type.toUpperCase()}</Badge>
                  <Badge variant="outline">{movie.year}</Badge>
                  <Badge variant="outline">{quality}</Badge>
                  {movie.imdb_rating && (
                    <Badge className="bg-yellow-600">⭐ {movie.imdb_rating}</Badge>
                  )}
                </div>
                
                {movie.storyline && (
                  <p className="text-gray-300 mb-4">{movie.storyline}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {movie.director && (
                    <div>
                      <span className="text-gray-400">Director:</span>
                      <p className="text-white">{movie.director}</p>
                    </div>
                  )}
                  {movie.country && (
                    <div>
                      <span className="text-gray-400">Country:</span>
                      <p className="text-white">{movie.country}</p>
                    </div>
                  )}
                  {movie.genre && movie.genre.length > 0 && (
                    <div>
                      <span className="text-gray-400">Genre:</span>
                      <p className="text-white">{movie.genre.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Downloads:</span>
                    <p className="text-white">{movie.downloads?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown or Download Links */}
        {!showLinks ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Preparing Download Links
              </h2>
              <p className="text-gray-300 mb-6">
                Please wait while we prepare your download links...
              </p>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                {countdown}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Episodes Links (for series) */}
            {movie.content_type === 'series' && episodeLinks.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Episodes - {quality}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {episodeLinks.map((episode) => (
                      <div key={episode.link_id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            Episode {episode.episode_number}
                            {episode.episode_title && `: ${episode.episode_title}`}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{episode.quality}</Badge>
                            <Badge variant="outline">{episode.file_size}</Badge>
                            <Badge className="bg-green-600">{episode.source_name}</Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownloadLinkClick(episode.download_url, 'episode')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regular Download Links (for movies) */}
            {movie.content_type !== 'series' && downloadLinks.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Download Links - {quality}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {downloadLinks.map((link) => (
                      <div key={link.link_id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline">{link.quality}</Badge>
                            <Badge variant="outline">{link.file_size}</Badge>
                          </div>
                          <p className="text-gray-300 text-sm truncate">{link.download_url}</p>
                        </div>
                        <Button
                          onClick={() => handleDownloadLinkClick(link.download_url)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Links Available */}
            {((movie.content_type === 'series' && episodeLinks.length === 0) || 
              (movie.content_type !== 'series' && downloadLinks.length === 0)) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">😔</div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    No Download Links Available
                  </h2>
                  <p className="text-gray-400">
                    Download links for {quality} quality are not available at the moment.
                    Please try a different quality or check back later.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
