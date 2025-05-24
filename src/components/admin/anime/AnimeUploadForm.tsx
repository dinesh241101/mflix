
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface AnimeUploadFormProps {
  animeForm: any;
  setAnimeForm: (form: any) => void;
  handleUploadAnime: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const AnimeUploadForm = ({
  animeForm,
  setAnimeForm,
  handleUploadAnime,
  isEditing
}: AnimeUploadFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Anime" : "Upload New Anime"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUploadAnime} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <Input
                value={animeForm.title}
                onChange={(e) => setAnimeForm({ ...animeForm, title: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Enter anime title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
              <Input
                type="number"
                value={animeForm.year}
                onChange={(e) => setAnimeForm({ ...animeForm, year: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <Input
                value={animeForm.genre}
                onChange={(e) => setAnimeForm({ ...animeForm, genre: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Action, Adventure, Fantasy (comma separated)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
              <Select value={animeForm.quality} onValueChange={(value) => setAnimeForm({ ...animeForm, quality: value })}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="4K">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
              <Input
                value={animeForm.director}
                onChange={(e) => setAnimeForm({ ...animeForm, director: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Director name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Production House</label>
              <Input
                value={animeForm.productionHouse}
                onChange={(e) => setAnimeForm({ ...animeForm, productionHouse: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="Studio name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">IMDB Rating</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={animeForm.imdbRating}
                onChange={(e) => setAnimeForm({ ...animeForm, imdbRating: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="8.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
              <Input
                value={animeForm.posterUrl}
                onChange={(e) => setAnimeForm({ ...animeForm, posterUrl: e.target.value })}
                className="bg-gray-700 border-gray-600"
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Storyline</label>
            <Textarea
              value={animeForm.storyline}
              onChange={(e) => setAnimeForm({ ...animeForm, storyline: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="Enter anime storyline/description"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">SEO Tags</label>
            <Input
              value={animeForm.seoTags}
              onChange={(e) => setAnimeForm({ ...animeForm, seoTags: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="anime, action, fantasy (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Trailer URL</label>
            <Input
              value={animeForm.youtubeTrailer}
              onChange={(e) => setAnimeForm({ ...animeForm, youtubeTrailer: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={animeForm.featured}
                onCheckedChange={(checked) => setAnimeForm({ ...animeForm, featured: checked })}
              />
              <label className="text-sm text-gray-300">Featured</label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2" size={16} />
            {isEditing ? "Update Anime" : "Upload Anime"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnimeUploadForm;
