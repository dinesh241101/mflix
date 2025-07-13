import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const MoviesPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
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
    releaseYear: "",
    screenshots: ""
  });
  
  // Cast member form
  const [castForm, setCastForm] = useState({
    name: "",
    role: ""
  });
  
  // Google search results for cast members
  const [castSearchResults, setCastSearchResults] = useState<Array<{name: string, role: string}>>([]);
  const [castSearchQuery, setCastSearchQuery] = useState("");
  
  // Downloads form
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies();
    }
  }, [isAuthenticated]);

  // Fetch movies data
  const fetchMovies = async () => {
    try {
      setLoading(true);
      updateActivity();
      
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
  
  // Handle movie upload
  const handleUploadMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    updateActivity();
    
    try {
      setLoading(true);
      
      if (!movieForm.title.trim()) {
        throw new Error("Movie title is required");
      }

      const movieData = {
        title: movieForm.title.trim(),
        year: movieForm.year ? parseInt(movieForm.year) : null,
        content_type: "movie",
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
        is_visible: true,
        downloads: 0,
        screenshots: movieForm.screenshots ? movieForm.screenshots.split(',').map(s => s.trim()) : []
      };
      
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .insert(movieData)
        .select('movie_id')
        .single();
      
      if (movieError) {
        console.error("Supabase error:", movieError);
        throw new Error(`Failed to upload movie: ${movieError.message}`);
      }
      
      // Process additional data
      if (movie && movie.movie_id) {
        // Process download links
        if (movieForm.downloadLinks?.trim()) {
          const links = movieForm.downloadLinks.split('\n').filter(link => link.trim());
          
          for (const link of links) {
            const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
            
            if (match && match.length >= 4) {
              const [_, quality, size, url] = match;
              
              const { error: linkError } = await supabase
                .from('download_links')
                .insert({
                  movie_id: movie.movie_id,
                  quality: quality.trim(),
                  file_size: size.trim(),
                  download_url: url.trim()
                });
              
              if (linkError) {
                console.warn("Failed to add download link:", linkError);
              }
            }
          }
        }
        
        // Add YouTube trailer
        if (movieForm.youtubeTrailer?.trim()) {
          const { error: trailerError } = await supabase
            .from('media_clips')
            .insert({
              movie_id: movie.movie_id,
              clip_title: `${movieForm.title} - Trailer`,
              clip_type: 'trailer',
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
          releaseYear: "",
          screenshots: ""
        });
        
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
      updateActivity();
      
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', movieId)
        .single();
      
      if (movieError) throw movieError;
      
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
    updateActivity();
    
    if (!selectedMovie) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('movie_cast')
        .insert({
          movie_id: selectedMovie.movie_id,
          actor_name: castForm.name,
          actor_role: castForm.role
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cast member added successfully!",
      });
      
      setMovieCast([
        ...movieCast,
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
  
  // Handle delete cast member
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
      
      setMovieCast(movieCast.filter(member => (member.cast_id !== id && member.id !== id)));
      
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
  const handleCastSearch = (query: string) => {
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
  
  // Select cast member from search results
  const selectCastFromSearch = (result: {name: string, role: string}) => {
    setCastForm({
      name: result.name,
      role: ""
    });
    setCastSearchResults([]);
    setCastSearchQuery("");
    updateActivity();
  };
  
  // Handle downloads count update
  const handleUpdateDownloads = async () => {
    if (!selectedMovie) return;
    
    try {
      setLoading(true);
      updateActivity();
      
      const { error } = await supabase
        .from('movies')
        .update({ downloads: downloadsCount })
        .eq('movie_id', selectedMovie.movie_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download count updated successfully!",
      });
      
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
  
  if (authLoading || loading) {
    return <LoadingScreen message="Loading Movies Page" />;
  }

  if (!isAuthenticated) {
    return null;
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
