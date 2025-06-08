
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdvancedAdsFormProps {
  adForm: {
    name: string;
    adType: string;
    position: string;
    contentUrl: string;
    targetUrl: string;
    displayFrequency: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    targetCountries: string[];
    targetDevices: string[];
    clickBased: boolean;
    description: string;
  };
  setAdForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

const AD_TYPES = [
  'banner', 'popup', 'sidebar', 'interstitial', 'native', 'video', 'overlay',
  'floating', 'sticky', 'inline', 'header', 'footer', 'content', 'modal',
  'corner', 'expandable', 'rich_media', 'social', 'email', 'push',
  'in_app', 'rewarded', 'playable', 'audio', 'podcast', 'streaming',
  'connected_tv', 'digital_billboard', 'transit', 'print', 'radio', 'sponsored'
];

const AD_POSITIONS = [
  'home_hero', 'home_trending', 'home_featured', 'home_category', 'home_top', 'home_middle', 'home_bottom',
  'movies_top', 'movies_grid', 'movies_sidebar', 'movies_bottom', 'movies_list',
  'series_top', 'series_grid', 'series_sidebar', 'series_bottom', 'series_list',
  'anime_top', 'anime_grid', 'anime_sidebar', 'anime_bottom', 'anime_list',
  'movie_detail_top', 'movie_detail_middle', 'movie_detail_bottom', 'movie_detail_sidebar',
  'search_top', 'search_results', 'search_bottom',
  'header_banner', 'footer_banner', 'sidebar_fixed', 'floating_corner',
  'click_based', 'scroll_based', 'time_based', 'exit_intent'
];

const COUNTRIES = [
  'Global', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Spain', 'Italy', 'Japan', 'India', 'Brazil', 'Mexico', 'Russia',
  'China', 'South Korea', 'Netherlands', 'Sweden', 'Norway', 'Denmark'
];

const DEVICES = ['All', 'Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Gaming Console'];

const AdvancedAdsForm = ({ adForm, setAdForm, onSubmit, submitButtonText = "Create Ad Campaign" }: AdvancedAdsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            value={adForm.name}
            onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="Summer Sale Banner 2024"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="adType">Ad Type</Label>
          <Select
            value={adForm.adType}
            onValueChange={(value) => setAdForm({ ...adForm, adType: value })}
          >
            <SelectTrigger id="adType" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select ad type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
              {AD_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="position">Position/Placement</Label>
          <Select
            value={adForm.position}
            onValueChange={(value) => setAdForm({ ...adForm, position: value })}
          >
            <SelectTrigger id="position" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
              {AD_POSITIONS.map((position) => (
                <SelectItem key={position} value={position} className="capitalize">
                  {position.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="frequency">Display Frequency</Label>
          <Select
            value={adForm.displayFrequency.toString()}
            onValueChange={(value) => setAdForm({ ...adForm, displayFrequency: parseInt(value) })}
          >
            <SelectTrigger id="frequency" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="1">Every page load</SelectItem>
              <SelectItem value="2">Every 2 page loads</SelectItem>
              <SelectItem value="3">Every 3 page loads</SelectItem>
              <SelectItem value="5">Every 5 page loads</SelectItem>
              <SelectItem value="10">Every 10 page loads</SelectItem>
              <SelectItem value="0">Click-based only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={adForm.startDate}
            onChange={(e) => setAdForm({ ...adForm, startDate: e.target.value })}
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={adForm.endDate}
            onChange={(e) => setAdForm({ ...adForm, endDate: e.target.value })}
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="targetCountries">Target Countries</Label>
          <Select
            value={adForm.targetCountries[0] || 'Global'}
            onValueChange={(value) => setAdForm({ ...adForm, targetCountries: [value] })}
          >
            <SelectTrigger id="targetCountries" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select countries" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetDevices">Target Devices</Label>
          <Select
            value={adForm.targetDevices[0] || 'All'}
            onValueChange={(value) => setAdForm({ ...adForm, targetDevices: [value] })}
          >
            <SelectTrigger id="targetDevices" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select devices" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {DEVICES.map((device) => (
                <SelectItem key={device} value={device}>
                  {device}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="description">Campaign Description</Label>
          <Textarea
            id="description"
            value={adForm.description}
            onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="Describe your ad campaign..."
            rows={3}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="contentUrl">Content URL (Image/Video URL)</Label>
          <Input
            id="contentUrl"
            value={adForm.contentUrl}
            onChange={(e) => setAdForm({ ...adForm, contentUrl: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="https://example.com/banner.jpg"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="targetUrl">Target URL (Where to send visitors)</Label>
          <Input
            id="targetUrl"
            value={adForm.targetUrl}
            onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="https://example.com/landing-page"
            required
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={adForm.isActive}
              onCheckedChange={(checked) => setAdForm({ ...adForm, isActive: checked })}
            />
            <Label>Active Campaign</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={adForm.clickBased}
              onCheckedChange={(checked) => setAdForm({ ...adForm, clickBased: checked })}
            />
            <Label>Click-based Trigger</Label>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <UploadCloud className="mr-2" size={16} />
            {submitButtonText}
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">Advanced Ad Placement Guide:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
          <div>
            <h5 className="font-medium text-blue-300 mb-1">Homepage Placements:</h5>
            <ul className="space-y-0.5">
              <li>• <strong>home_hero</strong>: Main banner area</li>
              <li>• <strong>home_trending</strong>: Trending section</li>
              <li>• <strong>home_featured</strong>: Featured content</li>
              <li>• <strong>home_category</strong>: Category sections</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-1">Content Pages:</h5>
            <ul className="space-y-0.5">
              <li>• <strong>movies_*/series_*/anime_*</strong>: Content listings</li>
              <li>• <strong>movie_detail_*</strong>: Movie detail pages</li>
              <li>• <strong>search_*</strong>: Search result pages</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-1">Behavior-based:</h5>
            <ul className="space-y-0.5">
              <li>• <strong>click_based</strong>: After user clicks</li>
              <li>• <strong>scroll_based</strong>: On scroll events</li>
              <li>• <strong>time_based</strong>: After time delay</li>
              <li>• <strong>exit_intent</strong>: Before user leaves</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-1">Fixed Positions:</h5>
            <ul className="space-y-0.5">
              <li>• <strong>header_banner</strong>: Top of page</li>
              <li>• <strong>footer_banner</strong>: Bottom of page</li>
              <li>• <strong>sidebar_fixed</strong>: Fixed sidebar</li>
              <li>• <strong>floating_corner</strong>: Corner overlay</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdvancedAdsForm;
