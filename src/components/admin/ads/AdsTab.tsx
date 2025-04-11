
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import AdsForm from "./AdsForm";
import AdsList from "./AdsList";
import AffiliateForm from "./AffiliateForm";

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
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Ads & Affiliate Management</h2>
        <Button>
          <Edit className="mr-2" size={16} />
          Manage Campaigns
        </Button>
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
            handleUploadAd={handleUploadAd} 
          />
          
          <AdsList ads={ads} />
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
