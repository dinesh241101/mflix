
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Search, Users, Download, Film } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MovieDetailsDialogProps {
  selectedMovie: any;
  setSelectedMovie: (movie: any) => void;
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
  updateActivity: () => void;
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
  selectCastFromSearch,
  updateActivity
}: MovieDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState("cast");

  if (!selectedMovie) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    updateActivity();
  };

  return (
    <div className="space-y-6">
      {/* Movie Info Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Film size={24} className="text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{selectedMovie.content_type}</Badge>
                {selectedMovie.year && <span className="text-sm text-gray-400">{selectedMovie.year}</span>}
                {selectedMovie.quality && <Badge variant="secondary">{selectedMovie.quality}</Badge>}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedMovie.poster_url && (
              <div className="flex justify-center">
                <img 
                  src={selectedMovie.poster_url} 
                  alt={selectedMovie.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="md:col-span-2 space-y-4">
              {selectedMovie.storyline && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Storyline</h3>
                  <p className="text-gray-400 text-sm">{selectedMovie.storyline}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedMovie.director && (
                  <div>
                    <span className="font-semibold text-gray-300">Director:</span>
                    <p className="text-gray-400">{selectedMovie.director}</p>
                  </div>
                )}
                {selectedMovie.genre && selectedMovie.genre.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-300">Genres:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMovie.genre.map((g: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">{g}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedMovie.imdb_rating && (
                  <div>
                    <span className="font-semibold text-gray-300">IMDB Rating:</span>
                    <p className="text-gray-400">{selectedMovie.imdb_rating}/10</p>
                  </div>
                )}
                {selectedMovie.country && (
                  <div>
                    <span className="font-semibold text-gray-300">Country:</span>
                    <p className="text-gray-400">{selectedMovie.country}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <Button
          variant={activeTab === "cast" ? "default" : "ghost"}
          onClick={() => handleTabChange("cast")}
          className="flex-1"
        >
          <Users size={16} className="mr-2" />
          Cast Management
        </Button>
        <Button
          variant={activeTab === "downloads" ? "default" : "ghost"}
          onClick={() => handleTabChange("downloads")}
          className="flex-1"
        >
          <Download size={16} className="mr-2" />
          Downloads
        </Button>
      </div>

      {/* Cast Management Tab */}
      {activeTab === "cast" && (
        <div className="space-y-6">
          {/* Add Cast Member Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Add Cast Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                handleAddCastMember(e);
                updateActivity();
              }} className="space-y-4">
                {/* Cast Search */}
                <div>
                  <Label>Search for Actor/Actress</Label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Type to search..."
                      value={castSearchQuery}
                      onChange={(e) => handleCastSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {castSearchResults.length > 0 && (
                    <div className="mt-2 bg-gray-700 rounded-md border border-gray-600 max-h-32 overflow-y-auto">
                      {castSearchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            selectCastFromSearch(result);
                            updateActivity();
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-600 text-sm"
                        >
                          {result.name} - {result.role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Actor/Actress Name</Label>
                    <Input
                      value={castForm.name}
                      onChange={(e) => setCastForm({...castForm, name: e.target.value})}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={castForm.role}
                      onChange={(e) => setCastForm({...castForm, role: e.target.value})}
                      placeholder="Enter role"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add Cast Member
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Cast List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Cast Members ({movieCast.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {movieCast.length > 0 ? (
                <div className="space-y-3">
                  {movieCast.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        {member.role && <p className="text-sm text-gray-400">{member.role}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleDeleteCastMember(member.id);
                          updateActivity();
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No cast members added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Downloads Tab */}
      {activeTab === "downloads" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Download Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Downloads Count</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={downloadsCount}
                  onChange={(e) => setDownloadsCount(parseInt(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button onClick={() => {
                  handleUpdateDownloads();
                  updateActivity();
                }}>
                  Update
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Downloads:</span>
                  <p className="text-xl font-bold text-blue-400">{selectedMovie.downloads || 0}</p>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <p className="text-xl font-bold text-green-400">
                    {selectedMovie.imdb_rating ? `${selectedMovie.imdb_rating}/10` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MovieDetailsDialog;
