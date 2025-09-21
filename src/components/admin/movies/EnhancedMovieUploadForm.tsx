
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import CountrySelector from "./CountrySelector";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content_type: z.enum(["movie", "series", "anime", "shorts"]),
  year: z.string().regex(/^\d+$/, { message: "Year must be a number." }).min(4, { message: "Year must be 4 digits." }).max(4, { message: "Year must be 4 digits." }),
  imdb_rating: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, { message: "IMDB Rating must be a number." }).refine((value) => parseFloat(value) <= 10, { message: "IMDB Rating must be less than or equal to 10." }),
  director: z.string().optional(),
  production_house: z.string().optional(),
  country: z.string().optional(),
  storyline: z.string().optional(),
  poster_url: z.string().url({ message: "Poster URL must be a valid URL." }),
  quality: z.string().optional(),
  genre: z.array(z.string()).optional(),
  seo_tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
});

interface EnhancedMovieUploadFormProps {
  existingMovie?: any;
  onClose?: () => void;
  onSuccess?: (movieId: string, contentType: string) => void;
}

const EnhancedMovieUploadForm = ({ existingMovie, onClose, onSuccess }: EnhancedMovieUploadFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [allSeoTags, setAllSeoTags] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [newSeoTag, setNewSeoTag] = useState("");
  const [showGenreInput, setShowGenreInput] = useState(false);
  const [showSeoTagInput, setShowSeoTagInput] = useState(false);
  const [initialValues, setInitialValues] = useState<z.infer<typeof formSchema> | undefined>(undefined);

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: "onChange"
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchGenres();
    fetchAllSeoTags();
    if (existingMovie?.movie_id) {
      fetchMovieData(existingMovie.movie_id);
    }
  }, [existingMovie]);

  const fetchMovieData = async (movieId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', movieId)
        .single();

      if (error) throw error;

      // Convert IMDB rating to string
      const imdb_rating = data.imdb_rating !== null ? data.imdb_rating.toString() : "";

      const movieData = {
        title: data.title,
        content_type: data.content_type as "movie" | "series" | "anime" | "shorts",
        year: data.year.toString(),
        imdb_rating: imdb_rating,
        director: data.director || "",
        production_house: data.production_house || "",
        country: data.country || "",
        storyline: data.storyline || "",
        poster_url: data.poster_url,
        quality: data.quality || "",
        genre: data.genre || [],
        seo_tags: data.seo_tags || [],
        featured: data.featured || false,
        is_visible: data.is_visible || true,
      };

      setInitialValues(movieData);

      // Set form values
      Object.keys(movieData).forEach(key => {
        setValue(key as keyof z.infer<typeof formSchema>, movieData[key as keyof typeof movieData]);
      });

    } catch (error: any) {
      console.error("Error fetching movie data:", error);
      toast({
        title: "Error",
        description: "Failed to load movie data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchAllSeoTags = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('seo_tags');

      if (error) {
        console.error("Error fetching SEO tags:", error);
        return;
      }

      // Extract all unique SEO tags from the movies
      const tags = new Set<string>();
      data.forEach(movie => {
        if (movie.seo_tags && Array.isArray(movie.seo_tags)) {
          movie.seo_tags.forEach(tag => tags.add(tag));
        }
      });

      setAllSeoTags(Array.from(tags));
    } catch (error) {
      console.error("Error fetching SEO tags:", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const submitData = {
        movie_id: existingMovie?.movie_id || undefined,
        title: data.title,
        content_type: data.content_type,
        year: parseInt(data.year),
        imdb_rating: parseFloat(data.imdb_rating),
        director: data.director,
        production_house: data.production_house,
        country: data.country,
        storyline: data.storyline,
        poster_url: data.poster_url,
        quality: data.quality,
        genre: data.genre,
        seo_tags: data.seo_tags,
        featured: data.featured,
        is_visible: data.is_visible,
      };

      const { error } = await supabase
        .from('movies')
        .upsert(submitData, { onConflict: 'movie_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content ${existingMovie ? 'updated' : 'uploaded'} successfully`,
      });
      
      // Call success callback with movie ID and content type for redirect
      if (onSuccess) {
        const movieId = existingMovie?.movie_id || submitData.movie_id;
        onSuccess(movieId, data.content_type);
      } else {
        navigate('/admin/movies');
      }
    } catch (error: any) {
      console.error("Error uploading content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;

    try {
      const { data, error } = await supabase
        .from('genres')
        .insert({ name: newGenre.trim() })
        .select()
        .single();

      if (error) throw error;

      setGenres([...genres, data]);
      setNewGenre("");
      setShowGenreInput(false);
      toast({
        title: "Success",
        description: "Genre added successfully",
      });
    } catch (error: any) {
      console.error("Error adding genre:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add genre",
        variant: "destructive"
      });
    }
  };

  const handleAddSeoTag = () => {
    if (newSeoTag.trim() && !allSeoTags.includes(newSeoTag.trim())) {
      setAllSeoTags([...allSeoTags, newSeoTag.trim()]);
      setNewSeoTag("");
      setShowSeoTagInput(false);
    }
  };

  const handleToggleGenre = (genreName: string) => {
    const currentGenres = watchedValues.genre || [];
    if (currentGenres.includes(genreName)) {
      setValue("genre", currentGenres.filter(g => g !== genreName));
    } else {
      setValue("genre", [...currentGenres, genreName]);
    }
  };

  const handleToggleSeoTag = (seoTag: string) => {
    const currentSeoTags = watchedValues.seo_tags || [];
    if (currentSeoTags.includes(seoTag)) {
      setValue("seo_tags", currentSeoTags.filter(tag => tag !== seoTag));
    } else {
      setValue("seo_tags", [...currentSeoTags, seoTag]);
    }
  };

  const handleCountryChange = (country: string) => {
    setValue("country", country);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          {existingMovie ? "Edit Content" : "Upload New Content"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter title"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <Controller
              name="content_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Series</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.content_type && (
              <p className="text-red-500 text-sm mt-1">{errors.content_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="text"
              placeholder="Enter year"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("year")}
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="imdb_rating">IMDB Rating</Label>
            <Input
              id="imdb_rating"
              type="text"
              placeholder="Enter IMDB rating"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("imdb_rating")}
            />
            {errors.imdb_rating && (
              <p className="text-red-500 text-sm mt-1">{errors.imdb_rating.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              type="text"
              placeholder="Enter director"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("director")}
            />
            {errors.director && (
              <p className="text-red-500 text-sm mt-1">{errors.director.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="production_house">Production House</Label>
            <Input
              id="production_house"
              type="text"
              placeholder="Enter production house"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("production_house")}
            />
            {errors.production_house && (
              <p className="text-red-500 text-sm mt-1">{errors.production_house.message}</p>
            )}
          </div>

          <CountrySelector
            selectedCountry={watchedValues.country || ""}
            onCountryChange={handleCountryChange}
          />

          <div>
            <Label htmlFor="quality">Quality</Label>
            <Input
              id="quality"
              type="text"
              placeholder="Enter quality (e.g., 1080p, 720p)"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("quality")}
            />
          </div>

          <div>
            <Label htmlFor="storyline">Storyline</Label>
            <Textarea
              id="storyline"
              placeholder="Enter storyline"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("storyline")}
            />
            {errors.storyline && (
              <p className="text-red-500 text-sm mt-1">{errors.storyline.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="poster_url">Poster URL</Label>
            <Input
              id="poster_url"
              type="text"
              placeholder="Enter poster URL"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("poster_url")}
            />
            {errors.poster_url && (
              <p className="text-red-500 text-sm mt-1">{errors.poster_url.message}</p>
            )}
          </div>

          <div>
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className={`cursor-pointer ${watchedValues.genre && watchedValues.genre.includes(genre.name) ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  onClick={() => handleToggleGenre(genre.name)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowGenreInput(true)}>
              Add Genre
            </Button>

            {showGenreInput && (
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="New genre name"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button type="button" size="sm" onClick={handleAddGenre}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowGenreInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>SEO Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allSeoTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`cursor-pointer ${watchedValues.seo_tags && watchedValues.seo_tags.includes(tag) ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  onClick={() => handleToggleSeoTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowSeoTagInput(true)}>
              Add SEO Tag
            </Button>

            {showSeoTagInput && (
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="New SEO tag"
                  value={newSeoTag}
                  onChange={(e) => setNewSeoTag(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button type="button" size="sm" onClick={handleAddSeoTag}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowSeoTagInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="featured"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="is_visible"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_visible"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              )}
            />
            <Label htmlFor="is_visible">Is Visible</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Uploading..." : (existingMovie ? "Update Content" : "Upload Content")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedMovieUploadForm;
