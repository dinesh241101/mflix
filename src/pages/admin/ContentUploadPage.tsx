
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Upload, Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/movies/ImageUploader";
import MultipleImageUploader from "@/components/admin/movies/MultipleImageUploader";

const ContentUploadPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [contentForm, setContentForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    contentType: "movie",
    genre: "",
    quality: "1080p",
    country: "",
    director: "",
    productionHouse: "",
    imdbRating: "",
    storyline: "",
    seoTags: "",
    posterUrl: "",
    featured: false,
    youtubeTrailer: "",
    screenshots: [] as string[],
    isVisible: true
  });

  const [downloadLinks, setDownloadLinks] = useState([
    { quality: "720p", source: "Telegram Bot", url: "" },
    { quality: "1080p", source: "Google Drive", url: "" }
  ]);

  const addDownloadLink = () => {
    setDownloadLinks([...downloadLinks, { quality: "720p", source: "Telegram Bot", url: "" }]);
  };

  const removeDownloadLink = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, i) => i !== index));
  };

  const updateDownloadLink = (index: number, field: string, value: string) => {
    const updated = [...downloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDownloadLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    updateActivity();

    try {
      const movieData = {
        title: contentForm.title.trim(),
        year: contentForm.year,
        content_type: contentForm.contentType,
        genre: contentForm.genre ? contentForm.genre.split(',').map(g => g.trim()) : [],
        quality: contentForm.quality,
        country: contentForm.country,
        director: contentForm.director,
        production_house: contentForm.productionHouse,
        imdb_rating: contentForm.imdbRating ? parseFloat(contentForm.imdbRating) : null,
        storyline: contentForm.storyline,
        seo_tags: contentForm.seoTags ? contentForm.seoTags.split(',').map(t => t.trim()) : [],
        poster_url: contentForm.posterUrl,
        featured: contentForm.featured,
        is_visible: contentForm.isVisible,
        screenshots: contentForm.screenshots
      };

      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .insert(movieData)
        .select()
        .single();

      if (movieError) throw movieError;

      // Add download links
      for (const link of downloadLinks) {
        if (link.url.trim()) {
          await supabase
            .from('download_links')
            .insert({
              movie_id: movie.movie_id,
              quality: link.quality,
              file_size: "Unknown",
              download_url: link.url.trim()
            });
        }
      }

      // Add YouTube trailer
      if (contentForm.youtubeTrailer?.trim()) {
        await supabase
          .from('media_clips')
          .insert({
            movie_id: movie.movie_id,
            clip_title: `${contentForm.title} - Trailer`,
            clip_type: 'trailer',
            video_url: contentForm.youtubeTrailer.trim()
          });
      }

      toast({
        title: "Success",
        description: "Content uploaded successfully!",
      });

      // Reset form
      setContentForm({
        title: "",
        year: new Date().getFullYear(),
        contentType: "movie",
        genre: "",
        quality: "1080p",
        country: "",
        director: "",
        productionHouse: "",
        imdbRating: "",
        storyline: "",
        seoTags: "",
        posterUrl: "",
        featured: false,
        youtubeTrailer: "",
        screenshots: [],
        isVisible: true
      });
      
      setDownloadLinks([
        { quality: "720p", source: "Telegram Bot", url: "" },
        { quality: "1080p", source: "Google Drive", url: "" }
      ]);

    } catch (error: any) {
      console.error("Error uploading content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Loading Upload Page" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateActivity();
                navigate("/admin");
              }}
              className="text-white hover:bg-gray-700"
            >
              <Home size={18} className="mr-2" />
              Admin Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Upload New Content</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media & Images</TabsTrigger>
              <TabsTrigger value="downloads">Download Links</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={contentForm.title}
                        onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                        placeholder="Enter content title"
                        className="bg-gray-700 border-gray-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={contentForm.contentType}
                        onValueChange={(value) => setContentForm({...contentForm, contentType: value})}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Web Series</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="shorts">Shorts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={contentForm.year}
                        onChange={(e) => setContentForm({...contentForm, year: parseInt(e.target.value) || new Date().getFullYear()})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imdbRating">IMDB Rating</Label>
                      <Input
                        id="imdbRating"
                        type="number"
                        step="0.1"
                        value={contentForm.imdbRating}
                        onChange={(e) => setContentForm({...contentForm, imdbRating: e.target.value})}
                        placeholder="8.5"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="director">Director</Label>
                      <Input
                        id="director"
                        value={contentForm.director}
                        onChange={(e) => setContentForm({...contentForm, director: e.target.value})}
                        placeholder="Director name"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={contentForm.country}
                        onChange={(e) => setContentForm({...contentForm, country: e.target.value})}
                        placeholder="USA"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="genre">Genres (comma separated)</Label>
                    <Input
                      id="genre"
                      value={contentForm.genre}
                      onChange={(e) => setContentForm({...contentForm, genre: e.target.value})}
                      placeholder="Action, Drama, Thriller"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="storyline">Storyline</Label>
                    <Textarea
                      id="storyline"
                      value={contentForm.storyline}
                      onChange={(e) => setContentForm({...contentForm, storyline: e.target.value})}
                      placeholder="Enter storyline"
                      className="bg-gray-700 border-gray-600"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={contentForm.featured}
                        onCheckedChange={(checked) => setContentForm({...contentForm, featured: checked as boolean})}
                      />
                      <Label htmlFor="featured">Featured Content</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isVisible"
                        checked={contentForm.isVisible}
                        onCheckedChange={(checked) => setContentForm({...contentForm, isVisible: checked as boolean})}
                      />
                      <Label htmlFor="isVisible">Visible to Public</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Media & Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUploader
                    currentImageUrl={contentForm.posterUrl}
                    onImageUrlChange={(url) => setContentForm({...contentForm, posterUrl: url})}
                    label="Poster Image"
                  />

                  <MultipleImageUploader
                    currentImages={contentForm.screenshots}
                    onImageUrlsChange={(urls) => setContentForm({...contentForm, screenshots: urls})}
                    label="Screenshots"
                    maxImages={10}
                  />

                  <div>
                    <Label htmlFor="youtubeTrailer">YouTube Trailer URL</Label>
                    <Input
                      id="youtubeTrailer"
                      value={contentForm.youtubeTrailer}
                      onChange={(e) => setContentForm({...contentForm, youtubeTrailer: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downloads" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Download Links
                    <Button
                      type="button"
                      onClick={addDownloadLink}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="mr-2" size={16} />
                      Add Link
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {downloadLinks.map((link, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Download Link #{index + 1}</h4>
                        {downloadLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDownloadLink(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Quality</Label>
                          <Select
                            value={link.quality}
                            onValueChange={(value) => updateDownloadLink(index, 'quality', value)}
                          >
                            <SelectTrigger className="bg-gray-600 border-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="480p">480p</SelectItem>
                              <SelectItem value="720p">720p</SelectItem>
                              <SelectItem value="1080p">1080p</SelectItem>
                              <SelectItem value="4K">4K</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Source</Label>
                          <Select
                            value={link.source}
                            onValueChange={(value) => updateDownloadLink(index, 'source', value)}
                          >
                            <SelectTrigger className="bg-gray-600 border-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Telegram Bot">Telegram Bot</SelectItem>
                              <SelectItem value="Google Drive">Google Drive</SelectItem>
                              <SelectItem value="TeraBox">TeraBox</SelectItem>
                              <SelectItem value="Mega">Mega</SelectItem>
                              <SelectItem value="MediaFire">MediaFire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Download URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                            placeholder="Enter download URL"
                            className="bg-gray-600 border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{contentForm.title || "Untitled"}</h3>
                    <p><strong>Type:</strong> {contentForm.contentType}</p>
                    <p><strong>Year:</strong> {contentForm.year}</p>
                    <p><strong>Genre:</strong> {contentForm.genre || "Not specified"}</p>
                    <p><strong>Director:</strong> {contentForm.director || "Not specified"}</p>
                    <p><strong>Download Links:</strong> {downloadLinks.filter(link => link.url.trim()).length}</p>
                    <p><strong>Featured:</strong> {contentForm.featured ? "Yes" : "No"}</p>
                    <p><strong>Visible:</strong> {contentForm.isVisible ? "Yes" : "No"}</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  >
                    {loading ? (
                      <>
                        <Upload className="mr-2 animate-spin" size={20} />
                        Uploading Content...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2" size={20} />
                        Upload Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default ContentUploadPage;
