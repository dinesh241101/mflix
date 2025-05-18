
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import AdsForm from "./AdsForm";
import AdsList from "./AdsList";
import AffiliateForm from "./AffiliateForm";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdsTabProps {
  ads: any[];
  adForm: {
    name: string;
    adType: string;
    position: string;
    contentUrl: string;
    targetUrl: string;
    displayFrequency: number;
  };
  setAdForm: (form: any) => void;
  handleUploadAd: (e: React.FormEvent) => void;
}

const AdsTab = ({ ads, adForm, setAdForm, handleUploadAd }: AdsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditAd = (ad: any) => {
    setAdForm({
      name: ad.name || "",
      adType: ad.ad_type || "banner",
      position: ad.position || "home",
      contentUrl: ad.content_url || "",
      targetUrl: ad.target_url || "",
      displayFrequency: ad.display_frequency || 2
    });
    setSelectedAdId(ad.id);
    setIsEditing(true);
  };

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdId) return;
    
    try {
      const adData = {
        name: adForm.name,
        ad_type: adForm.adType,
        position: adForm.position,
        content_url: adForm.contentUrl,
        target_url: adForm.targetUrl,
        display_frequency: parseInt(adForm.displayFrequency.toString())
      };
      
      const { error } = await supabase
        .from('ads')
        .update(adData)
        .eq('id', selectedAdId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad campaign updated successfully!",
      });
      
      // Reset form and state
      setAdForm({
        name: "",
        adType: "banner",
        position: "home",
        contentUrl: "",
        targetUrl: "",
        displayFrequency: 2
      });
      setIsEditing(false);
      setSelectedAdId(null);
      
      // Refresh ad list
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error: any) {
      console.error("Error updating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad campaign",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setAdForm({
      name: "",
      adType: "banner",
      position: "home",
      contentUrl: "",
      targetUrl: "",
      displayFrequency: 2
    });
    setIsEditing(false);
    setSelectedAdId(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Ads & Affiliate Management</h2>
        {!isEditing ? (
          <Button>
            <Edit className="mr-2" size={16} />
            Manage Campaigns
          </Button>
        ) : (
          <Button onClick={handleCancelEdit} variant="outline">
            Cancel Editing
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="ads">
        <TabsList className="mb-4">
          <TabsTrigger value="ads">Banner Ads</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliate Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ads">
          <AdsForm 
            adForm={adForm} 
            setAdForm={setAdForm} 
            onSubmit={isEditing ? handleUpdateAd : handleUploadAd}
            submitButtonText={isEditing ? "Update Ad Campaign" : "Create Ad Campaign"}
          />
          
          <AdsList 
            ads={ads} 
            onEditAd={handleEditAd}
            onRefreshList={() => setRefreshTrigger(prev => prev + 1)}
          />
        </TabsContent>
        
        <TabsContent value="affiliates">
          <AffiliateForm />
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Active Affiliate Links</h3>
            <p className="text-gray-400">No affiliate links added yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdsTab;
