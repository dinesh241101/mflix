
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

const AffiliateForm = () => {
  return (
    <form className="bg-gray-700 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Affiliate Link</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Affiliate Name</label>
          <Input 
            className="bg-gray-700 border-gray-600"
            placeholder="Amazon, Walmart, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
          <Select defaultValue="product">
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Affiliate URL</label>
        <Input 
          className="bg-gray-700 border-gray-600"
          placeholder="https://amazon.com/product/ref=your-affiliate-code"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
        <Textarea
          className="bg-gray-700 border-gray-600"
          placeholder="Brief description of what you're promoting"
        />
      </div>
      
      <Button className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="mr-2" size={16} />
        Add Affiliate Link
      </Button>
    </form>
  );
};

export default AffiliateForm;
