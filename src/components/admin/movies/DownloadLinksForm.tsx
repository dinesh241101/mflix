
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DownloadSource {
  name: string;
  url: string;
}

interface DownloadLink {
  resolution: string;
  fileSize: string;
  sources: DownloadSource[];
}

interface Episode {
  number: string;
  title: string;
  links: DownloadLink[];
}

interface DownloadLinksFormProps {
  movieId: string;
  contentType: string;
  onLinksAdded: () => void;
}

const DownloadLinksForm = ({ movieId, contentType, onLinksAdded }: DownloadLinksFormProps) => {
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const resolutions = ['360p', '480p', '720p', '1080p', '1440p', '2160p (4K)'];

  const addDownloadLink = () => {
    setDownloadLinks([...downloadLinks, {
      resolution: '1080p',
      fileSize: '',
      sources: [{ name: '', url: '' }]
    }]);
  };

  const removeDownloadLink = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
  };

  const updateDownloadLink = (index: number, field: string, value: string) => {
    const updated = [...downloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDownloadLinks(updated);
  };

  const addSource = (linkIndex: number) => {
    const updated = [...downloadLinks];
    updated[linkIndex].sources.push({ name: '', url: '' });
    setDownloadLinks(updated);
  };

  const removeSource = (linkIndex: number, sourceIndex: number) => {
    const updated = [...downloadLinks];
    updated[linkIndex].sources = updated[linkIndex].sources.filter((_, i) => i !== sourceIndex);
    setDownloadLinks(updated);
  };

  const updateSource = (linkIndex: number, sourceIndex: number, field: string, value: string) => {
    const updated = [...downloadLinks];
    updated[linkIndex].sources[sourceIndex] = { 
      ...updated[linkIndex].sources[sourceIndex], 
      [field]: value 
    };
    setDownloadLinks(updated);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, {
      number: `${episodes.length + 1}`,
      title: '',
      links: []
    }]);
  };

  const saveDownloadLinks = async () => {
    try {
      setIsLoading(true);

      if (contentType === 'series') {
        // Save episodes with download links
        for (const episode of episodes) {
          for (const link of episode.links) {
            // Insert download link
            const { data: linkData, error: linkError } = await supabase
              .from('download_links')
              .insert({
                movie_id: movieId,
                quality: link.resolution,
                file_size: link.fileSize,
                resolution: link.resolution,
                file_size_gb: parseFloat(link.fileSize) || 0,
                download_url: link.sources[0]?.url || ''
              })
              .select('link_id')
              .single();

            if (linkError) throw linkError;

            // Insert episode
            const { data: episodeData, error: episodeError } = await supabase
              .from('download_episodes')
              .insert({
                link_id: linkData.link_id,
                episode_number: episode.number,
                episode_title: episode.title
              })
              .select('episode_id')
              .single();

            if (episodeError) throw episodeError;

            // Insert mirrors/sources
            for (const source of link.sources) {
              if (source.name && source.url) {
                await supabase
                  .from('download_mirrors')
                  .insert({
                    link_id: linkData.link_id,
                    episode_id: episodeData.episode_id,
                    source_name: source.name,
                    mirror_url: source.url
                  });
              }
            }
          }
        }
      } else {
        // Save movie download links
        for (const link of downloadLinks) {
          // Insert download link
          const { data: linkData, error: linkError } = await supabase
            .from('download_links')
            .insert({
              movie_id: movieId,
              quality: link.resolution,
              file_size: link.fileSize,
              resolution: link.resolution,
              file_size_gb: parseFloat(link.fileSize) || 0,
              download_url: link.sources[0]?.url || ''
            })
            .select('link_id')
            .single();

          if (linkError) throw linkError;

          // Insert mirrors/sources
          for (const source of link.sources) {
            if (source.name && source.url) {
              await supabase
                .from('download_mirrors')
                .insert({
                  link_id: linkData.link_id,
                  source_name: source.name,
                  mirror_url: source.url
                });
            }
          }
        }
      }

      toast({
        title: "Success",
        description: "Download links saved successfully!",
      });

      // Reset form
      setDownloadLinks([]);
      setEpisodes([]);
      onLinksAdded();

    } catch (error: any) {
      console.error("Error saving download links:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save download links",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Links Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contentType === 'series' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Episodes</h3>
                <Button onClick={addEpisode}>
                  <Plus className="mr-2" size={16} />
                  Add Episode
                </Button>
              </div>

              {episodes.map((episode, episodeIndex) => (
                <Card key={episodeIndex} className="bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Episode {episode.number}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Episode Number</Label>
                        <Input
                          value={episode.number}
                          onChange={(e) => {
                            const updated = [...episodes];
                            updated[episodeIndex].number = e.target.value;
                            setEpisodes(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Episode Title</Label>
                        <Input
                          value={episode.title}
                          onChange={(e) => {
                            const updated = [...episodes];
                            updated[episodeIndex].title = e.target.value;
                            setEpisodes(updated);
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Movie Download Links</h3>
                <Button onClick={addDownloadLink}>
                  <Plus className="mr-2" size={16} />
                  Add Download Link
                </Button>
              </div>

              {downloadLinks.map((link, linkIndex) => (
                <Card key={linkIndex} className="bg-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Download Link {linkIndex + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDownloadLink(linkIndex)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Resolution</Label>
                        <Select
                          value={link.resolution}
                          onValueChange={(value) => updateDownloadLink(linkIndex, 'resolution', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {resolutions.map((res) => (
                              <SelectItem key={res} value={res}>{res}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>File Size (GB)</Label>
                        <Input
                          value={link.fileSize}
                          onChange={(e) => updateDownloadLink(linkIndex, 'fileSize', e.target.value)}
                          placeholder="e.g., 3.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Download Sources</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSource(linkIndex)}
                        >
                          <Plus className="mr-1" size={14} />
                          Add Source
                        </Button>
                      </div>

                      {link.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="grid grid-cols-5 gap-2 items-end">
                          <div className="col-span-2">
                            <Label>Source Name</Label>
                            <Input
                              value={source.name}
                              onChange={(e) => updateSource(linkIndex, sourceIndex, 'name', e.target.value)}
                              placeholder="e.g., Telegram Bot"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Source URL</Label>
                            <Input
                              value={source.url}
                              onChange={(e) => updateSource(linkIndex, sourceIndex, 'url', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSource(linkIndex, sourceIndex)}
                            className="text-red-500"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button 
            onClick={saveDownloadLinks} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Download Links"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadLinksForm;
