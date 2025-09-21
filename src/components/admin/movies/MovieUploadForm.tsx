
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from "./ImageUploader";
import MultipleImageUploader from "./MultipleImageUploader";
import CountrySelector from "./CountrySelector";
import GenreSelectorWithSearch from "../genres/GenreSelectorWithSearch";

const MovieUploadForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    storyline: "",
    year: new Date().getFullYear(),
    imdb_rating: "",
    director: "",
    production_house: "",
    genre: [] as string[],
    quality: "",
    country: "",
    content_type: "movie",
    poster_url: "",
    screenshots: [] as string[],
    featured: false,
    is_visible: true,
    seo_tags: [] as string[]
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenresChange = (genres: string[]) => {
    setFormData(prev => ({
      ...prev,
      genre: genres
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const movieData = {
        ...formData,
        imdb_rating: formData.imdb_rating ? parseFloat(formData.imdb_rating) : null,
        seo_tags: formData.title.toLowerCase().split(' ')
      };

      const { data, error } = await supabase
        .from('movies')
        .insert([movieData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie uploaded successfully! Redirecting to add download links...",
      });

      // Redirect to content links manager with the new movie
      setTimeout(() => {
        navigate(`/admin/content-links`, {
          state: { 
            contentId: data.movie_id, 
            contentType: formData.content_type.split(',')[0].trim()
          }
        });
      }, 1500);

      // Reset form
      setFormData({
        title: "",
        storyline: "",
        year: new Date().getFullYear(),
        imdb_rating: "",
        director: "",
        production_house: "",
        genre: [],
        quality: "",
        country: "",
        content_type: "movie",
        poster_url: "",
        screenshots: [],
        featured: false,
        is_visible: true,
        seo_tags: []
      });

    } catch (error: any) {
      console.error('Error uploading movie:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload movie",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Enter movie title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
          <Select value={formData.content_type} onValueChange={(value) => handleInputChange('content_type', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="movie">Movie</SelectItem>
              <SelectItem value="series">Web Series</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
            className="bg-gray-700 border-gray-600 text-white"
            min="1900"
            max={new Date().getFullYear() + 5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">IMDB Rating</label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.imdb_rating}
            onChange={(e) => handleInputChange('imdb_rating', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="e.g., 8.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
          <Input
            value={formData.director}
            onChange={(e) => handleInputChange('director', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Director name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Production House</label>
          <Input
            value={formData.production_house}
            onChange={(e) => handleInputChange('production_house', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Production company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
          <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="4K">4K</SelectItem>
              <SelectItem value="BluRay">BluRay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CountrySelector 
          selectedCountry={formData.country}
          onCountryChange={(country) => handleInputChange('country', country)}
        />
      </div>

      <GenreSelectorWithSearch 
        selectedGenres={formData.genre}
        onGenresChange={handleGenresChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Storyline</label>
        <Textarea
          value={formData.storyline}
          onChange={(e) => handleInputChange('storyline', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Enter movie storyline/description"
          rows={4}
        />
      </div>

      <ImageUploader
        currentImageUrl={formData.poster_url}
        onImageUrlChange={(url) => handleInputChange('poster_url', url)}
        label="Poster Image"
      />

      <MultipleImageUploader
        currentImages={formData.screenshots}
        onImageUrlsChange={(urls) => handleInputChange('screenshots', urls)}
        label="Screenshots"
        maxImages={10}
      />

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-300">Featured Content</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_visible}
            onChange={(e) => handleInputChange('is_visible', e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-300">Visible to Public</span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Uploading..." : "Upload Movie"}
      </Button>
    </form>
  );
};

export default MovieUploadForm;
