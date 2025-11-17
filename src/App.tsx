import awsConfig, { API_URL } from './aws-config';
import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

interface Startup {
  startup_id: string;
  name: string;
  industry: string;
  funding_stage: string;
  description: string;
  location: string;
  founded_year: number;
  website: string;
  // Enhanced fields
  funding_amount?: string;
  team_size?: string;
  revenue_model?: string;
  key_metrics?: string[];
  competitors?: string[];
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
}

const formFields = {
  signUp: {
    email: {
      order: 1,
      label: 'Email',
      placeholder: 'Enter your email',
      isRequired: true,
    },
    name: {
      order: 2,
      label: 'Full Name',
      placeholder: 'Enter your full name',
      isRequired: true,
    },
    password: {
      order: 3,
      label: 'Password',
      placeholder: 'Create a password',
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      isRequired: true,
    },
  },
};

function App() {
  return (
    <Authenticator formFields={formFields} signUpAttributes={['name']}>
      {({ signOut, user }) => (
        <div className="app">
          <header className="header">
            <h1>🚀 Startup Investor Platform</h1>
            <div className="user-info">
              <span>Welcome, {user?.signInDetails?.loginId || user?.username}</span>
              <button onClick={signOut} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          </header>
          <main>
            <MarketNewsSection />
            <StartupDashboard />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

function MarketNewsSection() {
  const marketNews: MarketNews[] = [
    {
      id: '1',
      title: 'AI Startups Raise Record $50B in 2024',
      summary: 'Venture capital continues flowing into artificial intelligence, with Series A rounds averaging $15M. Investors are particularly focused on generative AI and enterprise automation solutions.',
      category: 'VC TRENDS',
      date: 'Nov 15, 2025'
    },
    {
      id: '2',
      title: 'FinTech Sector Shows Strong Growth',
      summary: 'Payment and banking startups attract significant investor interest amid digital transformation. Embedded finance and B2B payments lead the sector.',
      category: 'FINTECH',
      date: 'Nov 14, 2025'
    },
    {
      id: '3',
      title: 'Series A Valuations Stabilize at $45M Average',
      summary: 'After 2023 corrections, startup valuations are finding equilibrium with more realistic expectations. Founders report improved term sheets and faster closing times.',
      category: 'MARKET',
      date: 'Nov 13, 2025'
    },
    {
      id: '4',
      title: 'Climate Tech Investments Surge 40% YoY',
      summary: 'Sustainable technology and clean energy startups see unprecedented funding. Carbon capture and renewable energy storage lead investment categories.',
      category: 'CLEANTECH',
      date: 'Nov 12, 2025'
    },
    {
      id: '5',
      title: 'Healthcare AI Valuations Hit All-Time Highs',
      summary: 'Medical AI companies commanding premium valuations as hospitals accelerate digital transformation. Diagnostic and drug discovery AI startups attract major pharmaceutical partnerships.',
      category: 'HEALTHTECH',
      date: 'Nov 11, 2025'
    },
    {
      id: '6',
      title: 'Cybersecurity Startups See 35% Funding Increase',
      summary: 'Rising cyber threats drive record investments in security infrastructure. Zero-trust architecture and AI-powered threat detection lead the surge.',
      category: 'CYBERSECURITY',
      date: 'Nov 10, 2025'
    },
    {
      id: '7',
      title: 'European Startup Ecosystem Outpaces US Growth',
      summary: 'London, Berlin, and Paris see 25% increase in seed funding. European founders benefit from stronger government support and expanding venture capital presence.',
      category: 'GLOBAL',
      date: 'Nov 9, 2025'
    },
    {
      id: '8',
      title: 'SaaS Multiples Recover to 8x Revenue',
      summary: 'Software-as-a-Service valuations rebound after 2023 downturn. Enterprise SaaS with strong retention metrics command premium multiples from investors.',
      category: 'SAAS',
      date: 'Nov 8, 2025'
    },
    {
      id: '9',
      title: 'Quantum Computing Startups Attract Strategic Investors',
      summary: 'Major tech companies and governments invest in quantum technology. Commercial applications in cryptography and materials science drive interest.',
      category: 'DEEPTECH',
      date: 'Nov 7, 2025'
    },
    {
      id: '10',
      title: 'Latin America Becomes Fastest-Growing Startup Region',
      summary: 'Brazil, Mexico, and Colombia see 60% YoY increase in venture funding. Digital payments and e-commerce lead the regional boom.',
      category: 'EMERGING MARKETS',
      date: 'Nov 6, 2025'
    }
  ];

  const marketStats = [
    { label: 'Total VC Funding Q3', value: '$75.2B', change: '+12%' },
    { label: 'Average Series A', value: '$15.3M', change: '+8%' },
    { label: 'Active Deals', value: '2,847', change: '+5%' },
    { label: 'IPO Pipeline', value: '156', change: '-3%' }
  ];

  return (
    <div className="market-section">
      <h2 className="section-title">📊 Market Intelligence</h2>
      
      <div className="market-stats">
        {marketStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={'stat-change ' + (stat.change.startsWith('+') ? 'positive' : 'negative')}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="news-grid">
        {marketNews.map(news => (
          <div key={news.id} className="news-card">
            <div className="news-category">{news.category}</div>
            <h3 className="news-title">{news.title}</h3>
            <p className="news-summary">{news.summary}</p>
            <div className="news-date">{news.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartupDashboard() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'founded' | 'stage'>('name');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [bookmarkedStartups, setBookmarkedStartups] = useState<Set<string>>(new Set());
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  useEffect(() => {
    fetchStartups();
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarked_startups');
    if (saved) {
      setBookmarkedStartups(new Set(JSON.parse(saved)));
    }
  };

  const toggleBookmark = (startupId: string) => {
    const newBookmarks = new Set(bookmarkedStartups);
    if (newBookmarks.has(startupId)) {
      newBookmarks.delete(startupId);
    } else {
      newBookmarks.add(startupId);
    }
    setBookmarkedStartups(newBookmarks);
    localStorage.setItem('bookmarked_startups', JSON.stringify(Array.from(newBookmarks)));
  };

  const fetchStartups = async () => {
    setLoading(true);
    try {
      console.log('Fetching startups from AWS:', `${API_URL}/startups`);
      
      const response = await fetch(`${API_URL}/startups`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received startups from AWS:', data.length, 'startups');
      
      setStartups(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError('Failed to fetch startups from AWS');
      setLoading(false);
    }
  };
  


  const filteredStartups = startups
    .filter(startup => {
      const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           startup.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = !filterIndustry || startup.industry === filterIndustry;
      const matchesStage = !filterStage || startup.funding_stage === filterStage;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedStartups.has(startup.startup_id);
      return matchesSearch && matchesIndustry && matchesStage && matchesBookmark;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'founded') return b.founded_year - a.founded_year;
      return 0;
    });

  const industries = Array.from(new Set(startups.map(s => s.industry)));
  const stages = Array.from(new Set(startups.map(s => s.funding_stage)));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing startups...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="section-title">🏢 Browse Startups</h2>
        <div className="portfolio-toggle">
          <button 
            className={`portfolio-btn ${showBookmarkedOnly ? 'active' : ''}`}
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          >
            ⭐ My Portfolio ({bookmarkedStartups.size})
          </button>
        </div>
      </div>
      
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search startups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="filter-select"
        >
          <option value="">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="filter-select"
        >
          <option value="">All Stages</option>
          {stages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'founded' | 'stage')}
          className="filter-select"
        >
          <option value="name">Sort by Name</option>
          <option value="founded">Sort by Newest</option>
        </select>
      </div>

      <div className="stats">
        Showing {filteredStartups.length} of {startups.length} startups
        {showBookmarkedOnly && ' (Bookmarked)'}
      </div>

      <div className="startup-grid">
        {filteredStartups.map(startup => (
          <StartupCard 
            key={startup.startup_id} 
            startup={startup}
            isBookmarked={bookmarkedStartups.has(startup.startup_id)}
            onBookmark={() => toggleBookmark(startup.startup_id)}
            onViewDetails={() => setSelectedStartup(startup)}
          />
        ))}
      </div>

      {selectedStartup && (
        <StartupDetailModal 
          startup={selectedStartup}
          isBookmarked={bookmarkedStartups.has(selectedStartup.startup_id)}
          onBookmark={() => toggleBookmark(selectedStartup.startup_id)}
          onClose={() => setSelectedStartup(null)}
        />
      )}
    </div>
  );
}

interface StartupCardProps {
  startup: Startup;
  isBookmarked: boolean;
  onBookmark: () => void;
  onViewDetails: () => void;
}

function StartupCard({ startup, isBookmarked, onBookmark, onViewDetails }: StartupCardProps) {
  const getBadgeClass = () => {
    return 'stage-badge ' + startup.funding_stage.toLowerCase().replace(' ', '-').replace(/\s+/g, '-');
  };

  return (
    <div className="startup-card" onClick={onViewDetails}>
      <div className="card-header">
        <h3>{startup.name}</h3>
        <div className="card-badges">
          <span className={getBadgeClass()}>{startup.funding_stage}</span>
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            title={isBookmarked ? 'Remove from portfolio' : 'Add to portfolio'}
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="industry">
          <strong>Industry:</strong> {startup.industry}
        </p>
        <p className="description">{startup.description}</p>
        {startup.funding_amount && (
          <p className="funding">
            <strong>💰 Total Raised:</strong> {startup.funding_amount}
          </p>
        )}
        <p className="location">📍 {startup.location}</p>
        <p className="founded">Founded: {startup.founded_year}</p>
      </div>
      <div className="card-footer">
        <button className="view-details-btn">
          View Details →
        </button>
      </div>
    </div>
  );
}

interface StartupDetailModalProps {
  startup: Startup;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
}

function StartupDetailModal({ startup, isBookmarked, onBookmark, onClose }: StartupDetailModalProps) {
  const handleContact = () => {
    alert('Contact request sent to ' + startup.name + '! They will receive your information via email.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div>
            <h2>{startup.name}</h2>
            <p className="modal-tagline">{startup.industry} • {startup.location}</p>
          </div>
          <button 
            className={`bookmark-btn-large ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={onBookmark}
          >
            {isBookmarked ? '⭐ Bookmarked' : '☆ Add to Portfolio'}
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>📋 Overview</h3>
            <p>{startup.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">🏆 Funding Stage</span>
              <span className="detail-value">{startup.funding_stage}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💰 Total Raised</span>
              <span className="detail-value">{startup.funding_amount || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">👥 Team Size</span>
              <span className="detail-value">{startup.team_size || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📅 Founded</span>
              <span className="detail-value">{startup.founded_year}</span>
            </div>
          </div>

          {startup.revenue_model && (
            <div className="detail-section">
              <h3>💵 Revenue Model</h3>
              <p>{startup.revenue_model}</p>
            </div>
          )}

          {startup.key_metrics && startup.key_metrics.length > 0 && (
            <div className="detail-section">
              <h3>📊 Key Metrics</h3>
              <ul className="metrics-list">
                {startup.key_metrics.map((metric, index) => (
                  <li key={index}>✓ {metric}</li>
                ))}
              </ul>
            </div>
          )}

          {startup.competitors && startup.competitors.length > 0 && (
            <div className="detail-section">
              <h3>🎯 Competitive Landscape</h3>
              <div className="competitors-list">
                {startup.competitors.map((competitor, index) => (
                  <span key={index} className="competitor-tag">{competitor}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <a 
            href={startup.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="website-link-large"
          >
            🌐 Visit Website
          </a>
          <button onClick={handleContact} className="contact-btn-large">
            ✉️ Contact Startup
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

