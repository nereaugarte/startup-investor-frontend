import React from 'react';
import './MarketTrendsChart.css';

interface ChartDataPoint {
  month: string;
  funding: number; // in billions
}

const MarketTrendsChart: React.FC = () => {
  // Sample data - VC funding by month (in billions)
  const chartData: ChartDataPoint[] = [
    { month: 'Jul', funding: 45 },
    { month: 'Aug', funding: 52 },
    { month: 'Sep', funding: 48 },
    { month: 'Oct', funding: 58 },
    { month: 'Nov', funding: 62 },
    { month: 'Dec', funding: 68 }
  ];

  const maxFunding = Math.max(...chartData.map(d => d.funding));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;
  const barWidth = (chartWidth - padding * 2) / chartData.length - 10;

  return (
    <div className="market-trends-chart">
      <div className="chart-header">
        <h3>📈 VC Funding Trends (Last 6 Months)</h3>
        <p className="chart-subtitle">Global venture capital investments in $B</p>
      </div>
      
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight + 60} className="chart-svg">
          {/* Y-axis labels */}
          {[0, 20, 40, 60, 80].map((value) => {
            const y = chartHeight - (value / maxFunding) * chartHeight + padding;
            return (
              <g key={value}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#718096"
                >
                  ${value}B
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((data, index) => {
            const barHeight = (data.funding / maxFunding) * chartHeight;
            const x = padding + index * (barWidth + 10) + 5;
            const y = chartHeight - barHeight + padding;
            
            // Gradient color based on trend
            const isIncreasing = index > 0 && data.funding > chartData[index - 1].funding;
            const barColor = isIncreasing ? '#2ecc71' : '#3498db';

            return (
              <g key={data.month}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="4"
                  className="chart-bar"
                />
                
                {/* Value label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#2d3748"
                >
                  ${data.funding}B
                </text>
                
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + padding + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#718096"
                  fontWeight="500"
                >
                  {data.month}
                </text>
              </g>
            );
          })}

          {/* X-axis line */}
          <line
            x1={padding}
            y1={chartHeight + padding}
            x2={chartWidth - padding}
            y2={chartHeight + padding}
            stroke="#cbd5e0"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
            <span>Stable/Decreasing</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
            <span>Increasing</span>
          </div>
        </div>
        <p className="chart-note">Data reflects global VC funding across all stages</p>
      </div>
    </div>
  );
};

export default MarketTrendsChart;

