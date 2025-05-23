
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MovieUploadFormProps {
  movieForm: any;
  setMovieForm: (form: any) => void;
  handleUploadMovie: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const MovieUploadForm = ({ movieForm, setMovieForm, handleUploadMovie, isEditing }: MovieUploadFormProps) => {
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
                <Select value={movieForm.contentType} onValueChange={(value) => setMovieForm({ ...movieForm, contentType: value })}>
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
                <Label htmlFor="genre">Genre (comma separated)</Label>
                <Input
                  id="genre"
                  type="text"
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                  placeholder="Action, Drama, Thriller"
                />
              </div>
              
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select value={movieForm.quality} onValueChange={(value) => setMovieForm({ ...movieForm, quality: value })}>
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
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={movieForm.country}
                  onChange={(e) => setMovieForm({ ...movieForm, country: e.target.value })}
                  placeholder="USA"
                />
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={movieForm.featured}
                  onCheckedChange={(checked) => setMovieForm({ ...movieForm, featured: checked })}
                />
                <Label htmlFor="featured">Featured Movie</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
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

export default MovieUploadForm;
