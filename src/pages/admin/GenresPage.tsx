
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import GenreForm from "@/components/admin/genres/GenreForm";
import GenreList from "@/components/admin/genres/GenreList";

const GenresPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<any[]>([]);
  const [genreForm, setGenreForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6"
  });

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

        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (adminError || !isAdmin) {
          throw new Error("Not authorized as admin");
        }

        setAdminEmail(email || user.email || "admin@example.com");
        fetchGenres();

      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      // @ts-ignore - genres table exists but types need to be regenerated
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setGenres(data || []);
    } catch (error: any) {
      console.error("Error fetching genres:", error);
      toast({
        title: "Error",
        description: "Failed to load genres data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!genreForm.name.trim()) {
        throw new Error("Genre name is required");
      }

      // @ts-ignore - genres table exists but types need to be regenerated
      const { error } = await supabase
        .from('genres')
        .insert({
          name: genreForm.name.trim(),
          description: genreForm.description.trim() || null,
          color: genreForm.color
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Genre added successfully!",
      });

      setGenreForm({
        name: "",
        description: "",
        color: "#3b82f6"
      });

      fetchGenres();

    } catch (error: any) {
      console.error("Error adding genre:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add genre",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGenre = async (id: string) => {
    try {
      setLoading(true);
      
      // @ts-ignore - genres table exists but types need to be regenerated
      const { error } = await supabase
        .from('genres')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Genre deleted successfully",
      });
      
      setGenres(genres.filter(g => g.id !== id));
      
    } catch (error: any) {
      console.error('Error deleting genre:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete genre",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Genres Management" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Genres Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GenreForm 
              genreForm={genreForm}
              setGenreForm={setGenreForm}
              handleAddGenre={handleAddGenre}
            />
          </div>
          
          <div className="lg:col-span-2">
            <GenreList 
              genres={genres}
              handleDeleteGenre={handleDeleteGenre}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenresPage;
