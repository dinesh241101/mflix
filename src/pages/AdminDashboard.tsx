
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
  Calendar, Clock, Share2, Youtube, FilmIcon, Video,
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
import MFlixLogo from "@/components/MFlixLogo";
import ShareLinks from "@/components/ShareLinks";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  
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
    downloadLinks: "",
    releaseMonth: "",
    releaseYear: ""
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
        featured: movieForm.featured,
        downloads: 0
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
          downloadLinks: "",
          releaseMonth: "",
          releaseYear: ""
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
    // In a real app, you would use a proper API
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
            <MFlixLogo />
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
                  <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedMovie ? `Content Details: "${selectedMovie.title}"` : 'Content Management'}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedMovie && (
                      <div className="mt-4 space-y-4">
                        <Tabs defaultValue="cast">
                          <TabsList className="w-full bg-gray-700 mb-4">
                            <TabsTrigger value="cast">Cast Members</TabsTrigger>
                            <TabsTrigger value="downloads">Download Count</TabsTrigger>
                            <TabsTrigger value="share">Share Links</TabsTrigger>
                            <TabsTrigger value="clips">Media Clips</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="cast">
                            {/* Cast Search */}
                            <div className="mb-4">
                              <h3 className="text-lg font-medium mb-2">Search Cast Members</h3>
                              <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                                <Input 
                                  value={castSearchQuery}
                                  onChange={(e) => handleCastSearch(e.target.value)}
                                  className="pl-10 bg-gray-700 border-gray-600"
                                  placeholder="Search for actors/actresses..."
                                />
                              </div>
                              
                              {castSearchResults.length > 0 && (
                                <div className="mt-2 bg-gray-700 rounded-lg p-2 border border-gray-600">
                                  {castSearchResults.map((result: any, index) => (
                                    <div 
                                      key={index}
                                      className="py-2 px-3 hover:bg-gray-600 rounded cursor-pointer flex justify-between"
                                      onClick={() => selectCastFromSearch(result)}
                                    >
                                      <span>{result.name}</span>
                                      <span className="text-gray-400">{result.role}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
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
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {movieCast.map(member => (
                                        <tr key={member.id} className="border-t border-gray-600">
                                          <td className="p-3">{member.name}</td>
                                          <td className="p-3">{member.role}</td>
                                          <td className="p-3 text-right">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500"
                                              onClick={() => handleDeleteCastMember(member.id)}
                                            >
                                              <Trash2 size={16} />
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="downloads">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Manage Download Count</h3>
                              <p className="text-gray-400">Set the number of downloads to display for this content.</p>
                              
                              <div className="flex items-center space-x-4">
                                <Input 
                                  type="number"
                                  value={downloadsCount}
                                  onChange={(e) => setDownloadsCount(parseInt(e.target.value) || 0)}
                                  className="bg-gray-700 border-gray-600 w-32"
                                  min="0"
                                />
                                <Button onClick={handleUpdateDownloads}>
                                  Update Downloads
                                </Button>
                              </div>
                              
                              <div className="text-sm text-gray-400">
                                <p>Current download count: {selectedMovie.downloads || 0}</p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="share">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Shareable Links</h3>
                              <p className="text-gray-400">Share this content on social media or copy the direct link.</p>
                              
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <ShareLinks 
                                  url={`https://mflix.com/movie/${selectedMovie.id}`} 
                                  title={selectedMovie.title}
                                  customLinks={[
                                    { text: "WhatsApp", url: `https://wa.me/?text=Check out ${selectedMovie.title} on MFlix: https://mflix.com/movie/${selectedMovie.id}` },
                                    { text: "Telegram", url: `https://t.me/share/url?url=https://mflix.com/movie/${selectedMovie.id}&text=Check out ${selectedMovie.title} on MFlix!` }
                                  ]}
                                />
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="clips">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Media Clips</h3>
                              <p className="text-gray-400">Add YouTube trailers and clips for this content.</p>
                              
                              <form className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-1">YouTube URL</label>
                                  <div className="flex space-x-2">
                                    <Input 
                                      className="bg-gray-700 border-gray-600 flex-grow"
                                      placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <Select defaultValue="trailer">
                                      <SelectTrigger className="w-36 bg-gray-700 border-gray-600">
                                        <SelectValue placeholder="Clip Type" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-700 border-gray-600">
                                        <SelectItem value="trailer">Trailer</SelectItem>
                                        <SelectItem value="teaser">Teaser</SelectItem>
                                        <SelectItem value="clip">Clip</SelectItem>
                                        <SelectItem value="bts">Behind the Scenes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button>Add Clip</Button>
                                  </div>
                                </div>
                              </form>
                              
                              <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="font-medium mb-2">Existing Clips</h4>
                                <p className="text-gray-400">No clips added yet.</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <form onSubmit={handleUploadMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <Input 
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Movie Title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Content Type</label>
                    <Select 
                      value={movieForm.contentType}
                      onValueChange={(value) => setMovieForm({ ...movieForm, contentType: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="series">Series</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                    <Input 
                      type="number"
                      value={movieForm.year}
                      onChange={(e) => setMovieForm({ ...movieForm, year: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Release Year"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Release Month</label>
                    <Select 
                      value={movieForm.releaseMonth}
                      onValueChange={(value) => setMovieForm({ ...movieForm, releaseMonth: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="01">January</SelectItem>
                        <SelectItem value="02">February</SelectItem>
                        <SelectItem value="03">March</SelectItem>
                        <SelectItem value="04">April</SelectItem>
                        <SelectItem value="05">May</SelectItem>
                        <SelectItem value="06">June</SelectItem>
                        <SelectItem value="07">July</SelectItem>
                        <SelectItem value="08">August</SelectItem>
                        <SelectItem value="09">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Release Year</label>
                    <Input 
                      type="number"
                      value={movieForm.releaseYear}
                      onChange={(e) => setMovieForm({ ...movieForm, releaseYear: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Release Year"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Genres (comma separated)</label>
                  <Input 
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Action, Adventure, Comedy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                  <Input 
                    value={movieForm.country}
                    onChange={(e) => setMovieForm({ ...movieForm, country: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Country of Origin"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Director</label>
                    <Input 
                      value={movieForm.director}
                      onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Director Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Production House</label>
                    <Input 
                      value={movieForm.productionHouse}
                      onChange={(e) => setMovieForm({ ...movieForm, productionHouse: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Production Studio"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">IMDB Rating</label>
                    <Input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={movieForm.imdbRating}
                      onChange={(e) => setMovieForm({ ...movieForm, imdbRating: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Rating out of 10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Quality</label>
                    <Select 
                      value={movieForm.quality}
                      onValueChange={(value) => setMovieForm({ ...movieForm, quality: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select Quality" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="4K">4K Ultra HD</SelectItem>
                        <SelectItem value="480p">480p SD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Poster URL</label>
                  <Input 
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Trailer URL</label>
                  <Input 
                    value={movieForm.youtubeTrailer}
                    onChange={(e) => setMovieForm({ ...movieForm, youtubeTrailer: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Storyline</label>
                  <Textarea
                    value={movieForm.storyline}
                    onChange={(e) => setMovieForm({ ...movieForm, storyline: e.target.value })}
                    className="bg-gray-700 border-gray-600 min-h-[100px]"
                    placeholder="Movie plot and storyline..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">SEO Tags (comma separated)</label>
                  <Input 
                    value={movieForm.seoTags}
                    onChange={(e) => setMovieForm({ ...movieForm, seoTags: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="action movie, hollywood, thriller, download"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Download Links (one per line)</label>
                  <Textarea
                    value={movieForm.downloadLinks}
                    onChange={(e) => setMovieForm({ ...movieForm, downloadLinks: e.target.value })}
                    className="bg-gray-700 border-gray-600 min-h-[100px]"
                    placeholder="Quality: 1080p, Size: 2.1GB, URL: https://example.com/download
Quality: 720p, Size: 1.3GB, URL: https://example.com/download-720"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={movieForm.featured}
                    onCheckedChange={(checked) => setMovieForm({ ...movieForm, featured: checked })}
                  />
                  <label htmlFor="featured">Featured Content</label>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2" size={16} />
                  Add Movie
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="shorts" className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Shorts Management</h2>
              <div className="flex space-x-4">
                <Button>
                  <Edit className="mr-2" size={16} />
                  Manage Shorts
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleAddShort} className="bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">Add New Short Video</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <Input 
                    value={shortForm.title}
                    onChange={(e) => setShortForm({ ...shortForm, title: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Short Video Title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail URL</label>
                  <Input 
                    value={shortForm.thumbnailUrl}
                    onChange={(e) => setShortForm({ ...shortForm, thumbnailUrl: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Video URL (YouTube or direct link)</label>
                <Input 
                  value={shortForm.videoUrl}
                  onChange={(e) => setShortForm({ ...shortForm, videoUrl: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
                  required
                />
              </div>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2" size={16} />
                Add Short Video
              </Button>
            </form>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shorts.map(short => (
                <Card key={short.id} className="bg-gray-700 border-gray-600 overflow-hidden">
                  <div className="relative aspect-video bg-gray-800">
                    {short.thumbnail_url ? (
                      <img 
                        src={short.thumbnail_url} 
                        alt={short.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="text-gray-500" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="ghost" className="text-white">
                        <Play size={24} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium truncate">{short.title}</h3>
                    <div className="mt-2 flex justify-between">
                      <Button
                        size="sm" 
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 p-1 h-auto"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-1 h-auto"
                        onClick={() => handleDeleteShort(short.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ads" className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ads & Affiliate Management</h2>
              <Button>
                <Edit className="mr-2" size={16} />
                Manage Campaigns
              </Button>
            </div>
            
            <Tabs defaultValue="ads">
              <TabsList className="mb-4">
                <TabsTrigger value="ads">Banner Ads</TabsTrigger>
                <TabsTrigger value="affiliates">Affiliate Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ads">
                <form onSubmit={handleUploadAd} className="bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Advertisement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Name</label>
                      <Input 
                        value={adForm.name}
                        onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Ad Campaign Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Ad Type</label>
                      <Select 
                        value={adForm.adType}
                        onValueChange={(value) => setAdForm({ ...adForm, adType: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select Ad Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="banner">Banner Ad</SelectItem>
                          <SelectItem value="video">Video Ad</SelectItem>
                          <SelectItem value="popup">Popup Ad</SelectItem>
                          <SelectItem value="native">Native Ad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                      <Select 
                        value={adForm.position}
                        onValueChange={(value) => setAdForm({ ...adForm, position: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="home">Home Page</SelectItem>
                          <SelectItem value="detail">Movie Detail</SelectItem>
                          <SelectItem value="search">Search Results</SelectItem>
                          <SelectItem value="download">Download Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Display Frequency</label>
                      <Input 
                        type="number"
                        value={adForm.displayFrequency}
                        onChange={(e) => setAdForm({ ...adForm, displayFrequency: parseInt(e.target.value) || 0 })}
                        className="bg-gray-700 border-gray-600"
                        placeholder="How often to show (1-10)"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Ad Content URL (Image/Video)</label>
                    <Input 
                      value={adForm.contentUrl}
                      onChange={(e) => setAdForm({ ...adForm, contentUrl: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="https://example.com/ad-content.jpg"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Target URL (Link)</label>
                    <Input 
                      value={adForm.targetUrl}
                      onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="https://advertiser.com/landing-page"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2" size={16} />
                    Create Ad Campaign
                  </Button>
                </form>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ads.filter(ad => ad.ad_type !== 'affiliate').map(ad => (
                    <Card key={ad.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{ad.name}</h3>
                            <p className="text-gray-400 text-sm">{ad.ad_type} · {ad.position}</p>
                          </div>
                          <div className="flex">
                            <Button variant="ghost" size="sm" className="text-blue-400">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-gray-800 p-2 rounded">
                            <span className="text-gray-400 block">Target:</span>
                            <span className="truncate block">{ad.target_url}</span>
                          </div>
                          <div className="bg-gray-800 p-2 rounded">
                            <span className="text-gray-400 block">Frequency:</span>
                            <span className="block">{ad.display_frequency}x</span>
                          </div>
                        </div>
                        
                        {ad.content_url && (
                          <div className="mt-4 bg-gray-800 rounded overflow-hidden h-24">
                            <img 
                              src={ad.content_url}
                              alt={ad.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/400x100?text=Ad+Preview';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-between text-sm text-gray-400">
                          <span>Created: {format(new Date(ad.created_at), 'MMM d, yyyy')}</span>
                          <span className={ad.is_active ? 'text-green-400' : 'text-red-400'}>
                            {ad.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="affiliates">
                <form className="bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Affiliate Link</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Affiliate Name</label>
                      <Input 
                        className="bg-gray-700 border-gray-600"
                        placeholder="Amazon, Walmart, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                      <Select defaultValue="product">
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Affiliate URL</label>
                    <Input 
                      className="bg-gray-700 border-gray-600"
                      placeholder="https://amazon.com/product/ref=your-affiliate-code"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <Textarea
                      className="bg-gray-700 border-gray-600"
                      placeholder="Brief description of what you're promoting"
                    />
                  </div>
                  
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2" size={16} />
                    Add Affiliate Link
                  </Button>
                </form>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Active Affiliate Links</h3>
                  <p className="text-gray-400">No affiliate links added yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="users" className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2" size={16} />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <Input 
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          className="bg-gray-700 border-gray-600"
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <Input 
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                          className="bg-gray-700 border-gray-600"
                          placeholder="Create a strong password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <Select 
                          value={newUserForm.role}
                          onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create User
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 font-medium bg-gray-800 p-3">
                <div className="col-span-5">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>
              
              {users.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No users found. Add your first user using the button above.
                </div>
              ) : (
                <div className="divide-y divide-gray-600">
                  {users.map(user => (
                    <div key={user.id} className="grid grid-cols-12 p-3 items-center">
                      <div className="col-span-5 truncate">{user.email}</div>
                      <div className="col-span-2">
                        <Select 
                          value={user.role}
                          onValueChange={(value) => handleUpdateUserRole(user.user_id, value)}
                          disabled={user.email === "dinesh001kaushik@gmail.com"}
                        >
                          <SelectTrigger className="h-8 bg-gray-700 border-gray-600">
                            <SelectValue placeholder={user.role} />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="col-span-3 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={user.email === "dinesh001kaushik@gmail.com"}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteUser(user.user_id)}
                          disabled={user.email === "dinesh001kaushik@gmail.com"}
                        >
                          <UserMinus size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-gray-300 font-medium mb-2">Total Downloads</h3>
                    <p className="text-3xl font-bold">{analytics.totalDownloads.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-gray-300 font-medium mb-2">Active Users</h3>
                    <p className="text-3xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-900 to-green-800 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-gray-300 font-medium mb-2">Ad Clicks</h3>
                    <p className="text-3xl font-bold">{analytics.adClicks.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-gray-300 font-medium mb-2">Ad Revenue</h3>
                    <p className="text-3xl font-bold">${analytics.adRevenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
              
              {selectedCountry ? (
                <div>
                  <div className="flex items-center mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-400"
                      onClick={() => setSelectedCountry(null)}
                    >
                      &larr; Back to Countries
                    </Button>
                    <h3 className="text-lg font-medium ml-2">{selectedCountry.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">States/Regions</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {selectedCountry.states.map((state: any) => (
                            <div 
                              key={state.name}
                              className="flex justify-between items-center p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-750"
                            >
                              <span>{state.name}</span>
                              <span className="text-gray-400">{state.count} users</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Devices</h4>
                        <div className="space-y-2">
                          {selectedCountry.states.flatMap((state: any) => 
                            state.cities.flatMap((city: any) => 
                              city.devices.map((device: any) => ({
                                name: device.name,
                                count: device.count
                              }))
                            )
                          ).reduce((acc: any[], device: any) => {
                            const existing = acc.find(d => d.name === device.name);
                            if (existing) {
                              existing.count += device.count;
                            } else {
                              acc.push({ ...device });
                            }
                            return acc;
                          }, []).sort((a: any, b: any) => b.count - a.count).map((device: any) => (
                            <div 
                              key={device.name}
                              className="flex justify-between items-center p-2 bg-gray-800 rounded"
                            >
                              <span>{device.name}</span>
                              <span className="text-gray-400">{device.count} users</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 font-medium bg-gray-800 p-3">
                    <div className="col-span-4">Country</div>
                    <div className="col-span-3">Users</div>
                    <div className="col-span-3">Downloads</div>
                    <div className="col-span-2">Revenue</div>
                  </div>
                  
                  <div className="divide-y divide-gray-600">
                    {analytics.countries.map((country: any) => (
                      <div 
                        key={country.name}
                        className="grid grid-cols-12 p-3 items-center hover:bg-gray-600 cursor-pointer"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <div className="col-span-4">{country.name}</div>
                        <div className="col-span-3">{country.users.toLocaleString()}</div>
                        <div className="col-span-3">{country.downloads.toLocaleString()}</div>
                        <div className="col-span-2">${country.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">Account Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                    <Input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <Input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      placeholder="New password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Change Password
                  </Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Site Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Site Title</label>
                    <Input 
                      className="bg-gray-700 border-gray-600"
                      placeholder="MFlix - Download Movies & Series"
                      defaultValue="MFlix - Download Movies & Series"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                    <Textarea
                      className="bg-gray-700 border-gray-600"
                      placeholder="Site meta description for SEO"
                      defaultValue="MFlix is your go-to destination for downloading the latest movies, TV series, and more. High-quality content available in multiple resolutions."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Analytics Tracking ID</label>
                    <Input 
                      className="bg-gray-700 border-gray-600"
                      placeholder="UA-XXXXXXXXX-X"
                    />
                  </div>
                  
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
