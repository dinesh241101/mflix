
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";

interface AdsTabProps {
  ads?: any[];
  adForm?: any;
  setAdForm?: (form: any) => void;
  handleUploadAd?: (e: React.FormEvent) => void;
}

const AdsTab = (props: AdsTabProps = {}) => {
  const [ads, setAds] = useState(props.ads || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

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
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to load ads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ads Management</h2>
        <Button>
          <PlusCircle className="mr-2" size={16} />
          Add Ad
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Active Ads ({ads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400">Loading ads...</p>
          ) : ads.length === 0 ? (
            <p className="text-gray-400">No ads found</p>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.ad_id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium">{ad.ad_name}</h3>
                  <p className="text-gray-400 text-sm">{ad.ad_type} • {ad.position}</p>
                  <p className="text-gray-300 text-sm mt-1">{ad.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsTab;
