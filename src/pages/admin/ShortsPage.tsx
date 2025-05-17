
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import ShortsTab from "@/components/admin/shorts/ShortsTab";
import LoadingScreen from "@/components/LoadingScreen";

const ShortsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [shorts, setShorts] = useState<any[]>([]);
  
  // Short form state
  const [shortForm, setShortForm] = useState({
    title: "",
    videoUrl: "",
    thumbnailUrl: ""
  });
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const email = localStorage.getItem("adminEmail");
        
        if (!token) {
          navigate("/admin/login", { state: { from: location.pathname } });
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
        
        // Load shorts data
        fetchShorts();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login", { state: { from: location.pathname } });
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname]);

  // Fetch shorts data
  const fetchShorts = async () => {
    try {
      setLoading(true);
      const { data: shortsData, error: shortsError } = await supabase
        .from('shorts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (shortsError) throw shortsError;
      setShorts(shortsData || []);
    } catch (error: any) {
      console.error("Error fetching shorts:", error);
      toast({
        title: "Error",
        description: "Failed to load shorts data.",
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
  
  // Handle add short
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
      fetchShorts();
      
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
      fetchShorts();
      
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
  
  if (loading) {
    return <LoadingScreen message="Loading Shorts Page" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <AdminNavTabs activeTab="shorts" />
        
        <ShortsTab 
          shorts={shorts}
          shortForm={shortForm}
          setShortForm={setShortForm}
          handleAddShort={handleAddShort}
          handleDeleteShort={handleDeleteShort}
        />
      </div>
    </div>
  );
};

export default ShortsPage;
