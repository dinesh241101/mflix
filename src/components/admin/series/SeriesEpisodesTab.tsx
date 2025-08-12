import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Edit3 } from "lucide-react";

interface Series {
  movie_id: string;
  title: string;
}

interface Episode {
  episode_id: string;
  series_id: string;
  episode_number: number;
  episode_title: string;
  episode_description: string;
}

interface EpisodeLink {
  link_id: string;
  episode_id: string;
  quality: string;
  file_size: string;
  download_url: string;
  source_name: string;
  is_active: boolean;
}

const SeriesEpisodesTab = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeLinks, setEpisodeLinks] = useState<EpisodeLink[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newEpisode, setNewEpisode] = useState({
    episode_number: 1,
    episode_title: '',
    episode_description: ''
  });

  const [newLink, setNewLink] = useState({
    episode_id: '',
    quality: '720p',
    file_size: '',
    download_url: '',
    source_name: 'Google Drive'
  });

  const qualities = ['480p', '720p', '1080p', '4K'];
  const sources = ['Google Drive', 'MEGA', 'MediaFire', 'Dropbox', 'OneDrive'];

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    if (selectedSeries) {
      fetchEpisodes();
    }
  }, [selectedSeries]);

  const fetchSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title')
        .eq('content_type', 'series')
        .order('title');

      if (error) throw error;
      setSeries(data || []);
    } catch (error: any) {
      console.error('Error fetching series:', error);
      toast({
        title: "Error",
        description: "Failed to load series",
        variant: "destructive"
      });
    }
  };

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const { data: episodesData, error: episodesError } = await supabase
        .from('series_episodes')
        .select('*')
        .eq('series_id', selectedSeries)
        .order('episode_number');

      if (episodesError) throw episodesError;
      setEpisodes(episodesData || []);

      if (episodesData && episodesData.length > 0) {
        const episodeIds = episodesData.map(ep => ep.episode_id);
        const { data: linksData, error: linksError } = await supabase
          .from('episode_download_links')
          .select('*')
          .in('episode_id', episodeIds)
          .order('quality');

        if (linksError) throw linksError;
        setEpisodeLinks(linksData || []);
      } else {
        setEpisodeLinks([]);
      }
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

  const handleAddEpisode = async () => {
    if (!selectedSeries || !newEpisode.episode_title) {
      toast({
        title: "Error",
        description: "Please select a series and provide episode title",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('series_episodes')
        .insert([{
          series_id: selectedSeries,
          ...newEpisode
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Episode added successfully"
      });

      setNewEpisode({
        episode_number: Math.max(...episodes.map(ep => ep.episode_number), 0) + 1,
        episode_title: '',
        episode_description: ''
      });

      fetchEpisodes();
    } catch (error: any) {
      console.error('Error adding episode:', error);
      toast({
        title: "Error",
        description: "Failed to add episode",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEpisodeLink = async () => {
    if (!newLink.episode_id || !newLink.download_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('episode_download_links')
        .insert([newLink]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Download link added successfully"
      });

      setNewLink({
        episode_id: '',
        quality: '720p',
        file_size: '',
        download_url: '',
        source_name: 'Google Drive'
      });

      fetchEpisodes();
    } catch (error: any) {
      console.error('Error adding download link:', error);
      toast({
        title: "Error",
        description: "Failed to add download link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('series_episodes')
        .delete()
        .eq('episode_id', episodeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Episode deleted successfully"
      });

      fetchEpisodes();
    } catch (error: any) {
      console.error('Error deleting episode:', error);
      toast({
        title: "Error",
        description: "Failed to delete episode",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('episode_download_links')
        .delete()
        .eq('link_id', linkId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Download link deleted successfully"
      });

      fetchEpisodes();
    } catch (error: any) {
      console.error('Error deleting download link:', error);
      toast({
        title: "Error",
        description: "Failed to delete download link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Series Episodes Management</h2>
      </div>

      {/* Series Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Select Series</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a series to manage episodes" />
            </SelectTrigger>
            <SelectContent>
              {series.map((s) => (
                <SelectItem key={s.movie_id} value={s.movie_id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSeries && (
        <>
          {/* Add New Episode */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Episode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="episode_number" className="text-white">Episode Number</Label>
                  <Input
                    id="episode_number"
                    type="number"
                    min="1"
                    value={newEpisode.episode_number}
                    onChange={(e) => setNewEpisode({ ...newEpisode, episode_number: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="episode_title" className="text-white">Episode Title</Label>
                  <Input
                    id="episode_title"
                    value={newEpisode.episode_title}
                    onChange={(e) => setNewEpisode({ ...newEpisode, episode_title: e.target.value })}
                    placeholder="Episode title"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="episode_description" className="text-white">Episode Description</Label>
                <Textarea
                  id="episode_description"
                  value={newEpisode.episode_description}
                  onChange={(e) => setNewEpisode({ ...newEpisode, episode_description: e.target.value })}
                  placeholder="Episode description"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button
                onClick={handleAddEpisode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add Episode
              </Button>
            </CardContent>
          </Card>

          {/* Episodes List */}
          <div className="space-y-4">
            {episodes.map((episode) => {
              const links = episodeLinks.filter(link => link.episode_id === episode.episode_id);
              
              return (
                <Card key={episode.episode_id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex justify-between items-center">
                      Episode {episode.episode_number}: {episode.episode_title}
                      <Button
                        onClick={() => handleDeleteEpisode(episode.episode_id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {episode.episode_description && (
                      <p className="text-gray-300">{episode.episode_description}</p>
                    )}

                    {/* Add Download Link for this Episode */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Add Download Link</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <Select
                          value={newLink.episode_id === episode.episode_id ? newLink.quality : '720p'}
                          onValueChange={(value) => setNewLink({ ...newLink, episode_id: episode.episode_id, quality: value })}
                        >
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {qualities.map((quality) => (
                              <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="File size (e.g., 500MB)"
                          value={newLink.episode_id === episode.episode_id ? newLink.file_size : ''}
                          onChange={(e) => setNewLink({ ...newLink, episode_id: episode.episode_id, file_size: e.target.value })}
                          className="bg-gray-600 border-gray-500 text-white"
                        />

                        <Select
                          value={newLink.episode_id === episode.episode_id ? newLink.source_name : 'Google Drive'}
                          onValueChange={(value) => setNewLink({ ...newLink, episode_id: episode.episode_id, source_name: value })}
                        >
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sources.map((source) => (
                              <SelectItem key={source} value={source}>{source}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="Download URL"
                          value={newLink.episode_id === episode.episode_id ? newLink.download_url : ''}
                          onChange={(e) => setNewLink({ ...newLink, episode_id: episode.episode_id, download_url: e.target.value })}
                          className="bg-gray-600 border-gray-500 text-white"
                        />

                        <Button
                          onClick={handleAddEpisodeLink}
                          disabled={loading || newLink.episode_id !== episode.episode_id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Existing Download Links */}
                    {links.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-3">Download Links</h4>
                        <div className="space-y-2">
                          {links.map((link) => (
                            <div key={link.link_id} className="flex items-center gap-4 p-3 bg-gray-600 rounded">
                              <span className="text-blue-400 font-medium">{link.quality}</span>
                              <span className="text-gray-300">{link.file_size}</span>
                              <span className="text-green-400">{link.source_name}</span>
                              <span className="flex-1 text-gray-300 text-sm truncate">{link.download_url}</span>
                              <Button
                                onClick={() => handleDeleteLink(link.link_id)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SeriesEpisodesTab;
