
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Film, 
  Tv, 
  Zap, 
  Users, 
  Settings, 
  Plus,
  BarChart3,
  Upload,
  Tag,
  Download,
  FileText,
  Palette
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import SampleDataInitializer from "@/components/admin/SampleDataInitializer";

const AdminDashboard = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalAnime: 0,
    totalShorts: 0,
    totalUsers: 0,
    totalAds: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      updateActivity();
      
      const [moviesRes, seriesRes, animeRes, shortsRes, adsRes] = await Promise.all([
        supabase.from('movies').select('*', { count: 'exact' }).eq('content_type', 'movie'),
        supabase.from('movies').select('*', { count: 'exact' }).eq('content_type', 'series'),
        supabase.from('movies').select('*', { count: 'exact' }).eq('content_type', 'anime'),
        supabase.from('shorts').select('*', { count: 'exact' }),
        supabase.from('ads').select('*', { count: 'exact' })
      ]);

      setStats({
        totalMovies: moviesRes.count || 0,
        totalSeries: seriesRes.count || 0,
        totalAnime: animeRes.count || 0,
        totalShorts: shortsRes.count || 0,
        totalUsers: 0, // Would need user_roles or profiles table
        totalAds: adsRes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    updateActivity();
    navigate(path);
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Admin Dashboard" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    {
      title: "Upload Content",
      description: "Add new movies, series, anime or shorts",
      icon: Upload,
      path: "/admin/upload",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Manage Movies",
      description: "Edit and organize movie content",
      icon: Film,
      path: "/admin/movies",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Manage Series",
      description: "Edit and organize web series",
      icon: Tv,
      path: "/admin/series",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Manage Anime",
      description: "Edit and organize anime content",
      icon: Zap,
      path: "/admin/anime",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Manage Shorts",
      description: "Edit and organize short videos",
      icon: FileText,
      path: "/admin/shorts",
      color: "bg-pink-600 hover:bg-pink-700"
    },
    {
      title: "Manage Ads",
      description: "Configure advertisements and placements",
      icon: BarChart3,
      path: "/admin/ads",
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "Manage Genres",
      description: "Add and edit content genres",
      icon: Tag,
      path: "/admin/genres",
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Header Configuration",
      description: "Customize site header and branding",
      icon: Palette,
      path: "/admin/header-config",
      color: "bg-teal-600 hover:bg-teal-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {adminEmail}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movies</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMovies}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Series</CardTitle>
              <Tv className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSeries}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anime</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnime}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shorts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShorts}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ads</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAds}</div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Data Initializer */}
        <div className="mb-8">
          <SampleDataInitializer onDataCreated={fetchStats} />
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => handleNavigation(action.path)}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Settings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">System Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>General Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Configure general site settings, preferences, and system configurations.</p>
                <Button onClick={() => handleNavigation("/admin/settings")} className="w-full">
                  Open Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Manage user accounts, roles, and permissions across the platform.</p>
                <Button onClick={() => handleNavigation("/admin/users")} className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
