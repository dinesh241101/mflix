
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContentToggleFormProps {
  onSettingsUpdate?: () => void;
}

const ContentToggleForm = ({ onSettingsUpdate }: ContentToggleFormProps) => {
  const [settings, setSettings] = useState({
    showLatestUploads: true,
    showTrendingMovies: true,
    showFeaturedContent: true,
    latestUploadsLimit: 12,
    trendingLimit: 8,
    featuredLimit: 6
  });
  const [loading, setLoading] = useState(false);

  const handleToggleChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // Store settings in localStorage for now (could be moved to database later)
      localStorage.setItem('contentDisplaySettings', JSON.stringify(settings));
      
      toast({
        title: "Success",
        description: "Content display settings updated successfully!",
      });
      
      if (onSettingsUpdate) {
        onSettingsUpdate();
      }
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('contentDisplaySettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Display Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="latest-uploads" className="text-base">
              Show Latest Uploads Section
            </Label>
            <Switch
              id="latest-uploads"
              checked={settings.showLatestUploads}
              onCheckedChange={(checked) => handleToggleChange('showLatestUploads', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="trending-movies" className="text-base">
              Show Trending Movies Section
            </Label>
            <Switch
              id="trending-movies"
              checked={settings.showTrendingMovies}
              onCheckedChange={(checked) => handleToggleChange('showTrendingMovies', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="featured-content" className="text-base">
              Show Featured Content Section
            </Label>
            <Switch
              id="featured-content"
              checked={settings.showFeaturedContent}
              onCheckedChange={(checked) => handleToggleChange('showFeaturedContent', checked)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-4 text-gray-300">Content Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="latest-limit" className="text-sm">Latest Uploads Limit</Label>
              <input
                id="latest-limit"
                type="number"
                min="1"
                max="50"
                value={settings.latestUploadsLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, latestUploadsLimit: parseInt(e.target.value) || 12 }))}
                className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="trending-limit" className="text-sm">Trending Movies Limit</Label>
              <input
                id="trending-limit"
                type="number"
                min="1"
                max="50"
                value={settings.trendingLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, trendingLimit: parseInt(e.target.value) || 8 }))}
                className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="featured-limit" className="text-sm">Featured Content Limit</Label>
              <input
                id="featured-limit"
                type="number"
                min="1"
                max="50"
                value={settings.featuredLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, featuredLimit: parseInt(e.target.value) || 6 }))}
                className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContentToggleForm;
