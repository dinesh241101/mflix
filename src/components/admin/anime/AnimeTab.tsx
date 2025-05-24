
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimeUploadForm from "./AnimeUploadForm";
import AnimeList from "./AnimeList";
import MovieDetailsDialog from "../movies/MovieDetailsDialog";
import DownloadLinksForm from "../movies/DownloadLinksForm";

interface AnimeTabProps {
  animes: any[];
  animeForm: any;
  setAnimeForm: (form: any) => void;
  handleUploadAnime: (e: React.FormEvent) => void;
  selectedAnime: any;
  setSelectedAnime: (anime: any) => void;
  handleSelectAnimeForCast: (animeId: string) => void;
  animeCast: any[];
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

const AnimeTab = ({
  animes,
  animeForm,
  setAnimeForm,
  handleUploadAnime,
  selectedAnime,
  setSelectedAnime,
  handleSelectAnimeForCast,
  animeCast,
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
}: AnimeTabProps) => {
  const [refreshList, setRefreshList] = useState(0);

  const handleRefreshList = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Anime Management</h1>
        {selectedAnime && (
          <div className="text-sm text-gray-400">
            Selected: {selectedAnime.title}
          </div>
        )}
      </div>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="upload">Upload Anime</TabsTrigger>
          <TabsTrigger value="list">Anime Library</TabsTrigger>
          <TabsTrigger value="downloads" disabled={!selectedAnime}>
            Download Links {!selectedAnime && "(Select anime first)"}
          </TabsTrigger>
          <TabsTrigger value="manage" disabled={!selectedAnime}>
            Manage Cast {!selectedAnime && "(Select anime first)"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <AnimeUploadForm 
            animeForm={animeForm}
            setAnimeForm={setAnimeForm}
            handleUploadAnime={handleUploadAnime}
            isEditing={isEditing}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <AnimeList 
            animes={animes}
            onSelectAnime={handleSelectAnimeForCast}
            refreshTrigger={refreshList}
          />
        </TabsContent>

        <TabsContent value="downloads">
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Download Links Management</h2>
              <p className="text-gray-300">
                Configure download links for <strong>{selectedAnime?.title}</strong> with multiple quality options and mirror sources.
              </p>
            </div>
            
            {selectedAnime ? (
              <DownloadLinksForm 
                movieId={selectedAnime.movie_id || selectedAnime.id}
                contentType="anime"
                onLinksAdded={handleRefreshList}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">Please select an anime from the Anime Library tab first.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Cast & Content Management</h2>
              <p className="text-gray-300">
                Manage cast members, download count, and media clips for <strong>{selectedAnime?.title}</strong>.
              </p>
            </div>
            
            {selectedAnime ? (
              <MovieDetailsDialog 
                selectedMovie={selectedAnime}
                setSelectedMovie={setSelectedAnime}
                movieCast={animeCast}
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
                <p className="text-gray-400">Please select an anime from the Anime Library tab first.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimeTab;
