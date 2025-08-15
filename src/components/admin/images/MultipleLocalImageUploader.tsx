
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, X, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MultipleLocalImageUploaderProps {
  currentImages: string[];
  onImageUrlsChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

const MultipleLocalImageUploader = ({ 
  currentImages, 
  onImageUrlsChange, 
  label = "Images", 
  maxImages = 20 
}: MultipleLocalImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      
      if (currentImages.length + files.length > maxImages) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${maxImages} images.`,
          variant: "destructive"
        });
        return;
      }
      
      // Validate file types and sizes
      const invalidFiles = files.filter(file => 
        !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024
      );
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid files",
          description: "Please upload only image files under 10MB each",
          variant: "destructive"
        });
        return;
      }
      
      // Process each file
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Convert file to base64 for storage
        const base64Url = await new Promise<string>((resolve) => {
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          fileReader.readAsDataURL(file);
        });
        
        // Save image info to database
        try {
          const { data, error } = await supabase
            .from('uploaded_images')
            .insert([{
              filename: file.name,
              file_path: base64Url,
              content_type: file.type,
              file_size: file.size,
              uploaded_by: (await supabase.auth.getUser()).data.user?.id
            }])
            .select('file_path')
            .single();
          
          if (error) throw error;
          uploadedUrls.push(data.file_path);
          
        } catch (dbError) {
          console.error("Database save error:", dbError);
          // Fallback to base64 URL
          uploadedUrls.push(base64Url);
        }
      }
      
      onImageUrlsChange([...currentImages, ...uploadedUrls]);
      
      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
      
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading the images.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImageUrlsChange(newImages);
    toast({
      title: "Image removed",
      description: "Image has been removed.",
    });
  };

  const clearAllImages = () => {
    onImageUrlsChange([]);
    toast({
      title: "All images cleared",
      description: "All images have been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <span className="text-xs text-gray-500">
          {currentImages.length} / {maxImages} images
        </span>
      </div>
      
      {/* Image grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                <img 
                  src={url} 
                  alt={`Image ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload controls */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          disabled={uploading || currentImages.length >= maxImages}
        >
          <label className="cursor-pointer flex items-center justify-center w-full">
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2" size={16} />
                Upload Local Images
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              disabled={uploading || currentImages.length >= maxImages}
            />
          </label>
        </Button>
        
        {currentImages.length > 0 && (
          <Button
            type="button"
            variant="destructive"
            onClick={clearAllImages}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Supports JPG, PNG, GIF, WebP (max 10MB per file)
      </p>
    </div>
  );
};

export default MultipleLocalImageUploader;
