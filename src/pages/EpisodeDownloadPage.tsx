import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Play, Download, Clock, CheckCircle } from "lucide-react";
import UniversalHeader from "@/components/universal/UniversalHeader";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

interface Movie {
  movie_id: string;
  title: string;
  poster_url?: string;
  year?: number;
  content_type: string;
}

interface Episode {
  episode_id: string;
  episode_number: string;
  episode_title: string;
  download_links: DownloadLink[];
}

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_mirrors: DownloadMirror[];
}

interface DownloadMirror {
  mirror_id: string;
  source_name: string;
  mirror_url: string;
}

const EpisodeDownloadPage = () => {
  const { movieId, quality } = useParams<{ movieId: string; quality: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieAndEpisodes();
    }
  }, [movieId]);

  useEffect(() => {
    if (countdown > 0 && !showEpisodes) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowEpisodes(true);
    }
  }, [countdown, showEpisodes]);

  const fetchMovieAndEpisodes = async () => {
    try {
      setLoading(true);

      // Fetch movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, content_type')
        .eq('movie_id', movieId)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      // Fetch episodes with download links and mirrors
      const { data: episodeData, error: episodeError } = await supabase
        .from('download_episodes')
        .select(`
          episode_id,
          episode_number,
          episode_title,
          download_links!inner(
            link_id,
            quality,
            file_size,
            download_mirrors(
              mirror_id,
              source_name,
              mirror_url
            )
          )
        `)
        .eq('download_links.movie_id', movieId)
        .eq('download_links.quality', quality || '720p')
        .order('episode_number');

      if (episodeError) throw episodeError;

      // Transform the data
      const episodesMap = new Map<string, Episode>();
      
      episodeData?.forEach((item: any) => {
        if (!episodesMap.has(item.episode_id)) {
          episodesMap.set(item.episode_id, {
            episode_id: item.episode_id,
            episode_number: item.episode_number,
            episode_title: item.episode_title,
            download_links: []
          });
        }

        const episode = episodesMap.get(item.episode_id)!;
        
        // Add download link if it doesn't exist
        let downloadLink = episode.download_links.find(
          link => link.link_id === item.download_links.link_id
        );

        if (!downloadLink) {
          downloadLink = {
            link_id: item.download_links.link_id,
            quality: item.download_links.quality,
            file_size: item.download_links.file_size,
            download_mirrors: []
          };
          episode.download_links.push(downloadLink);
        }

        // Add mirrors
        item.download_links.download_mirrors?.forEach((mirror: any) => {
          downloadLink!.download_mirrors.push({
            mirror_id: mirror.mirror_id,
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url
          });
        });
      });

      const sortedEpisodes = Array.from(episodesMap.values()).sort(
        (a, b) => parseInt(a.episode_number) - parseInt(b.episode_number)
      );
      
      setEpisodes(sortedEpisodes);
    } catch (error: any) {
      console.error('Error fetching episodes:', error);
      toast({
        title: "Error",
        description: "Failed to load episodes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleSourceClick = (mirrorUrl: string) => {
    // Implement redirect loop logic here
    // For now, just open the link
    window.open(mirrorUrl, '_blank');
  };

  const progressPercentage = ((30 - countdown) / 30) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <UniversalHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-white">Loading episodes...</div>
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
        {movie && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {movie.poster_url && (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{movie.content_type}</Badge>
                    {movie.year && <span className="text-gray-400">{movie.year}</span>}
                    <Badge variant="secondary">{quality || '720p'}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <ResponsiveAdPlaceholder position="content-top" />

        {!showEpisodes ? (
          /* Countdown Timer */
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                <Clock size={24} />
                Preparing Episode Links...
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl font-bold text-blue-500">{countdown}</div>
              <Progress value={progressPercentage} className="w-full max-w-md mx-auto" />
              <p className="text-gray-300">
                Your episode download links will be available in {countdown} seconds
              </p>
              <ResponsiveAdPlaceholder position="content-middle" />
            </CardContent>
          </Card>
        ) : selectedEpisode ? (
          /* Episode Sources */
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Episode {selectedEpisode.episode_number}: {selectedEpisode.episode_title}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedEpisode(null)}
                  >
                    ← Back to Episodes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {selectedEpisode.download_links.map((link) => (
                    <div key={link.link_id}>
                      <h3 className="text-white font-medium mb-3">
                        Quality: {link.quality} ({link.file_size})
                      </h3>
                      <div className="grid gap-3">
                        {link.download_mirrors.map((mirror, index) => (
                          <Card key={mirror.mirror_id} className="bg-gray-700 border-gray-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Download size={20} className="text-blue-400" />
                                  <div>
                                    <p className="text-white font-medium">{mirror.source_name}</p>
                                    <p className="text-sm text-gray-400">Source {index + 1}</p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handleSourceClick(mirror.mirror_url)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Download Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <ResponsiveAdPlaceholder position="content-bottom" />
          </div>
        ) : (
          /* Episode List */
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle size={24} className="text-green-500" />
                  Episodes Available ({episodes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {episodes.map((episode) => (
                    <Card 
                      key={episode.episode_id} 
                      className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => handleEpisodeClick(episode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Play size={20} className="text-blue-400" />
                            <div>
                              <h3 className="text-white font-medium">
                                Episode {episode.episode_number}: {episode.episode_title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {episode.download_links.length} quality option(s) available
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {episode.download_links.map((link) => (
                              <Badge key={link.link_id} variant="outline">
                                {link.quality}
                              </Badge>
                            ))}
                            <Button variant="outline" size="sm">
                              View Sources
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            <ResponsiveAdPlaceholder position="content-bottom" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeDownloadPage;