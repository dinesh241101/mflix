
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AffiliateLink } from '@/models/adModels';
import { PlusCircle, Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AffiliateLinksManagerProps {
  affiliateLinks: AffiliateLink[];
  onAddLink: (link: Omit<AffiliateLink, "id" | "createdAt" | "clicks" | "conversions" | "revenue" | "conversionRate">) => void;
  onDeleteLink: (id: string) => void;
}

const AffiliateLinksManager = ({ 
  affiliateLinks, 
  onAddLink, 
  onDeleteLink 
}: AffiliateLinksManagerProps) => {
  const [activeTab, setActiveTab] = useState("manage");
  const [newLink, setNewLink] = useState({
    name: '',
    originalUrl: '',
    program: '',
    commission: 0,
    trackingParams: { utm_source: 'website', utm_medium: 'affiliate', utm_campaign: '' }
  });
  const [shortCode, setShortCode] = useState('');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLink.name || !newLink.originalUrl || !newLink.program) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a short code if not provided
    const generatedShortCode = shortCode || generateShortCode();
    
    onAddLink({
      ...newLink,
      shortCode: generatedShortCode,
    });
    
    // Reset form
    setNewLink({
      name: '',
      originalUrl: '',
      program: '',
      commission: 0,
      trackingParams: { utm_source: 'website', utm_medium: 'affiliate', utm_campaign: '' }
    });
    setShortCode('');
    
    toast({
      title: "Success",
      description: "Affiliate link added successfully!"
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard"
    });
  };

  const generateShortCode = () => {
    // Generate random alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const buildAffiliateUrl = (link: AffiliateLink) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/go/${link.shortCode}`;
  };

  const buildOriginalUrlWithParams = (link: AffiliateLink) => {
    const url = new URL(link.originalUrl);
    Object.entries(link.trackingParams).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    return url.toString();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Affiliate Links</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="manage">Manage Links</TabsTrigger>
          <TabsTrigger value="add">Add New Link</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          {affiliateLinks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {affiliateLinks.map(link => (
                <Card key={link.id} className="bg-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-white">{link.name}</h3>
                        <p className="text-xs text-gray-400">{link.program}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCopyLink(buildAffiliateUrl(link))}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => window.open(buildOriginalUrlWithParams(link), '_blank')}
                        >
                          <ExternalLink size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => onDeleteLink(link.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Short Link</p>
                        <div className="flex items-center">
                          <p className="text-sm truncate">{buildAffiliateUrl(link)}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 ml-1"
                            onClick={() => handleCopyLink(buildAffiliateUrl(link))}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Clicks</p>
                        <p className="text-sm">{link.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Conversions</p>
                        <p className="text-sm">{link.conversions.toLocaleString()} ({link.conversionRate.toFixed(2)}%)</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Revenue</p>
                        <p className="text-sm">${link.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Original URL</p>
                      <p className="text-sm truncate">{link.originalUrl}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">No affiliate links yet</h3>
              <p className="text-gray-400 mb-4">Create your first affiliate link to start tracking conversions</p>
              <Button onClick={() => setActiveTab("add")}>
                <PlusCircle className="mr-2" size={16} />
                Add Affiliate Link
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card className="bg-gray-700">
            <CardContent className="p-6">
              <form onSubmit={handleAddLink}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Link Name*</Label>
                    <Input 
                      id="name" 
                      placeholder="Amazon Product Link" 
                      value={newLink.name}
                      onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="program">Affiliate Program*</Label>
                    <Input 
                      id="program" 
                      placeholder="Amazon Associates" 
                      value={newLink.program}
                      onChange={(e) => setNewLink({...newLink, program: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="originalUrl">Original URL with Affiliate Code*</Label>
                    <Input 
                      id="originalUrl" 
                      placeholder="https://amazon.com/product?tag=myaffiliateId" 
                      value={newLink.originalUrl}
                      onChange={(e) => setNewLink({...newLink, originalUrl: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission Rate (%)</Label>
                    <Input 
                      id="commission" 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="0.01"
                      placeholder="5.00" 
                      value={newLink.commission || ''}
                      onChange={(e) => setNewLink({
                        ...newLink, 
                        commission: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shortCode">Custom Short Code (Optional)</Label>
                    <Input 
                      id="shortCode" 
                      placeholder="amazon-deal" 
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="utmCampaign">Campaign Name</Label>
                    <Input 
                      id="utmCampaign" 
                      placeholder="summer-sale" 
                      value={newLink.trackingParams.utm_campaign}
                      onChange={(e) => setNewLink({
                        ...newLink, 
                        trackingParams: {
                          ...newLink.trackingParams,
                          utm_campaign: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <PlusCircle className="mr-2" size={16} />
                    Add Affiliate Link
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-gray-700">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium mb-2">Affiliate Analytics Coming Soon</h3>
              <p className="text-gray-400">
                We're working on detailed analytics for your affiliate links. 
                Check back soon for more insights into your affiliate marketing performance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliateLinksManager;
