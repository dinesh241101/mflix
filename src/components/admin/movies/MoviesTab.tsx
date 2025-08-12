import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface MoviesTabProps {
  movies?: any[];
  movieForm?: any;
  setMovieForm?: (form: any) => void;
  handleUploadMovie?: (e: React.FormEvent) => void;
  handleDeleteMovie?: (id: string) => void;
  handleEditMovie?: (movie: any) => void;
  genres?: any[];
  countries?: any[];
  languages?: any[];
  qualities?: any[];
  downloadLinks?: any[];
  setDownloadLinks?: (links: any[]) => void;
  newLink?: any;
  setNewLink?: (link: any) => void;
  handleAddDownloadLink?: () => void;
  handleRemoveDownloadLink?: (index: number) => void;
  editingMovie?: any;
  setEditingMovie?: (movie: any) => void;
  handleUpdateMovie?: (e: React.FormEvent) => void;
  handleCancelEdit?: () => void;
  handleToggleVisibility?: (movieId: string, isVisible: boolean) => void;
  handleToggleFeatured?: (movieId: string, isFeatured: boolean) => void;
  selectedMovie?: any;
  setSelectedMovie?: (movie: any) => void;
  handleSelectMovieForCast?: (movieId: string) => void;
  movieCast?: any[];
  castForm?: any;
  setCastForm?: (form: any) => void;
  handleAddCastMember?: (e: React.FormEvent) => void;
  handleDeleteCastMember?: (id: string) => void;
  downloadsCount?: number;
  setDownloadsCount?: (count: number) => void;
  handleUpdateDownloads?: () => void;
  castSearchQuery?: string;
  handleCastSearch?: (query: string) => void;
  castSearchResults?: any[];
  selectCastFromSearch?: (result: any) => void;
  isEditing?: boolean;
}

const MoviesTab = (props: MoviesTabProps = {}) => {
  const [movies, setMovies] = useState(props.movies || []);
  const [movieForm, setMovieForm] = useState(props.movieForm || {
    title: '',
    year: new Date().getFullYear(),
    genre: [],
    country: '',
    director: '',
    storyline: '',
    poster_url: '',
    trailer_url: '',
    content_type: 'movie'
  });
  const [loading, setLoading] = useState(false);

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

  const handleUploadMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (props.handleUploadMovie) {
      props.handleUploadMovie(e);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .insert([movieForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie uploaded successfully"
      });

      setMovieForm({
        title: '',
        year: new Date().getFullYear(),
        genre: [],
        country: '',
        director: '',
        storyline: '',
        poster_url: '',
        trailer_url: '',
        content_type: 'movie'
      });

      fetchMovies();
    } catch (error: any) {
      console.error('Error uploading movie:', error);
      toast({
        title: "Error",
        description: "Failed to upload movie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (props.handleDeleteMovie) {
      props.handleDeleteMovie(id);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', id);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Movies Management</h2>
        <Button>
          <PlusCircle className="mr-2" size={16} />
          Add Movie
        </Button>
      </div>

      {/* Upload Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Movie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadMovie} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Movie title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-white">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={movieForm.year}
                  onChange={(e) => setMovieForm({ ...movieForm, year: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storyline" className="text-white">Storyline</Label>
              <Textarea
                id="storyline"
                value={movieForm.storyline}
                onChange={(e) => setMovieForm({ ...movieForm, storyline: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Movie storyline"
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Uploading..." : "Upload Movie"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Movies List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Movies ({movies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400">Loading movies...</p>
          ) : movies.length === 0 ? (
            <p className="text-gray-400">No movies found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map((movie) => (
                <div key={movie.movie_id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium">{movie.title}</h3>
                  <p className="text-gray-400 text-sm">{movie.year} • {movie.content_type}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteMovie(movie.movie_id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoviesTab;
