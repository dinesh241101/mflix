
import { AdAnalytics } from "@/models/adModels";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GeographicDistributionChartProps {
  analytics: AdAnalytics[];
}

const GeographicDistributionChart = ({ analytics }: GeographicDistributionChartProps) => {
  // Group by country and calculate totals
  const countryMap = analytics.reduce((acc: Record<string, number>, item) => {
    const country = item.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = 0;
    }
    acc[country] += item.impressions;
    return acc;
  }, {});
  
  // Convert to array for chart
  const data = Object.entries(countryMap).map(([name, value]) => ({
    name,
    value
  }));
  
  // Sort by value descending
  data.sort((a, b) => b.value - a.value);
  
  // Take top 8, group rest as "Other"
  const displayData = data.slice(0, 8);
  
  if (data.length > 8) {
    const otherValue = data
      .slice(8)
      .reduce((sum, item) => sum + item.value, 0);
    
    displayData.push({
      name: 'Other',
      value: otherValue
    });
  }
  
  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#A4DE6C', '#D0ED57'];
  
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} 
            formatter={(value: any) => [`${value.toLocaleString()} impressions`, 'Impressions']}
            labelFormatter={(label) => `Country: ${label}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeographicDistributionChart;
