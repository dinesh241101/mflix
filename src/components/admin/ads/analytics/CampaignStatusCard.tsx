
import { AdAnalytics } from "@/models/adModels";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CampaignStatusCardProps {
  campaign: AdAnalytics;
}

const CampaignStatusCard = ({ campaign }: CampaignStatusCardProps) => {
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
};

export default CampaignStatusCard;
