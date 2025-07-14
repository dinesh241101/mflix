import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Film, Star, Edit, Search, Download } from "lucide-react";

interface AnimeListProps {
  animes: any[];
  onSelectAnime: (animeId: string) => void;
  refreshTrigger?: number;
  updateActivity: () => void;
}

const AnimeList = ({ animes, onSelectAnime, refreshTrigger = 0, updateActivity }: AnimeListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAnimes = animes.filter(anime => 
    anime.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (anime.director && anime.director.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalDownloads = animes.reduce((total, anime) => total + (anime.downloads || 0), 0);

  if (!animes.length) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg">
        <Film size={48} className="mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">No anime found</p>
        <p className="text-sm text-gray-500 mt-2">Upload your first anime to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Anime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animes.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Featured Anime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {animes.filter(anime => anime.featured).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {animes.length ? 
                (animes.reduce((sum, anime) => sum + (anime.imdb_rating || 0), 0) / animes.length).toFixed(1) 
                : '0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anime Library ({filteredAnimes.length})</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                type="text"
                className="pl-10 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimes.map((anime) => (
                  <TableRow key={anime.movie_id || anime.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {anime.poster_url ? (
                          <img 
                            src={anime.poster_url} 
                            alt={anime.title} 
                            className="h-12 w-8 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-8 bg-gray-700 flex items-center justify-center rounded">
                            <Film size={16} />
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{anime.title}</span>
                          {anime.featured && (
                            <Badge className="ml-2 bg-yellow-600 text-yellow-100">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{anime.year || "-"}</TableCell>
                    <TableCell>
                      {anime.imdb_rating ? (
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          {anime.imdb_rating}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Download size={14} className="mr-2 text-gray-400" />
                        {(anime.downloads || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                        {anime.content_type || "anime"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          onSelectAnime(anime.movie_id || anime.id);
                          updateActivity();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit size={16} className="mr-2" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimeList;
