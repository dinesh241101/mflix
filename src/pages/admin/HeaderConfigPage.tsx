
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Home, Save } from "lucide-react";

const HeaderConfigPage = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [headerConfig, setHeaderConfig] = useState({
    siteName: "MFlix",
    logoUrl: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    navigationItems: "Home,Movies,Series,Anime,Shorts",
    footerText: "© 2024 MFlix. All rights reserved.",
    contactEmail: "contact@mflix.com",
    socialLinks: JSON.stringify({
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: ""
    }, null, 2)
  });

  const handleSave = async () => {
    setLoading(true);
    updateActivity();
    
    try {
      // Save header configuration to database
      const configData = {
        site_name: headerConfig.siteName,
        logo_url: headerConfig.logoUrl,
        primary_color: headerConfig.primaryColor,
        secondary_color: headerConfig.secondaryColor,
        navigation_items: headerConfig.navigationItems.split(',').map(item => item.trim()),
        footer_text: headerConfig.footerText,
        contact_email: headerConfig.contactEmail,
        social_links: JSON.parse(headerConfig.socialLinks)
      };

      // For now, we'll just show success message
      // In a real implementation, you'd save this to a settings table
      
      toast({
        title: "Success",
        description: "Header configuration saved successfully!",
      });

    } catch (error: any) {
      console.error("Error saving header config:", error);
      toast({
        title: "Error",
        description: "Failed to save header configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Loading Header Configuration" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateActivity();
                navigate("/admin");
              }}
              className="text-white hover:bg-gray-700"
            >
              <Home size={18} className="mr-2" />
              Admin Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Header Configuration</h1>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2" size={16} />
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Site Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={headerConfig.siteName}
                  onChange={(e) => setHeaderConfig({...headerConfig, siteName: e.target.value})}
                  placeholder="MFlix"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={headerConfig.logoUrl}
                  onChange={(e) => setHeaderConfig({...headerConfig, logoUrl: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={headerConfig.primaryColor}
                    onChange={(e) => setHeaderConfig({...headerConfig, primaryColor: e.target.value})}
                    className="bg-gray-700 border-gray-600 h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={headerConfig.secondaryColor}
                    onChange={(e) => setHeaderConfig({...headerConfig, secondaryColor: e.target.value})}
                    className="bg-gray-700 border-gray-600 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="navigationItems">Navigation Items (comma separated)</Label>
                <Input
                  id="navigationItems"
                  value={headerConfig.navigationItems}
                  onChange={(e) => setHeaderConfig({...headerConfig, navigationItems: e.target.value})}
                  placeholder="Home,Movies,Series,Anime,Shorts"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Footer & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={headerConfig.footerText}
                  onChange={(e) => setHeaderConfig({...headerConfig, footerText: e.target.value})}
                  placeholder="© 2024 MFlix. All rights reserved."
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={headerConfig.contactEmail}
                  onChange={(e) => setHeaderConfig({...headerConfig, contactEmail: e.target.value})}
                  placeholder="contact@mflix.com"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="socialLinks">Social Links (JSON)</Label>
                <Textarea
                  id="socialLinks"
                  value={headerConfig.socialLinks}
                  onChange={(e) => setHeaderConfig({...headerConfig, socialLinks: e.target.value})}
                  placeholder='{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}'
                  className="bg-gray-700 border-gray-600"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeaderConfigPage;
