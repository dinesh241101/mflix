import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Edit3 } from "lucide-react";

interface RedirectLink {
  id: string;
  position: string;
  redirect_url: string;
  is_active: boolean;
  display_order: number;
}

const RedirectLoopTab = () => {
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingLink, setEditingLink] = useState<RedirectLink | null>(null);
  const [newLink, setNewLink] = useState({
    position: '',
    redirect_url: '',
    is_active: true,
    display_order: 1
  });

  const positions = [
    { value: 'download_cta_1', label: 'Download CTA-1' },
    { value: 'download_cta_2', label: 'Download CTA-2' },
    { value: 'download_cta_3', label: 'Download CTA-3' },
    { value: 'page_switch', label: 'Page Switch' },
    { value: 'same_page_click', label: 'Same Page Click' }
  ];

  useEffect(() => {
    fetchRedirectLinks();
  }, []);

  const fetchRedirectLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('redirect_links')
        .select('*')
        .order('position', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error('Error fetching redirect links:', error);
      toast({
        title: "Error",
        description: "Failed to load redirect links",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.position || !newLink.redirect_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if we already have 10 links for this position
    const positionLinks = links.filter(link => link.position === newLink.position);
    if (positionLinks.length >= 10) {
      toast({
        title: "Error",
        description: "Maximum 10 links allowed per position",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('redirect_links')
        .insert([newLink]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirect link added successfully"
      });

      setNewLink({
        position: '',
        redirect_url: '',
        is_active: true,
        display_order: 1
      });

      fetchRedirectLinks();
    } catch (error: any) {
      console.error('Error adding redirect link:', error);
      toast({
        title: "Error",
        description: "Failed to add redirect link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = async (link: RedirectLink) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('redirect_links')
        .update({
          redirect_url: link.redirect_url,
          is_active: link.is_active,
          display_order: link.display_order
        })
        .eq('id', link.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirect link updated successfully"
      });

      setEditingLink(null);
      fetchRedirectLinks();
    } catch (error: any) {
      console.error('Error updating redirect link:', error);
      toast({
        title: "Error",
        description: "Failed to update redirect link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('redirect_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirect link deleted successfully"
      });

      fetchRedirectLinks();
    } catch (error: any) {
      console.error('Error deleting redirect link:', error);
      toast({
        title: "Error",
        description: "Failed to delete redirect link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLinkStatus = async (link: RedirectLink) => {
    await handleUpdateLink({ ...link, is_active: !link.is_active });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Redirect Loop Management</h2>
      </div>

      {/* Add New Link Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Redirect Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="position" className="text-white">Position</Label>
              <Select
                value={newLink.position}
                onValueChange={(value) => setNewLink({ ...newLink, position: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="redirect_url" className="text-white">Redirect URL</Label>
              <Input
                id="redirect_url"
                value={newLink.redirect_url}
                onChange={(e) => setNewLink({ ...newLink, redirect_url: e.target.value })}
                placeholder="https://example.com/redirect"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="display_order" className="text-white">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                min="1"
                max="10"
                value={newLink.display_order}
                onChange={(e) => setNewLink({ ...newLink, display_order: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddLink}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Links */}
      <div className="space-y-4">
        {positions.map((position) => {
          const positionLinks = links.filter(link => link.position === position.value);
          
          return (
            <Card key={position.value} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  {position.label}
                  <span className="text-sm text-gray-400">
                    {positionLinks.length}/10 links
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {positionLinks.length === 0 ? (
                  <p className="text-gray-400">No redirect links configured for this position</p>
                ) : (
                  <div className="space-y-3">
                    {positionLinks.map((link) => (
                      <div key={link.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                        {editingLink?.id === link.id ? (
                          <>
                            <Input
                              value={editingLink.redirect_url}
                              onChange={(e) => setEditingLink({ ...editingLink, redirect_url: e.target.value })}
                              className="flex-1 bg-gray-600 border-gray-500 text-white"
                            />
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={editingLink.display_order}
                              onChange={(e) => setEditingLink({ ...editingLink, display_order: parseInt(e.target.value) })}
                              className="w-20 bg-gray-600 border-gray-500 text-white"
                            />
                            <Switch
                              checked={editingLink.is_active}
                              onCheckedChange={(checked) => setEditingLink({ ...editingLink, is_active: checked })}
                            />
                            <Button
                              onClick={() => handleUpdateLink(editingLink)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingLink(null)}
                              size="sm"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="text-white text-sm">{link.redirect_url}</p>
                              <p className="text-gray-400 text-xs">Order: {link.display_order}</p>
                            </div>
                            <Switch
                              checked={link.is_active}
                              onCheckedChange={() => toggleLinkStatus(link)}
                            />
                            <Button
                              onClick={() => setEditingLink(link)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              onClick={() => handleDeleteLink(link.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RedirectLoopTab;
