
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Star, Edit } from "lucide-react";

interface MoviesListProps {
  movies: any[];
  onSelectMovie: (movieId: string) => void;
  refreshTrigger?: number;
}

const MoviesList = ({ movies, onSelectMovie, refreshTrigger = 0 }: MoviesListProps) => {
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update filtered movies when movies change or refresh is triggered
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        (movie.director && movie.director.toLowerCase().includes(query))
      );
      setFilteredMovies(filtered);
    }
  }, [movies, searchQuery, refreshTrigger]);

  if (!movies.length) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg">
        <Film size={48} className="mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movies Library</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white"
              placeholder="Search movies..."
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
                <TableHead>Type</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.movie_id || movie.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {movie.poster_url ? (
                        <img 
                          src={movie.poster_url} 
                          alt={movie.title} 
                          className="h-10 w-7 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-7 bg-gray-700 flex items-center justify-center rounded">
                          <Film size={16} />
                        </div>
                      )}
                      <span>{movie.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{movie.year || "-"}</TableCell>
                  <TableCell>
                    {movie.imdb_rating ? (
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500 mr-1" />
                        {movie.imdb_rating}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={movie.content_type === "movie" ? "default" : "secondary"}>
                      {movie.content_type || "movie"}
                    </Badge>
                  </TableCell>
                  <TableCell>{movie.downloads || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onSelectMovie(movie.movie_id || movie.id)}
                    >
                      <Edit size={16} className="mr-2" />
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoviesList;
