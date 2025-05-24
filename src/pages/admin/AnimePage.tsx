
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import LoadingScreen from "@/components/LoadingScreen";

interface AnimeFormData {
  title: string;
  year: string;
  contentType: string;
  genre: string;
  quality: string;
  country: string;
  director: string;
  productionHouse: string;
  imdbRating: string;
  storyline: string;
  seoTags: string;
  posterUrl: string;
  featured: boolean;
  youtubeTrailer: string;
  downloadLinks: string;
  releaseMonth: string;
  releaseYear: string;
}

interface CastFormData {
  name: string;
  role: string;
}

interface CastMember {
  id: string;
  name: string;
  role: string;
}

interface SearchResult {
  name: string;
  role: string;
}

const AnimePage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [animes, setAnimes] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [animeCast, setAnimeCast] = useState<CastMember[]>([]);
  
  // Anime form state
  const [animeForm, setAnimeForm] = useState<AnimeFormData>({
    title: "",
    year: "",
    contentType: "anime",
    genre: "",
    quality: "1080p",
    country: "Japan",
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
  const [castForm, setCastForm] = useState<CastFormData>({
    name: "",
    role: ""
  });
  
  // Google search results for cast members
  const [castSearchResults, setCastSearchResults] = useState<SearchResult[]>([]);
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
        
        // Load anime data
        fetchAnime();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch anime data
  const fetchAnime = async () => {
    try {
      setLoading(true);
      const { data: animeData, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'anime')
        .order('created_at', { ascending: false });
      
      if (animeError) throw animeError;
      setAnimes(animeData || []);
    } catch (error: any) {
      console.error("Error fetching anime:", error);
      toast({
        title: "Error",
        description: "Failed to load anime data.",
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
  
  // Handle anime upload
  const handleUploadAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert form data for Supabase
      const animeData = {
        title: animeForm.title,
        year: parseInt(animeForm.year),
        content_type: "anime",
        genre: animeForm.genre.split(',').map(g => g.trim()),
        quality: animeForm.quality,
        country: animeForm.country,
        director: animeForm.director,
        production_house: animeForm.productionHouse,
        imdb_rating: parseFloat(animeForm.imdbRating),
        storyline: animeForm.storyline,
        seo_tags: animeForm.seoTags.split(',').map(t => t.trim()),
        poster_url: animeForm.posterUrl,
        featured: animeForm.featured,
        downloads: 0
      };
      
      // Insert anime data
      const { data: anime, error: animeError } = await supabase
        .from('movies')
        .insert(animeData)
        .select('movie_id')
        .single();
      
      if (animeError) throw animeError;
      
      // If anime created successfully, add download links
      if (anime && anime.movie_id) {
        // Process download links if any
        if (animeForm.downloadLinks.trim()) {
          const links = animeForm.downloadLinks.split('\n').filter(link => link.trim());
          
          for (const link of links) {
            const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
            
            if (match && match.length >= 4) {
              const [_, quality, size, url] = match;
              
              await supabase
                .from('download_links')
                .insert({
                  movie_id: anime.movie_id,
                  quality: quality.trim(),
                  file_size: size.trim(),
                  download_url: url.trim()
                });
            }
          }
        }
        
        // Add YouTube trailer if provided
        if (animeForm.youtubeTrailer.trim()) {
          await supabase
            .from('media_clips')
            .insert({
              movie_id: anime.movie_id,
              clip_title: `${animeForm.title} - Trailer`,
              clip_type: 'trailer',
              video_url: animeForm.youtubeTrailer.trim()
            });
        }
        
        toast({
          title: "Success",
          description: "Anime uploaded successfully!",
        });
        
        // Reset form
        setAnimeForm({
          title: "",
          year: "",
          contentType: "anime",
          genre: "",
          quality: "1080p",
          country: "Japan",
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
        
        // Reload anime data
        fetchAnime();
      }
    } catch (error: any) {
      console.error("Error uploading anime:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload anime",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle anime select for cast management
  const handleSelectAnimeForCast = async (animeId: string) => {
    try {
      setLoading(true);
      
      // Fetch anime details
      const { data: anime, error: animeError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', animeId)
        .single();
      
      if (animeError) throw animeError;
      
      // Fetch existing cast for this anime
      const { data: cast, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', animeId);
      
      if (castError) throw castError;
      
      setSelectedAnime(anime);
      setAnimeCast(cast || []);
      setDownloadsCount(anime.downloads || 0);
      
    } catch (error: any) {
      console.error("Error fetching anime details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load anime details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add cast member
  const handleAddCastMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAnime) {
      toast({
        title: "Error",
        description: "No anime selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .insert({
          movie_id: selectedAnime.movie_id,
          actor_name: castForm.name,
          actor_role: castForm.role
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member added successfully!",
      });
      
      // Reset form
      setAnimeCast([
        ...animeCast,
        {
          id: Date.now().toString(), // Temporary ID
          name: castForm.name,
          role: castForm.role
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
  
  // Handle delete cast member
  const handleDeleteCastMember = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member removed successfully!",
      });
      
      // Update local state
      setAnimeCast(animeCast.filter(member => member.id !== id));
      
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
  
  // Handle search for cast members 
  const handleCastSearch = async (query: string) => {
    setCastSearchQuery(query);
    
    // Simulate search results
    if (query.trim().length > 2) {
      // Simulated results based on query
      const simulatedResults: SearchResult[] = [
        { name: `${query} (Voice Actor)`, role: "Voice Actor" },
        { name: `${query} (Voice Actress)`, role: "Voice Actress" },
        { name: `${query} (Director)`, role: "Director" },
        { name: `${query} (Producer)`, role: "Producer" }
      ];
      
      setCastSearchResults(simulatedResults);
    } else {
      setCastSearchResults([]);
    }
  };
  
  // Select cast member from search results
  const selectCastFromSearch = (result: SearchResult) => {
    setCastForm({
      name: result.name,
      role: ""
    });
    setCastSearchResults([]);
    setCastSearchQuery("");
  };
  
  // Handle downloads count update
  const handleUpdateDownloads = async () => {
    if (!selectedAnime) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movies')
        .update({ downloads: downloadsCount })
        .eq('movie_id', selectedAnime.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download count updated successfully!",
      });
      
      // Update local state
      setSelectedAnime({
        ...selectedAnime,
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
  
  if (loading) {
    return <LoadingScreen message="Loading Anime Page" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <MoviesTab 
          movies={animes}
          movieForm={animeForm}
          setMovieForm={setAnimeForm}
          handleUploadMovie={handleUploadAnime}
          selectedMovie={selectedAnime}
          setSelectedMovie={setSelectedAnime}
          handleSelectMovieForCast={handleSelectAnimeForCast}
          movieCast={animeCast}
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

export default AnimePage;
