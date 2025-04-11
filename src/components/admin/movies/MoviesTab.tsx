
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  selectCastFromSearch
}: MoviesTabProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Movies Management</h2>
        <div className="flex space-x-4">
          <Dialog>
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
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
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
