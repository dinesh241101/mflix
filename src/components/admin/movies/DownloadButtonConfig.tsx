
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface DownloadButton {
  id: string;
  name: string;
  type: 'free' | 'premium' | 'external';
  url?: string;
  color: string;
  order: number;
}

const DownloadButtonConfig = () => {
  const [buttons, setButtons] = useState<DownloadButton[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newButton, setNewButton] = useState({
    name: "",
    type: "free" as const,
    url: "",
    color: "#3b82f6"
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Default download buttons
  const defaultButtons: DownloadButton[] = [
    { id: '1', name: 'Download Free', type: 'free', color: '#10b981', order: 1 },
    { id: '2', name: 'High Quality Download', type: 'premium', color: '#f59e0b', order: 2 },
    { id: '3', name: 'Mirror 1', type: 'external', url: 'https://example.com', color: '#6366f1', order: 3 },
    { id: '4', name: 'Mirror 2', type: 'external', url: 'https://example2.com', color: '#8b5cf6', order: 4 },
    { id: '5', name: 'Torrent Download', type: 'external', url: 'magnet:', color: '#ef4444', order: 5 },
  ];

  useEffect(() => {
    loadButtons();
  }, []);

  const loadButtons = async () => {
    try {
      // For now, use default buttons since we don't have a buttons table
      // In a real implementation, this would fetch from database
      setButtons(defaultButtons);
    } catch (error) {
      console.error('Error loading buttons:', error);
      setButtons(defaultButtons);
    }
  };

  const handleAddButton = () => {
    if (!newButton.name.trim()) {
      toast({
        title: "Error",
        description: "Button name is required",
        variant: "destructive"
      });
      return;
    }

    const button: DownloadButton = {
      id: Date.now().toString(),
      name: newButton.name.trim(),
      type: newButton.type,
      url: newButton.url.trim() || undefined,
      color: newButton.color,
      order: buttons.length + 1
    };

    setButtons([...buttons, button]);
    setNewButton({ name: "", type: "free", url: "", color: "#3b82f6" });
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "Download button added successfully!",
    });
  };

  const handleDeleteButton = (id: string) => {
    setButtons(buttons.filter(b => b.id !== id));
    toast({
      title: "Success",
      description: "Download button deleted successfully!",
    });
  };

  const handleEditButton = (id: string, updates: Partial<DownloadButton>) => {
    setButtons(buttons.map(b => b.id === id ? { ...b, ...updates } : b));
    setEditingId(null);
    toast({
      title: "Success",
      description: "Download button updated successfully!",
    });
  };

  const moveButton = (id: string, direction: 'up' | 'down') => {
    const index = buttons.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === buttons.length - 1)) {
      return;
    }

    const newButtons = [...buttons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newButtons[index], newButtons[targetIndex]] = [newButtons[targetIndex], newButtons[index]];
    
    // Update order
    newButtons.forEach((button, idx) => {
      button.order = idx + 1;
    });

    setButtons(newButtons);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Download Button Configuration</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Button
        </Button>
      </div>

      {/* Add New Button Form */}
      {showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Download Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Button Name</label>
                <Input
                  value={newButton.name}
                  onChange={(e) => setNewButton({ ...newButton, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Download Free"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Button Type</label>
                <select
                  value={newButton.type}
                  onChange={(e) => setNewButton({ ...newButton, type: e.target.value as any })}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                >
                  <option value="free">Free Download</option>
                  <option value="premium">Premium Download</option>
                  <option value="external">External Link</option>
                </select>
              </div>
              {newButton.type === 'external' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                  <Input
                    value={newButton.url}
                    onChange={(e) => setNewButton({ ...newButton, url: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Button Color</label>
                <input
                  type="color"
                  value={newButton.color}
                  onChange={(e) => setNewButton({ ...newButton, color: e.target.value })}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddButton} className="bg-green-600 hover:bg-green-700">
                <Save size={16} className="mr-2" />
                Add Button
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-gray-600"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Buttons List */}
      <div className="grid gap-4">
        {buttons.sort((a, b) => a.order - b.order).map((button) => (
          <Card key={button.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveButton(button.id, 'up')}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveButton(button.id, 'down')}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                  
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: button.color }}
                  />
                  
                  <div>
                    <div className="font-medium text-white">{button.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {button.type}
                      </Badge>
                      {button.url && (
                        <span className="text-xs text-gray-400">
                          {button.url.substring(0, 30)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(button.id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteButton(button.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {buttons.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No download buttons configured.</p>
          <p className="text-sm">Add some buttons to customize the download experience.</p>
        </div>
      )}
    </div>
  );
};

export default DownloadButtonConfig;
