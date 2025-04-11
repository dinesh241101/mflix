
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsCardsProps {
  analytics: {
    totalDownloads: number;
    activeUsers: number;
    adClicks: number;
    adRevenue: number;
    countries: any[];
  };
}

const AnalyticsCards = ({ analytics }: AnalyticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0">
        <CardContent className="p-6">
          <h3 className="text-gray-300 font-medium mb-2">Total Downloads</h3>
          <p className="text-3xl font-bold">{analytics.totalDownloads.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-0">
        <CardContent className="p-6">
          <h3 className="text-gray-300 font-medium mb-2">Active Users</h3>
          <p className="text-3xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-900 to-green-800 border-0">
        <CardContent className="p-6">
          <h3 className="text-gray-300 font-medium mb-2">Ad Clicks</h3>
          <p className="text-3xl font-bold">{analytics.adClicks.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-0">
        <CardContent className="p-6">
          <h3 className="text-gray-300 font-medium mb-2">Ad Revenue</h3>
          <p className="text-3xl font-bold">${analytics.adRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;
