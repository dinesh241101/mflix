
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdsFormProps {
  adForm: {
    name: string;
    adType: string;
    position: string;
    contentUrl: string;
    targetUrl: string;
    displayFrequency: number;
  };
  setAdForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

const AdsForm = ({ adForm, setAdForm, onSubmit, submitButtonText = "Create Ad Campaign" }: AdsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            value={adForm.name}
            onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="Summer Sale Banner"
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
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="popup">Popup</SelectItem>
              <SelectItem value="sidebar">Sidebar</SelectItem>
              <SelectItem value="interstitial">Interstitial</SelectItem>
              <SelectItem value="native">Native Ad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="position">Position</Label>
          <Select
            value={adForm.position}
            onValueChange={(value) => setAdForm({ ...adForm, position: value })}
          >
            <SelectTrigger id="position" className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="home">Home Page</SelectItem>
              <SelectItem value="movies">Movies Page</SelectItem>
              <SelectItem value="series">Web Series Page</SelectItem>
              <SelectItem value="anime">Anime Page</SelectItem>
              <SelectItem value="details">Movie Details Page</SelectItem>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
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
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="contentUrl">Content URL (Image URL)</Label>
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
        
        <div className="md:col-span-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <UploadCloud className="mr-2" size={16} />
            {submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AdsForm;
