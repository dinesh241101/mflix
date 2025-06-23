
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MultipleImageUploaderProps {
  currentImages: string[];
  onImageUrlsChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

const MultipleImageUploader = ({ 
  currentImages, 
  onImageUrlsChange, 
  label = "Screenshots", 
  maxImages = 10 
}: MultipleImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  
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
      
      // Validate file types
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Read files as data URLs (base64)
      const imageUrls: string[] = [];
      
      for (const file of files) {
        const dataUrl = await new Promise<string>((resolve) => {
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          fileReader.readAsDataURL(file);
        });
        imageUrls.push(dataUrl);
      }
      
      onImageUrlsChange([...currentImages, ...imageUrls]);
      
      toast({
        title: "Images uploaded",
        description: `${imageUrls.length} image(s) uploaded successfully.`,
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

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    
    if (currentImages.length >= maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can only have up to ${maxImages} images.`,
        variant: "destructive"
      });
      return;
    }
    
    onImageUrlsChange([...currentImages, newImageUrl.trim()]);
    setNewImageUrl("");
    toast({
      title: "Image added",
      description: "Image URL has been added.",
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-400 mb-2">{label}</p>
      
      {/* Image grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-24 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                <img 
                  src={url} 
                  alt={`Screenshot ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add image URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image URL"
        />
        <Button
          type="button"
          onClick={addImageUrl}
          variant="secondary"
          disabled={!newImageUrl.trim() || currentImages.length >= maxImages}
        >
          Add URL
        </Button>
      </div>
      
      {/* File upload */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          disabled={uploading || currentImages.length >= maxImages}
        >
          <label className="cursor-pointer flex items-center justify-center w-full">
            <Upload className="mr-2" size={16} />
            {uploading ? "Uploading..." : "Upload Files"}
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
            onClick={() => onImageUrlsChange([])}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        {currentImages.length} / {maxImages} images uploaded
      </p>
    </div>
  );
};

export default MultipleImageUploader;
