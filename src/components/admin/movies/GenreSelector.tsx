
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

const GenreSelector = ({ selectedGenres, onGenresChange }: GenreSelectorProps) => {
  const [availableGenres, setAvailableGenres] = useState<any[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setAvailableGenres(data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleGenreToggle = (genreName: string) => {
    if (selectedGenres.includes(genreName)) {
      onGenresChange(selectedGenres.filter(g => g !== genreName));
    } else {
      onGenresChange([...selectedGenres, genreName]);
    }
  };

  const handleAddNewGenre = async () => {
    if (!newGenre.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('genres')
        .insert([{ 
          name: newGenre.trim(),
          description: `${newGenre.trim()} genre`
        }])
        .select()
        .single();
      
      if (!error && data) {
        setAvailableGenres([...availableGenres, data]);
        onGenresChange([...selectedGenres, data.name]);
        setNewGenre("");
        setShowInput(false);
      }
    } catch (error) {
      console.error('Error adding new genre:', error);
    }
  };

  const removeGenre = (genreToRemove: string) => {
    onGenresChange(selectedGenres.filter(g => g !== genreToRemove));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Genres
        </label>
        
        {/* Selected Genres */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedGenres.map((genre) => (
              <Badge 
                key={genre} 
                variant="secondary" 
                className="bg-blue-600 text-white flex items-center gap-1"
              >
                {genre}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-red-300" 
                  onClick={() => removeGenre(genre)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        {/* Available Genres */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {availableGenres.map((genre) => (
            <Button
              key={genre.id}
              type="button"
              variant={selectedGenres.includes(genre.name) ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenreToggle(genre.name)}
              className={`text-xs ${
                selectedGenres.includes(genre.name) 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 border-gray-600 hover:bg-gray-700"
              }`}
            >
              {genre.name}
            </Button>
          ))}
        </div>
        
        {/* Add New Genre */}
        {showInput ? (
          <div className="flex gap-2">
            <Input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Enter new genre"
              className="bg-gray-700 border-gray-600 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewGenre()}
            />
            <Button 
              type="button"
              onClick={handleAddNewGenre}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Add
            </Button>
            <Button 
              type="button"
              onClick={() => setShowInput(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            type="button"
            onClick={() => setShowInput(true)}
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <Plus size={16} className="mr-1" />
            Add New Genre
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenreSelector;
