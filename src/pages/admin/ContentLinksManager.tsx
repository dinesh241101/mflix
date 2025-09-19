import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Link as LinkIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Movie {
  movie_id: string;
  title: string;
  content_type: string;
  year?: number;
}

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_url: string;
  resolution?: string;
}

interface Episode {
  episode_id: string;
  episode_number: string;
  episode_title?: string;
}

interface Mirror {
  mirror_id: string;
  source_name: string;
  mirror_url: string;
  display_order: number;
}

const ContentLinksManager = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<'movie' | 'series' | 'anime'>('movie');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [mirrors, setMirrors] = useState<Mirror[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    navigate('/admin');
  };

  // Form states
  const [linkForm, setLinkForm] = useState({
    quality: '',
    file_size: '',
    download_url: '',
    resolution: ''
  });

  const [episodeForm, setEpisodeForm] = useState({
    episode_number: '',
    episode_title: ''
  });

  const [mirrorForm, setMirrorForm] = useState({
    source_name: '',
    mirror_url: '',
    display_order: 0
  });

  useEffect(() => {
    fetchMoviesByType();
  }, [contentType]);

  useEffect(() => {
    if (selectedMovie) {
      fetchDownloadLinks();
      if (selectedMovie.content_type === 'series') {
        fetchEpisodes();
      }
    }
  }, [selectedMovie]);

  const fetchMoviesByType = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, content_type, year')
        .eq('content_type', contentType)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadLinks = async () => {
    if (!selectedMovie) return;

    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', selectedMovie.movie_id)
        .order('quality');

      if (error) throw error;
      setDownloadLinks(data || []);
    } catch (error) {
      console.error('Error fetching download links:', error);
    }
  };

  const fetchEpisodes = async () => {
    if (!selectedMovie) return;

    try {
      const { data, error } = await supabase
        .from('download_episodes')
        .select('*')
        .eq('link_id', selectedMovie.movie_id)
        .order('episode_number');

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const fetchMirrors = async (linkId?: string, episodeId?: string) => {
    try {
      let query = supabase.from('download_mirrors').select('*');
      
      if (linkId) {
        query = query.eq('link_id', linkId);
      }
      if (episodeId) {
        query = query.eq('episode_id', episodeId);
      }

      const { data, error } = await query.order('display_order');

      if (error) throw error;
      setMirrors(data || []);
    } catch (error) {
      console.error('Error fetching mirrors:', error);
    }
  };

  const handleAddLink = async () => {
    if (!selectedMovie || !linkForm.quality || !linkForm.file_size || !linkForm.download_url) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('download_links')
        .insert([{
          movie_id: selectedMovie.movie_id,
          quality: linkForm.quality,
          file_size: linkForm.file_size,
          download_url: linkForm.download_url,
          resolution: linkForm.resolution
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Download link added successfully"
      });

      setLinkForm({ quality: '', file_size: '', download_url: '', resolution: '' });
      fetchDownloadLinks();
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error",
        description: "Failed to add download link",
        variant: "destructive"
      });
    }
  };

  const handleAddEpisode = async () => {
    if (!selectedMovie || !episodeForm.episode_number) {
      toast({
        title: "Error",
        description: "Please enter episode number",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('download_episodes')
        .insert([{
          link_id: selectedMovie.movie_id,
          episode_number: episodeForm.episode_number,
          episode_title: episodeForm.episode_title
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Episode added successfully"
      });

      setEpisodeForm({ episode_number: '', episode_title: '' });
      fetchEpisodes();
    } catch (error) {
      console.error('Error adding episode:', error);
      toast({
        title: "Error",
        description: "Failed to add episode",
        variant: "destructive"
      });
    }
  };

  const handleAddMirror = async (linkId?: string, episodeId?: string) => {
    if (!mirrorForm.source_name || !mirrorForm.mirror_url) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('download_mirrors')
        .insert([{
          link_id: linkId,
          episode_id: episodeId,
          source_name: mirrorForm.source_name,
          mirror_url: mirrorForm.mirror_url,
          display_order: mirrorForm.display_order
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mirror added successfully"
      });

      setMirrorForm({ source_name: '', mirror_url: '', display_order: 0 });
      fetchMirrors(linkId, episodeId);
    } catch (error) {
      console.error('Error adding mirror:', error);
      toast({
        title: "Error",
        description: "Failed to add mirror",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('link_id', linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Download link deleted"
      });

      fetchDownloadLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      const { error } = await supabase
        .from('download_episodes')
        .delete()
        .eq('episode_id', episodeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Episode deleted"
      });

      fetchEpisodes();
    } catch (error) {
      console.error('Error deleting episode:', error);
      toast({
        title: "Error",
        description: "Failed to delete episode",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <LinkIcon size={20} className="text-blue-400" />
              <span className="text-xl font-bold text-white">Content Links Manager</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700 hover:text-red-400"
            >
              <LogOut size={18} className="mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Links Manager</h1>
          <p className="text-gray-400">Manage download links, episodes, and mirrors for your content</p>
        </div>

        {/* Content Type Selection */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Select Content Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={contentType} onValueChange={(value) => setContentType(value as 'movie' | 'series' | 'anime')}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="series">Web Series</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Content Selection */}
        {movies.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Select Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map((movie) => (
                  <div
                    key={movie.movie_id}
                    onClick={() => setSelectedMovie(movie)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMovie?.movie_id === movie.movie_id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <h3 className="font-semibold text-white">{movie.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="capitalize">
                        {movie.content_type}
                      </Badge>
                      {movie.year && (
                        <Badge variant="outline">
                          {movie.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links Management */}
        {selectedMovie && (
          <div className="space-y-6">
            {/* Add Download Link */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LinkIcon size={20} />
                  Add Download Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="quality" className="text-white">Quality *</Label>
                    <Input
                      id="quality"
                      placeholder="e.g., 720p, 1080p, 4K"
                      value={linkForm.quality}
                      onChange={(e) => setLinkForm({ ...linkForm, quality: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="file_size" className="text-white">File Size *</Label>
                    <Input
                      id="file_size"
                      placeholder="e.g., 1.5GB, 800MB"
                      value={linkForm.file_size}
                      onChange={(e) => setLinkForm({ ...linkForm, file_size: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resolution" className="text-white">Resolution</Label>
                    <Input
                      id="resolution"
                      placeholder="e.g., 1920x1080"
                      value={linkForm.resolution}
                      onChange={(e) => setLinkForm({ ...linkForm, resolution: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="download_url" className="text-white">Download URL *</Label>
                    <Input
                      id="download_url"
                      placeholder="https://example.com/download"
                      value={linkForm.download_url}
                      onChange={(e) => setLinkForm({ ...linkForm, download_url: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={handleAddLink} className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Add Link
                </Button>
              </CardContent>
            </Card>

            {/* Episodes Management (for series only) */}
            {selectedMovie.content_type === 'series' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Episode Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="episode_number" className="text-white">Episode Number *</Label>
                      <Input
                        id="episode_number"
                        placeholder="e.g., 1, 2, 3"
                        value={episodeForm.episode_number}
                        onChange={(e) => setEpisodeForm({ ...episodeForm, episode_number: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="episode_title" className="text-white">Episode Title</Label>
                      <Input
                        id="episode_title"
                        placeholder="Episode title (optional)"
                        value={episodeForm.episode_title}
                        onChange={(e) => setEpisodeForm({ ...episodeForm, episode_title: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddEpisode} className="bg-green-600 hover:bg-green-700">
                    <Plus size={16} className="mr-2" />
                    Add Episode
                  </Button>

                  {/* Episodes List */}
                  {episodes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-white font-semibold mb-4">Episodes</h4>
                      <div className="space-y-2">
                        {episodes.map((episode) => (
                          <div key={episode.episode_id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                            <div>
                              <span className="text-white font-medium">Episode {episode.episode_number}</span>
                              {episode.episode_title && (
                                <span className="text-gray-300 ml-2">- {episode.episode_title}</span>
                              )}
                            </div>
                            <Button
                              onClick={() => handleDeleteEpisode(episode.episode_id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Existing Links */}
            {downloadLinks.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Existing Download Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {downloadLinks.map((link) => (
                      <div key={link.link_id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{link.quality}</Badge>
                            <Badge variant="outline">{link.file_size}</Badge>
                            {link.resolution && (
                              <Badge variant="outline">{link.resolution}</Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => handleDeleteLink(link.link_id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm truncate">{link.download_url}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLinksManager;
