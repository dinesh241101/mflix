import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Short {
  short_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  created_at: string;
}

const ShortsPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [shortToDelete, setShortToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newShort, setNewShort] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    description: "",
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
        fetchShorts();

      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shorts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShorts(data || []);
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShort(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadShort = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      if (!newShort.title.trim() || !newShort.video_url.trim() || !newShort.thumbnail_url.trim()) {
        throw new Error("All fields are required");
      }

      const { error } = await supabase
        .from('shorts')
        .insert(newShort);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Short uploaded successfully!",
      });

      setNewShort({
        title: "",
        video_url: "",
        thumbnail_url: "",
        description: "",
      });

      fetchShorts();

    } catch (error: any) {
      console.error("Error uploading short:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload short",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // FIX: Simplify the delete operation to avoid deep type instantiation
  const handleDeleteShort = async (id: string) => {
    try {
      setDeleting(true);
      
      // Simplify the deletion logic to avoid TypeScript error
      const { error } = await supabase
        .from('shorts')
        .delete()
        .eq('short_id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Short deleted successfully",
      });
      
      // Update local state
      setShorts(shorts.filter(s => s.short_id !== id));
      
    } catch (error: any) {
      console.error('Error deleting short:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete short",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setShortToDelete(null);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Shorts Page" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shorts Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Short</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadShort} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newShort.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={newShort.video_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={newShort.thumbnail_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newShort.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload Short"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {shorts.length === 0 ? (
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <Play size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No shorts found</p>
          </div>
        ) : (
          <Table className="bg-gray-800 rounded-lg">
            <TableCaption>List of all shorts</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Video URL</TableHead>
                <TableHead>Thumbnail URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shorts.map((short) => (
                <TableRow key={short.short_id}>
                  <TableCell className="font-medium">{short.title}</TableCell>
                  <TableCell>
                    <a href={short.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Video
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={short.thumbnail_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Thumbnail
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setShortToDelete(short.short_id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AlertDialog open={!!shortToDelete} onOpenChange={(open) => !open && setShortToDelete(null)}>
          <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this short? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (shortToDelete) {
                    handleDeleteShort(shortToDelete);
                  }
                }}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ShortsPage;
