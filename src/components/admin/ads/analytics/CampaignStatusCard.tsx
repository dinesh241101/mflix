import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CampaignStatusCardProps {
  campaign?: any; // For full campaign analytics
  title?: string;  // For simplified dashboard cards
  value?: string;  // For simplified dashboard cards
  change?: number; // Percentage change
}

const CampaignStatusCard = ({ campaign, title, value, change }: CampaignStatusCardProps) => {
  // If we have a campaign object, use that data
  if (campaign) {
    // Determine if campaign is active based on dates
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
    
    const isActive = startDate <= now && (!endDate || endDate >= now);
    
    // Calculate progress if there's an end date
    const progress = endDate 
      ? Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / 
          (endDate.getTime() - startDate.getTime())) * 100))
      : null;
    
    // Format dates for display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    };
    
    // Mock trend data
    const trend = Math.random() > 0.5 ? 
      { direction: 'up', value: (Math.random() * 25 + 5).toFixed(1) } : 
      { direction: 'down', value: (Math.random() * 15 + 2).toFixed(1) };
    
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-white mb-1">{campaign.adName}</h3>
              <p className="text-xs text-gray-400">{campaign.adType} · {campaign.position}</p>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Impressions</p>
              <p className="text-lg font-medium">{campaign.impressions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Clicks</p>
              <p className="text-lg font-medium">{campaign.clicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">CTR</p>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-2">{campaign.ctr.toFixed(2)}%</p>
                {trend.direction === 'up' ? (
                  <span className="text-xs text-green-400 flex items-center">
                    <ArrowUpRight size={12} className="mr-1" />
                    {trend.value}%
                  </span>
                ) : (
                  <span className="text-xs text-red-400 flex items-center">
                    <ArrowDownRight size={12} className="mr-1" />
                    {trend.value}%
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Revenue</p>
              <p className="text-lg font-medium">${campaign.revenue.toLocaleString()}</p>
            </div>
          </div>
          
          {progress !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Campaign Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatDate(campaign.startDate)}</span>
                <span>{formatDate(campaign.endDate || '')}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Otherwise, use the simplified metric card
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-gray-200 mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? 
                <ArrowUpRight size={16} className="mr-1" /> : 
                <ArrowDownRight size={16} className="mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignStatusCard;
