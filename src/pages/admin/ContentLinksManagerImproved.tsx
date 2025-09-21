import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";

interface Content {
  movie_id: string;
  title: string;
  poster_url?: string;
  year?: number;
  content_type: string;
}

interface DownloadSource {
  source_name: string;
  mirror_url: string;
  cta_button_text: string;
}

interface DownloadLink {
  quality: string;
  file_size: string;
  sources: DownloadSource[];
}

interface Episode {
  episode_number: number;
  episode_title: string;
  download_links: DownloadLink[];
}

const ContentLinksManagerImproved = () => {
  const { adminEmail, logout } = useNewAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedContentType, setSelectedContentType] = useState<string>('movie');
  const [contentList, setContentList] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [movieDownloadLinks, setMovieDownloadLinks] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(false);

  // Get content from navigation state if redirected from content creation
  useEffect(() => {
    const state = location.state as { contentId?: string; contentType?: string };
    if (state?.contentId && state?.contentType) {
      setSelectedContentType(state.contentType);
      // Fetch and select the specific content
      fetchContentList(state.contentType);
    }
  }, [location.state]);

  const qualities = ['480p', '720p', '1080p', '4K', 'BluRay', 'HDRip', 'DVDRip', 'WEBRip'];

  useEffect(() => {
    fetchContentList(selectedContentType);
  }, [selectedContentType]);

  const fetchContentList = async (contentType: string) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, poster_url, year, content_type')
        .eq('content_type', contentType)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentList(data || []);
      
      // Auto-select if coming from navigation
      const state = location.state as { contentId?: string };
      if (state?.contentId && data) {
        const content = data.find(c => c.movie_id === state.contentId);
        if (content) {
          setSelectedContent(content);
          if (content.content_type === 'series') {
            fetchEpisodes(content.movie_id);
          } else {
            fetchMovieDownloadLinks(content.movie_id);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    }
  };

  const fetchEpisodes = async (movieId: string) => {
    try {
      setLoading(true);
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
            download_mirrors(
              mirror_id,
              source_name,
              mirror_url
            )
          )
        `)
        .eq('download_links.movie_id', movieId);

      if (error) throw error;

      // Transform the data for episodes
      const episodesMap = new Map();
      
      data?.forEach((item: any) => {
        const episodeNumber = parseInt(item.episode_number);
        
        if (!episodesMap.has(episodeNumber)) {
          episodesMap.set(episodeNumber, {
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
            quality: item.download_links.quality,
            file_size: item.download_links.file_size,
            sources: []
          };
          episode.download_links.push(downloadLink);
        }

        item.download_links.download_mirrors?.forEach((mirror: any) => {
          downloadLink.sources.push({
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url,
            cta_button_text: "Download Now"
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

  const fetchMovieDownloadLinks = async (movieId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('download_links')
        .select(`
          link_id,
          quality,
          file_size,
          download_mirrors(
            mirror_id,
            source_name,
            mirror_url
          )
        `)
        .eq('movie_id', movieId);

      if (error) throw error;

      // Transform data for movie download links
      const linksMap = new Map();
      
      data?.forEach((item: any) => {
        if (!linksMap.has(item.quality)) {
          linksMap.set(item.quality, {
            quality: item.quality,
            file_size: item.file_size,
            sources: []
          });
        }

        const link = linksMap.get(item.quality);
        item.download_mirrors?.forEach((mirror: any) => {
          link.sources.push({
            source_name: mirror.source_name,
            mirror_url: mirror.mirror_url,
            cta_button_text: "Download Now"
          });
        });
      });

      setMovieDownloadLinks(Array.from(linksMap.values()));
    } catch (error: any) {
      console.error('Error fetching movie download links:', error);
      toast({
        title: "Error",
        description: "Failed to load download links",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (content: Content) => {
    setSelectedContent(content);
    if (content.content_type === 'series') {
      fetchEpisodes(content.movie_id);
    } else {
      fetchMovieDownloadLinks(content.movie_id);
      setEpisodes([]); // Clear episodes for non-series content
    }
  };

  // Movie/Anime download link management
  const addMovieDownloadLink = () => {
    setMovieDownloadLinks([...movieDownloadLinks, {
      quality: "720p",
      file_size: "",
      sources: [{ source_name: "Google Drive", mirror_url: "", cta_button_text: "Download Now" }]
    }]);
  };

  const removeMovieDownloadLink = (index: number) => {
    setMovieDownloadLinks(movieDownloadLinks.filter((_, i) => i !== index));
  };

  const updateMovieDownloadLink = (index: number, field: string, value: any) => {
    const updated = [...movieDownloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setMovieDownloadLinks(updated);
  };

  const addMovieSource = (linkIndex: number) => {
    const updated = [...movieDownloadLinks];
    updated[linkIndex].sources.push({
      source_name: "Google Drive",
      mirror_url: "",
      cta_button_text: "Download Now"
    });
    setMovieDownloadLinks(updated);
  };

  const removeMovieSource = (linkIndex: number, sourceIndex: number) => {
    const updated = [...movieDownloadLinks];
    updated[linkIndex].sources = updated[linkIndex].sources.filter((_, i) => i !== sourceIndex);
    setMovieDownloadLinks(updated);
  };

  const updateMovieSource = (linkIndex: number, sourceIndex: number, field: string, value: any) => {
    const updated = [...movieDownloadLinks];
    updated[linkIndex].sources[sourceIndex] = {
      ...updated[linkIndex].sources[sourceIndex],
      [field]: value
    };
    setMovieDownloadLinks(updated);
  };

  // Episode management for series
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

  const saveMovieDownloadLinks = async () => {
    if (!selectedContent) return;

    try {
      setLoading(true);

      // Clear existing links
      await supabase
        .from('download_links')
        .delete()
        .eq('movie_id', selectedContent.movie_id);

      // Save new links
      for (const link of movieDownloadLinks) {
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

        // Save sources
        for (const source of link.sources) {
          await supabase
            .from('download_mirrors')
            .insert({
              link_id: linkData.link_id,
              source_name: source.source_name,
              mirror_url: source.mirror_url
            });
        }
      }

      toast({
        title: "Success",
        description: "Download links saved successfully!",
      });

      fetchMovieDownloadLinks(selectedContent.movie_id);
    } catch (error: any) {
      console.error('Error saving download links:', error);
      toast({
        title: "Error",
        description: "Failed to save download links",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            link_id: null
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

      fetchEpisodes(selectedContent.movie_id);
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Links Manager</h1>
            <p className="text-gray-400">Add download links and episodes to your content</p>
          </div>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="content-selection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content-selection">Select Content</TabsTrigger>
            <TabsTrigger value="links-management" disabled={!selectedContent}>
              {selectedContent?.content_type === 'series' ? 'Episodes' : 'Download Links'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content-selection" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Select Content Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="series">Web Series</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Available Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentList.map((content) => (
                    <Card 
                      key={content.movie_id}
                      className={`cursor-pointer transition-colors ${
                        selectedContent?.movie_id === content.movie_id 
                          ? 'bg-blue-600/20 border-blue-500' 
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                      }`}
                      onClick={() => handleContentSelect(content)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={content.poster_url || "/placeholder.svg"}
                            alt={content.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{content.title}</h3>
                            <p className="text-sm text-gray-400">{content.year}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {content.content_type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {contentList.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No content available for {selectedContentType}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links-management" className="space-y-6">
            {selectedContent && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={selectedContent.poster_url || "/placeholder.svg"}
                      alt={selectedContent.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedContent.title}</h3>
                      <p className="text-gray-400">{selectedContent.year} • {selectedContent.content_type}</p>
                    </div>
                  </div>

                  {selectedContent.content_type === 'series' ? (
                    // Series Episodes Management
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Episodes Management</h3>
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
                        <Card key={episodeIndex} className="bg-gray-700 border-gray-600">
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
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Episode Number</Label>
                                <Input
                                  type="number"
                                  value={episode.episode_number}
                                  onChange={(e) => updateEpisode(episodeIndex, 'episode_number', parseInt(e.target.value))}
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Episode Title</Label>
                                <Input
                                  value={episode.episode_title}
                                  onChange={(e) => updateEpisode(episodeIndex, 'episode_title', e.target.value)}
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                              </div>
                            </div>

                            {/* Episode Download Links */}
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
                                <Card key={linkIndex} className="bg-gray-600 border-gray-500">
                                  <CardContent className="p-4 space-y-4">
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-white">Quality</Label>
                                        <Select
                                          value={link.quality}
                                          onValueChange={(value) => updateDownloadLink(episodeIndex, linkIndex, 'quality', value)}
                                        >
                                          <SelectTrigger className="bg-gray-500 border-gray-400 text-white">
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
                                          className="bg-gray-500 border-gray-400 text-white"
                                        />
                                      </div>
                                    </div>

                                    {/* Sources */}
                                    <div className="space-y-2">
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
                                        <div key={sourceIndex} className="flex gap-2 items-end">
                                          <div className="flex-1">
                                            <Label className="text-white text-sm">Source Name</Label>
                                            <Input
                                              value={source.source_name}
                                              onChange={(e) => updateSource(episodeIndex, linkIndex, sourceIndex, 'source_name', e.target.value)}
                                              className="bg-gray-400 border-gray-300 text-white"
                                            />
                                          </div>
                                          <div className="flex-2">
                                            <Label className="text-white text-sm">Mirror URL</Label>
                                            <Input
                                              value={source.mirror_url}
                                              onChange={(e) => updateSource(episodeIndex, linkIndex, sourceIndex, 'mirror_url', e.target.value)}
                                              placeholder="https://..."
                                              className="bg-gray-400 border-gray-300 text-white"
                                            />
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSource(episodeIndex, linkIndex, sourceIndex)}
                                            className="text-red-400 hover:text-red-300"
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
                          </CardContent>
                        </Card>
                      ))}

                      {episodes.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">No episodes added yet</p>
                          <Button onClick={addEpisode} className="bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" />
                            Add First Episode
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Movie/Anime Download Links Management
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Download Links</h3>
                        <div className="flex gap-2">
                          <Button onClick={addMovieDownloadLink} className="bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" />
                            Add Quality
                          </Button>
                          <Button onClick={saveMovieDownloadLinks} disabled={loading} className="bg-green-600 hover:bg-green-700">
                            <Save size={16} className="mr-2" />
                            Save Download Links
                          </Button>
                        </div>
                      </div>

                      {movieDownloadLinks.map((link, linkIndex) => (
                        <Card key={linkIndex} className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{link.quality}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMovieDownloadLink(linkIndex)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Quality</Label>
                                <Select
                                  value={link.quality}
                                  onValueChange={(value) => updateMovieDownloadLink(linkIndex, 'quality', value)}
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
                                  onChange={(e) => updateMovieDownloadLink(linkIndex, 'file_size', e.target.value)}
                                  placeholder="e.g., 1.5GB"
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                              </div>
                            </div>

                            {/* Sources */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-white">Download Sources</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addMovieSource(linkIndex)}
                                >
                                  <Plus size={12} className="mr-1" />
                                  Add Source
                                </Button>
                              </div>

                              {link.sources.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="flex gap-2 items-end">
                                  <div className="flex-1">
                                    <Label className="text-white text-sm">Source Name</Label>
                                    <Input
                                      value={source.source_name}
                                      onChange={(e) => updateMovieSource(linkIndex, sourceIndex, 'source_name', e.target.value)}
                                      className="bg-gray-500 border-gray-400 text-white"
                                    />
                                  </div>
                                  <div className="flex-2">
                                    <Label className="text-white text-sm">Mirror URL</Label>
                                    <Input
                                      value={source.mirror_url}
                                      onChange={(e) => updateMovieSource(linkIndex, sourceIndex, 'mirror_url', e.target.value)}
                                      placeholder="https://..."
                                      className="bg-gray-500 border-gray-400 text-white"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMovieSource(linkIndex, sourceIndex)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {movieDownloadLinks.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-400 mb-4">No download links added yet</p>
                          <Button onClick={addMovieDownloadLink} className="bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" />
                            Add First Download Link
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentLinksManagerImproved;