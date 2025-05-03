
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Edit, Trash2, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MovieListProps {
  movies: any[];
  onSelectMovie: (movieId: string) => void;
  onEditMovie?: (movieId: string) => void;
  onDeleteMovie?: (movieId: string) => void;
}

const MovieList = ({ 
  movies, 
  onSelectMovie, 
  onEditMovie, 
  onDeleteMovie 
}: MovieListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredMovies = movies.filter(movie => 
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total downloads
  const totalDownloads = movies.reduce((total, movie) => total + (movie.downloads || 0), 0);
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Movies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movies.length}</div>
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
            <CardTitle className="text-sm font-medium text-gray-400">Featured Movies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {movies.filter(movie => movie.featured).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {movies.length ? Math.round(totalDownloads / movies.length).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Movie List */}
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">All Content ({filteredMovies.length})</h3>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input 
              placeholder="Search content..." 
              className="pl-10 bg-gray-700 border-gray-600 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border border-gray-600 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="hover:bg-gray-800 border-gray-600">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300 w-20">Year</TableHead>
                <TableHead className="text-gray-300 w-24">Type</TableHead>
                <TableHead className="text-gray-300 w-32">Downloads</TableHead>
                <TableHead className="text-gray-300 w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.length > 0 ? (
                filteredMovies.map(movie => (
                  <TableRow 
                    key={movie.id} 
                    className="hover:bg-gray-700/50 border-gray-600"
                  >
                    <TableCell className="font-medium">{movie.title || 'Untitled'}</TableCell>
                    <TableCell>{movie.year || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                        {movie.content_type || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Download size={14} className="mr-2 text-gray-400" />
                        <span>{movie.downloads?.toLocaleString() || '0'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => onSelectMovie(movie.id)} 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Button>
                        
                        {onEditMovie && (
                          <Button 
                            onClick={() => onEditMovie(movie.id)}
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            title="Edit Movie"
                          >
                            <Edit size={16} />
                          </Button>
                        )}
                        
                        {onDeleteMovie && (
                          <Button 
                            onClick={() => onDeleteMovie(movie.id)}
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            title="Delete Movie"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery ? 'No results found.' : 'No content available.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
