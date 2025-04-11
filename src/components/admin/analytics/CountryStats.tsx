
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CountryStatsProps {
  analytics: {
    countries: any[];
  };
  selectedCountry: any;
  setSelectedCountry: (country: any) => void;
}

const CountryStats = ({ analytics, selectedCountry, setSelectedCountry }: CountryStatsProps) => {
  if (selectedCountry) {
    return (
      <div>
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-400"
            onClick={() => setSelectedCountry(null)}
          >
            &larr; Back to Countries
          </Button>
          <h3 className="text-lg font-medium ml-2">{selectedCountry.name}</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">States/Regions</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedCountry.states.map((state: any) => (
                  <div 
                    key={state.name}
                    className="flex justify-between items-center p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-750"
                  >
                    <span>{state.name}</span>
                    <span className="text-gray-400">{state.count} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Devices</h4>
              <div className="space-y-2">
                {selectedCountry.states.flatMap((state: any) => 
                  state.cities.flatMap((city: any) => 
                    city.devices.map((device: any) => ({
                      name: device.name,
                      count: device.count
                    }))
                  )
                ).reduce((acc: any[], device: any) => {
                  const existing = acc.find(d => d.name === device.name);
                  if (existing) {
                    existing.count += device.count;
                  } else {
                    acc.push({ ...device });
                  }
                  return acc;
                }, []).sort((a: any, b: any) => b.count - a.count).map((device: any) => (
                  <div 
                    key={device.name}
                    className="flex justify-between items-center p-2 bg-gray-800 rounded"
                  >
                    <span>{device.name}</span>
                    <span className="text-gray-400">{device.count} users</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 font-medium bg-gray-800 p-3">
        <div className="col-span-4">Country</div>
        <div className="col-span-3">Users</div>
        <div className="col-span-3">Downloads</div>
        <div className="col-span-2">Revenue</div>
      </div>
      
      <div className="divide-y divide-gray-600">
        {analytics.countries.map((country: any) => (
          <div 
            key={country.name}
            className="grid grid-cols-12 p-3 items-center hover:bg-gray-600 cursor-pointer"
            onClick={() => setSelectedCountry(country)}
          >
            <div className="col-span-4">{country.name}</div>
            <div className="col-span-3">{country.users.toLocaleString()}</div>
            <div className="col-span-3">{country.downloads.toLocaleString()}</div>
            <div className="col-span-2">${country.revenue.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryStats;
