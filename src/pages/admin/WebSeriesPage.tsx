import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const WebSeriesPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [seriesCast, setSeriesCast] = useState<any[]>([]);
  
  // Series form state
  const [seriesForm, setSeriesForm] = useState({
    title: "",
    year: "",
    contentType: "series",
    genre: "",
    quality: "1080p",
    country: "",
    director: "",
    productionHouse: "",
    imdbRating: "",
    storyline: "",
    seoTags: "",
    posterUrl: "",
    featured: false,
    youtubeTrailer: "",
    downloadLinks: "",
    releaseMonth: "",
    releaseYear: "",
    screenshots: ""
  });
  
  // Cast member form
  const [castForm, setCastForm] = useState({
    name: "",
    role: ""
  });
  
  // Search results for cast members
  const [castSearchResults, setCastSearchResults] = useState<any[]>([]);
  const [castSearchQuery, setCastSearchQuery] = useState("");
  
  // Downloads form
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSeries();
    }
  }, [isAuthenticated]);

  // Fetch series data
  const fetchSeries = async () => {
    try {
      setLoading(true);
      updateActivity();
      
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false });
      
      if (seriesError) throw seriesError;
      setSeries(seriesData || []);
    } catch (error: any) {
      console.error("Error fetching series:", error);
      toast({
        title: "Error",
        description: "Failed to load web series data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle series upload
  const handleUploadSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    updateActivity();
    
    try {
      setLoading(true);
      
      if (!seriesForm.title.trim()) {
        throw new Error("Series title is required");
      }

      const seriesData = {
        title: seriesForm.title,
        year: parseInt(seriesForm.year),
        content_type: "series",
        genre: seriesForm.genre.split(',').map(g => g.trim()),
        quality: seriesForm.quality,
        country: seriesForm.country,
        director: seriesForm.director,
        production_house: seriesForm.productionHouse,
        imdb_rating: parseFloat(seriesForm.imdbRating),
        storyline: seriesForm.storyline,
        seo_tags: seriesForm.seoTags.split(',').map(t => t.trim()),
        poster_url: seriesForm.posterUrl,
        featured: seriesForm.featured,
        downloads: 0,
        is_visible: true,
        screenshots: seriesForm.screenshots ? seriesForm.screenshots.split(',').map(s => s.trim()) : []
      };
      
      const { data: series, error: seriesError } = await supabase
        .from('movies')
        .insert(seriesData)
        .select('movie_id')
        .single();
      
      if (seriesError) throw seriesError;
      
      // Process additional data like movies
      if (series && series.movie_id) {
        if (seriesForm.downloadLinks.trim()) {
          const links = seriesForm.downloadLinks.split('\n').filter(link => link.trim());
          
          for (const link of links) {
            const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
            
            if (match && match.length >= 4) {
              const [_, quality, size, url] = match;
              
              await supabase
                .from('download_links')
                .insert({
                  movie_id: series.movie_id,
                  quality: quality.trim(),
                  file_size: size.trim(),
                  download_url: url.trim()
                });
            }
          }
        }
        
        if (seriesForm.youtubeTrailer.trim()) {
          await supabase
            .from('media_clips')
            .insert({
              movie_id: series.movie_id,
              clip_title: `${seriesForm.title} - Trailer`,
              clip_type: 'trailer',
              video_url: seriesForm.youtubeTrailer.trim()
            });
        }
        
        toast({
          title: "Success",
          description: "Web Series uploaded successfully!",
        });
        
        // Reset form
        setSeriesForm({
          title: "",
          year: "",
          contentType: "series",
          genre: "",
          quality: "1080p",
          country: "",
          director: "",
          productionHouse: "",
          imdbRating: "",
          storyline: "",
          seoTags: "",
          posterUrl: "",
          featured: false,
          youtubeTrailer: "",
          downloadLinks: "",
          releaseMonth: "",
          releaseYear: "",
          screenshots: ""
        });
        
        fetchSeries();
      }
    } catch (error: any) {
      console.error("Error uploading web series:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload web series",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeriesForCast = async (seriesId: string) => {
    try {
      setLoading(true);
      updateActivity();
      
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', seriesId)
        .single();
      
      if (seriesError) throw seriesError;
      
      const { data: cast, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', seriesId);
      
      if (castError) throw castError;
      
      setSelectedSeries(seriesData);
      setSeriesCast(cast || []);
      setDownloadsCount(seriesData.downloads || 0);
      
    } catch (error: any) {
      console.error("Error fetching series details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load series details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCastMember = async (e: React.FormEvent) => {
    e.preventDefault();
    updateActivity();
    
    if (!selectedSeries) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .insert({
          movie_id: selectedSeries.movie_id,
          actor_name: castForm.name,
          actor_role: castForm.role
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member added successfully!",
      });
      
      setSeriesCast([
        ...seriesCast,
        {
          id: Date.now().toString(),
          actor_name: castForm.name,
          actor_role: castForm.role
        }
      ]);
      
      setCastForm({ name: "", role: "" });
      
    } catch (error: any) {
      console.error("Error adding cast member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add cast member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCastMember = async (id: string) => {
    try {
      setLoading(true);
      updateActivity();
      
      const { error } = await supabase
        .from('movie_cast')
        .delete()
        .eq('cast_id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member removed successfully!",
      });
      
      setSeriesCast(prev => prev.filter(member => member.id !== id && member.cast_id !== id));
      
    } catch (error: any) {
      console.error("Error deleting cast member:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove cast member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCastSearch = async (query: string) => {
    setCastSearchQuery(query);
    updateActivity();
    
    if (query.trim().length > 2) {
      const simulatedResults = [
        { name: `${query} Johnson`, role: "Actor" },
        { name: `${query} Smith`, role: "Actress" },
        { name: `${query} Williams`, role: "Director" },
        { name: `${query} Brown`, role: "Producer" }
      ];
      
      setCastSearchResults(simulatedResults);
    } else {
      setCastSearchResults([]);
    }
  };

  const selectCastFromSearch = (result: any) => {
    setCastForm({
      name: result.name,
      role: ""
    });
    setCastSearchResults([]);
    setCastSearchQuery("");
    updateActivity();
  };

  const handleUpdateDownloads = async () => {
    if (!selectedSeries) return;
    
    try {
      setLoading(true);
      updateActivity();
      
      const { error } = await supabase
        .from('movies')
        .update({ downloads: downloadsCount })
        .eq('movie_id', selectedSeries.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download count updated successfully!",
      });
      
      setSelectedSeries({
        ...selectedSeries,
        downloads: downloadsCount
      });
      
    } catch (error: any) {
      console.error("Error updating downloads:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update download count",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading || loading) {
    return <LoadingScreen message="Loading Web Series Page" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <MoviesTab 
          movies={series}
          movieForm={seriesForm}
          setMovieForm={setSeriesForm}
          handleUploadMovie={handleUploadSeries}
          selectedMovie={selectedSeries}
          setSelectedMovie={setSelectedSeries}
          handleSelectMovieForCast={handleSelectSeriesForCast}
          movieCast={seriesCast}
          castForm={castForm}
          setCastForm={setCastForm}
          handleAddCastMember={handleAddCastMember}
          handleDeleteCastMember={handleDeleteCastMember}
          downloadsCount={downloadsCount}
          setDownloadsCount={setDownloadsCount}
          handleUpdateDownloads={handleUpdateDownloads}
          castSearchQuery={castSearchQuery}
          handleCastSearch={handleCastSearch}
          castSearchResults={castSearchResults}
          selectCastFromSearch={selectCastFromSearch}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default WebSeriesPage;
