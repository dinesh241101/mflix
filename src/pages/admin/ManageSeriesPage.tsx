
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import MoviesTab from "@/components/admin/movies/MoviesTab";

const ManageSeriesPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSeries();
    }
  }, [isAuthenticated]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      updateActivity();
      
      const { data: seriesData, error } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSeries(seriesData || []);
    } catch (error: any) {
      console.error("Error fetching series:", error);
      toast({
        title: "Error",
        description: "Failed to load series data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Series Management" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateActivity();
                navigate("/admin");
              }}
              className="text-white hover:bg-gray-700"
            >
              <Home size={18} className="mr-2" />
              Admin Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Web Series</h1>
          </div>
          
          <Button
            onClick={() => navigate("/admin/upload")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2" size={16} />
            Upload New Series
          </Button>
        </div>

        <MoviesTab 
          movies={series}
          movieForm={{}}
          setMovieForm={() => {}}
          handleUploadMovie={() => {}}
          selectedMovie={selectedSeries}
          setSelectedMovie={setSelectedSeries}
          handleSelectMovieForCast={() => {}}
          movieCast={[]}
          castForm={{}}
          setCastForm={() => {}}
          handleAddCastMember={() => {}}
          handleDeleteCastMember={() => {}}
          downloadsCount={0}
          setDownloadsCount={() => {}}
          handleUpdateDownloads={() => {}}
          castSearchQuery=""
          handleCastSearch={() => {}}
          castSearchResults={[]}
          selectCastFromSearch={() => {}}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default ManageSeriesPage;
