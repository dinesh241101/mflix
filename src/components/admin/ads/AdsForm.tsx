
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

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
  handleUploadAd: (e: React.FormEvent) => void;
}

const AdsForm = ({ adForm, setAdForm, handleUploadAd }: AdsFormProps) => {
  return (
    <form onSubmit={handleUploadAd} className="bg-gray-700 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Advertisement</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Name</label>
          <Input 
            value={adForm.name}
            onChange={(e) => setAdForm({ ...adForm, name: e.target.value })}
            className="bg-gray-700 border-gray-600"
            placeholder="Ad Campaign Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Ad Type</label>
          <Select 
            value={adForm.adType}
            onValueChange={(value) => setAdForm({ ...adForm, adType: value })}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select Ad Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="banner">Banner Ad</SelectItem>
              <SelectItem value="video">Video Ad</SelectItem>
              <SelectItem value="popup">Popup Ad</SelectItem>
              <SelectItem value="native">Native Ad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
          <Select 
            value={adForm.position}
            onValueChange={(value) => setAdForm({ ...adForm, position: value })}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="home">Home Page</SelectItem>
              <SelectItem value="detail">Movie Detail</SelectItem>
              <SelectItem value="search">Search Results</SelectItem>
              <SelectItem value="download">Download Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Display Frequency</label>
          <Input 
            type="number"
            value={adForm.displayFrequency}
            onChange={(e) => setAdForm({ ...adForm, displayFrequency: parseInt(e.target.value) || 0 })}
            className="bg-gray-700 border-gray-600"
            placeholder="How often to show (1-10)"
            min="1"
            max="10"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Ad Content URL (Image/Video)</label>
        <Input 
          value={adForm.contentUrl}
          onChange={(e) => setAdForm({ ...adForm, contentUrl: e.target.value })}
          className="bg-gray-700 border-gray-600"
          placeholder="https://example.com/ad-content.jpg"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Target URL (Link)</label>
        <Input 
          value={adForm.targetUrl}
          onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
          className="bg-gray-700 border-gray-600"
          placeholder="https://advertiser.com/landing-page"
          required
        />
      </div>
      
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="mr-2" size={16} />
        Create Ad Campaign
      </Button>
    </form>
  );
};

export default AdsForm;
