
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PerformanceOverTimeChart, 
  DeviceDistributionChart,
  GeographicDistributionChart,
  AdComparisonChart,
  DatePickerWithRange as DateRangePicker,
  CampaignStatusCard
} from "@/components/admin/ads/analytics";
import { DateRange } from "react-day-picker";

interface AnalyticsDashboardProps {
  ads: any[];
  dateRange?: DateRange;
  setDateRange?: (dateRange: DateRange | undefined) => void;
}

const AnalyticsDashboard = ({ ads, dateRange, setDateRange }: AnalyticsDashboardProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">Ad Analytics Dashboard</h2>
        
        {setDateRange && dateRange && (
          <DateRangePicker 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CampaignStatusCard title="Total Impressions" value="12,456" change={+8.2} />
        <CampaignStatusCard title="Total Clicks" value="2,315" change={+5.7} />
        <CampaignStatusCard title="Click Rate" value="18.6%" change={-2.3} />
        <CampaignStatusCard title="Conversion Rate" value="3.2%" change={+1.4} />
      </div>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="comparison">Ad Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
              <div className="h-80">
                <PerformanceOverTimeChart analytics={[]} dateRange={dateRange || {from: new Date(), to: new Date()}} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Device Distribution</h3>
                <div className="h-72">
                  <DeviceDistributionChart analytics={[]} type="device" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
                <div className="h-72">
                  <GeographicDistributionChart analytics={[]} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Ad Campaign Comparison</h3>
              <div className="h-80">
                <AdComparisonChart analytics={[]} metric="impressions" />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ads.slice(0, 4).map((ad, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h4 className="font-medium truncate">{ad.ad_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-400">Impressions:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 5000)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-400">Clicks:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 1000)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-400">CTR:</span>
                    <span className="font-medium">{(Math.random() * 10).toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
