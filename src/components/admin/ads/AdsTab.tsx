
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdvancedAdsForm from "./AdvancedAdsForm";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
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
      displayFrequency: ad.display_frequency,
      isActive: ad.is_active,
      startDate: ad.start_date || new Date().toISOString().split('T')[0],
      endDate: ad.end_date || '',
      targetCountries: ad.target_countries || ['Global'],
      targetDevices: ad.target_devices || ['All'],
      clickBased: ad.position === 'click_based',
      description: ad.description || ''
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
          is_active: adForm.isActive,
          start_date: adForm.startDate,
          end_date: adForm.endDate || null,
          target_countries: adForm.targetCountries,
          target_devices: adForm.targetDevices,
          description: adForm.description,
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
        position: "home_top",
        contentUrl: "",
        targetUrl: "",
        displayFrequency: 2,
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        targetCountries: ['Global'],
        targetDevices: ['All'],
        clickBased: false,
        description: ''
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

  // Toggle ad status
  const toggleAdStatus = async (ad: any) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !ad.is_active })
        .eq('ad_id', ad.ad_id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Ad campaign ${!ad.is_active ? "activated" : "deactivated"} successfully!`,
      });
      
      // Reload page to refresh data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Error toggling ad status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad status",
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
      <h2 className="text-xl font-bold mb-6">Advanced Ads Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Update Ad Campaign" : "Create New Ad Campaign"}
          </h3>
          
          <AdvancedAdsForm 
            adForm={adForm} 
            setAdForm={setAdForm} 
            onSubmit={isEditing ? handleUpdateAd : handleUploadAd}
            submitButtonText={isEditing ? "Update Campaign" : "Create Campaign"}
          />
          
          <div className="mt-6">
            <ImageUploader 
              currentImageUrl={adForm.contentUrl}
              onImageUrlChange={(url) => setAdForm({...adForm, contentUrl: url})}
              label="Ad Creative (Image/Banner)"
            />
          </div>
          
          {isEditing && (
            <div className="mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedAd(null);
                  setAdForm({
                    name: "",
                    adType: "banner",
                    position: "home_top",
                    contentUrl: "",
                    targetUrl: "",
                    displayFrequency: 2,
                    isActive: true,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    targetCountries: ['Global'],
                    targetDevices: ['All'],
                    clickBased: false,
                    description: ''
                  });
                }}
                className="w-full"
              >
                Cancel Edit
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Campaigns ({ads.length})</h3>
          
          {ads.length > 0 ? (
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {ads.map((ad) => (
                <div 
                  key={ad.ad_id}
                  className={`rounded-lg p-4 border transition-all ${
                    ad.is_active 
                      ? 'bg-gray-700 border-green-500/30' 
                      : 'bg-gray-700/50 border-red-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-white">{ad.ad_name}</h4>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleAdStatus(ad)}
                        className={`hover:bg-gray-600 ${
                          ad.is_active ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {ad.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAd(ad)}
                        className="hover:bg-gray-600 text-blue-400"
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
                  
                  <div className="flex items-center mb-3 flex-wrap gap-2">
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded capitalize">
                      {ad.ad_type.replace('_', ' ')}
                    </span>
                    <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                      {ad.position.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      Freq: {ad.display_frequency === 0 ? 'Click-based' : `${ad.display_frequency}x`}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      ad.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {ad.content_url && (
                    <div className="mb-3">
                      <div className="h-20 bg-gray-800 rounded overflow-hidden border border-gray-600">
                        <img 
                          src={ad.content_url}
                          alt={ad.ad_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {ad.description && (
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                      Target: {ad.target_countries?.[0] || 'Global'} | {ad.target_devices?.[0] || 'All'}
                    </span>
                    <span>
                      {ad.start_date} - {ad.end_date || 'Ongoing'}
                    </span>
                  </div>
                  
                  {ad.target_url && (
                    <div className="text-xs text-blue-400 truncate mt-1">
                      → {ad.target_url}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
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
