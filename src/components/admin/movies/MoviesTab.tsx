import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Eye, EyeOff, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MovieUploadForm from "./MovieUploadForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MoviesTabProps {
  movies: any[];
  movieForm: any;
  setMovieForm: (form: any) => void;
  handleUploadMovie: (e: React.FormEvent) => void;
  selectedMovie: any;
  setSelectedMovie: (movie: any) => void;
  handleSelectMovieForCast: (movieId: string) => void;
  movieCast: any[];
  castForm: any;
  setCastForm: (form: any) => void;
  handleAddCastMember: (e: React.FormEvent) => void;
  handleDeleteCastMember: (id: string) => void;
  downloadsCount: number;
  setDownloadsCount: (count: number) => void;
  handleUpdateDownloads: () => void;
  castSearchQuery: string;
  handleCastSearch: (query: string) => void;
  castSearchResults: any[];
  selectCastFromSearch: (result: any) => void;
  isEditing: boolean;
}

const MoviesTab = ({
  movies,
  movieForm,
  setMovieForm,
  handleUploadMovie,
  selectedMovie,
  setSelectedMovie,
  handleSelectMovieForCast,
  movieCast,
  castForm,
  setCastForm,
  handleAddCastMember,
  handleDeleteCastMember,
  downloadsCount,
  setDownloadsCount,
  handleUpdateDownloads,
  castSearchQuery,
  handleCastSearch,
  castSearchResults,
  selectCastFromSearch,
  isEditing
}: MoviesTabProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter movies based on search and content type
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.genre?.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = contentTypeFilter === "all" || movie.content_type === contentTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEditMovie = (movie: any) => {
    navigate(`/admin/movies/edit/${movie.movie_id}`);
  };

  const handleDeleteMovie = async () => {
    if (!movieToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Delete related data first
      await supabase.from('movie_cast').delete().eq('movie_id', movieToDelete.movie_id);
      await supabase.from('download_links').delete().eq('movie_id', movieToDelete.movie_id);
      await supabase.from('media_clips').delete().eq('movie_id', movieToDelete.movie_id);
      
      // Delete movie
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', movieToDelete.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Movie deleted successfully!",
      });
      
      setMovieToDelete(null);
      setShowDeleteDialog(false);
      
      // Reload page to refresh data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Error deleting movie:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete movie",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewMovie = (movie: any) => {
    const contentTypeUrl = movie.content_type === 'series' ? 'series' : 
                          movie.content_type === 'anime' ? 'anime' : 'movie';
    window.open(`/${contentTypeUrl}/${movie.movie_id}`, '_blank');
  };

  const handleToggleVisibility = async (movie: any, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ is_visible: isVisible })
        .eq('movie_id', movie.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Movie visibility ${isVisible ? 'enabled' : 'disabled'} successfully!`,
      });
      
      // Reload page to refresh data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update visibility",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Movies Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upload New Movie</h3>
            <Button
              onClick={() => navigate("/admin/upload")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2" size={16} />
              Advanced Upload
            </Button>
          </div>
          <MovieUploadForm />
        </div>
        
        {/* Movies List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Content ({filteredMovies.length})</h3>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredMovies.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.movie_id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{movie.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{movie.year || 'N/A'}</span>
                        <span>•</span>
                        <span className="capitalize">{movie.content_type}</span>
                        {movie.imdb_rating && (
                          <>
                            <span>•</span>
                            <span>⭐ {movie.imdb_rating}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Visibility Toggle */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={movie.is_visible !== false}
                          onCheckedChange={(checked) => handleToggleVisibility(movie, checked)}
                        />
                        <span className="text-xs text-gray-400">
                          {movie.is_visible !== false ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewMovie(movie)}
                        className="hover:bg-gray-600 text-blue-400"
                        title="View Movie"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMovie(movie)}
                        className="hover:bg-gray-600 text-green-400"
                        title="Edit Movie"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          setMovieToDelete(movie);
                          setShowDeleteDialog(true);
                        }}
                        title="Delete Movie"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.slice(0, 3).map((genre: string, index: number) => (
                        <span 
                          key={index}
                          className="bg-blue-600 text-xs px-2 py-1 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                      {movie.genre.length > 3 && (
                        <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                          +{movie.genre.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                      Downloads: {movie.downloads || 0}
                    </span>
                    <span>
                      {movie.featured && (
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded mr-2">
                          Featured
                        </span>
                      )}
                      {new Date(movie.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
              <p className="text-gray-400">No content found.</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || contentTypeFilter !== "all" 
                  ? "Try adjusting your search or filters." 
                  : "Upload your first content using the form."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{movieToDelete?.title}"? This will also delete all related cast members, download links, and media clips. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMovie}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MoviesTab;
