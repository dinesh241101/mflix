import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, Upload, ChevronDown, LogOut, Users, BarChart3, Settings, 
  Film, Tv, Layers, PlusCircle, UserPlus, UserMinus, Edit, Trash2,
  Calendar, Clock, Share2, Link, Copy, Play, Youtube, FilmIcon, Video,
  Clipboard, X
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [shorts, setShorts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalDownloads: 0,
    activeUsers: 0,
    adClicks: 0,
    adRevenue: 0,
    countries: []
  });
  const [movieCast, setMovieCast] = useState<any[]>([]);
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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
    downloadLinks: ""
  });
  
  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    role: "editor"
  });
  
  // Short form state
  const [shortForm, setShortForm] = useState({
    title: "",
    videoUrl: "",
    thumbnailUrl: ""
  });
  
  // Ad form state
  const [adForm, setAdForm] = useState({
    name: "",
    adType: "banner",
    position: "home",
    contentUrl: "",
    targetUrl: "",
    displayFrequency: 2
  });
  
  // Cast member form
  const [castForm, setCastForm] = useState({
    name: "",
    role: ""
  });
  
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
        
        setIsLoggedIn(true);
        setAdminEmail(email || user.email || "admin@example.com");
        
        // Set active tab based on URL if needed
        const path = location.pathname.split("/").pop();
        if (path && ["movies", "ads", "users", "analytics", "settings", "shorts"].includes(path)) {
          setActiveTab(path);
        }
        
        // Load initial data
        fetchData();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname]);
  
  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      // Fetch users data
      const { data: userData, error: userError } = await supabase
        .from('user_roles')
        .select(`
          id,
          role,
          created_at,
          user_id
        `);
      
      if (userError) throw userError;
      
      // Get auth user details for each user
      let populatedUsers = [];
      if (userData) {
        for (const user of userData) {
          const { data: authUser } = await supabase.auth.admin.getUserById(user.user_id);
          if (authUser && authUser.user) {
            populatedUsers.push({
              ...user,
              email: authUser.user.email,
              status: authUser.user.confirmed_at ? 'Active' : 'Pending'
            });
          }
        }
      }
      
      setUsers(populatedUsers);
      
      // Fetch movies data
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (movieError) throw movieError;
      setMovies(movieData || []);
      
      // Fetch shorts data
      const { data: shortsData, error: shortsError } = await supabase
        .from('shorts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (shortsError) throw shortsError;
      setShorts(shortsData || []);
      
      // Fetch ads data
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (adsError) throw adsError;
      setAds(adsData || []);
      
      // Fetch analytics data (simplified for demo)
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select('*');
      
      if (analyticsError) throw analyticsError;
      
      // Process analytics data for display
      if (analyticsData) {
        // Group by country
        const countries = analyticsData.reduce((acc: any, item: any) => {
          const country = item.country || 'Unknown';
          if (!acc[country]) {
            acc[country] = { count: 0, states: {} };
          }
          acc[country].count++;
          
          // Track states/cities
          const state = item.state || 'Unknown';
          if (!acc[country].states[state]) {
            acc[country].states[state] = { count: 0, cities: {} };
          }
          acc[country].states[state].count++;
          
          // Track cities
          const city = item.city || 'Unknown';
          if (!acc[country].states[state].cities[city]) {
            acc[country].states[state].cities[city] = { count: 0, devices: {} };
          }
          acc[country].states[state].cities[city].count++;
          
          // Track devices
          const device = item.device || 'Unknown';
          if (!acc[country].states[state].cities[city].devices[device]) {
            acc[country].states[state].cities[city].devices[device] = 1;
          } else {
            acc[country].states[state].cities[city].devices[device]++;
          }
          
          return acc;
        }, {});
        
        // Convert to array for display
        const countriesArray = Object.entries(countries).map(([name, data]: [string, any]) => ({
          name,
          users: data.count,
          downloads: data.count * 2, // Just for demo
          revenue: Math.floor(data.count * 0.5), // Just for demo
          states: Object.entries(data.states).map(([stateName, stateData]: [string, any]) => ({
            name: stateName,
            count: stateData.count,
            cities: Object.entries(stateData.cities).map(([cityName, cityData]: [string, any]) => ({
              name: cityName,
              count: cityData.count,
              devices: Object.entries(cityData.devices).map(([deviceName, deviceCount]: [string, any]) => ({
                name: deviceName,
                count: deviceCount
              }))
            }))
          }))
        }));
        
        setAnalytics({
          totalDownloads: analyticsData.length * 3, // Just for demo
          activeUsers: analyticsData.length,
          adClicks: Math.floor(analyticsData.length * 0.7), // Just for demo
          adRevenue: Math.floor(analyticsData.length * 0.2), // Just for demo
          countries: countriesArray.sort((a, b) => b.users - a.users)
        });
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };
  
  // Handle movie upload
  const handleUploadMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert form data for Supabase
      const movieData = {
        title: movieForm.title,
        year: parseInt(movieForm.year),
        content_type: movieForm.contentType,
        genre: movieForm.genre.split(',').map(g => g.trim()),
        quality: movieForm.quality,
        country: movieForm.country,
        director: movieForm.director,
        production_house: movieForm.productionHouse,
        imdb_rating: parseFloat(movieForm.imdbRating),
        storyline: movieForm.storyline,
        seo_tags: movieForm.seoTags.split(',').map(t => t.trim()),
        poster_url: movieForm.posterUrl,
        featured: movieForm.featured
      };
      
      // Insert movie data
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .insert(movieData)
        .select('id')
        .single();
      
      if (movieError) throw movieError;
      
      // If movie created successfully, add download links
      if (movie && movie.id) {
        // Process download links if any
        if (movieForm.downloadLinks.trim()) {
          const links = movieForm.downloadLinks.split('\n').filter(link => link.trim());
          
          for (const link of links) {
            const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
            
            if (match && match.length >= 4) {
              const [_, quality, size, url] = match;
              
              await supabase
                .from('download_links')
                .insert({
                  movie_id: movie.id,
                  quality: quality.trim(),
                  size: size.trim(),
                  url: url.trim()
                });
            }
          }
        }
        
        // Add YouTube trailer if provided
        if (movieForm.youtubeTrailer.trim()) {
          await supabase
            .from('media_clips')
            .insert({
              movie_id: movie.id,
              title: `${movieForm.title} - Trailer`,
              type: 'trailer',
              video_url: movieForm.youtubeTrailer.trim()
            });
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
          downloadLinks: ""
        });
        
        // Reload movie data
        fetchData();
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
  
  // Handle upload ad
  const handleUploadAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const adData = {
        name: adForm.name,
        ad_type: adForm.adType,
        position: adForm.position,
        content_url: adForm.contentUrl,
        target_url: adForm.targetUrl,
        display_frequency: parseInt(adForm.displayFrequency.toString())
      };
      
      const { error } = await supabase
        .from('ads')
        .insert(adData);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad campaign created successfully!",
      });
      
      // Reset form
      setAdForm({
        name: "",
        adType: "banner",
        position: "home",
        contentUrl: "",
        targetUrl: "",
        displayFrequency: 2
      });
      
      // Reload ad data
      fetchData();
      
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad campaign",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        email_confirm: true
      });
      
      if (error) throw error;
      
      if (data && data.user) {
        // Add user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: newUserForm.role
          });
        
        if (roleError) throw roleError;
        
        toast({
          title: "Success",
          description: "User created successfully!",
        });
        
        // Reset form
        setNewUserForm({
          email: "",
          password: "",
          role: "editor"
        });
        
        // Reload user data
        fetchData();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle user role update
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User role updated successfully!",
      });
      
      // Reload user data
      fetchData();
      
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // Delete from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
      
      // Reload user data
      fetchData();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add short video
  const handleAddShort = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('shorts')
        .insert({
          title: shortForm.title,
          video_url: shortForm.videoUrl,
          thumbnail_url: shortForm.thumbnailUrl
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Short video added successfully!",
      });
      
      // Reset form
      setShortForm({
        title: "",
        videoUrl: "",
        thumbnailUrl: ""
      });
      
      // Reload shorts data
      fetchData();
      
    } catch (error: any) {
      console.error("Error adding short:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add short video",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete short
  const handleDeleteShort = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('shorts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Short video deleted successfully!",
      });
      
      // Reload shorts data
      fetchData();
      
    } catch (error: any) {
      console.error("Error deleting short:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete short video",
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
  
  // For unauthorized access
  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need to log in to access the admin panel</p>
          <Link 
            to="/admin/login" 
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen message="Loading Admin Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/admin" className="text-2xl font-bold flex items-center">
              <Film className="mr-2" />
              MFlix Admin
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, {adminEmail}</span>
              <button 
                className="text-red-400 hover:text-red-300 flex items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-800 p-0 rounded-lg mb-6">
            <TabsTrigger value="movies" className="flex-1 py-3">
              <Film className="mr-2" size={16} />
              Movies
            </TabsTrigger>
            <TabsTrigger value="shorts" className="flex-1 py-3">
              <Video className="mr-2" size={16} />
              Shorts
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex-1 py-3">
              <Layers className="mr-2" size={16} />
              Ads & Affiliates
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 py-3">
              <Users className="mr-2" size={16} />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 py-3">
              <BarChart3 className="mr-2" size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 py-3">
              <Settings className="mr-2" size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Movies Management</h2>
              <div className="flex space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Edit className="mr-2" size={16} />
                      Manage Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Content Management</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">All Movies ({movies.length})</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                          <Input 
                            placeholder="Search movies..." 
                            className="pl-10 bg-gray-700 border-gray-600"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-2">
                        <div className="grid grid-cols-12 font-medium border-b border-gray-600 pb-2 mb-2">
                          <div className="col-span-5">Title</div>
                          <div className="col-span-1">Year</div>
                          <div className="col-span-2">Type</div>
                          <div className="col-span-2">Downloads</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>
                        
                        {movies.map(movie => (
                          <div 
                            key={movie.id} 
                            className="grid grid-cols-12 py-2 border-b border-gray-600 items-center text-sm"
                          >
                            <div className="col-span-5 font-medium">{movie.title}</div>
                            <div className="col-span-1">{movie.year || 'N/A'}</div>
                            <div className="col-span-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300">
                                {movie.content_type}
                              </span>
                            </div>
                            <div className="col-span-2">{movie.downloads}</div>
                            <div className="col-span-2 text-right space-x-2">
                              <Button 
                                onClick={() => handleSelectMovieForCast(movie.id)} 
                                variant="ghost" 
                                size="sm"
                              >
                                <Users size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Cast Management Dialog */}
                <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
                  <DialogContent className="bg-gray-800 text-white border-gray-700">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedMovie ? `Cast for "${selectedMovie.title}"` : 'Cast Management'}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedMovie && (
                      <div className="mt-4 space-y-4">
                        {/* Cast Form */}
                        <form onSubmit={handleAddCastMember} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Cast Name</label>
                              <Input 
                                value={castForm.name}
                                onChange={(e) => setCastForm({ ...castForm, name: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                                placeholder="Actor/Actress Name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                              <Input 
                                value={castForm.role}
                                onChange={(e) => setCastForm({ ...castForm, role: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                                placeholder="Character Name"
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            <UserPlus size={16} className="mr-2" />
                            Add Cast Member
                          </Button>
                        </form>
                        
                        {/* Cast List */}
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-2">Current Cast</h3>
                          {movieCast.length === 0 ? (
                            <p className="text-gray-400">No cast members added yet.</p>
                          ) : (
                            <div className="bg-gray-700 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-800">
                                    <th className="text-left p-3">Actor/Actress</th>
                                    <th className="text-left p-3">Role</th>
                                    <th className="text-right p-3">Actions</th>
