
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Trash, Edit, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Content {
  id: string;
  movie_id: string;
  title: string;
  year?: number;
  poster_url?: string;
  storyline?: string;
  imdb_rating?: number;
  genre?: string[];
  content_type: string;
}

const ContentManagementPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("movie");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const email = localStorage.getItem("adminEmail");
        
        if (!email) {
          navigate("/admin/login");
          return;
        }
        
        setAdminEmail(email);
        fetchContents(contentType);
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchContents = async (type: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('content_type', type)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map the data to match our Content interface
      const mappedData: Content[] = (data || []).map(item => ({
        id: item.movie_id,
        movie_id: item.movie_id,
        title: item.title,
        year: item.year,
        poster_url: item.poster_url,
        storyline: item.storyline,
        imdb_rating: item.imdb_rating,
        genre: item.genre,
        content_type: item.content_type
      }));
      
      setContents(mappedData);
      setContentType(type);
    } catch (error: any) {
      console.error(`Error fetching ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${type} data.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    if (!searchQuery.trim()) {
      fetchContents(contentType);
      return;
    }

    const filteredContents = contents.filter(content => 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (content.storyline && content.storyline.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setContents(filteredContents);
  };

  const handleEdit = (id: string) => {
    const contentTypeRoute = contentType === 'movie' ? 'movies' : 
      contentType === 'series' ? 'web-series' : 
      contentType === 'anime' ? 'anime' : 'shorts';
      
    navigate(`/admin/${contentTypeRoute}?edit=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    
    try {
      setLoading(true);
      
      // Delete download links - simplified operation
      const deleteLinksResult = await supabase
        .from('download_links')
        .delete()
        .eq('movie_id', id);
      
      // Delete media clips - simplified operation  
      const deleteClipsResult = await supabase
        .from('media_clips')
        .delete()
        .eq('movie_id', id);
      
      // Delete cast - simplified operation
      const deleteCastResult = await supabase
        .from('movie_cast')
        .delete()
        .eq('movie_id', id);
      
      // Finally delete the movie - simplified operation
      const deleteMovieResult = await supabase
        .from('movies')
        .delete()
        .eq('id', id);
      
      if (deleteMovieResult.error) throw deleteMovieResult.error;
      
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      
      fetchContents(contentType);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (id: string) => {
    window.open(`/movie/${id}`, '_blank');
  };

  if (loading) {
    return <LoadingScreen message="Loading Content Management" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="text"
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
        
        <Tabs defaultValue="movie" onValueChange={fetchContents}>
          <TabsList className="mb-6">
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="series">Web Series</TabsTrigger>
            <TabsTrigger value="anime">Anime</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="movie" className="space-y-4">
            <ContentList 
              contents={contents} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onView={handleViewContent}
            />
          </TabsContent>
          
          <TabsContent value="series" className="space-y-4">
            <ContentList 
              contents={contents} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onView={handleViewContent}
            />
          </TabsContent>
          
          <TabsContent value="anime" className="space-y-4">
            <ContentList 
              contents={contents} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onView={handleViewContent}
            />
          </TabsContent>
          
          <TabsContent value="shorts" className="space-y-4">
            <ContentList 
              contents={contents} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onView={handleViewContent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ContentListProps {
  contents: Content[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ContentList = ({ contents, onEdit, onDelete, onView }: ContentListProps) => {
  if (contents.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <Card key={content.id} className="bg-gray-800 border-gray-700">
          <div className="relative h-48">
            <img 
              src={content.poster_url || "https://images.unsplash.com/photo-1500673922987-e212871fec22"} 
              alt={content.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="font-bold text-white">{content.title}</h3>
              <p className="text-sm text-gray-300">{content.year || "N/A"}</p>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1">
                {content.genre && content.genre.slice(0, 2).map((genre: string, i: number) => (
                  <span key={i} className="bg-gray-700 text-xs px-2 py-1 rounded">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{content.imdb_rating || "N/A"}</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-4 line-clamp-2">
              {content.storyline || "No description available"}
            </div>
            <div className="flex justify-between gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onView(content.id)}
                title="View content"
              >
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => onEdit(content.id)}
                title="Edit content"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(content.id)}
                title="Delete content"
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentManagementPage;
