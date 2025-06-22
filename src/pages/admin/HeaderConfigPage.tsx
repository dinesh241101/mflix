
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeaderConfigPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [headerConfig, setHeaderConfig] = useState({
    topButtons: [
      { name: "BOLLYWOOD MOVIES", path: "/movies?category=bollywood", color: "green" },
      { name: "DUAL AUDIO CONTENT", path: "/movies?audio=dual", color: "red" },
      { name: "HOLLYWOOD MOVIES", path: "/movies?category=hollywood", color: "orange" },
      { name: "JOIN OUR TELEGRAM", path: "#", color: "blue" }
    ],
    categoryTags: [
      "Dual Audio [Hindi] 720p",
      "Hollywood Movies 1080p",
      "Telugu",
      "Action",
      "Adventure",
      "Animation"
    ]
  });
  const [newButton, setNewButton] = useState({ name: "", path: "", color: "blue" });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authLoading && (!user || !isAdmin)) {
          navigate("/admin/login");
          return;
        }

        setAdminEmail(user?.email || "admin@example.com");
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const addNewButton = () => {
    if (!newButton.name || !newButton.path) {
      toast({
        title: "Error",
        description: "Please fill in button name and path",
        variant: "destructive"
      });
      return;
    }

    setHeaderConfig({
      ...headerConfig,
      topButtons: [...headerConfig.topButtons, newButton]
    });
    setNewButton({ name: "", path: "", color: "blue" });
    
    toast({
      title: "Success",
      description: "Button added successfully",
    });
  };

  const removeButton = (index: number) => {
    const updatedButtons = headerConfig.topButtons.filter((_, i) => i !== index);
    setHeaderConfig({
      ...headerConfig,
      topButtons: updatedButtons
    });
    
    toast({
      title: "Success",
      description: "Button removed successfully",
    });
  };

  const addNewTag = () => {
    if (!newTag.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tag name",
        variant: "destructive"
      });
      return;
    }

    setHeaderConfig({
      ...headerConfig,
      categoryTags: [...headerConfig.categoryTags, newTag.trim()]
    });
    setNewTag("");
    
    toast({
      title: "Success",
      description: "Tag added successfully",
    });
  };

  const removeTag = (index: number) => {
    const updatedTags = headerConfig.categoryTags.filter((_, i) => i !== index);
    setHeaderConfig({
      ...headerConfig,
      categoryTags: updatedTags
    });
    
    toast({
      title: "Success",
      description: "Tag removed successfully",
    });
  };

  const saveConfiguration = () => {
    // In a real implementation, you would save this to the database
    localStorage.setItem('headerConfig', JSON.stringify(headerConfig));
    
    toast({
      title: "Success",
      description: "Header configuration saved successfully",
    });
  };

  if (loading || authLoading) {
    return <LoadingScreen message="Loading Header Configuration" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Header Configuration</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Buttons Configuration */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Header Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {headerConfig.topButtons.map((button, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <span className="font-medium text-white">{button.name}</span>
                    <p className="text-sm text-gray-400">{button.path}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeButton(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="space-y-3 pt-4 border-t border-gray-600">
                <h4 className="font-medium text-white">Add New Button</h4>
                <div>
                  <Label htmlFor="buttonName">Button Name</Label>
                  <Input
                    id="buttonName"
                    value={newButton.name}
                    onChange={(e) => setNewButton({...newButton, name: e.target.value})}
                    placeholder="e.g., BOLLYWOOD MOVIES"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonPath">Button Path</Label>
                  <Input
                    id="buttonPath"
                    value={newButton.path}
                    onChange={(e) => setNewButton({...newButton, path: e.target.value})}
                    placeholder="e.g., /movies?category=bollywood"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonColor">Button Color</Label>
                  <select
                    id="buttonColor"
                    value={newButton.color}
                    onChange={(e) => setNewButton({...newButton, color: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <Button onClick={addNewButton} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add Button
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category Tags Configuration */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Category Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {headerConfig.categoryTags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-white">{tag}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTag(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="space-y-3 pt-4 border-t border-gray-600">
                <h4 className="font-medium text-white">Add New Tag</h4>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., Malayalam Movies"
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                  />
                  <Button onClick={addNewTag}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={saveConfiguration} className="bg-green-600 hover:bg-green-700">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderConfigPage;
