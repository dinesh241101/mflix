
import { useState, useEffect } from "react";
import AnalyticsCards from "./AnalyticsCards";
import CountryStats from "./CountryStats";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsTabProps {
  analytics?: {
    totalDownloads: number;
    activeUsers: number;
    adClicks: number;
    adRevenue: number;
    countries: any[];
  };
  selectedCountry?: any;
  setSelectedCountry?: (country: any) => void;
}

const AnalyticsTab = (props: AnalyticsTabProps = {}) => {
  const [analytics, setAnalytics] = useState(props.analytics || {
    totalDownloads: 0,
    activeUsers: 0,
    adClicks: 0,
    adRevenue: 0,
    countries: []
  });
  const [selectedCountry, setSelectedCountry] = useState(props.selectedCountry || null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic analytics
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*');

      const { data: moviesData } = await supabase
        .from('movies')
        .select('downloads');

      const totalDownloads = moviesData?.reduce((sum, movie) => sum + (movie.downloads || 0), 0) || 0;

      setAnalytics({
        totalDownloads,
        activeUsers: analyticsData?.length || 0,
        adClicks: 0,
        adRevenue: 0,
        countries: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
        
        <AnalyticsCards analytics={analytics} />
        
        <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
        
        <CountryStats 
          analytics={analytics} 
          selectedCountry={selectedCountry} 
          setSelectedCountry={props.setSelectedCountry || setSelectedCountry} 
        />
      </div>
    </div>
  );
};

export default AnalyticsTab;
