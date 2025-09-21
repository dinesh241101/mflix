
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import MovieUploadForm from "./MovieUploadForm";
import EnhancedMovieUploadForm from "./EnhancedMovieUploadForm";
import MovieDetailsDialog from "./MovieDetailsDialog";
import DownloadLinksForm from "./DownloadLinksForm";

interface Movie {
  movie_id: string;
  title: string;
  year: number;
  genre: string[];
  country: string;
  imdb_rating: number;
  content_type: string;
  is_visible: boolean;
  poster_url?: string;
  director?: string;
  production_house?: string;
  storyline?: string;
}

interface MoviesTabProps {
  contentType?: 'movie' | 'series' | 'anime' | 'all';
}

const MoviesTab = ({ contentType = 'all' }: MoviesTabProps) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<'movie' | 'series' | 'anime' | 'all'>(contentType);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showDownloadLinks, setShowDownloadLinks] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('movies')
        .select('movie_id, title, year, genre, country, imdb_rating, content_type, is_visible, poster_url, director, production_house ')
        .order('created_at', { ascending: false });

      if (contentType !== 'all') {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch movies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (movieId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ is_visible: !currentVisibility })
        .eq('movie_id', movieId);

      if (error) throw error;

      setMovies(movies.map(movie => 
        movie.movie_id === movieId 
          ? { ...movie, is_visible: !currentVisibility }
          : movie
      ));

      toast({
        title: "Success",
        description: `Movie ${!currentVisibility ? 'shown' : 'hidden'} successfully`,
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (movieId: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`);
    
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', movieId);

      if (error) throw error;

      setMovies(movies.filter(movie => movie.movie_id !== movieId));
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive"
      });
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.production_house?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || movie.content_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (showUploadForm) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingMovie ? 'Edit Content' : 'Upload New Content'}
          </h2>
          <Button
            onClick={() => {
              setShowUploadForm(false);
              setEditingMovie(null);
            }}
            variant="outline"
          >
            Back to List
          </Button>
        </div>
        <EnhancedMovieUploadForm
          existingMovie={editingMovie}
          onClose={() => {
            setShowUploadForm(false);
            setEditingMovie(null);
            fetchMovies();
          }}
          onSuccess={(movieId, contentType) => {
            // Redirect to content links manager after successful edit/upload
            setTimeout(() => {
              navigate('/admin/content-links', {
                state: { 
                  contentId: movieId, 
                  contentType: contentType.split(',')[0].trim()
                }
              });
            }, 1500);
          }}
        />
      </div>
    );
  }

  if (showDownloadLinks) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Download Links</h2>
          <Button
            onClick={() => setShowDownloadLinks(null)}
            variant="outline"
          >
            Back to List
          </Button>
        </div>
        <DownloadLinksForm
          movieId={showDownloadLinks}
          contentType={contentType !== 'all' ? contentType : 'movie'}
          onLinksAdded={() => {
            setShowDownloadLinks(null);
            fetchMovies();
          }}
          updateActivity={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {contentType === 'movie' ? 'Movies' : 
           contentType === 'series' ? 'Web Series' : 
           contentType === 'anime' ? 'Anime' : 'Content'} Management
        </h2>
        <Button onClick={() => setShowUploadForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add New {contentType === 'movie' ? 'Movie' : 
                   contentType === 'series' ? 'Series' : 
                   contentType === 'anime' ? 'Anime' : 'Content'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-700 border-gray-600 text-white"
        />
        {contentType === 'all' && (
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as 'movie' | 'series' | 'anime' | 'all')}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="series">Web Series</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center text-white">Loading content...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <Card key={movie.movie_id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg line-clamp-1">
                    {movie.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={movie.is_visible}
                      onCheckedChange={() => handleVisibilityToggle(movie.movie_id, movie.is_visible)}
                      className="data-[state=checked]:bg-green-600"
                    />
                    {movie.is_visible ? (
                      <Eye size={16} className="text-green-500" />
                    ) : (
                      <EyeOff size={16} className="text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {movie.content_type}
                    </Badge>
                    <Badge variant={movie.is_visible ? "default" : "destructive"}>
                      {movie.is_visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p><strong>Year:</strong> {movie.year}</p>
                    <p><strong>Country:</strong> {movie.country}</p>
                    <p><strong>IMDB:</strong> {movie.imdb_rating}/10</p>
                    {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
                  </div>

                  {movie.genre && movie.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {movie.genre.slice(0, 3).map((g, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                      {movie.genre.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{movie.genre.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      View Details
                    </Button>
                    
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowDownloadLinks(movie.movie_id)}
                        className="text-green-400 hover:text-green-300"
                        title="Manage Download Links"
                      >
                        <LinkIcon size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingMovie(movie);
                          setShowUploadForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(movie.movie_id, movie.title)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMovies.length === 0 && !loading && (
        <div className="text-center text-gray-400 py-8">
          <p>No content found matching your criteria.</p>
        </div>
      )}

      {/* Movie Details Dialog */}
      {selectedMovie && (
        <MovieDetailsDialog
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          movieCast={[]}
          castForm={{ name: '', role: '' }}
          setCastForm={() => {}}
          handleAddCastMember={() => {}}
          handleDeleteCastMember={() => {}}
          downloadsCount={0}
          setDownloadsCount={() => {}}
          handleUpdateDownloads={() => {}}
          castSearchQuery=""
          handleCastSearch={() => {}}
          castSearchResults={[]}
          selectCastFromSearch={() => {}}
          updateActivity={() => {}}
        />
      )}
    </div>
  );
};

export default MoviesTab;
