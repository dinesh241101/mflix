
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUrlChange: (url: string) => void;
  label?: string;
}

const ImageUploader = ({ currentImageUrl, onImageUrlChange, label = "Poster Image" }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Read the file as data URL (base64)
      const fileReader = new FileReader();
      
      fileReader.onload = function(event) {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          onImageUrlChange(imageUrl);
          
          toast({
            title: "Image uploaded",
            description: "Image has been prepared for upload.",
          });
        }
      };
      
      fileReader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading the image.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = () => {
    onImageUrlChange("");
    toast({
      title: "Image removed",
      description: "Image has been removed.",
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
      
      <div className="flex items-start gap-4">
        {/* Image preview */}
        <div className="w-32 h-48 rounded-md overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center">
          {currentImageUrl ? (
            <img 
              src={currentImageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-gray-500" size={32} />
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          {/* External URL input */}
          <input
            type="text"
            value={currentImageUrl || ""}
            onChange={(e) => onImageUrlChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL or upload file below"
          />
          
          <div className="flex gap-2">
            {/* File upload */}
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              disabled={uploading}
            >
              <label className="cursor-pointer flex items-center justify-center w-full">
                <Upload className="mr-2" size={16} />
                {uploading ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={uploading}
                />
              </label>
            </Button>
            
            {/* Remove button */}
            {currentImageUrl && (
              <Button
                type="button"
                variant="destructive"
                onClick={removeImage}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
