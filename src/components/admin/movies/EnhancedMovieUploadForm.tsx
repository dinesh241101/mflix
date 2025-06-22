
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface EnhancedMovieUploadFormProps {
  movieForm: any;
  setMovieForm: (form: any) => void;
  handleUploadMovie: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const EnhancedMovieUploadForm = ({ 
  movieForm, 
  setMovieForm, 
  handleUploadMovie, 
  isEditing 
}: EnhancedMovieUploadFormProps) => {
  const [availableGenres, setAvailableGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [showGenreInput, setShowGenreInput] = useState(false);

  useEffect(() => {
    fetchGenres();
    if (movieForm.genre && Array.isArray(movieForm.genre)) {
      setSelectedGenres(movieForm.genre);
    }
  }, [movieForm.genre]);

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
    const updatedGenres = selectedGenres.includes(genreName)
      ? selectedGenres.filter(g => g !== genreName)
      : [...selectedGenres, genreName];
    
    setSelectedGenres(updatedGenres);
    setMovieForm({ ...movieForm, genre: updatedGenres });
  };

  const handleAddNewGenre = async () => {
    if (!newGenre.trim()) return;

    try {
      const { data, error } = await supabase
        .from('genres')
        .insert({
          name: newGenre.trim(),
          description: `${newGenre.trim()} genre`,
          color: '#3b82f6'
        })
        .select()
        .single();

      if (error) throw error;

      setAvailableGenres([...availableGenres, data]);
      handleGenreToggle(data.name);
      setNewGenre("");
      setShowGenreInput(false);
      
      toast({
        title: "Success",
        description: "New genre added successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add new genre",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { value: "bollywood", label: "Bollywood" },
    { value: "hollywood", label: "Hollywood" },
    { value: "tollywood", label: "Tollywood" },
    { value: "kollywood", label: "Kollywood" },
    { value: "international", label: "International" }
  ];

  const languages = [
    { value: "hindi", label: "Hindi" },
    { value: "english", label: "English" },
    { value: "telugu", label: "Telugu" },
    { value: "tamil", label: "Tamil" },
    { value: "malayalam", label: "Malayalam" },
    { value: "kannada", label: "Kannada" },
    { value: "punjabi", label: "Punjabi" },
    { value: "dual-audio", label: "Dual Audio" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Movie' : 'Upload New Movie'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUploadMovie} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Movie Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="year">Release Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={movieForm.year}
                  onChange={(e) => setMovieForm({ ...movieForm, year: e.target.value })}
                  placeholder="2024"
                />
              </div>
              
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={movieForm.contentType} 
                  onValueChange={(value) => setMovieForm({ ...movieForm, contentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Web Series</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={movieForm.category} 
                  onValueChange={(value) => setMovieForm({ ...movieForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={movieForm.language} 
                  onValueChange={(value) => setMovieForm({ ...movieForm, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select 
                  value={movieForm.quality} 
                  onValueChange={(value) => setMovieForm({ ...movieForm, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="360p">360p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="1440p">1440p</SelectItem>
                    <SelectItem value="2160p">2160p (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  type="text"
                  value={movieForm.director}
                  onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="productionHouse">Production House</Label>
                <Input
                  id="productionHouse"
                  type="text"
                  value={movieForm.productionHouse}
                  onChange={(e) => setMovieForm({ ...movieForm, productionHouse: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="imdbRating">IMDB Rating</Label>
                <Input
                  id="imdbRating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={movieForm.imdbRating}
                  onChange={(e) => setMovieForm({ ...movieForm, imdbRating: e.target.value })}
                  placeholder="8.5"
                />
              </div>
              
              <div>
                <Label htmlFor="posterUrl">Poster URL</Label>
                <Input
                  id="posterUrl"
                  type="url"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="youtubeTrailer">YouTube Trailer URL</Label>
                <Input
                  id="youtubeTrailer"
                  type="url"
                  value={movieForm.youtubeTrailer}
                  onChange={(e) => setMovieForm({ ...movieForm, youtubeTrailer: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={movieForm.featured}
                    onCheckedChange={(checked) => setMovieForm({ ...movieForm, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Movie</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVisible"
                    checked={movieForm.isVisible !== false}
                    onCheckedChange={(checked) => setMovieForm({ ...movieForm, isVisible: checked })}
                  />
                  <Label htmlFor="isVisible">Visible on Website</Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Genre Selection */}
          <div className="space-y-4">
            <div>
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                    {genre}
                    <X 
                      size={12} 
                      className="cursor-pointer hover:text-red-500" 
                      onClick={() => handleGenreToggle(genre)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {availableGenres.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={selectedGenres.includes(genre.name)}
                      onCheckedChange={() => handleGenreToggle(genre.name)}
                    />
                    <Label htmlFor={`genre-${genre.id}`} className="text-sm">
                      {genre.name}
                    </Label>
                  </div>
                ))}
              </div>
              
              {showGenreInput ? (
                <div className="flex gap-2">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Enter new genre name"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddNewGenre}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowGenreInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGenreInput(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Genre
                </Button>
              )}
            </div>
            
            <div>
              <Label htmlFor="storyline">Storyline</Label>
              <Textarea
                id="storyline"
                value={movieForm.storyline}
                onChange={(e) => setMovieForm({ ...movieForm, storyline: e.target.value })}
                rows={4}
                placeholder="Enter movie storyline..."
              />
            </div>
            
            <div>
              <Label htmlFor="seoTags">SEO Tags (comma separated)</Label>
              <Input
                id="seoTags"
                type="text"
                value={movieForm.seoTags}
                onChange={(e) => setMovieForm({ ...movieForm, seoTags: e.target.value })}
                placeholder="movie download, bollywood, action"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Movie' : 'Upload Movie'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedMovieUploadForm;
