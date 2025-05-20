import React from 'react';

interface AnalyticsDashboardProps {
  ads: any[];
  dateRange?: { from: Date; to: Date; };
  setDateRange?: React.Dispatch<React.SetStateAction<{ from: Date; to: Date; }>>;
}

const AnalyticsDashboard = ({ ads, dateRange, setDateRange }: AnalyticsDashboardProps) => {
  return (
    <div>
      {/* Analytics Dashboard Content */}
      <h2>Analytics Dashboard</h2>
      {/* Display ads and date range if available */}
      {ads && ads.length > 0 ? (
        <ul>
          {ads.map((ad, index) => (
            <li key={index}>Ad Name: {ad.ad_name}</li>
          ))}
        </ul>
      ) : (
        <p>No ads available.</p>
      )}
      {dateRange && (
        <p>
          Date Range: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
