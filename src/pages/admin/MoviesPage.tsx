import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import LoadingScreen from "@/components/LoadingScreen";

const MoviesPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [movieCast, setMovieCast] = useState<any[]>([]);
  
  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: "",
    year: "",
    contentType: "movie",
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
  const [castSearchResults, setCastSearchResults] = useState([]);
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
        
        // Load movies data
        fetchMovies();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch movies data
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'movie')
        .order('created_at', { ascending: false });
      
      if (movieError) throw movieError;
      setMovies(movieData || []);
    } catch (error: any) {
      console.error("Error fetching movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies data.",
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
  
  // Handle movie upload
  const handleUploadMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!movieForm.title.trim()) {
        throw new Error("Movie title is required");
      }

      // Convert form data for Supabase
      const movieData = {
        title: movieForm.title.trim(),
        year: movieForm.year ? parseInt(movieForm.year) : null,
        content_type: movieForm.contentType || "movie",
        genre: movieForm.genre ? movieForm.genre.split(',').map(g => g.trim()) : [],
        quality: movieForm.quality || "1080p",
        country: movieForm.country || "",
        director: movieForm.director || "",
        production_house: movieForm.productionHouse || "",
        imdb_rating: movieForm.imdbRating ? parseFloat(movieForm.imdbRating) : null,
        storyline: movieForm.storyline || "",
        seo_tags: movieForm.seoTags ? movieForm.seoTags.split(',').map(t => t.trim()) : [],
        poster_url: movieForm.posterUrl || "",
        featured: movieForm.featured || false,
        downloads: 0
      };
      
      console.log("Sending movie data:", movieData);
      
      // Insert movie data
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .insert(movieData)
        .select('id')
        .single();
      
      if (movieError) {
        console.error("Supabase error:", movieError);
        throw new Error(`Failed to upload movie: ${movieError.message}`);
      }
      
      // If movie created successfully, add download links
      if (movie && movie.id) {
        // Process download links if any
        if (movieForm.downloadLinks?.trim()) {
          const links = movieForm.downloadLinks.split('\n').filter(link => link.trim());
          
          for (const link of links) {
            const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
            
            if (match && match.length >= 4) {
              const [_, quality, size, url] = match;
              
              const { error: linkError } = await supabase
                .from('download_links')
                .insert({
                  movie_id: movie.id,
                  quality: quality.trim(),
                  size: size.trim(),
                  url: url.trim()
                });
              
              if (linkError) {
                console.warn("Failed to add download link:", linkError);
              }
            }
          }
        }
        
        // Add YouTube trailer if provided
        if (movieForm.youtubeTrailer?.trim()) {
          const { error: trailerError } = await supabase
            .from('media_clips')
            .insert({
              movie_id: movie.id,
              title: `${movieForm.title} - Trailer`,
              type: 'trailer',
              video_url: movieForm.youtubeTrailer.trim()
            });
          
          if (trailerError) {
            console.warn("Failed to add trailer:", trailerError);
          }
        }
        
        toast({
          title: "Success",
          description: "Movie uploaded successfully!",
        });
        
        // Reset form
        setMovieForm({
          title: "",
          year: "",
          contentType: "movie",
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
        
        // Reload movie data
        fetchMovies();
      }
    } catch (error: any) {
      console.error("Error uploading movie:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload movie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle movie select for cast management
  const handleSelectMovieForCast = async (movieId: string) => {
    try {
      setLoading(true);
      
      // Fetch movie details
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single();
      
      if (movieError) throw movieError;
      
      // Fetch existing cast for this movie
      const { data: cast, error: castError } = await supabase
        .from('movie_cast')
        .select('*')
        .eq('movie_id', movieId);
      
      if (castError) throw castError;
      
      setSelectedMovie(movie);
      setMovieCast(cast || []);
      setDownloadsCount(movie.downloads || 0);
      
    } catch (error: any) {
      console.error("Error fetching movie details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load movie details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add cast member
  const handleAddCastMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovie) {
      toast({
        title: "Error",
        description: "No movie selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .insert({
          movie_id: selectedMovie.id,
          name: castForm.name,
          role: castForm.role
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member added successfully!",
      });
      
      // Reset form
      setMovieCast([
        ...movieCast,
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
      setMovieCast(movieCast.filter(member => member.id !== id));
      
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
  const selectCastFromSearch = (result: any) => {
    setCastForm({
      name: result.name,
      role: ""
    });
    setCastSearchResults([]);
    setCastSearchQuery("");
  };
  
  // Handle downloads count update
  const handleUpdateDownloads = async () => {
    if (!selectedMovie) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movies')
        .update({ downloads: downloadsCount })
        .eq('id', selectedMovie.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download count updated successfully!",
      });
      
      // Update local state
      setSelectedMovie({
        ...selectedMovie,
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
    return <LoadingScreen message="Loading Movies Page" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <MoviesTab 
          movies={movies}
          movieForm={movieForm}
          setMovieForm={setMovieForm}
          handleUploadMovie={handleUploadMovie}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          handleSelectMovieForCast={handleSelectMovieForCast}
          movieCast={movieCast}
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

export default MoviesPage;
