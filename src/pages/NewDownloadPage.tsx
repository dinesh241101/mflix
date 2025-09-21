import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import LoadingScreen from "@/components/LoadingScreen";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  resolution: string;
  sources: DownloadSource[];
}

interface DownloadSource {
  mirror_id: string;
  source_name: string;
  mirror_url: string;
}

interface Episode {
  episode_id: string;
  episode_number: string;
  episode_title: string;
  download_links: DownloadLink[];
}

const NewDownloadPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  const fetchMovieData = async () => {
    try {
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', movieId)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      if (movieData.content_type === 'series') {
        await fetchEpisodes(movieId);
      } else {
        await fetchDownloadLinks(movieId);
      }
    } catch (error: any) {
      console.error('Error fetching movie:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadLinks = async (movieId: string) => {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select(`
          link_id,
          quality,
          file_size,
          resolution,
          download_mirrors(
            mirror_id,
            source_name,
            mirror_url
          )
        `)
        .eq('movie_id', movieId)
        .order('quality', { ascending: false });

      if (error) throw error;

      // Group sources by quality
      const linksMap = new Map();
      data?.forEach((link: any) => {
        if (!linksMap.has(link.quality)) {
          linksMap.set(link.quality, {
            link_id: link.link_id,
            quality: link.quality,
            file_size: link.file_size,
            resolution: link.resolution,
            sources: []
          });
        }
        
        const linkData = linksMap.get(link.quality);
        link.download_mirrors?.forEach((mirror: any) => {
          linkData.sources.push({
            mirror_id: mirror.mirror_id,
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url
          });
        });
      });

      setDownloadLinks(Array.from(linksMap.values()));
    } catch (error: any) {
      console.error('Error fetching download links:', error);
    }
  };

  const fetchEpisodes = async (movieId: string) => {
    try {
      const { data, error } = await supabase
        .from('download_episodes')
        .select(`
          episode_id,
          episode_number,
          episode_title,
          download_links!inner(
            link_id,
            quality,
            file_size,
            resolution,
            download_mirrors(
              mirror_id,
              source_name,
              mirror_url
            )
          )
        `)
        .eq('download_links.movie_id', movieId)
        .order('episode_number', { ascending: true });

      if (error) throw error;

      // Group by episodes
      const episodesMap = new Map();
      data?.forEach((item: any) => {
        const episodeNumber = item.episode_number;
        
        if (!episodesMap.has(episodeNumber)) {
          episodesMap.set(episodeNumber, {
            episode_id: item.episode_id,
            episode_number: episodeNumber,
            episode_title: item.episode_title,
            download_links: []
          });
        }

        const episode = episodesMap.get(episodeNumber);
        let downloadLink = episode.download_links.find(
          (link: any) => link.quality === item.download_links.quality
        );

        if (!downloadLink) {
          downloadLink = {
            link_id: item.download_links.link_id,
            quality: item.download_links.quality,
            file_size: item.download_links.file_size,
            resolution: item.download_links.resolution,
            sources: []
          };
          episode.download_links.push(downloadLink);
        }

        item.download_links.download_mirrors?.forEach((mirror: any) => {
          downloadLink.sources.push({
            mirror_id: mirror.mirror_id,
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url
          });
        });
      });

      setEpisodes(Array.from(episodesMap.values()).sort((a, b) => 
        parseInt(a.episode_number) - parseInt(b.episode_number)
      ));
    } catch (error: any) {
      console.error('Error fetching episodes:', error);
    }
  };

  const handleDownloadClick = (linkId: string, quality: string) => {
    // Navigate to download sources page
    navigate(`/download-sources/${movieId}/${linkId}`, {
      state: { movie, quality }
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K':
      case '2160p':
        return 'bg-red-600';
      case '1080p':
        return 'bg-blue-600';
      case '720p':
        return 'bg-green-600';
      case '480p':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading download options..." />;
  }

  if (!movie) {
    return (
      <UniversalAdsWrapper>
        <HeaderWithAds />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Go Home
          </Button>
        </div>
      </UniversalAdsWrapper>
    );
  }

  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            onClick={() => navigate(`/movie/${movieId}`)} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Movie
          </Button>
          
          {/* Movie info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex gap-4 flex-col md:flex-row">
              {movie.poster_url && (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full md:w-32 h-48 md:h-48 object-cover rounded mx-auto md:mx-0"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  <Badge variant="outline">{movie.content_type}</Badge>
                  {movie.year && <Badge variant="secondary">{movie.year}</Badge>}
                  {movie.country && <Badge variant="secondary">{movie.country}</Badge>}
                </div>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {movie.storyline}
                </p>
              </div>
            </div>
          </div>
          
          {/* Download Links Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            {movie.content_type === 'series' ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Episodes
                </h2>
                
                <div className="space-y-6">
                  {episodes.map((episode) => (
                    <Card key={episode.episode_id} className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-center">
                          Episode {episode.episode_number}: {episode.episode_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {episode.download_links.flatMap((link) =>
                            link.sources.map((source, idx) => (
                              <Button
                                key={`${link.link_id}-${idx}`}
                                onClick={() => handleDownloadClick(link.link_id, link.quality)}
                                className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 ${
                                  source.source_name.includes('G-Direct') ? 'bg-teal-600 hover:bg-teal-700' :
                                  source.source_name.includes('Multi') ? 'bg-purple-600 hover:bg-purple-700' :
                                  source.source_name.includes('V-Cloud') ? 'bg-red-600 hover:bg-red-700' :
                                  source.source_name.includes('Filepress') ? 'bg-yellow-600 hover:bg-yellow-700' :
                                  source.source_name.includes('GDToT') ? 'bg-blue-600 hover:bg-blue-700' :
                                  'bg-gray-600 hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1 text-xs">
                                  <Play size={12} />
                                  {source.source_name}
                                </div>
                              </Button>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Download Links
                </h2>
                
                <div className="space-y-6">
                  {downloadLinks.map((link) => (
                    <div key={link.link_id} className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-red-400 mb-4">
                          {link.quality}
                        </h3>
                        <div className="space-y-3">
                          {link.sources.map((source, idx) => (
                            <Button
                              key={`${link.link_id}-${idx}`}
                              onClick={() => handleDownloadClick(link.link_id, link.quality)}
                              className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Download size={18} />
                                CLICK HERE TO DOWNLOAD [{link.file_size}]
                                <Download size={18} />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* G-Direct Section */}
                      <div className="mt-8">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-bold text-teal-400 flex items-center justify-center gap-2">
                            <Download size={18} />
                            G-Direct [Instant]
                            <Download size={18} />
                          </h4>
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-red-400 mb-4">
                            {link.quality}
                          </h3>
                          <Button
                            onClick={() => handleDownloadClick(link.link_id, link.quality)}
                            className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Download size={18} />
                              CLICK HERE TO DOWNLOAD [{link.file_size}]
                              <Download size={18} />
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {downloadLinks.length === 0 && episodes.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <Download size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No download links available yet.</p>
                <p className="text-sm">Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UniversalAdsWrapper>
  );
};

export default NewDownloadPage;