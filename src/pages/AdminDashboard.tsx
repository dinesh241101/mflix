
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Tv, Gamepad2, Video, BarChart3, Settings, Users, Menu } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalAnime: 0,
    totalShorts: 0,
    totalUsers: 0,
    totalDownloads: 0
  });

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const email = localStorage.getItem("adminEmail");
        const isAuth = localStorage.getItem("isAuthenticated");
        
        if (!token || isAuth !== "true") {
          console.log("No valid admin token found, redirecting to login");
          navigate("/admin/login");
          return;
        }
        
        setAdminEmail(email || "admin@example.com");
        
        // Load dashboard stats
        await loadStats();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("isAuthenticated");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get movies count
      const { count: movieCount } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'movie');
      
      // Get series count
      const { count: seriesCount } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'series');
      
      // Get anime count
      const { count: animeCount } = await supabase
        .from('movies')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', 'anime');
      
      // Get shorts count
      const { count: shortsCount } = await supabase
        .from('shorts')
        .select('*', { count: 'exact', head: true });
      
      // Get total downloads
      const { data: downloadData } = await supabase
        .from('movies')
        .select('downloads');
      
      const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.downloads || 0), 0) || 0;
      
      setStats({
        totalMovies: movieCount || 0,
        totalSeries: seriesCount || 0,
        totalAnime: animeCount || 0,
        totalShorts: shortsCount || 0,
        totalUsers: 0, // We don't have access to auth.users count
        totalDownloads
      });
      
    } catch (error: any) {
      console.error("Error loading stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
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
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("sessionExpiry");
    navigate("/admin/login");
  };
  
  if (loading) {
    return <LoadingScreen message="Loading Admin Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Movies</CardTitle>
              <Film className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalMovies}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Series</CardTitle>
              <Tv className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSeries}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Anime</CardTitle>
              <Gamepad2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalAnime}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Shorts</CardTitle>
              <Video className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalShorts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDownloads}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Content Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/movies')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Film className="mr-2" size={16} />
                Manage Movies
              </Button>
              <Button 
                onClick={() => navigate('/admin/web-series')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Tv className="mr-2" size={16} />
                Manage Series
              </Button>
              <Button 
                onClick={() => navigate('/admin/anime')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Gamepad2 className="mr-2" size={16} />
                Manage Anime
              </Button>
              <Button 
                onClick={() => navigate('/admin/shorts')} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Video className="mr-2" size={16} />
                Manage Shorts
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Advertisement Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin/ads')} 
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <BarChart3 className="mr-2" size={16} />
                Manage Ads
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/genres')} 
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                <Settings className="mr-2" size={16} />
                Manage Genres
              </Button>
              <Button 
                onClick={() => navigate('/admin/header')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Menu className="mr-2" size={16} />
                Header Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
