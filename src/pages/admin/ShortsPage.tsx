
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";
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
import { Edit, Trash2, Play, Upload, Eye, EyeOff } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Short {
  short_id: string;
  title: string;
  video_url: string;
  youtube_url?: string;
  video_file_url?: string;
  thumbnail_url: string | null;
  duration?: number;
  is_visible: boolean;
  created_at: string;
}

const ShortsPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [shortToDelete, setShortToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newShort, setNewShort] = useState({
    title: "",
    video_url: "",
    youtube_url: "",
    video_file_url: "",
    thumbnail_url: "",
    duration: "",
    is_visible: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchShorts();
    }
  }, [isAuthenticated]);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      updateActivity();
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewShort(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleUploadShort = async (e: React.FormEvent) => {
    e.preventDefault();
    updateActivity();

    try {
      setUploading(true);

      if (!newShort.title.trim()) {
        throw new Error("Title is required");
      }

      if (!newShort.video_url.trim() && !newShort.youtube_url.trim() && !newShort.video_file_url.trim()) {
        throw new Error("At least one video source is required");
      }

      const shortData = {
        title: newShort.title,
        video_url: newShort.video_url || newShort.youtube_url || newShort.video_file_url,
        youtube_url: newShort.youtube_url || null,
        video_file_url: newShort.video_file_url || null,
        thumbnail_url: newShort.thumbnail_url || null,
        duration: newShort.duration ? parseInt(newShort.duration) : null,
        is_visible: newShort.is_visible
      };

      const { error } = await supabase
        .from('shorts')
        .insert(shortData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Short uploaded successfully!",
      });

      setNewShort({
        title: "",
        video_url: "",
        youtube_url: "",
        video_file_url: "",
        thumbnail_url: "",
        duration: "",
        is_visible: true,
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

  const handleToggleVisibility = async (shortId: string, currentVisibility: boolean) => {
    try {
      updateActivity();
      
      const { error } = await supabase
        .from('shorts')
        .update({ is_visible: !currentVisibility })
        .eq('short_id', shortId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Short ${!currentVisibility ? 'made visible' : 'hidden'} successfully`,
      });

      fetchShorts();

    } catch (error: any) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update visibility",
        variant: "destructive"
      });
    }
  };

  const handleDeleteShort = async (id: string) => {
    try {
      setDeleting(true);
      updateActivity();
      
      const { error } = await supabase
        .from('shorts')
        .delete()
        .eq('short_id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Short deleted successfully",
      });
      
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

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Shorts Page" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shorts Management</h1>

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="mr-2" />
              Upload New Short
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadShort} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newShort.title}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="video_url" className="text-white">Direct Video URL</Label>
                  <Input
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={newShort.video_url}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube_url" className="text-white">YouTube URL</Label>
                  <Input
                    type="url"
                    id="youtube_url"
                    name="youtube_url"
                    value={newShort.youtube_url}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="video_file_url" className="text-white">Uploaded File URL</Label>
                  <Input
                    type="url"
                    id="video_file_url"
                    name="video_file_url"
                    value={newShort.video_file_url}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thumbnail_url" className="text-white">Thumbnail URL</Label>
                  <Input
                    type="url"
                    id="thumbnail_url"
                    name="thumbnail_url"
                    value={newShort.thumbnail_url}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration" className="text-white">Duration (seconds)</Label>
                  <Input
                    type="number"
                    id="duration"
                    name="duration"
                    value={newShort.duration}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  name="is_visible"
                  checked={newShort.is_visible}
                  onCheckedChange={(checked) => setNewShort(prev => ({ ...prev, is_visible: checked }))}
                />
                <Label htmlFor="is_visible" className="text-white">Make visible to public</Label>
              </div>
              
              <Button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700">
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
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <Table>
                <TableCaption className="text-gray-400">List of all shorts</TableCaption>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Video Source</TableHead>
                    <TableHead className="text-gray-300">Duration</TableHead>
                    <TableHead className="text-gray-300">Visibility</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shorts.map((short) => (
                    <TableRow key={short.short_id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{short.title}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {short.youtube_url && (
                            <a href={short.youtube_url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm block">
                              YouTube
                            </a>
                          )}
                          {short.video_file_url && (
                            <a href={short.video_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm block">
                              Uploaded File
                            </a>
                          )}
                          {short.video_url && !short.youtube_url && !short.video_file_url && (
                            <a href={short.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm block">
                              Direct Link
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {short.duration ? `${short.duration}s` : 'Not set'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(short.short_id, short.is_visible)}
                          className={short.is_visible ? "text-green-500 hover:text-green-400" : "text-red-500 hover:text-red-400"}
                        >
                          {short.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          <span className="ml-1 text-xs">
                            {short.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-400">
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
            </CardContent>
          </Card>
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
              <AlertDialogCancel disabled={deleting} className="bg-gray-700 text-white border-gray-600">
                Cancel
              </AlertDialogCancel>
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
