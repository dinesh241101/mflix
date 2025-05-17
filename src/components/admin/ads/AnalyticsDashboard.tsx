
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdAnalytics } from "@/models/adModels";
import PerformanceOverTimeChart from "./analytics/PerformanceOverTimeChart";
import AdComparisonChart from "./analytics/AdComparisonChart";
import GeographicDistributionChart from "./analytics/GeographicDistributionChart";
import DeviceDistributionChart from "./analytics/DeviceDistributionChart";
import CampaignStatusCard from "./analytics/CampaignStatusCard";
import { DatePickerWithRange } from './analytics/DateRangePicker';

interface AnalyticsDashboardProps {
  adAnalytics: AdAnalytics[];
}

const AnalyticsDashboard = ({ adAnalytics }: AnalyticsDashboardProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total metrics
  const totalImpressions = adAnalytics.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = adAnalytics.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalConversions = adAnalytics.reduce((sum, ad) => sum + ad.conversions, 0);
  const totalRevenue = adAnalytics.reduce((sum, ad) => sum + ad.revenue, 0);
  
  // Calculate overall CTR and CPM
  const overallCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  const overallCPM = totalImpressions > 0 
    ? (totalRevenue / totalImpressions) * 1000 
    : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Ad Performance Analytics</h2>
        <div className="w-72">
          <DatePickerWithRange 
            date={dateRange} 
            setDate={setDateRange} 
          />
        </div>
      </div>

      {/* Top metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0">
          <CardContent className="p-6">
            <h3 className="text-gray-300 font-medium mb-2">Impressions</h3>
            <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900 to-green-800 border-0">
          <CardContent className="p-6">
            <h3 className="text-gray-300 font-medium mb-2">Clicks</h3>
            <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-sm text-gray-300">{overallCTR.toFixed(2)}% CTR</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-0">
          <CardContent className="p-6">
            <h3 className="text-gray-300 font-medium mb-2">Conversions</h3>
            <p className="text-3xl font-bold">{totalConversions.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-0">
          <CardContent className="p-6">
            <h3 className="text-gray-300 font-medium mb-2">Revenue</h3>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-300">${overallCPM.toFixed(2)} CPM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="devices">Devices & Browsers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Performance Over Time</h3>
              <PerformanceOverTimeChart analytics={adAnalytics} dateRange={dateRange} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Top Performing Ads</h3>
                <AdComparisonChart analytics={adAnalytics} metric="clicks" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Revenue by Ad Type</h3>
                <AdComparisonChart analytics={adAnalytics} metric="revenue" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adAnalytics.map(ad => (
              <CampaignStatusCard key={ad.id} campaign={ad} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Geographic Distribution</h3>
              <GeographicDistributionChart analytics={adAnalytics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Device Distribution</h3>
                <DeviceDistributionChart analytics={adAnalytics} type="device" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Browser Distribution</h3>
                <DeviceDistributionChart analytics={adAnalytics} type="browser" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
