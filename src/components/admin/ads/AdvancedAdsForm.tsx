
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AdvancedAdsFormProps {
  adForm: any;
  setAdForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

const AdvancedAdsForm = ({
  adForm,
  setAdForm,
  onSubmit,
  submitButtonText = "Create Campaign"
}: AdvancedAdsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="adName">Campaign Name *</Label>
        <Input
          id="adName"
          value={adForm.name || ""}
          onChange={(e) => setAdForm({...adForm, name: e.target.value})}
          placeholder="Enter campaign name"
          required
        />
      </div>

      <div>
        <Label htmlFor="adType">Ad Type *</Label>
        <Select 
          value={adForm.adType || "banner"} 
          onValueChange={(value) => setAdForm({...adForm, adType: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ad type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="popup">Popup</SelectItem>
            <SelectItem value="sidebar">Sidebar</SelectItem>
            <SelectItem value="floating">Floating</SelectItem>
            <SelectItem value="sticky">Sticky</SelectItem>
            <SelectItem value="native">Native</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="position">Position *</Label>
        <Select 
          value={adForm.position || "home_top"} 
          onValueChange={(value) => setAdForm({...adForm, position: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home_top">Home Top</SelectItem>
            <SelectItem value="home_middle">Home Middle</SelectItem>
            <SelectItem value="home_bottom">Home Bottom</SelectItem>
            <SelectItem value="sidebar">Sidebar</SelectItem>
            <SelectItem value="footer">Footer</SelectItem>
            <SelectItem value="header-banner">Header Banner</SelectItem>
            <SelectItem value="content-top">Content Top</SelectItem>
            <SelectItem value="content-middle">Content Middle</SelectItem>
            <SelectItem value="content-bottom">Content Bottom</SelectItem>
            <SelectItem value="floating">Floating</SelectItem>
            <SelectItem value="mobile-sticky">Mobile Sticky</SelectItem>
            <SelectItem value="click_based">Click Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input
          id="targetUrl"
          value={adForm.targetUrl || ""}
          onChange={(e) => setAdForm({...adForm, targetUrl: e.target.value})}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <div>
        <Label htmlFor="displayFrequency">Display Frequency</Label>
        <Input
          id="displayFrequency"
          type="number"
          min="0"
          value={adForm.displayFrequency || 2}
          onChange={(e) => setAdForm({...adForm, displayFrequency: parseInt(e.target.value)})}
          placeholder="2"
        />
        <p className="text-sm text-gray-400 mt-1">
          Show ad every X page views (0 = click-based)
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={adForm.description || ""}
          onChange={(e) => setAdForm({...adForm, description: e.target.value})}
          placeholder="Ad description..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={adForm.isActive !== undefined ? adForm.isActive : true}
          onCheckedChange={(checked) => setAdForm({...adForm, isActive: checked})}
        />
        <Label htmlFor="isActive">Active Campaign</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={adForm.startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setAdForm({...adForm, startDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={adForm.endDate || ""}
            onChange={(e) => setAdForm({...adForm, endDate: e.target.value})}
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {submitButtonText}
      </Button>
    </form>
  );
};

export default AdvancedAdsForm;
