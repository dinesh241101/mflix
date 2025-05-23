
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieUploadForm from "./MovieUploadForm";
import MoviesList from "./MoviesList";
import MovieDetailsDialog from "./MovieDetailsDialog";
import DownloadLinksForm from "./DownloadLinksForm";

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
  const [refreshList, setRefreshList] = useState(0);

  const handleRefreshList = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Movies Management</h1>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="upload">Upload Movie</TabsTrigger>
          <TabsTrigger value="list">Movies List</TabsTrigger>
          <TabsTrigger value="downloads">Download Links</TabsTrigger>
          <TabsTrigger value="cast">Manage Cast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <MovieUploadForm 
            movieForm={movieForm}
            setMovieForm={setMovieForm}
            handleUploadMovie={handleUploadMovie}
            isEditing={isEditing}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <MoviesList 
            movies={movies}
            onSelectMovie={handleSelectMovieForCast}
            refreshTrigger={refreshList}
          />
        </TabsContent>

        <TabsContent value="downloads">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configure Download Links</h2>
            <p className="text-gray-400">
              Select a movie to configure its download links with multiple quality options and sources.
            </p>
            
            {selectedMovie ? (
              <DownloadLinksForm 
                movieId={selectedMovie.movie_id || selectedMovie.id}
                contentType={selectedMovie.content_type || "movie"}
                onLinksAdded={handleRefreshList}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">Please select a movie from the Movies List tab first.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="cast">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Cast Management</h2>
            <p className="text-gray-400">
              Select a movie to manage its cast members.
            </p>
            
            {selectedMovie ? (
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
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">Please select a movie from the Movies List tab first.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoviesTab;
