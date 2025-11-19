import React, { useState, useEffect } from 'react';
import { API_URL } from './aws-config';
import './RecommendedStartups.css';

interface Recommendation {
  startup_id: string;
  name: string;
  industry: string;
  funding_stage: string;
  match_score: number;
}

interface Props {
  userId: string;
  onStartupClick: (startupId: string) => void;
}

const RecommendedStartups: React.FC<Props> = ({ userId, onStartupClick }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch investor data which includes recommendations
      const response = await fetch(`${API_URL}/investors/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const investor = await response.json();
      const recs = investor.recommendations || [];
      
      setRecommendations(recs);
      console.log('Loaded recommendations:', recs);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="recommended-section">
        <div className="container">
          <h2 className="section-title">⭐ Recommended for You</h2>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your personalized recommendations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recommended-section">
        <div className="container">
          <h2 className="section-title">⭐ Recommended for You</h2>
          <div className="empty-recommendations">
            <p>Unable to load recommendations at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="recommended-section">
        <div className="container">
          <h2 className="section-title">⭐ Recommended for You</h2>
          <div className="empty-recommendations">
            <div className="empty-icon">🎯</div>
            <h3>No recommendations yet</h3>
            <p>Set your investment preferences to get personalized startup recommendations!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="recommended-section">
      <div className="container">
        <div className="recommended-header">
          <div>
            <h2 className="section-title">⭐ Recommended for You</h2>
            <p className="recommended-subtitle">
              Based on your investment preferences • {recommendations.length} matches found
            </p>
          </div>
        </div>

        <div className="recommended-grid">
          {recommendations.map((rec) => (
            <div 
              key={rec.startup_id} 
              className="recommended-card"
              onClick={() => onStartupClick(rec.startup_id)}
            >
              <div className="match-badge">
                <span className="match-score">{rec.match_score}%</span>
                <span className="match-label">Match</span>
              </div>
              
              <h3 className="recommended-name">{rec.name}</h3>
              
              <div className="recommended-tags">
                <span className="rec-tag industry">{rec.industry}</span>
                <span className="rec-tag stage">{rec.funding_stage}</span>
              </div>
              
              <button className="view-recommendation-btn">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedStartups;

