
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Edit, Trash2 } from "lucide-react";

interface MovieListProps {
  movies: any[];
  onSelectMovie: (movieId: string) => void;
}

const MovieList = ({ movies, onSelectMovie }: MovieListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">All Movies ({movies.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <Input 
            placeholder="Search movies..." 
            className="pl-10 bg-gray-700 border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-gray-700 rounded-lg p-2">
        <div className="grid grid-cols-12 font-medium border-b border-gray-600 pb-2 mb-2">
          <div className="col-span-5">Title</div>
          <div className="col-span-1">Year</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Downloads</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {filteredMovies.map(movie => (
          <div 
            key={movie.id} 
            className="grid grid-cols-12 py-2 border-b border-gray-600 items-center text-sm"
          >
            <div className="col-span-5 font-medium">{movie.title}</div>
            <div className="col-span-1">{movie.year || 'N/A'}</div>
            <div className="col-span-2">
              <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300">
                {movie.content_type}
              </span>
            </div>
            <div className="col-span-2">{movie.downloads}</div>
            <div className="col-span-2 text-right space-x-2">
              <Button 
                onClick={() => onSelectMovie(movie.id)} 
                variant="ghost" 
                size="sm"
              >
                <Users size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
