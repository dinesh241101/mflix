
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import MovieForm from "./MovieForm";
import MovieList from "./MovieList";
import MovieDetailsDialog from "./MovieDetailsDialog";

interface MoviesTabProps {
  movies: any[];
  movieForm: any;
  setMovieForm: (form: any) => void;
  handleUploadMovie: (e: React.FormEvent) => void;
  selectedMovie: any;
  setSelectedMovie: (movie: any) => void;
  handleSelectMovieForCast: (movieId: string) => void;
  movieCast: any[];
  isEditing: boolean;
  castForm: {
    name: string;
    role: string;
  };
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
  const [showContentManager, setShowContentManager] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<string | null>(null);

  // Handle delete movie confirmation
  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Delete movie from database
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', movieToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Movie deleted",
        description: "The movie has been permanently deleted.",
      });
      
      // Remove from local state (this assumes movies state is updated elsewhere)
      // If not, you might need to fetch movies again or update local state
      
      // Close dialog
      setMovieToDelete(null);
    } catch (error: any) {
      console.error("Error deleting movie:", error);
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the movie.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit movie
  const handleEditMovie = (movieId: string) => {
    // Find the movie to edit
    const movieData = movies.find(m => m.movie_id === movieId);
    if (movieData) {
      // Set form data (this is simplified - you'd need to map database fields to form fields)
      setMovieForm({
        title: movieData.title || "",
        year: movieData.year?.toString() || "",
        contentType: movieData.content_type || "movie",
        genre: Array.isArray(movieData.genre) ? movieData.genre.join(", ") : "",
        quality: movieData.quality || "1080p",
        country: movieData.country || "",
        director: movieData.director || "",
        productionHouse: movieData.production_house || "",
        imdbRating: movieData.imdb_rating?.toString() || "",
        storyline: movieData.storyline || "",
        seoTags: Array.isArray(movieData.seo_tags) ? movieData.seo_tags.join(", ") : "",
        posterUrl: movieData.poster_url || "",
        featured: movieData.featured || false,
        youtubeTrailer: "",  // You'd need to fetch this from another table
        downloadLinks: "",   // You'd need to fetch these from another table
        releaseMonth: "",
        releaseYear: ""
      });
      
      setMovieToEdit(movieId);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Movies Management</h2>
        <div className="flex space-x-4">
          <Dialog open={showContentManager} onOpenChange={setShowContentManager}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2" size={16} />
                Manage Content
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Content Management</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <MovieList 
                  movies={movies}
                  onSelectMovie={handleSelectMovieForCast}
                  onEditMovie={handleEditMovie}
                  onDeleteMovie={(id) => setMovieToDelete(id)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Edit Movie Dialog */}
      <Dialog open={!!movieToEdit} onOpenChange={(open) => !open && setMovieToEdit(null)}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update movie information below.
            </DialogDescription>
          </DialogHeader>
          <MovieForm 
            movieForm={movieForm} 
            setMovieForm={setMovieForm} 
            onSubmit={(e) => {
              e.preventDefault();
              // Here you'd handle updating instead of creating
              // handleUpdateMovie(e);
              setMovieToEdit(null);
              toast({
                title: "Not implemented",
                description: "Update functionality is not fully implemented yet.",
              });
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!movieToDelete} onOpenChange={(open) => !open && setMovieToDelete(null)}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <MovieForm 
        movieForm={movieForm} 
        setMovieForm={setMovieForm} 
        onSubmit={handleUploadMovie} 
      />
      
      <MovieDetailsDialog 
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
        movieCast={movieCast}
        castForm={castForm}
        setCastForm={setCastForm}
        handleAddCastMember={handleAddCastMember}
        handleDeleteCastMember={handleDeleteCastMember}
        downloadsCount={downloadsCount}
        setDownloadsCount={setDownloadsCount}
        handleUpdateDownloads={handleUpdateDownloads}
        castSearchQuery={castSearchQuery}
        handleCastSearch={handleCastSearch}
        castSearchResults={castSearchResults}
        selectCastFromSearch={selectCastFromSearch}
      />
    </div>
  );
};

export default MoviesTab;
