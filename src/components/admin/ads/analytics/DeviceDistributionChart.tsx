
import { AdAnalytics } from "@/models/adModels";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DeviceDistributionChartProps {
  analytics: AdAnalytics[];
  type: 'device' | 'browser';
}

const DeviceDistributionChart = ({ analytics, type }: DeviceDistributionChartProps) => {
  // Generate mock data for devices/browsers
  const createMockData = () => {
    if (type === 'device') {
      return [
        { name: 'Mobile', value: 65 },
        { name: 'Desktop', value: 30 },
        { name: 'Tablet', value: 5 }
      ];
    } else {
      return [
        { name: 'Chrome', value: 55 },
        { name: 'Safari', value: 20 },
        { name: 'Firefox', value: 12 },
        { name: 'Edge', value: 8 },
        { name: 'Other', value: 5 }
      ];
    }
  };
  
  // In a real app, you would calculate this from actual analytics data
  const data = createMockData();
  
  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const label = type === 'device' ? 'Device' : 'Browser';
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} 
            formatter={(value: any) => [`${value}%`, 'Percentage']}
            labelFormatter={(name) => `${label}: ${name}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceDistributionChart;
