
import AnalyticsCards from "./AnalyticsCards";
import CountryStats from "./CountryStats";

interface AnalyticsTabProps {
  analytics: {
    totalDownloads: number;
    activeUsers: number;
    adClicks: number;
    adRevenue: number;
    countries: any[];
  };
  selectedCountry: any;
  setSelectedCountry: (country: any) => void;
}

const AnalyticsTab = ({ analytics, selectedCountry, setSelectedCountry }: AnalyticsTabProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
        
        <AnalyticsCards analytics={analytics} />
        
        <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
        
        <CountryStats 
          analytics={analytics} 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
        />
      </div>
    </div>
  );
};

export default AnalyticsTab;
