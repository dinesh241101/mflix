import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import LoadingScreen from "@/components/LoadingScreen";

interface Series {
  id: string;
  movie_id: string;
  title: string;
  year?: number;
  poster_url?: string;
  content_type: string;
  created_at?: string;
  downloads?: number;
}

interface Cast {
  id?: string;
  cast_id?: string;
  actor_name: string;
  actor_role?: string;
}

interface CastSearchResult {
  name: string;
  role: string;
}

const WebSeriesPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [seriesCast, setSeriesCast] = useState<Cast[]>([]);
  
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
    releaseYear: ""
  });
  
  // Cast member form
  const [castForm, setCastForm] = useState({
    name: "",
    role: ""
  });
  
  // Google search results for cast members
  const [castSearchResults, setCastSearchResults] = useState<CastSearchResult[]>([]);
  const [castSearchQuery, setCastSearchQuery] = useState("");
  
  // Downloads form
  const [downloadsCount, setDownloadsCount] = useState(0);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const email = localStorage.getItem("adminEmail");
        
        if (!token) {
          navigate("/admin/login");
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Session expired");
        }
        
        // Check if user is admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (adminError || !isAdmin) {
          throw new Error("Not authorized as admin");
        }
        
        setAdminEmail(email || user.email || "admin@example.com");
        
        // Load series data
        fetchSeries();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch series data
  const fetchSeries = async () => {
    try {
      setLoading(true);
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false });
      
      if (seriesError) throw seriesError;
      
      // Map the data to match our Series interface
      const mappedSeries: Series[] = (seriesData || []).map(item => ({
        id: item.movie_id,
        movie_id: item.movie_id,
        title: item.title,
        year: item.year,
        poster_url: item.poster_url,
        content_type: item.content_type,
        created_at: item.created_at,
        downloads: item.downloads
      }));
      
      setSeries(mappedSeries);
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
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };
  
  // Handle series upload
  const handleUploadSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert form data for Supabase
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
        downloads: 0
      };
      
      // Insert series data
      const { data: series, error: seriesError } = await supabase
        .from('movies')
        .insert(seriesData)
        .select('movie_id')
        .single();
      
      if (seriesError) throw seriesError;
      
      // If series created successfully, add download links
      if (series && series.movie_id) {
        // Process download links if any
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
        
        // Add YouTube trailer if provided
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
          releaseYear: ""
        });
        
        // Reload series data
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

  // Handle series select for cast management
  const handleSelectSeriesForCast = async (seriesId: string) => {
    try {
      setLoading(true);
      
      // Fetch series details
      const { data: seriesData, error: seriesError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', seriesId)
        .single();
      
      if (seriesError) throw seriesError;
      
      // Fetch existing cast for this series
      const { data: cast, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', seriesId);
      
      if (castError) throw castError;
      
      // Map the series data to match our Series interface
      const mappedSeries: Series = {
        id: seriesData.movie_id,
        movie_id: seriesData.movie_id,
        title: seriesData.title,
        year: seriesData.year,
        poster_url: seriesData.poster_url,
        content_type: seriesData.content_type,
        created_at: seriesData.created_at,
        downloads: seriesData.downloads
      };
      
      setSelectedSeries(mappedSeries);
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
  
  // Handle add cast member
  const handleAddCastMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSeries) {
      toast({
        title: "Error",
        description: "No series selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .insert({
          movie_id: selectedSeries.id,
          actor_name: castForm.name,
          actor_role: castForm.role
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member added successfully!",
      });
      
      // Reset form
      setSeriesCast([
        ...seriesCast,
        {
          id: Date.now().toString(), // Temporary ID
          actor_name: castForm.name,
          actor_role: castForm.role
        }
      ]);
      
      setCastForm({
        name: "",
        role: ""
      });
      
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
  
  // Simplified delete cast member to avoid type issues
  const handleDeleteCastMember = async (id: string) => {
    try {
      setLoading(true);
      
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
  
  // Handle search for cast members using Google
  const handleCastSearch = async (query: string) => {
    setCastSearchQuery(query);
    
    // Simulate Google search results
    if (query.trim().length > 2) {
      // Simulated results based on query
      const simulatedResults = [
        { name: `${query} Johnson`, role: "Actor" },
        { name: `${query} Smith`, role: "Actress" },
        { name: `${query} Williams`, role: "Director" },
        { name: `${query} Brown`, role: "Producer" }
      ];
      
      setCastSearchResults(simulatedResults as any);
    } else {
      setCastSearchResults([]);
    }
  };
  
  // Select cast member from search results
  const selectCastFromSearch = (result: CastSearchResult) => {
    setCastForm({
      name: result.name,
      role: ""
    });
    setCastSearchResults([]);
    setCastSearchQuery("");
  };
  
  // Handle downloads count update
  const handleUpdateDownloads = async () => {
    if (!selectedSeries) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movies')
        .update({ downloads: downloadsCount })
        .eq('movie_id', selectedSeries.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download count updated successfully!",
      });
      
      // Update local state
      if (selectedSeries) {
        setSelectedSeries({
          ...selectedSeries,
          downloads: downloadsCount
        });
      }
      
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
  
  // Handle delete series
  const [deleting, setDeleting] = useState(false);
  const [seriesIdToDelete, setSeriesIdToDelete] = useState<string | null>(null);
  
  const handleDeleteSeries = async (id: string) => {
    try {
      setDeleting(true);
      
      // Simplify the deletion logic to avoid TypeScript error
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('movie_id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Web series deleted successfully",
      });
      
      // Update local state
      setSeries(series.filter(s => s.movie_id !== id));
      
    } catch (error: any) {
      console.error('Error deleting series:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete web series",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setSeriesIdToDelete(null);
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Loading Web Series Page" />;
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
