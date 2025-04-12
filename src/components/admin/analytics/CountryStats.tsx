import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { fetchStateAnalytics, fetchCityAnalytics, fetchDeviceAnalytics } from "@/utils/analyticsQueries";
import type { AnalyticsCountResult } from "@/utils/analyticsQueries";

interface CountryStatsProps {
  analytics: {
    countries: any[];
  };
  selectedCountry: any;
  setSelectedCountry: (country: any) => void;
}

const CountryStats = ({ analytics, selectedCountry, setSelectedCountry }: CountryStatsProps) => {
  const [stateData, setStateData] = useState<AnalyticsCountResult[]>([]);
  const [cityData, setCityData] = useState<AnalyticsCountResult[]>([]);
  const [deviceData, setDeviceData] = useState<AnalyticsCountResult[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];
  
  // Fetch detailed data when a country is selected
  useEffect(() => {
    if (!selectedCountry) return;
    
    const fetchDetailedData = async () => {
      setLoadingDetails(true);
      try {
        const states = await fetchStateAnalytics(selectedCountry.name);
        const cities = await fetchCityAnalytics(selectedCountry.name);
        const devices = await fetchDeviceAnalytics(selectedCountry.name);
        
        setStateData(states);
        setCityData(cities);
        setDeviceData(devices);
      } catch (error) {
        console.error("Error fetching detailed data:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchDetailedData();
  }, [selectedCountry]);

  if (selectedCountry) {
    return (
      <div className="mt-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCountry(null)}
            className="mr-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Countries
          </Button>
          <h3 className="text-lg font-medium">{selectedCountry.name} Statistics</h3>
        </div>
        
        <Tabs defaultValue="states">
          <TabsList className="mb-4">
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="states">
            {loadingDetails ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : stateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <p>No state data available for {selectedCountry.name}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cities">
            {loadingDetails ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : cityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <p>No city data available for {selectedCountry.name}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="devices">
            {loadingDetails ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : deviceData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ device, percent }) => `${device || 'Unknown'}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="device"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="flex flex-col">
                  <h4 className="text-md font-medium mb-3">Device Distribution</h4>
                  <div className="space-y-2">
                    {deviceData.map((device, index) => (
                      <Card key={index} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{device.device || "Unknown"}</span>
                          </div>
                          <span className="font-medium">{device.count} visits</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <p>No device data available for {selectedCountry.name}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-md font-medium mb-3">Top Countries</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.countries.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" onClick={(data) => setSelectedCountry(data)} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">Click on a country to view detailed data</p>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-3">Countries Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.countries.slice(0, 8)}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onClick={(data) => setSelectedCountry(data)}
              cursor="pointer"
            >
              {analytics.countries.slice(0, 8).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CountryStats;
