
import { AdAnalytics } from "@/models/adModels";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdComparisonChartProps {
  analytics: AdAnalytics[];
  metric: 'impressions' | 'clicks' | 'conversions' | 'revenue' | 'ctr' | 'cpm';
}

const AdComparisonChart = ({ analytics, metric }: AdComparisonChartProps) => {
  // Sort by the selected metric and take top 5
  const data = [...analytics]
    .sort((a, b) => (b[metric] as number) - (a[metric] as number))
    .slice(0, 5)
    .map(ad => ({
      name: ad.adName.length > 15 ? ad.adName.slice(0, 15) + '...' : ad.adName,
      [metric]: ad[metric],
      adType: ad.adType
    }));
  
  // Determine fill color based on metric
  const getFillColor = () => {
    switch (metric) {
      case 'impressions': return '#8884d8';
      case 'clicks': return '#82ca9d';
      case 'conversions': return '#8dd1e1';
      case 'revenue': return '#ffc658';
      case 'ctr': return '#a4de6c';
      case 'cpm': return '#d0ed57';
      default: return '#8884d8';
    }
  };
  
  const formatYAxis = (value: any) => {
    if (metric === 'revenue') return `$${value}`;
    if (metric === 'ctr' || metric === 'cpm') return `${value}%`;
    return value;
  };
  
  const formatTooltip = (value: any) => {
    if (metric === 'revenue') return `$${value}`;
    if (metric === 'ctr' || metric === 'cpm') return `${value}%`;
    return value;
  };
  
  const metricLabel = {
    impressions: 'Impressions',
    clicks: 'Clicks',
    conversions: 'Conversions',
    revenue: 'Revenue',
    ctr: 'CTR',
    cpm: 'CPM'
  }[metric];
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 75,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="name" 
            stroke="#999" 
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            stroke="#999" 
            tickFormatter={formatYAxis} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} 
            formatter={(value: any) => [formatTooltip(value), metricLabel]}
            labelFormatter={(label) => `Ad: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey={metric} 
            name={metricLabel}
            fill={getFillColor()} 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdComparisonChart;
