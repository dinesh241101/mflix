
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ad {
  id: string;
  ad_id?: string;
  name: string;
  ad_name?: string;
  ad_type: string;
  position: string;
  is_active: boolean;
  display_frequency: number;
}

interface AdsListProps {
  ads: Ad[];
  onEditAd: (ad: Ad) => void;
  onRefreshList: () => void;
}

const AdsList = ({ ads, onEditAd, onRefreshList }: AdsListProps) => {
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Simplified delete operation to avoid type instantiation issues
      const deleteResult = await supabase
        .from('ads')
        .delete()
        .eq('id', adToDelete);
      
      if (deleteResult.error) throw deleteResult.error;
      
      toast({
        title: "Success",
        description: "Ad campaign deleted successfully!",
      });
      
      // Close dialog and refresh list
      setAdToDelete(null);
      onRefreshList();
      
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

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Simplified update operation
      const updateResult = await supabase
        .from('ads')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (updateResult.error) throw updateResult.error;
      
      toast({
        title: "Success",
        description: `Ad campaign ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      });
      
      onRefreshList();
    } catch (error: any) {
      console.error("Error updating ad status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad status",
        variant: "destructive"
      });
    }
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg mt-6">
        <p className="text-gray-400">No ad campaigns found.</p>
      </div>
    );
  }

  return (
    <>
      <Table className="bg-gray-800 rounded-lg mt-6">
        <TableCaption>List of all ad campaigns</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => (
            <TableRow key={ad.id || ad.ad_id}>
              <TableCell className="font-medium">{ad.name || ad.ad_name}</TableCell>
              <TableCell>{ad.ad_type}</TableCell>
              <TableCell>{ad.position}</TableCell>
              <TableCell>
                <Badge 
                  className={ad.is_active ? "bg-green-500" : "bg-red-500"} 
                  onClick={() => toggleAdStatus(ad.id || ad.ad_id || "", ad.is_active)}
                >
                  {ad.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{ad.display_frequency}x</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEditAd(ad)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAdToDelete(ad.id || ad.ad_id || "")}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this ad campaign? This action cannot be undone.
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
    </>
  );
};

export default AdsList;
