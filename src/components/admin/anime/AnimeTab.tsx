import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface AnimeTabProps {
  animes?: any[];
  animeForm?: any;
  setAnimeForm?: (form: any) => void;
  handleUploadAnime?: (e: React.FormEvent) => void;
  handleDeleteAnime?: (id: string) => void;
  handleEditAnime?: (anime: any) => void;
  genres?: any[];
  countries?: any[];
  selectedAnime?: any;
  setSelectedAnime?: (anime: any) => void;
  handleSelectAnimeForCast?: (animeId: string) => void;
  animeCast?: any[];
  castForm?: any;
  setCastForm?: (form: any) => void;
  handleAddCastMember?: (e: React.FormEvent) => void;
  handleDeleteCastMember?: (id: string) => void;
  downloadsCount?: number;
  setDownloadsCount?: (count: number) => void;
  handleUpdateDownloads?: () => void;
  castSearchQuery?: string;
  handleCastSearch?: (query: string) => void;
  castSearchResults?: any[];
  selectCastFromSearch?: (result: any) => void;
  isEditing?: boolean;
  updateActivity?: () => void;
}

const AnimeTab = (props: AnimeTabProps = {}) => {
  const [animes, setAnimes] = useState(props.animes || []);
  const [animeForm, setAnimeForm] = useState(props.animeForm || {
    title: '',
    year: new Date().getFullYear(),
    genre: [],
    country: '',
    director: '',
    storyline: '',
    poster_url: '',
    trailer_url: '',
    content_type: 'anime'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnimes();
  }, []);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimes(data || []);
    } catch (error: any) {
      console.error('Error fetching animes:', error);
      toast({
        title: "Error",
        description: "Failed to load animes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (props.handleUploadAnime) {
      props.handleUploadAnime(e);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .insert([animeForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Anime uploaded successfully"
      });

      setAnimeForm({
        title: '',
        year: new Date().getFullYear(),
        genre: [],
        country: '',
        director: '',
        storyline: '',
        poster_url: '',
        trailer_url: '',
        content_type: 'anime'
      });

      fetchAnimes();
    } catch (error: any) {
      console.error('Error uploading anime:', error);
      toast({
        title: "Error",
        description: "Failed to upload anime",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnime = async (id: string) => {
    if (props.handleDeleteAnime) {
      props.handleDeleteAnime(id);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Anime deleted successfully"
      });

      fetchAnimes();
    } catch (error: any) {
      console.error('Error deleting anime:', error);
      toast({
        title: "Error",
        description: "Failed to delete anime",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Anime Management</h2>
        <Button>
          <PlusCircle className="mr-2" size={16} />
          Add Anime
        </Button>
      </div>

      {/* Upload Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Anime</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadAnime} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={animeForm.title}
                  onChange={(e) => setAnimeForm({ ...animeForm, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Anime title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-white">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={animeForm.year}
                  onChange={(e) => setAnimeForm({ ...animeForm, year: parseInt(e.target.value) })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storyline" className="text-white">Storyline</Label>
              <Textarea
                id="storyline"
                value={animeForm.storyline}
                onChange={(e) => setAnimeForm({ ...animeForm, storyline: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Anime storyline"
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Uploading..." : "Upload Anime"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Animes List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Animes ({animes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400">Loading animes...</p>
          ) : animes.length === 0 ? (
            <p className="text-gray-400">No animes found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animes.map((anime) => (
                <div key={anime.movie_id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium">{anime.title}</h3>
                  <p className="text-gray-400 text-sm">{anime.year} • {anime.content_type}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteAnime(anime.movie_id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimeTab;
