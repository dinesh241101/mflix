
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Genre {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

interface GenreListProps {
  genres: Genre[];
  handleDeleteGenre: (id: string) => void;
}

const GenreList = ({ genres, handleDeleteGenre }: GenreListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Existing Genres</h3>
      
      {genres.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-400">
            No genres created yet. Add your first genre above.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <Card key={genre.id} className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: genre.color }}
                    />
                    <h4 className="font-medium">{genre.name}</h4>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteGenre(genre.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                {genre.description && (
                  <p className="text-sm text-gray-400">{genre.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreList;
