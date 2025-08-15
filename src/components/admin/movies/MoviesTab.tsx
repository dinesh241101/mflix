
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Eye, EyeOff, Plus, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface Movie {
  movie_id: string;
  title: string;
  content_type: string;
  genre: string[];
  year: number;
  country: string;
  storyline: string;
  poster_url: string;
  is_visible: boolean;
  featured: boolean;
  imdb_rating: number;
  director: string;
  production_house: string;
  quality: string;
  trailer_url: string;
  created_at: string;
}

const MoviesTab = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    content_type: "movie",
    genre: [] as string[],
    year: new Date().getFullYear(),
    country: "",
    storyline: "",
    poster_url: "",
    is_visible: true,
    featured: false,
    imdb_rating: 0,
    director: "",
    production_house: "",
    quality: "1080p",
    trailer_url: ""
  });

  const contentTypes = ["movie", "series", "anime"];
  const qualities = ["480p", "720p", "1080p", "4K"];
  const availableGenres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Adventure"];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error: any) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async (movie: Movie) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .update({
          title: movie.title,
          content_type: movie.content_type,
          genre: movie.genre,
          year: movie.year,
          country: movie.country,
          storyline: movie.storyline,
          poster_url: movie.poster_url,
          is_visible: movie.is_visible,
          featured: movie.featured,
          imdb_rating: movie.imdb_rating,
          director: movie.director,
          production_house: movie.production_house,
          quality: movie.quality,
          trailer_url: movie.trailer_url,
          updated_at: new Date().toISOString()
        })
        .eq('movie_id', movie.movie_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie updated successfully"
      });

      setEditingMovie(null);
      fetchMovies();
    } catch (error: any) {
      console.error('Error updating movie:', error);
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .insert([newMovie]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie added successfully"
      });

      setNewMovie({
        title: "",
        content_type: "movie",
        genre: [],
        year: new Date().getFullYear(),
        country: "",
        storyline: "",
        poster_url: "",
        is_visible: true,
        featured: false,
        imdb_rating: 0,
        director: "",
        production_house: "",
        quality: "1080p",
        trailer_url: ""
      });
      setShowAddForm(false);
      fetchMovies();
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      setLoading(true);
      
      // Delete associated download links first
      await supabase
        .from('download_links')
        .delete()
        .eq('movie_id', movieId);
      
      // Delete the movie
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', movieId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie deleted successfully"
      });

      fetchMovies();
    } catch (error: any) {
      console.error('Error deleting movie:', error);
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (movie: Movie) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ is_visible: !movie.is_visible })
        .eq('movie_id', movie.movie_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Movie ${!movie.is_visible ? 'shown' : 'hidden'} successfully`
      });

      fetchMovies();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Content
        </Button>
      </div>

      {/* Add New Content Form */}
      {showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Title</Label>
                <Input
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Content Type</Label>
                <Select
                  value={newMovie.content_type}
                  onValueChange={(value) => setNewMovie({ ...newMovie, content_type: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-white">Storyline</Label>
              <Textarea
                value={newMovie.storyline}
                onChange={(e) => setNewMovie({ ...newMovie, storyline: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddMovie} className="bg-green-600 hover:bg-green-700">
                <Save size={16} className="mr-2" />
                Add Content
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-gray-600"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movies List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : movies.length === 0 ? (
          <div className="text-center text-gray-400">No content found</div>
        ) : (
          movies.map((movie) => (
            <Card key={movie.movie_id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                {editingMovie?.movie_id === movie.movie_id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Title</Label>
                        <Input
                          value={editingMovie.title}
                          onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Content Type</Label>
                        <Select
                          value={editingMovie.content_type}
                          onValueChange={(value) => setEditingMovie({ ...editingMovie, content_type: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {contentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white">Storyline</Label>
                      <Textarea
                        value={editingMovie.storyline}
                        onChange={(e) => setEditingMovie({ ...editingMovie, storyline: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingMovie.is_visible}
                          onCheckedChange={(checked) => setEditingMovie({ ...editingMovie, is_visible: checked })}
                        />
                        <Label className="text-white">Visible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingMovie.featured}
                          onCheckedChange={(checked) => setEditingMovie({ ...editingMovie, featured: checked })}
                        />
                        <Label className="text-white">Featured</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveMovie(editingMovie)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save size={16} className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingMovie(null)}
                        variant="outline"
                        className="border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                          {movie.content_type.charAt(0).toUpperCase() + movie.content_type.slice(1)}
                        </Badge>
                        <Badge variant={movie.is_visible ? "default" : "destructive"}>
                          {movie.is_visible ? "Visible" : "Hidden"}
                        </Badge>
                        {movie.featured && (
                          <Badge className="bg-yellow-600">Featured</Badge>
                        )}
                      </div>
                      {movie.storyline && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{movie.storyline}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => toggleVisibility(movie)}
                        size="sm"
                        variant="ghost"
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        {movie.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </Button>
                      <Button
                        onClick={() => setEditingMovie(movie)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Content</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to delete "{movie.title}"? This action cannot be undone and will also delete all associated download links.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMovie(movie.movie_id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MoviesTab;
