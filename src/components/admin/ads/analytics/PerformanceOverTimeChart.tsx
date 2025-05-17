
import { AdAnalytics } from "@/models/adModels";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceOverTimeChartProps {
  analytics: AdAnalytics[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Helper function to create daily data points
const createDailyData = (analytics: AdAnalytics[], dateRange: { from: Date; to: Date }) => {
  const result = [];
  const currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  
  // Generate a data point for each day in the range
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Mock data - in a real app this would come from your analytics
    // You'd filter your analytics data for this specific date
    const dailyImpressions = Math.floor(Math.random() * 5000) + 1000;
    const dailyClicks = Math.floor(dailyImpressions * (Math.random() * 0.1 + 0.01)); // 1-10% CTR
    const dailyRevenue = dailyClicks * (Math.random() * 0.5 + 0.1); // $0.10-$0.60 per click
    
    result.push({
      date: dateStr,
      impressions: dailyImpressions,
      clicks: dailyClicks, 
      revenue: parseFloat(dailyRevenue.toFixed(2))
    });
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

const PerformanceOverTimeChart = ({ analytics, dateRange }: PerformanceOverTimeChartProps) => {
  // Generate daily data points
  const data = createDailyData(analytics, dateRange);
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="date" 
            stroke="#999"
            tickFormatter={(dateStr) => {
              const date = new Date(dateStr);
              return `${date.getMonth()+1}/${date.getDate()}`;
            }}
          />
          <YAxis stroke="#999" yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" stroke="#999" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} 
            formatter={(value, name) => {
              if (name === 'revenue') return [`$${value}`, 'Revenue'];
              return [value, name.charAt(0).toUpperCase() + name.slice(1)];
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="impressions" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="clicks" 
            stroke="#82ca9d" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="revenue" 
            stroke="#ffc658" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceOverTimeChart;
