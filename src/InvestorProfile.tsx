// InvestorProfile.tsx
// Add this as a new component in your frontend

import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_URL } from './aws-config';

interface InvestorProfileProps {
  user: any;
  onClose: () => void;
}

const InvestorProfile: React.FC<InvestorProfileProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    preferred_industries: [] as string[],
    preferred_funding_stages: [] as string[],
    min_investment: 100000,
    max_investment: 10000000,
  });

  const industries = [
    'Artificial Intelligence',
    'FinTech',
    'Productivity',
    'Design & Media',
    'Social & Communication',
    'E-commerce',
    'Data & Analytics',
    'HR Tech',
    'Developer Tools',
    'Cybersecurity',
    'Travel & Expense',
  ];

  const fundingStages = [
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D',
    'Series E',
    'Series F',
    'Series G',
    'Series H',
    'Series I',
    'IPO',
  ];

  // Load existing preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${API_URL}/investors/${user?.signInDetails?.loginId}`, {
        headers: {
          'Authorization': token!,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPreferences({
          preferred_industries: data.preferred_industries || [],
          preferred_funding_stages: data.preferred_funding_stages || [],
          min_investment: data.min_investment || 100000,
          max_investment: data.max_investment || 10000000,
        });
      }
    } catch (error) {
      console.log('No existing preferences found');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${API_URL}/investors`, {
        method: 'POST',
        headers: {
          'Authorization': token!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investor_id: user?.signInDetails?.loginId,
          email: user?.signInDetails?.loginId,
          ...preferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      });
      
      if (response.ok) {
        alert('✅ Preferences saved! You will receive email notifications for matching startups.');
        onClose();
      } else {
        alert('❌ Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('❌ Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const toggleIndustry = (industry: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_industries: prev.preferred_industries.includes(industry)
        ? prev.preferred_industries.filter(i => i !== industry)
        : [...prev.preferred_industries, industry]
    }));
  };

  const toggleFundingStage = (stage: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_funding_stages: prev.preferred_funding_stages.includes(stage)
        ? prev.preferred_funding_stages.filter(s => s !== stage)
        : [...prev.preferred_funding_stages, stage]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>⚙️ Investment Preferences</h2>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Set your preferences to receive personalized startup recommendations via email
          </p>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner"></div>
              <p>Loading preferences...</p>
            </div>
          ) : (
            <>
              {/* Preferred Industries */}
              <section className="modal-section">
                <h3>Preferred Industries</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  Select the industries you're interested in (select multiple)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {industries.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '2px solid',
                        borderColor: preferences.preferred_industries.includes(industry) ? '#2c5282' : '#e2e8f0',
                        backgroundColor: preferences.preferred_industries.includes(industry) ? '#2c5282' : 'white',
                        color: preferences.preferred_industries.includes(industry) ? 'white' : '#2d3748',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {preferences.preferred_industries.includes(industry) ? '✓ ' : ''}{industry}
                    </button>
                  ))}
                </div>
              </section>

              {/* Preferred Funding Stages */}
              <section className="modal-section">
                <h3>Preferred Funding Stages</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  Select the funding stages you're interested in
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {fundingStages.map(stage => (
                    <button
                      key={stage}
                      onClick={() => toggleFundingStage(stage)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '2px solid',
                        borderColor: preferences.preferred_funding_stages.includes(stage) ? '#2c5282' : '#e2e8f0',
                        backgroundColor: preferences.preferred_funding_stages.includes(stage) ? '#2c5282' : 'white',
                        color: preferences.preferred_funding_stages.includes(stage) ? 'white' : '#2d3748',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {preferences.preferred_funding_stages.includes(stage) ? '✓ ' : ''}{stage}
                    </button>
                  ))}
                </div>
              </section>

              {/* Investment Range */}
              <section className="modal-section">
                <h3>Investment Range</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  Set your minimum and maximum investment amounts
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Minimum Investment
                    </label>
                    <input
                      type="number"
                      value={preferences.min_investment}
                      onChange={(e) => setPreferences({ ...preferences, min_investment: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="e.g., 100000"
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      ${(preferences.min_investment / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Maximum Investment
                    </label>
                    <input
                      type="number"
                      value={preferences.max_investment}
                      onChange={(e) => setPreferences({ ...preferences, max_investment: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="e.g., 10000000"
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      ${(preferences.max_investment / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </section>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={savePreferences}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#2c5282',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1
                  }}
                >
                  {saving ? 'Saving...' : '💾 Save Preferences'}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: 'white',
                    color: '#2d3748',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile;

