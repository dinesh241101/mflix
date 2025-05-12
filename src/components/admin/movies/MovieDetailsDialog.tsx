
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import MovieCastTab from "./MovieCastTab";
import ShareLinks from "@/components/ShareLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Film, Clock, Star, Calendar } from "lucide-react";
import MediaClipsForm from "./MediaClipsForm";
import { supabase } from "@/integrations/supabase/client";

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
  const [mediaClips, setMediaClips] = useState<any[]>([]);
  
  // Fetch media clips when selected movie changes
  useEffect(() => {
    const fetchMediaClips = async () => {
      if (!selectedMovie) return;
      
      try {
        const { data, error } = await supabase
          .from('media_clips')
          .select('*')
          .eq('movie_id', selectedMovie.id);
          
        if (error) throw error;
        
        setMediaClips(data || []);
      } catch (error) {
        console.error("Error fetching media clips:", error);
      }
    };
    
    fetchMediaClips();
  }, [selectedMovie]);
  
  const handleClipAdded = async () => {
    if (!selectedMovie) return;
    
    // Refresh the media clips list
    const { data } = await supabase
      .from('media_clips')
      .select('*')
      .eq('movie_id', selectedMovie.id);
      
    setMediaClips(data || []);
  };
  
  if (!selectedMovie) return null;

  return (
    <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{selectedMovie.title || "Untitled Content"}</span>
            {selectedMovie.featured && (
              <span className="bg-amber-700/30 text-amber-300 text-xs px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Movie summary card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] bg-gray-700 rounded-md overflow-hidden">
              {selectedMovie.poster_url ? (
                <img 
                  src={selectedMovie.poster_url} 
                  alt={selectedMovie.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                  No Poster
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-gray-700 border-gray-600 h-full">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedMovie.title}</h3>
                  <p className="text-gray-400">{selectedMovie.storyline || "No description available."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-400" />
                    <span className="text-sm">Year: {selectedMovie.year || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={18} className="mr-2 text-amber-400" />
                    <span className="text-sm">
                      IMDB: {selectedMovie.imdb_rating || "Not rated"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Film size={18} className="mr-2 text-gray-400" />
                    <span className="text-sm">Type: {selectedMovie.content_type || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <Download size={18} className="mr-2 text-blue-400" />
                    <span className="text-sm">
                      Downloads: {selectedMovie.downloads?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
                
                {selectedMovie.genre && Array.isArray(selectedMovie.genre) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genre.map((genre: string, index: number) => (
                        <span 
                          key={index}
                          className="bg-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <Tabs defaultValue="cast">
            <TabsList className="w-full bg-gray-700 mb-4">
              <TabsTrigger value="cast">Cast Members</TabsTrigger>
              <TabsTrigger value="downloads">Download Count</TabsTrigger>
              <TabsTrigger value="mediaclips">Media Clips</TabsTrigger>
              <TabsTrigger value="share">Share Links</TabsTrigger>
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
            
            <TabsContent value="mediaclips">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media Clips Management</h3>
                <p className="text-gray-400">Add trailers, short clips, and 5-second autoplay previews for this content.</p>
                
                <MediaClipsForm 
                  movieId={selectedMovie.id}
                  onClipAdded={handleClipAdded}
                  existingClips={mediaClips}
                  onClipDeleted={handleClipAdded}
                />
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
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsDialog;
