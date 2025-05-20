import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, FilmIcon, Image, Youtube, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaClipsFormProps {
  movieId: string;
  onClipAdded: () => void;
  existingClips: any[];
  onClipDeleted: () => void;
}

const MediaClipsForm = ({ movieId, onClipAdded, existingClips, onClipDeleted }: MediaClipsFormProps) => {
  const [clipType, setClipType] = useState<string>("trailer");
  const [clipTitle, setClipTitle] = useState<string>("");
  const [clipUrl, setClipUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [clipUploadMethod, setClipUploadMethod] = useState<string>("url");

  const handleAddClip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clipUrl) {
      toast({
        title: "Missing information",
        description: "Please provide a video URL or upload a file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { data, error } = await supabase
        .from('media_clips')
        .insert({
          movie_id: movieId,
          clip_type: clipType,
          clip_title: clipTitle || `${clipType} clip`,
          thumbnail_url: thumbnailUrl,
          video_url: clipUrl
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Clip added",
        description: `${clipType} clip successfully added to the movie.`
      });
      
      // Reset form
      setClipTitle("");
      setClipUrl("");
      setThumbnailUrl("");
      
      if (onClipAdded) onClipAdded();
      
    } catch (error: any) {
      console.error("Error adding clip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add clip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    try {
      const { error } = await supabase
        .from('media_clips')
        .delete()
        .eq('clip_id', clipId);
      
      if (error) throw error;
      
      toast({
        title: "Clip deleted",
        description: "The clip has been successfully removed."
      });
      
      if (onClipDeleted) onClipDeleted();
      
    } catch (error: any) {
      console.error("Error deleting clip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete clip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYouTubeUrlChange = (url: string) => {
    setClipUrl(url);
    
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      // Set thumbnail from YouTube
      setThumbnailUrl(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
      
      // Convert to embed URL
      setClipUrl(`https://www.youtube.com/embed/${youtubeId}`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="add" className="flex-1">Add New Clip</TabsTrigger>
          <TabsTrigger value="manage" className="flex-1">Manage Existing Clips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="pt-4">
          <form onSubmit={handleAddClip} className="space-y-4">
            <div>
              <Label htmlFor="clipType">Clip Type</Label>
              <Select 
                value={clipType} 
                onValueChange={setClipType}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select clip type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="clip">Sample Clip</SelectItem>
                  <SelectItem value="teaser">Teaser</SelectItem>
                  <SelectItem value="bts">Behind the Scenes</SelectItem>
                  <SelectItem value="autoplay">Autoplay Clip (5sec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="clipTitle">Title (Optional)</Label>
              <Input 
                id="clipTitle"
                className="bg-gray-700 border-gray-600"
                value={clipTitle}
                onChange={(e) => setClipTitle(e.target.value)}
                placeholder="Enter clip title"
              />
            </div>
            
            <div>
              <Label htmlFor="clipUploadMethod">Source Type</Label>
              <Select 
                value={clipUploadMethod} 
                onValueChange={setClipUploadMethod}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select upload method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="url">YouTube URL</SelectItem>
                  <SelectItem value="direct">Direct Video URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {clipUploadMethod === "url" ? (
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Youtube className="absolute left-3 top-3 text-gray-400" size={16} />
                    <Input 
                      id="youtubeUrl"
                      className="pl-10 bg-gray-700 border-gray-600"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={clipUrl}
                      onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    />
                  </div>
                </div>
                {clipUrl && thumbnailUrl && (
                  <div className="mt-2">
                    <img 
                      src={thumbnailUrl}
                      alt="YouTube Thumbnail"
                      className="h-24 w-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="directUrl">Direct Video URL</Label>
                  <Input 
                    id="directUrl"
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://example.com/video.mp4"
                    value={clipUrl}
                    onChange={(e) => setClipUrl(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                  <Input 
                    id="thumbnailUrl"
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://example.com/thumbnail.jpg"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !clipUrl}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Add {clipType} Clip
                </>
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="manage" className="pt-4">
          {existingClips && existingClips.length > 0 ? (
            <div className="space-y-4">
              {existingClips.map((clip) => (
                <div key={clip.clip_id} className="bg-gray-700 rounded-md p-4 flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {clip.thumbnail_url ? (
                      <img 
                        src={clip.thumbnail_url} 
                        alt={clip.clip_title || "Clip thumbnail"}
                        className="w-24 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-gray-600 flex items-center justify-center rounded-md">
                        <FilmIcon className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">
                      {clip.clip_title || `${clip.clip_type} clip`}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Type: {clip.clip_type}
                    </p>
                    {clip.video_url && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {clip.video_url}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    onClick={() => handleDeleteClip(clip.clip_id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No clips have been added for this movie yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaClipsForm;
