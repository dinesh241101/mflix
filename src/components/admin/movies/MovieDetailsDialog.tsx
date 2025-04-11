
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MovieCastTab from "./MovieCastTab";
import ShareLinks from "@/components/ShareLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MovieDetailsDialogProps {
  selectedMovie: any;
  setSelectedMovie: (movie: any) => void;
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

const MovieDetailsDialog = ({
  selectedMovie,
  setSelectedMovie,
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
}: MovieDetailsDialogProps) => {
  if (!selectedMovie) return null;

  return (
    <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {`Content Details: "${selectedMovie.title}"`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Tabs defaultValue="cast">
            <TabsList className="w-full bg-gray-700 mb-4">
              <TabsTrigger value="cast">Cast Members</TabsTrigger>
              <TabsTrigger value="downloads">Download Count</TabsTrigger>
              <TabsTrigger value="share">Share Links</TabsTrigger>
              <TabsTrigger value="clips">Media Clips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cast">
              <MovieCastTab 
                castForm={castForm}
                setCastForm={setCastForm}
                movieCast={movieCast}
                handleAddCastMember={handleAddCastMember}
                handleDeleteCastMember={handleDeleteCastMember}
                castSearchQuery={castSearchQuery}
                handleCastSearch={handleCastSearch}
                castSearchResults={castSearchResults}
                selectCastFromSearch={selectCastFromSearch}
              />
            </TabsContent>
            
            <TabsContent value="downloads">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Manage Download Count</h3>
                <p className="text-gray-400">Set the number of downloads to display for this content.</p>
                
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number"
                    value={downloadsCount}
                    onChange={(e) => setDownloadsCount(parseInt(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 w-32"
                    min="0"
                  />
                  <Button onClick={handleUpdateDownloads}>
                    Update Downloads
                  </Button>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>Current download count: {selectedMovie.downloads || 0}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="share">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Shareable Links</h3>
                <p className="text-gray-400">Share this content on social media or copy the direct link.</p>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <ShareLinks 
                    url={`https://mflix.com/movie/${selectedMovie.id}`} 
                    title={selectedMovie.title}
                    customLinks={[
                      { text: "WhatsApp", url: `https://wa.me/?text=Check out ${selectedMovie.title} on MFlix: https://mflix.com/movie/${selectedMovie.id}` },
                      { text: "Telegram", url: `https://t.me/share/url?url=https://mflix.com/movie/${selectedMovie.id}&text=Check out ${selectedMovie.title} on MFlix!` }
                    ]}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="clips">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media Clips</h3>
                <p className="text-gray-400">Add YouTube trailers and clips for this content.</p>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">YouTube URL</label>
                    <div className="flex space-x-2">
                      <Input 
                        className="bg-gray-700 border-gray-600 flex-grow"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <Select defaultValue="trailer">
                        <SelectTrigger className="w-36 bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Clip Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="trailer">Trailer</SelectItem>
                          <SelectItem value="teaser">Teaser</SelectItem>
                          <SelectItem value="clip">Clip</SelectItem>
                          <SelectItem value="bts">Behind the Scenes</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Add Clip</Button>
                    </div>
                  </div>
                </form>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Existing Clips</h4>
                  <p className="text-gray-400">No clips added yet.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsDialog;
