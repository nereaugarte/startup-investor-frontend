import React, { useState, useEffect } from 'react';
import { API_URL } from './aws-config';
import './AnalyticsDashboard.css';

interface AnalyticsData {
  total_startups: number;
  total_funding_millions: number;
  industry_breakdown: { [key: string]: number };
  funding_stage_breakdown: { [key: string]: number };
  location_breakdown: { [key: string]: number };
  top_industries: [string, number][];
  top_locations: [string, number][];
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/analytics/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
      console.log('Analytics loaded:', data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading platform analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="analytics-error">
        <p>{error || 'Failed to load analytics'}</p>
      </div>
    );
  }

  return (
    <section className="analytics-dashboard">
      <div className="container">
        <h2 className="section-title">📊 Platform Analytics</h2>
        
        {/* Key Metrics */}
        <div className="analytics-metrics">
          <div className="metric-card">
            <div className="metric-icon">🚀</div>
            <div className="metric-content">
              <div className="metric-value">{analytics.total_startups}</div>
              <div className="metric-label">Total Startups</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-value">
                ${(analytics.total_funding_millions / 1000).toFixed(1)}B
              </div>
              <div className="metric-label">Total Funding Raised</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🏢</div>
            <div className="metric-content">
              <div className="metric-value">
                {Object.keys(analytics.industry_breakdown).length}
              </div>
              <div className="metric-label">Industries</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">📍</div>
            <div className="metric-content">
              <div className="metric-value">
                {Object.keys(analytics.location_breakdown).length}
              </div>
              <div className="metric-label">Locations</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="analytics-charts">
          {/* Top Industries */}
          <div className="chart-card">
            <h3 className="chart-title">Top Industries</h3>
            <div className="bar-chart">
              {analytics.top_industries.map(([industry, count]) => (
                <div key={industry} className="bar-item">
                  <div className="bar-label">{industry}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${(count / analytics.total_startups) * 100}%` 
                      }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="chart-card">
            <h3 className="chart-title">Top Locations</h3>
            <div className="bar-chart">
              {analytics.top_locations.map(([location, count]) => (
                <div key={location} className="bar-item">
                  <div className="bar-label">{location}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill location-bar"
                      style={{ 
                        width: `${(count / analytics.total_startups) * 100}%` 
                      }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funding Stages */}
          <div className="chart-card full-width">
            <h3 className="chart-title">Funding Stage Distribution</h3>
            <div className="stage-grid">
              {Object.entries(analytics.funding_stage_breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([stage, count]) => (
                  <div key={stage} className="stage-item">
                    <div className="stage-count">{count}</div>
                    <div className="stage-name">{stage}</div>
                    <div className="stage-percentage">
                      {((count / analytics.total_startups) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;

