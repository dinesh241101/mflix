
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SiteSettingsFormProps {
  onSettingsUpdate?: () => void;
}

const SiteSettingsForm = ({ onSettingsUpdate }: SiteSettingsFormProps) => {
  const handleSave = () => {
    // Handle saving logic here
    if (onSettingsUpdate) {
      onSettingsUpdate();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Site Title</label>
        <Input 
          className="bg-gray-700 border-gray-600"
          placeholder="MFlix - Download Movies & Series"
          defaultValue="MFlix - Download Movies & Series"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
        <Textarea
          className="bg-gray-700 border-gray-600"
          placeholder="Site meta description for SEO"
          defaultValue="MFlix is your go-to destination for downloading the latest movies, TV series, and more. High-quality content available in multiple resolutions."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Analytics Tracking ID</label>
        <Input 
          className="bg-gray-700 border-gray-600"
          placeholder="UA-XXXXXXXXX-X"
        />
      </div>
      
      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
        Save Settings
      </Button>
    </div>
  );
};

export default SiteSettingsForm;
