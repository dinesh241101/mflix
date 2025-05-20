
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import AdsTab from "@/components/admin/ads/AdsTab";
import AnalyticsDashboard from "@/components/admin/ads/AnalyticsDashboard";
import AffiliateLinksManager from "@/components/admin/ads/AffiliateLinksManager";
import LoadingScreen from "@/components/LoadingScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdsManagementPage = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ads");
  
  // Ad form state
  const [adForm, setAdForm] = useState({
    name: "",
    adType: "banner",
    position: "home",
    contentUrl: "",
    targetUrl: "",
    displayFrequency: 2
  });
  
  // Affiliate form state
  const [affiliateForm, setAffiliateForm] = useState({
    name: "",
    url: "",
    commission: "5",
    category: "general"
  });
  
  // Analytics date range
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const email = localStorage.getItem("adminEmail");
        
        if (!token) {
          navigate("/admin/login");
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Session expired");
        }
        
        // Check if user is admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (adminError || !isAdmin) {
          throw new Error("Not authorized as admin");
        }
        
        setAdminEmail(email || user.email || "admin@example.com");
        
        // Load ads data
        fetchAds();
        
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch ads data
  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      console.error("Error fetching ads:", error);
      toast({
        title: "Error",
        description: "Failed to load ads data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };
  
  // Handle upload ad
  const handleUploadAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const adData = {
        ad_name: adForm.name,
        ad_type: adForm.adType,
        position: adForm.position,
        content_url: adForm.contentUrl,
        target_url: adForm.targetUrl,
        display_frequency: parseInt(adForm.displayFrequency.toString())
      };
      
      const { error } = await supabase
        .from('ads')
        .insert(adData);
      
      if (error) throw error;
      
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
      
      // Reload ad data
      fetchAds();
      
    } catch (error: any) {
      console.error("Error creating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad campaign",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add affiliate
  const handleAddAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // In a real app, this would insert into an affiliates table
      
      toast({
        title: "Success",
        description: "Affiliate link added successfully!",
      });
      
      // Reset form
      setAffiliateForm({
        name: "",
        url: "",
        commission: "5",
        category: "general"
      });
      
    } catch (error: any) {
      console.error("Error adding affiliate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add affiliate link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && ads.length === 0) {
    return <LoadingScreen message="Loading Ads Management" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Ads Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="ads">Ad Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Ad Analytics</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliate Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ads">
            <AdsTab 
              ads={ads}
              adForm={adForm}
              setAdForm={setAdForm}
              handleUploadAd={handleUploadAd}
            />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard 
              dateRange={dateRange}
              setDateRange={setDateRange}
              ads={ads}
            />
          </TabsContent>
          
          <TabsContent value="affiliates">
            <AffiliateLinksManager 
              affiliateForm={affiliateForm}
              setAffiliateForm={setAffiliateForm}
              handleAddAffiliate={handleAddAffiliate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdsManagementPage;
