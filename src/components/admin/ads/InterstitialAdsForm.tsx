
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface InterstitialAdsFormProps {
  adForm: any;
  setAdForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

const InterstitialAdsForm = ({
  adForm,
  setAdForm,
  onSubmit,
  submitButtonText = "Create Interstitial Ad"
}: InterstitialAdsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="adName">Ad Name *</Label>
        <Input
          id="adName"
          value={adForm.ad_name || ""}
          onChange={(e) => setAdForm({...adForm, ad_name: e.target.value})}
          placeholder="Enter ad name"
          required
        />
      </div>

      <div>
        <Label htmlFor="triggerEvent">Trigger Event *</Label>
        <Select 
          value={adForm.trigger_event || "download_click"} 
          onValueChange={(value) => setAdForm({...adForm, trigger_event: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trigger event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="download_click">Download Click</SelectItem>
            <SelectItem value="page_navigation">Page Navigation</SelectItem>
            <SelectItem value="time_based">Time Based</SelectItem>
            <SelectItem value="click_based">Click Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="adContentUrl">Ad Content URL</Label>
        <Input
          id="adContentUrl"
          value={adForm.ad_content_url || ""}
          onChange={(e) => setAdForm({...adForm, ad_content_url: e.target.value})}
          placeholder="https://example.com/ad-image.jpg"
          type="url"
        />
      </div>

      <div>
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input
          id="targetUrl"
          value={adForm.target_url || ""}
          onChange={(e) => setAdForm({...adForm, target_url: e.target.value})}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="displayDuration">Display Duration (seconds)</Label>
          <Input
            id="displayDuration"
            type="number"
            min="3"
            max="30"
            value={adForm.display_duration || 5}
            onChange={(e) => setAdForm({...adForm, display_duration: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="skipAfter">Skip After (seconds)</Label>
          <Input
            id="skipAfter"
            type="number"
            min="0"
            max="10"
            value={adForm.skip_after || 3}
            onChange={(e) => setAdForm({...adForm, skip_after: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={adForm.is_active !== undefined ? adForm.is_active : true}
          onCheckedChange={(checked) => setAdForm({...adForm, is_active: checked})}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {submitButtonText}
      </Button>
    </form>
  );
};

export default InterstitialAdsForm;
