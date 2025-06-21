
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import ImageUploader from "@/components/admin/movies/ImageUploader";

const MovieEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  
  const [movieForm, setMovieForm] = useState({
    title: "",
    year: "",
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
    youtubeTrailer: ""
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const email = localStorage.getItem("adminEmail");
        
        if (!token) {
          navigate("/admin/login");
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Session expired");
        }
        
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (adminError || !isAdmin) {
          throw new Error("Not authorized as admin");
        }
        
        setAdminEmail(email || user.email || "admin@example.com");
        
        // Load movie data
        if (id) {
          await fetchMovieData();
        }
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate, id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      
      // Get movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();
      
      if (movieError) throw movieError;
      
      setMovie(movieData);
      
      // Populate form
      setMovieForm({
        title: movieData.title || "",
        year: movieData.year?.toString() || "",
        contentType: movieData.content_type || "movie",
        genre: movieData.genre?.join(', ') || "",
        quality: movieData.quality || "1080p",
        country: movieData.country || "",
        director: movieData.director || "",
        productionHouse: movieData.production_house || "",
        imdbRating: movieData.imdb_rating?.toString() || "",
        storyline: movieData.storyline || "",
        seoTags: movieData.seo_tags?.join(', ') || "",
        posterUrl: movieData.poster_url || "",
        featured: movieData.featured || false,
        youtubeTrailer: ""
      });
      
      // Get download links
      const { data: linksData, error: linksError } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', id);
      
      if (!linksError) {
        setDownloadLinks(linksData || []);
      }
      
      // Get cast
      const { data: castData, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', id);
      
      if (!castError) {
        setCast(castData || []);
      }
      
      // Get trailer
      const { data: trailerData, error: trailerError } = await supabase
        .from('media_clips')
        .select('*')
        .eq('movie_id', id)
        .eq('clip_type', 'trailer')
        .limit(1)
        .maybeSingle();
      
      if (trailerData && !trailerError) {
        setMovieForm(prev => ({
          ...prev,
          youtubeTrailer: trailerData.video_url || ""
        }));
      }
      
    } catch (error: any) {
      console.error("Error fetching movie data:", error);
      toast({
        title: "Error",
        description: "Failed to load movie data.",
        variant: "destructive"
      });
      navigate("/admin/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update movie data
      const movieData = {
        title: movieForm.title.trim(),
        year: movieForm.year ? parseInt(movieForm.year) : null,
        content_type: movieForm.contentType,
        genre: movieForm.genre ? movieForm.genre.split(',').map(g => g.trim()) : [],
        quality: movieForm.quality,
        country: movieForm.country,
        director: movieForm.director,
        production_house: movieForm.productionHouse,
        imdb_rating: movieForm.imdbRating ? parseFloat(movieForm.imdbRating) : null,
        storyline: movieForm.storyline,
        seo_tags: movieForm.seoTags ? movieForm.seoTags.split(',').map(t => t.trim()) : [],
        poster_url: movieForm.posterUrl,
        featured: movieForm.featured,
        updated_at: new Date().toISOString()
      };
      
      const { error: movieError } = await supabase
        .from('movies')
        .update(movieData)
        .eq('movie_id', id);
      
      if (movieError) throw movieError;
      
      // Update or create trailer
      if (movieForm.youtubeTrailer.trim()) {
        const { data: existingTrailer } = await supabase
          .from('media_clips')
          .select('clip_id')
          .eq('movie_id', id)
          .eq('clip_type', 'trailer')
          .limit(1)
          .maybeSingle();
        
        if (existingTrailer) {
          // Update existing trailer
          await supabase
            .from('media_clips')
            .update({ video_url: movieForm.youtubeTrailer.trim() })
            .eq('clip_id', existingTrailer.clip_id);
        } else {
          // Create new trailer
          await supabase
            .from('media_clips')
            .insert({
              movie_id: id,
              clip_title: `${movieForm.title} - Trailer`,
              clip_type: 'trailer',
              video_url: movieForm.youtubeTrailer.trim()
            });
        }
      }
      
      toast({
        title: "Success",
        description: "Movie updated successfully!",
      });
      
    } catch (error: any) {
      console.error("Error updating movie:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update movie",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Delete related data first
      await supabase.from('movie_cast').delete().eq('movie_id', id);
      await supabase.from('download_links').delete().eq('movie_id', id);
      await supabase.from('media_clips').delete().eq('movie_id', id);
      
      // Delete movie
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Movie deleted successfully!",
      });
      
      navigate("/admin/movies");
      
    } catch (error: any) {
      console.error("Error deleting movie:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete movie",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  if (loading) {
    return <LoadingScreen message="Loading Movie Data" />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Button onClick={() => navigate("/admin/movies")}>
            <ArrowLeft className="mr-2" size={16} />
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/movies")}
              className="mr-4"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Movies
            </Button>
            <h1 className="text-2xl font-bold">Edit Movie: {movie.title}</h1>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2" size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              onClick={handleDeleteMovie}
              disabled={saving}
              variant="destructive"
            >
              <Trash2 className="mr-2" size={16} />
              Delete Movie
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movie Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Movie Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
                  placeholder="Enter movie title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={movieForm.year}
                    onChange={(e) => setMovieForm({...movieForm, year: e.target.value})}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label htmlFor="imdbRating">IMDB Rating</Label>
                  <Input
                    id="imdbRating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={movieForm.imdbRating}
                    onChange={(e) => setMovieForm({...movieForm, imdbRating: e.target.value})}
                    placeholder="8.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={movieForm.contentType}
                  onValueChange={(value) => setMovieForm({...movieForm, contentType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Web Series</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="genre">Genres (comma separated)</Label>
                <Input
                  id="genre"
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({...movieForm, genre: e.target.value})}
                  placeholder="Action, Drama, Thriller"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quality">Quality</Label>
                  <Select
                    value={movieForm.quality}
                    onValueChange={(value) => setMovieForm({...movieForm, quality: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
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
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={movieForm.country}
                    onChange={(e) => setMovieForm({...movieForm, country: e.target.value})}
                    placeholder="USA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  value={movieForm.director}
                  onChange={(e) => setMovieForm({...movieForm, director: e.target.value})}
                  placeholder="Director name"
                />
              </div>

              <div>
                <Label htmlFor="productionHouse">Production House</Label>
                <Input
                  id="productionHouse"
                  value={movieForm.productionHouse}
                  onChange={(e) => setMovieForm({...movieForm, productionHouse: e.target.value})}
                  placeholder="Production house name"
                />
              </div>

              <div>
                <Label htmlFor="storyline">Storyline</Label>
                <Textarea
                  id="storyline"
                  value={movieForm.storyline}
                  onChange={(e) => setMovieForm({...movieForm, storyline: e.target.value})}
                  placeholder="Enter movie storyline"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="seoTags">SEO Tags (comma separated)</Label>
                <Input
                  id="seoTags"
                  value={movieForm.seoTags}
                  onChange={(e) => setMovieForm({...movieForm, seoTags: e.target.value})}
                  placeholder="movie, action, 2024"
                />
              </div>

              <div>
                <Label htmlFor="youtubeTrailer">YouTube Trailer URL</Label>
                <Input
                  id="youtubeTrailer"
                  value={movieForm.youtubeTrailer}
                  onChange={(e) => setMovieForm({...movieForm, youtubeTrailer: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={movieForm.featured}
                  onCheckedChange={(checked) => setMovieForm({...movieForm, featured: checked as boolean})}
                />
                <Label htmlFor="featured">Featured Movie</Label>
              </div>
            </div>
          </div>

          {/* Poster Upload and Statistics */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Movie Poster</h2>
              <ImageUploader 
                currentImageUrl={movieForm.posterUrl}
                onImageUrlChange={(url) => setMovieForm({...movieForm, posterUrl: url})}
                label="Movie Poster"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>
              <div className="space-y-2">
                <p><strong>Downloads:</strong> {movie.downloads || 0}</p>
                <p><strong>User Rating:</strong> {movie.user_rating || 0}/10</p>
                <p><strong>Created:</strong> {new Date(movie.created_at).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(movie.updated_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Download Links ({downloadLinks.length})</h2>
              {downloadLinks.length === 0 ? (
                <p className="text-gray-400">No download links available</p>
              ) : (
                <div className="space-y-2">
                  {downloadLinks.map((link) => (
                    <div key={link.link_id} className="bg-gray-700 p-3 rounded">
                      <p><strong>Quality:</strong> {link.quality}</p>
                      <p><strong>Size:</strong> {link.file_size}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Cast Members ({cast.length})</h2>
              {cast.length === 0 ? (
                <p className="text-gray-400">No cast members added</p>
              ) : (
                <div className="space-y-2">
                  {cast.map((member) => (
                    <div key={member.cast_id} className="bg-gray-700 p-3 rounded">
                      <p><strong>{member.actor_name}</strong></p>
                      {member.actor_role && <p className="text-sm text-gray-400">{member.actor_role}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEditPage;
