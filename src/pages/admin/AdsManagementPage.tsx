
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import AdsTab from "@/components/admin/ads/AdsTab";
import { BanknoteIcon, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const AdsManagementPage = () => {
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem("adminEmail") || "admin@example.com");
  const [activeTabValue, setActiveTabValue] = useState("ads");
  
  // Ad form state
  const [adForm, setAdForm] = useState({
    name: "",
    adType: "banner",
    position: "home",
    contentUrl: "",
    targetUrl: "",
    displayFrequency: 2
  });
  
  // Mock ads data
  const [ads, setAds] = useState([
    {
      id: "1",
      name: "Premium Streaming Banner",
      ad_type: "banner",
      position: "home",
      content_url: "https://via.placeholder.com/800x200?text=Movie+Streaming+Service",
      target_url: "https://example.com/premium",
      display_frequency: 2,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "New Releases Sidebar",
      ad_type: "sidebar",
      position: "movie-detail",
      content_url: "https://via.placeholder.com/300x600?text=New+Release",
      target_url: "https://example.com/new-releases",
      display_frequency: 3,
      is_active: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/admin/login";
  };
  
  // Handle upload ad
  const handleUploadAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would save to a database
      const newAd = {
        id: crypto.randomUUID(),
        name: adForm.name,
        ad_type: adForm.adType,
        position: adForm.position,
        content_url: adForm.contentUrl,
        target_url: adForm.targetUrl,
        display_frequency: adForm.displayFrequency,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      setAds([newAd, ...ads]);
      
      toast({
        title: "Success",
        description: "Ad campaign created successfully!",
      });
      
      // Reset form
      setAdForm({
        name: "",
        adType: "banner",
        position: "home",
        contentUrl: "",
        targetUrl: "",
        displayFrequency: 2
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ad campaign",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTabValue} onValueChange={setActiveTabValue}>
          <AdminNavTabs activeTab="ads" />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ad Management</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <BanknoteIcon className="mr-2" size={16} />
                Ad Statistics
              </Button>
              <Button className="flex items-center">
                <CreditCard className="mr-2" size={16} />
                Create Campaign
              </Button>
            </div>
          </div>

          <TabsContent value="ads" className="mt-6">
            <AdsTab 
              ads={ads}
              adForm={adForm}
              setAdForm={setAdForm}
              handleUploadAd={handleUploadAd}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdsManagementPage;
