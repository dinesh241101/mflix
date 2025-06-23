
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Upload, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MultipleImageUploaderProps {
  screenshots: string[];
  onScreenshotsChange: (screenshots: string[]) => void;
  label?: string;
}

const MultipleImageUploader = ({ 
  screenshots, 
  onScreenshotsChange, 
  label = "Movie Screenshots" 
}: MultipleImageUploaderProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    // Check if URL is already added
    if (screenshots.includes(newImageUrl.trim())) {
      toast({
        title: "Error",
        description: "This image URL is already added",
        variant: "destructive"
      });
      return;
    }

    onScreenshotsChange([...screenshots, newImageUrl.trim()]);
    setNewImageUrl("");
    
    toast({
      title: "Success",
      description: "Screenshot added successfully!",
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedScreenshots = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(updatedScreenshots);
    
    toast({
      title: "Success",
      description: "Screenshot removed successfully!",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // In a real application, you would upload to a cloud storage service
      // For demo purposes, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      onScreenshotsChange([...screenshots, imageUrl]);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Add new image section */}
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter image URL..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button 
                type="button"
                onClick={handleAddImage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            <div className="text-center text-gray-400">
              <span className="text-sm">OR</span>
            </div>
            
            <div className="flex items-center justify-center">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  <Upload size={16} />
                  Upload Image File
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </Label>
            </div>
            
            {isUploading && (
              <div className="text-center text-blue-400">
                Uploading image...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display current screenshots */}
      {screenshots.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Current Screenshots ({screenshots.length})
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((url, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600 overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative group">
                    <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center bg-gray-600 text-gray-400">
                        <div className="text-center">
                          <Eye size={24} className="mx-auto mb-2" />
                          <p className="text-xs">Image not available</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 truncate">
                      Screenshot {index + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {screenshots.length === 0 && (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-600">
          <Upload size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No screenshots added yet</p>
          <p className="text-sm text-gray-500 mt-1">Add images using the form above</p>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUploader;
