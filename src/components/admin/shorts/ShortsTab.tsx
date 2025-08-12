
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, PlusCircle, Trash2, Video } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShortsTabProps {
  shorts?: any[];
  shortForm?: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
  };
  setShortForm?: (form: any) => void;
  handleAddShort?: (e: React.FormEvent) => void;
  handleDeleteShort?: (id: string) => void;
}

const ShortsTab = (props: ShortsTabProps = {}) => {
  const [shorts, setShorts] = useState(props.shorts || []);
  const [shortForm, setShortForm] = useState(props.shortForm || {
    title: '',
    videoUrl: '',
    thumbnailUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShorts();
  }, []);

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
      console.error('Error fetching shorts:', error);
      toast({
        title: "Error",
        description: "Failed to load shorts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddShort = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (props.handleAddShort) {
      props.handleAddShort(e);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('shorts')
        .insert([{
          title: shortForm.title,
          video_url: shortForm.videoUrl,
          thumbnail_url: shortForm.thumbnailUrl
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Short video added successfully"
      });

      setShortForm({
        title: '',
        videoUrl: '',
        thumbnailUrl: ''
      });

      fetchShorts();
    } catch (error: any) {
      console.error('Error adding short:', error);
      toast({
        title: "Error",
        description: "Failed to add short video",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShort = async (id: string) => {
    if (props.handleDeleteShort) {
      props.handleDeleteShort(id);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('shorts')
        .delete()
        .eq('short_id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Short video deleted successfully"
      });

      fetchShorts();
    } catch (error: any) {
      console.error('Error deleting short:', error);
      toast({
        title: "Error",
        description: "Failed to delete short video",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
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
        
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
          <PlusCircle className="mr-2" size={16} />
          {loading ? "Adding..." : "Add Short Video"}
        </Button>
      </form>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shorts.map(short => (
          <Card key={short.short_id} className="bg-gray-700 border-gray-600 overflow-hidden">
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
                  <Video size={24} />
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
                  onClick={() => handleDeleteShort(short.short_id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShortsTab;
