
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

const GenreSelector = ({ selectedGenres, onGenresChange }: GenreSelectorProps) => {
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [showAddGenre, setShowAddGenre] = useState(false);

  // Predefined genres for the movie platform
  const predefinedGenres = [
    "Action", "Adventure", "Comedy", "Drama", "Horror", "Romance", "Thriller", "Sci-Fi",
    "Fantasy", "Mystery", "Crime", "War", "Biography", "History", "Documentary", "Animation",
    "Bollywood", "Hollywood", "Tamil", "Telugu", "Malayalam", "Kannada", "Punjabi", "Bengali",
    "Dual Audio", "Hindi Dubbed", "English", "Latest Movies", "Popular Movies", "Classic Movies",
    "Web Series", "TV Shows", "Netflix", "Amazon Prime", "Disney+", "Hotstar",
    "720p", "1080p", "480p", "4K", "BluRay", "HDRip", "DVDRip", "WEBRip",
    "300MB", "500MB", "700MB", "1GB", "2GB", "America", "India", "UK", "Japan", "Korea",
    "2024 Movies", "2023 Movies", "2022 Movies", "New Release", "Trending"
  ];

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('name')
        .order('name');

      if (error) throw error;

      const dbGenres = data?.map(g => g.name) || [];
      const allGenres = [...new Set([...predefinedGenres, ...dbGenres])].sort();
      setAvailableGenres(allGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setAvailableGenres(predefinedGenres);
    }
  };

  const handleGenreClick = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;

    const trimmedGenre = newGenre.trim();
    
    if (availableGenres.includes(trimmedGenre)) {
      if (!selectedGenres.includes(trimmedGenre)) {
        onGenresChange([...selectedGenres, trimmedGenre]);
      }
      setNewGenre("");
      setShowAddGenre(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('genres')
        .insert({ name: trimmedGenre });

      if (error) throw error;

      setAvailableGenres([...availableGenres, trimmedGenre].sort());
      onGenresChange([...selectedGenres, trimmedGenre]);
      setNewGenre("");
      setShowAddGenre(false);

      toast({
        title: "Success",
        description: "New genre added successfully!",
      });
    } catch (error: any) {
      console.error('Error adding genre:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add genre",
        variant: "destructive"
      });
    }
  };

  const removeGenre = (genre: string) => {
    onGenresChange(selectedGenres.filter(g => g !== genre));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Selected Genres ({selectedGenres.length})
        </label>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem] p-2 bg-gray-700 rounded border border-gray-600">
          {selectedGenres.length === 0 ? (
            <span className="text-gray-500 text-sm">No genres selected</span>
          ) : (
            selectedGenres.map((genre) => (
              <Badge key={genre} className="bg-blue-600 text-white">
                {genre}
                <X 
                  size={14} 
                  className="ml-1 cursor-pointer hover:text-red-300" 
                  onClick={() => removeGenre(genre)}
                />
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Available Genres (Click to select)
        </label>
        <div className="max-h-48 overflow-y-auto bg-gray-700 p-3 rounded border border-gray-600">
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedGenres.includes(genre)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {showAddGenre ? (
          <div className="flex gap-2">
            <Input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Enter new genre name"
              className="bg-gray-700 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGenre()}
            />
            <Button onClick={handleAddGenre} size="sm">
              Add
            </Button>
            <Button 
              onClick={() => {
                setShowAddGenre(false);
                setNewGenre("");
              }} 
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddGenre(true)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Add Custom Genre
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenreSelector;
