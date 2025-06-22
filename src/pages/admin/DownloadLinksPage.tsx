import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const DownloadLinksPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [newLink, setNewLink] = useState({
    quality: "",
    file_size: "",
    download_url: "",
    resolution: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authLoading && (!user || !isAdmin)) {
          navigate("/admin/login");
          return;
        }

        setAdminEmail(user?.email || "admin@example.com");
        await fetchMovies();
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [user, isAdmin, authLoading, navigate]);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title, content_type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchDownloadLinks = async (movieId: string) => {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDownloadLinks(data || []);
    } catch (error) {
      console.error("Error fetching download links:", error);
    }
  };

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovie(movieId);
    if (movieId) {
      fetchDownloadLinks(movieId);
    } else {
      setDownloadLinks([]);
    }
  };

  const addDownloadLink = async () => {
    if (!selectedMovie || !newLink.quality || !newLink.file_size || !newLink.download_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('download_links')
        .insert({
          movie_id: selectedMovie,
          quality: newLink.quality,
          file_size: newLink.file_size,
          download_url: newLink.download_url,
          resolution: newLink.resolution
        });

      if (error) throw error;

      setNewLink({
        quality: "",
        file_size: "",
        download_url: "",
        resolution: ""
      });

      fetchDownloadLinks(selectedMovie);
      
      toast({
        title: "Success",
        description: "Download link added successfully",
      });
    } catch (error) {
      console.error("Error adding download link:", error);
      toast({
        title: "Error",
        description: "Failed to add download link",
        variant: "destructive"
      });
    }
  };

  const removeDownloadLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('link_id', linkId);

      if (error) throw error;

      fetchDownloadLinks(selectedMovie);
      
      toast({
        title: "Success",
        description: "Download link removed successfully",
      });
    } catch (error) {
      console.error("Error removing download link:", error);
      toast({
        title: "Error",
        description: "Failed to remove download link",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading || authLoading) {
    return <LoadingScreen message="Loading Download Links Management" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Download Links Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movie Selection & Add Link */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add Download Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="movie">Select Movie/Series</Label>
                <select
                  id="movie"
                  value={selectedMovie}
                  onChange={(e) => handleMovieSelect(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">Select a movie or series</option>
                  {movies.map((movie) => (
                    <option key={movie.movie_id} value={movie.movie_id}>
                      {movie.title} ({movie.content_type})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMovie && (
                <>
                  <div>
                    <Label htmlFor="quality">Quality *</Label>
                    <Input
                      id="quality"
                      value={newLink.quality}
                      onChange={(e) => setNewLink({...newLink, quality: e.target.value})}
                      placeholder="e.g., 1080p, 720p, 480p"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fileSize">File Size *</Label>
                    <Input
                      id="fileSize"
                      value={newLink.file_size}
                      onChange={(e) => setNewLink({...newLink, file_size: e.target.value})}
                      placeholder="e.g., 2.5 GB, 800 MB"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="resolution">Resolution</Label>
                    <Input
                      id="resolution"
                      value={newLink.resolution}
                      onChange={(e) => setNewLink({...newLink, resolution: e.target.value})}
                      placeholder="e.g., 1920x1080, 1280x720"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="downloadUrl">Download URL *</Label>
                    <Textarea
                      id="downloadUrl"
                      value={newLink.download_url}
                      onChange={(e) => setNewLink({...newLink, download_url: e.target.value})}
                      placeholder="Enter the download URL"
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  <Button onClick={addDownloadLink} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus size={16} className="mr-2" />
                    Add Download Link
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Existing Download Links */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Existing Download Links</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedMovie ? (
                <p className="text-gray-400 text-center py-8">
                  Select a movie or series to view download links
                </p>
              ) : downloadLinks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No download links found for this content
                </p>
              ) : (
                <div className="space-y-4">
                  {downloadLinks.map((link) => (
                    <div key={link.link_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white">{link.quality}</div>
                        <div className="text-sm text-gray-400">Size: {link.file_size}</div>
                        {link.resolution && (
                          <div className="text-sm text-gray-400">Resolution: {link.resolution}</div>
                        )}
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {link.download_url}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDownloadLink(link.link_id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DownloadLinksPage;
