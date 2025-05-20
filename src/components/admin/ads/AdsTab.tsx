import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdsForm from "./AdsForm";
import { Edit, Trash2 } from "lucide-react";
import ImageUploader from "../../admin/movies/ImageUploader";

interface AdsTabProps {
  ads: any[];
  adForm: any;
  setAdForm: (form: any) => void;
  handleUploadAd: (e: React.FormEvent) => void;
}

const AdsTab = ({
  ads,
  adForm,
  setAdForm,
  handleUploadAd
}: AdsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit ad
  const handleEditAd = (ad: any) => {
    setAdForm({
      name: ad.ad_name,
      adType: ad.ad_type,
      position: ad.position,
      contentUrl: ad.content_url,
      targetUrl: ad.target_url,
      displayFrequency: ad.display_frequency
    });
    setSelectedAd(ad);
    setIsEditing(true);
  };

  // Handle update ad
  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAd) return;
    
    try {
      const { error } = await supabase
        .from('ads')
        .update({
          ad_name: adForm.name,
          ad_type: adForm.adType,
          position: adForm.position,
          content_url: adForm.contentUrl,
          target_url: adForm.targetUrl,
          display_frequency: parseInt(adForm.displayFrequency.toString()),
          updated_at: new Date().toISOString()
        })
        .eq('ad_id', selectedAd.ad_id);
      
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
      setSelectedAd(null);
      setIsEditing(false);
      
      // Reload page to refresh data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Error updating ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad campaign",
        variant: "destructive"
      });
    }
  };

  // Handle delete ad
  const handleDeleteAd = async () => {
    if (!selectedAd) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('ad_id', selectedAd.ad_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad campaign deleted successfully!",
      });
      
      // Reset state
      setSelectedAd(null);
      setShowDeleteDialog(false);
      
      // Reload page to refresh data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Error deleting ad:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete ad campaign",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Ads Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Update Ad Campaign" : "Create New Ad Campaign"}
          </h3>
          
          <form onSubmit={isEditing ? handleUpdateAd : handleUploadAd}>
            <AdsForm 
              adForm={adForm} 
              setAdForm={setAdForm} 
              onSubmit={isEditing ? handleUpdateAd : handleUploadAd}
            />
            
            <div className="mt-6">
              <ImageUploader 
                currentImageUrl={adForm.contentUrl}
                onImageUrlChange={(url) => setAdForm({...adForm, contentUrl: url})}
                label="Ad Image/Banner"
              />
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Update Ad" : "Create Ad"}
              </Button>
              
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedAd(null);
                    setAdForm({
                      name: "",
                      adType: "banner",
                      position: "home",
                      contentUrl: "",
                      targetUrl: "",
                      displayFrequency: 2
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
          
          {ads.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {ads.map((ad) => (
                <div 
                  key={ad.ad_id}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{ad.ad_name}</h4>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAd(ad)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          setSelectedAd(ad);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded capitalize">{ad.ad_type}</span>
                    <span className="ml-2 bg-gray-600 text-xs px-2 py-1 rounded">Position: {ad.position}</span>
                    <span className="ml-2 text-xs text-gray-400">Display Freq: {ad.display_frequency}</span>
                  </div>
                  
                  {ad.content_url && (
                    <div className="mb-2">
                      <div className="h-16 bg-gray-800 rounded overflow-hidden">
                        <img 
                          src={ad.content_url}
                          alt={ad.ad_name}
                          className="h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {ad.target_url && (
                    <div className="text-xs text-blue-400 truncate">
                      Target URL: {ad.target_url}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(ad.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400">No ad campaigns found.</p>
              <p className="text-sm text-gray-500 mt-2">Create your first campaign using the form.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete the ad campaign "{selectedAd?.ad_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAd}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdsTab;
