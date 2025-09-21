import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { Plus, Trash2, Edit, Save, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Content {
  movie_id: string;
  title: string;
  content_type: string;
  year?: number;
  poster_url?: string;
  storyline?: string;
}

interface Episode {
  id?: string;
  episode_number: number;
  episode_title: string;
  download_links: DownloadLink[];
}

interface DownloadLink {
  id?: string;
  quality: string;
  file_size: string;
  sources: DownloadSource[];
}

interface DownloadSource {
  id?: string;
  source_name: string;
  mirror_url: string;
  cta_button_text?: string;
}

const UpdateContentPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();
  const [contentType, setContentType] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  const contentTypes = ["movie", "series", "anime"];
  const qualities = ["480p", "720p", "1080p", "1440p", "4K"];
  const defaultSources = ["Google Drive", "MEGA", "MediaFire", "Telegram", "Direct Link"];

  useEffect(() => {
    if (contentType) {
      fetchContentList();
    }
  }, [contentType]);

  useEffect(() => {
    if (selectedContent && selectedContent.content_type === "series") {
      fetchEpisodes();
    }
  }, [selectedContent]);

  const fetchContentList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, content_type, year, poster_url, storyline')
        .eq('content_type', contentType)
        .eq('is_visible', true)
        .order('title');

      if (error) throw error;
      setContentList(data || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content list",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    if (!selectedContent) return;

    try {
      setLoading(true);
      // Fetch episodes with their download links and sources
      const { data: episodeData, error } = await supabase
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
        .eq('download_links.movie_id', selectedContent.movie_id)
        .order('episode_number');

      if (error) throw error;

      // Transform the data into our Episode structure
      const episodesMap = new Map<number, Episode>();
      
      episodeData?.forEach((item: any) => {
        const episodeNum = parseInt(item.episode_number);
        
        if (!episodesMap.has(episodeNum)) {
          episodesMap.set(episodeNum, {
            id: item.episode_id,
            episode_number: episodeNum,
            episode_title: item.episode_title,
            download_links: []
          });
        }

        const episode = episodesMap.get(episodeNum)!;
        
        // Add download link if it doesn't exist
        let downloadLink = episode.download_links.find(
          link => link.quality === item.download_links.quality
        );

        if (!downloadLink) {
          downloadLink = {
            id: item.download_links.link_id,
            quality: item.download_links.quality,
            file_size: item.download_links.file_size,
            sources: []
          };
          episode.download_links.push(downloadLink);
        }

        // Add sources
        item.download_links.download_mirrors?.forEach((mirror: any) => {
          downloadLink!.sources.push({
            id: mirror.mirror_id,
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url
          });
        });
      });

      setEpisodes(Array.from(episodesMap.values()).sort((a, b) => a.episode_number - b.episode_number));
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

  const addEpisode = () => {
    const newEpisodeNumber = episodes.length > 0 
      ? Math.max(...episodes.map(e => e.episode_number)) + 1 
      : 1;
    
    setEpisodes([...episodes, {
      episode_number: newEpisodeNumber,
      episode_title: `Episode ${newEpisodeNumber}`,
      download_links: []
    }]);
  };

  const removeEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index: number, field: string, value: any) => {
    const updated = [...episodes];
    updated[index] = { ...updated[index], [field]: value };
    setEpisodes(updated);
  };

  const addDownloadLink = (episodeIndex: number) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links.push({
      quality: "720p",
      file_size: "",
      sources: [{ source_name: "Google Drive", mirror_url: "", cta_button_text: "Download Now" }]
    });
    setEpisodes(updated);
  };

  const removeDownloadLink = (episodeIndex: number, linkIndex: number) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links = updated[episodeIndex].download_links.filter((_, i) => i !== linkIndex);
    setEpisodes(updated);
  };

  const updateDownloadLink = (episodeIndex: number, linkIndex: number, field: string, value: any) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links[linkIndex] = { 
      ...updated[episodeIndex].download_links[linkIndex], 
      [field]: value 
    };
    setEpisodes(updated);
  };

  const addSource = (episodeIndex: number, linkIndex: number) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links[linkIndex].sources.push({
      source_name: "Google Drive",
      mirror_url: "",
      cta_button_text: "Download Now"
    });
    setEpisodes(updated);
  };

  const removeSource = (episodeIndex: number, linkIndex: number, sourceIndex: number) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links[linkIndex].sources = 
      updated[episodeIndex].download_links[linkIndex].sources.filter((_, i) => i !== sourceIndex);
    setEpisodes(updated);
  };

  const updateSource = (episodeIndex: number, linkIndex: number, sourceIndex: number, field: string, value: any) => {
    const updated = [...episodes];
    updated[episodeIndex].download_links[linkIndex].sources[sourceIndex] = {
      ...updated[episodeIndex].download_links[linkIndex].sources[sourceIndex],
      [field]: value
    };
    setEpisodes(updated);
  };

  const saveEpisodes = async () => {
    if (!selectedContent) return;

    try {
      setLoading(true);

      for (const episode of episodes) {
        // Insert or update episode
        const { data: episodeData, error: episodeError } = await supabase
          .from('download_episodes')
          .upsert({
            episode_number: episode.episode_number.toString(),
            episode_title: episode.episode_title,
            link_id: null // We'll update this after creating the download link
          }, {
            onConflict: 'episode_id'
          })
          .select('episode_id')
          .single();

        if (episodeError) throw episodeError;

        // Save download links
        for (const link of episode.download_links) {
          const { data: linkData, error: linkError } = await supabase
            .from('download_links')
            .insert({
              movie_id: selectedContent.movie_id,
              quality: link.quality,
              file_size: link.file_size,
              download_url: link.sources[0]?.mirror_url || ''
            })
            .select('link_id')
            .single();

          if (linkError) throw linkError;

          // Update episode with link_id
          await supabase
            .from('download_episodes')
            .update({ link_id: linkData.link_id })
            .eq('episode_id', episodeData.episode_id);

          // Save sources
          for (const source of link.sources) {
            await supabase
              .from('download_mirrors')
              .insert({
                link_id: linkData.link_id,
                episode_id: episodeData.episode_id,
                source_name: source.source_name,
                mirror_url: source.mirror_url
              });
          }
        }
      }

      toast({
        title: "Success",
        description: "Episodes saved successfully!",
      });

      fetchEpisodes();
    } catch (error: any) {
      console.error('Error saving episodes:', error);
      toast({
        title: "Error",
        description: "Failed to save episodes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Update Content Links</h1>
          <p className="text-gray-400">Map download links and episodes to your content</p>
        </div>

        <Tabs defaultValue="content-selection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content-selection">Content Selection</TabsTrigger>
            <TabsTrigger value="episode-management" disabled={!selectedContent}>Episode Management</TabsTrigger>
          </TabsList>

          <TabsContent value="content-selection" className="space-y-6">
            {/* Content Type Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Select Content Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Choose content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Content List */}
            {contentType && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Select Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4 text-gray-400">Loading content...</div>
                  ) : contentList.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">No content found for this type</div>
                  ) : (
                    <div className="grid gap-4">
                      {contentList.map((content) => (
                        <div
                          key={content.movie_id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedContent?.movie_id === content.movie_id
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          onClick={() => setSelectedContent(content)}
                        >
                          <div className="flex items-start gap-4">
                            {content.poster_url && (
                              <img 
                                src={content.poster_url} 
                                alt={content.title}
                                className="w-16 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-white font-medium">{content.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{content.content_type}</Badge>
                                {content.year && <span className="text-sm text-gray-400">{content.year}</span>}
                              </div>
                              {content.storyline && (
                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                  {content.storyline}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="episode-management" className="space-y-6">
            {selectedContent && (
              <>
                {/* Selected Content Info */}
                <Card className="bg-blue-900/20 border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ExternalLink size={20} />
                      Selected Content: {selectedContent.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedContent.content_type}</Badge>
                      {selectedContent.year && <span className="text-gray-400">{selectedContent.year}</span>}
                    </div>
                  </CardContent>
                </Card>

                {selectedContent.content_type === "series" ? (
                  /* Series Episode Management */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">Episodes Management</h2>
                      <div className="flex gap-2">
                        <Button onClick={addEpisode} className="bg-blue-600 hover:bg-blue-700">
                          <Plus size={16} className="mr-2" />
                          Add Episode
                        </Button>
                        <Button onClick={saveEpisodes} disabled={loading} className="bg-green-600 hover:bg-green-700">
                          <Save size={16} className="mr-2" />
                          Save All Episodes
                        </Button>
                      </div>
                    </div>

                    {episodes.map((episode, episodeIndex) => (
                      <Card key={episodeIndex} className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-white">Episode {episode.episode_number}</CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeEpisode(episodeIndex)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Episode Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Episode Number</Label>
                              <Input
                                type="number"
                                value={episode.episode_number}
                                onChange={(e) => updateEpisode(episodeIndex, 'episode_number', parseInt(e.target.value))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Episode Title</Label>
                              <Input
                                value={episode.episode_title}
                                onChange={(e) => updateEpisode(episodeIndex, 'episode_title', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                          </div>

                          {/* Download Links */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-white text-lg">Download Links</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addDownloadLink(episodeIndex)}
                              >
                                <Plus size={14} className="mr-1" />
                                Add Quality
                              </Button>
                            </div>

                            {episode.download_links.map((link, linkIndex) => (
                              <Card key={linkIndex} className="bg-gray-700 border-gray-600">
                                <CardHeader>
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline">{link.quality}</Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeDownloadLink(episodeIndex, linkIndex)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white">Quality</Label>
                                      <Select
                                        value={link.quality}
                                        onValueChange={(value) => updateDownloadLink(episodeIndex, linkIndex, 'quality', value)}
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
                                    </div>
                                    <div>
                                      <Label className="text-white">File Size</Label>
                                      <Input
                                        value={link.file_size}
                                        onChange={(e) => updateDownloadLink(episodeIndex, linkIndex, 'file_size', e.target.value)}
                                        placeholder="e.g., 500MB"
                                        className="bg-gray-600 border-gray-500 text-white"
                                      />
                                    </div>
                                  </div>

                                  {/* Sources */}
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <Label className="text-white">Download Sources</Label>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addSource(episodeIndex, linkIndex)}
                                      >
                                        <Plus size={12} className="mr-1" />
                                        Add Source
                                      </Button>
                                    </div>

                                    {link.sources.map((source, sourceIndex) => (
                                      <div key={sourceIndex} className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-3">
                                          <Label className="text-white text-xs">Source Name</Label>
                                          <Select
                                            value={source.source_name}
                                            onValueChange={(value) => updateSource(episodeIndex, linkIndex, sourceIndex, 'source_name', value)}
                                          >
                                            <SelectTrigger className="bg-gray-600 border-gray-500 text-white text-xs">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {defaultSources.map((sourceName) => (
                                                <SelectItem key={sourceName} value={sourceName}>{sourceName}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="col-span-4">
                                          <Label className="text-white text-xs">Download URL</Label>
                                          <Input
                                            value={source.mirror_url}
                                            onChange={(e) => updateSource(episodeIndex, linkIndex, sourceIndex, 'mirror_url', e.target.value)}
                                            placeholder="https://..."
                                            className="bg-gray-600 border-gray-500 text-white text-xs"
                                          />
                                        </div>
                                        <div className="col-span-4">
                                          <Label className="text-white text-xs">CTA Button Text</Label>
                                          <Input
                                            value={source.cta_button_text || "Download Now"}
                                            onChange={(e) => updateSource(episodeIndex, linkIndex, sourceIndex, 'cta_button_text', e.target.value)}
                                            placeholder="Download Now"
                                            className="bg-gray-600 border-gray-500 text-white text-xs"
                                          />
                                        </div>
                                        <div className="col-span-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSource(episodeIndex, linkIndex, sourceIndex)}
                                            className="text-red-400 hover:text-red-300"
                                          >
                                            <Trash2 size={12} />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Movie/Anime Download Links Management */
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Download Links Management</h2>
                    <p className="text-gray-400">For movies and anime, manage download links directly without episodes.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UpdateContentPage;