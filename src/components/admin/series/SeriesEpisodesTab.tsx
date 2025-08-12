
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Edit3 } from "lucide-react";

interface Series {
  movie_id: string;
  title: string;
}

interface Episode {
  id: string;
  episode_number: number;
  episode_title: string;
  quality: string;
  file_size: string;
  download_url: string;
  source_name: string;
}

const SeriesEpisodesTab = () => {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    episode_number: 1,
    episode_title: '',
    quality: '720p',
    file_size: '',
    download_url: '',
    source_name: 'Google Drive'
  });

  const qualities = ['480p', '720p', '1080p', '4K'];
  const sources = ['Google Drive', 'MEGA', 'MediaFire', 'Dropbox', 'OneDrive'];

  useEffect(() => {
    fetchSeriesList();
  }, []);

  useEffect(() => {
    if (selectedSeries) {
      fetchEpisodes();
    }
  }, [selectedSeries]);

  const fetchSeriesList = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title')
        .eq('content_type', 'series')
        .eq('is_visible', true)
        .order('title');

      if (error) throw error;
      setSeriesList(data || []);
    } catch (error: any) {
      console.error('Error fetching series:', error);
      toast({
        title: "Error",
        description: "Failed to load series list",
        variant: "destructive"
      });
    }
  };

  const fetchEpisodes = async () => {
    if (!selectedSeries) return;

    try {
      setLoading(true);
      // For now, we'll use the download_links table to store episode data
      // with a naming convention to identify episodes
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', selectedSeries)
        .order('quality', { ascending: true });

      if (error) throw error;
      
      // Transform download links to episodes format
      const transformedEpisodes = data?.map(link => ({
        id: link.link_id,
        episode_number: parseInt(link.resolution || '1') || 1,
        episode_title: `Episode ${link.resolution || '1'}`,
        quality: link.quality,
        file_size: link.file_size,
        download_url: link.download_url,
        source_name: 'Direct Link'
      })) || [];
      
      setEpisodes(transformedEpisodes);
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
    if (!selectedSeries || !newEpisode.episode_title || !newEpisode.download_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a series",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      // Store as download link with episode number in resolution field
      const { error } = await supabase
        .from('download_links')
        .insert([{
          movie_id: selectedSeries,
          quality: newEpisode.quality,
          file_size: newEpisode.file_size,
          download_url: newEpisode.download_url,
          resolution: newEpisode.episode_number.toString()
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Episode added successfully"
      });

      setNewEpisode({
        episode_number: newEpisode.episode_number + 1,
        episode_title: '',
        quality: '720p',
        file_size: '',
        download_url: '',
        source_name: 'Google Drive'
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

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('link_id', episodeId);

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
              <SelectValue placeholder="Choose a series to manage episodes" />
            </SelectTrigger>
            <SelectContent>
              {seriesList.map((series) => (
                <SelectItem key={series.movie_id} value={series.movie_id}>
                  {series.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSeries && (
        <>
          {/* Add New Episode Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add New Episode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="episode_number" className="text-white">Episode #</Label>
                  <Input
                    id="episode_number"
                    type="number"
                    min="1"
                    value={newEpisode.episode_number}
                    onChange={(e) => setNewEpisode({ ...newEpisode, episode_number: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="episode_title" className="text-white">Episode Title</Label>
                  <Input
                    id="episode_title"
                    value={newEpisode.episode_title}
                    onChange={(e) => setNewEpisode({ ...newEpisode, episode_title: e.target.value })}
                    placeholder="Episode title"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="quality" className="text-white">Quality</Label>
                  <Select
                    value={newEpisode.quality}
                    onValueChange={(value) => setNewEpisode({ ...newEpisode, quality: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file_size" className="text-white">File Size</Label>
                  <Input
                    id="file_size"
                    value={newEpisode.file_size}
                    onChange={(e) => setNewEpisode({ ...newEpisode, file_size: e.target.value })}
                    placeholder="e.g., 500MB"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="download_url" className="text-white">Download URL</Label>
                  <Input
                    id="download_url"
                    value={newEpisode.download_url}
                    onChange={(e) => setNewEpisode({ ...newEpisode, download_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleAddEpisode}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Episode
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episodes List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Episodes ({episodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {episodes.length === 0 ? (
                <p className="text-gray-400">No episodes found for this series</p>
              ) : (
                <div className="space-y-3">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          Episode {episode.episode_number}: {episode.episode_title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {episode.quality} - {episode.file_size} - {episode.source_name}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-md">
                          {episode.download_url}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDeleteEpisode(episode.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SeriesEpisodesTab;
