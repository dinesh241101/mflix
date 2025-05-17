
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import AdsTab from "@/components/admin/ads/AdsTab";
import { BanknoteIcon, CreditCard, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AnalyticsDashboard from "@/components/admin/ads/AnalyticsDashboard";
import AffiliateLinksManager from "@/components/admin/ads/AffiliateLinksManager";
import { AdAnalytics, AffiliateLink } from "@/models/adModels";

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
    displayFrequency: 2,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    targetCountries: [],
    targetDevices: []
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
      created_at: new Date().toISOString(),
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in future
      target_countries: ["US", "CA", "UK"],
      target_devices: ["desktop", "mobile"]
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
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      end_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days in future
      target_countries: ["US", "UK", "AU"],
      target_devices: ["mobile"]
    }
  ]);
  
  // Mock analytics data
  const [adAnalytics, setAdAnalytics] = useState<AdAnalytics[]>([
    {
      id: "1",
      adId: "1",
      adName: "Premium Streaming Banner",
      impressions: 15245,
      clicks: 742,
      conversions: 98,
      revenue: 982.50,
      ctr: (742 / 15245) * 100,
      cpm: (982.50 / 15245) * 1000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      adType: "banner",
      position: "home",
      country: "US"
    },
    {
      id: "2",
      adId: "2",
      adName: "New Releases Sidebar",
      impressions: 8756,
      clicks: 514,
      conversions: 42,
      revenue: 378.00,
      ctr: (514 / 8756) * 100,
      cpm: (378.00 / 8756) * 1000,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      adType: "sidebar",
      position: "movie-detail",
      country: "UK"
    },
    {
      id: "3",
      adId: "3",
      adName: "Movie Downloads Button",
      impressions: 23540,
      clicks: 1892,
      conversions: 205,
      revenue: 1845.00,
      ctr: (1892 / 23540) * 100,
      cpm: (1845.00 / 23540) * 1000,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: null,
      adType: "button",
      position: "download-page",
      country: "CA"
    },
    {
      id: "4",
      adId: "4",
      adName: "Featured Content Promotion",
      impressions: 32651,
      clicks: 2145,
      conversions: 187,
      revenue: 1496.00,
      ctr: (2145 / 32651) * 100,
      cpm: (1496.00 / 32651) * 1000,
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      adType: "native",
      position: "home",
      country: "US"
    },
    {
      id: "5",
      adId: "5",
      adName: "Pre-roll Video Ad",
      impressions: 6823,
      clicks: 341,
      conversions: 29,
      revenue: 580.00,
      ctr: (341 / 6823) * 100,
      cpm: (580.00 / 6823) * 1000,
      startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      adType: "video",
      position: "video-player",
      country: "AU"
    }
  ]);
  
  // Mock affiliate links data
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: "1",
      name: "Premium Subscription",
      originalUrl: "https://streamingservice.com/subscribe?ref=affiliate123",
      shortCode: "premium",
      trackingParams: {
        utm_source: "website",
        utm_medium: "affiliate",
        utm_campaign: "premium-promo"
      },
      program: "Streaming Partner Program",
      commission: 15,
      clicks: 2543,
      conversions: 178,
      revenue: 2670.00,
      conversionRate: (178 / 2543) * 100,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      name: "Movie Merchandise",
      originalUrl: "https://moviestore.com/merch?aff=site001",
      shortCode: "merch",
      trackingParams: {
        utm_source: "website",
        utm_medium: "affiliate",
        utm_campaign: "merch-summer"
      },
      program: "Movie Store",
      commission: 12.5,
      clicks: 1872,
      conversions: 94,
      revenue: 1175.00,
      conversionRate: (94 / 1872) * 100,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
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
        start_date: adForm.startDate,
        end_date: adForm.endDate || null,
        target_countries: adForm.targetCountries,
        target_devices: adForm.targetDevices,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      setAds([newAd, ...ads]);
      
      // Create a new analytics entry for this ad
      const newAnalytics: AdAnalytics = {
        id: crypto.randomUUID(),
        adId: newAd.id,
        adName: newAd.name,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        cpm: 0,
        startDate: newAd.start_date,
        endDate: newAd.end_date,
        adType: newAd.ad_type,
        position: newAd.position
      };
      
      setAdAnalytics([...adAnalytics, newAnalytics]);
      
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
        displayFrequency: 2,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        targetCountries: [],
        targetDevices: []
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ad campaign",
        variant: "destructive"
      });
    }
  };
  
  // Handle adding a new affiliate link
  const handleAddAffiliateLink = (link: any) => {
    const newLink: AffiliateLink = {
      id: crypto.randomUUID(),
      name: link.name,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      trackingParams: link.trackingParams,
      program: link.program,
      commission: link.commission,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString()
    };
    
    setAffiliateLinks([newLink, ...affiliateLinks]);
  };
  
  // Handle deleting an affiliate link
  const handleDeleteAffiliateLink = (id: string) => {
    setAffiliateLinks(affiliateLinks.filter(link => link.id !== id));
    
    toast({
      title: "Success",
      description: "Affiliate link deleted successfully!",
    });
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
              <Button variant="outline" className="flex items-center" onClick={() => setActiveTabValue("analytics")}>
                <BarChart3 className="mr-2" size={16} />
                Ad Analytics
              </Button>
              <Button variant="outline" className="flex items-center" onClick={() => setActiveTabValue("targeting")}>
                <Target className="mr-2" size={16} />
                Targeting
              </Button>
              <Button className="flex items-center" onClick={() => setActiveTabValue("ads")}>
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
          
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard adAnalytics={adAnalytics} />
          </TabsContent>
          
          <TabsContent value="affiliates" className="mt-6">
            <AffiliateLinksManager 
              affiliateLinks={affiliateLinks}
              onAddLink={handleAddAffiliateLink}
              onDeleteLink={handleDeleteAffiliateLink}
            />
          </TabsContent>
          
          <TabsContent value="targeting" className="mt-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6">Ad Targeting</h2>
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Advanced targeting features coming soon!</p>
                <p className="text-sm text-gray-500">
                  This feature will allow you to target ads based on user demographics, behavior,
                  location, device type, and more.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdsManagementPage;
