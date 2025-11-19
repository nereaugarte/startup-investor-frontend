import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';  // ADD THIS LINE
import awsConfig, { API_URL } from './aws-config';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
// import AnalyticsDashboard from './AnalyticsDashboard';
// import RecommendedStartups from './RecommendedStartups';

Amplify.configure(awsConfig);

interface Startup {
  startup_id: string;
  name: string;
  industry: string;
  funding_stage: string;
  description: string;
  location: string;
  founded_year: number;
  website: string;
  funding_amount: string;
  team_size: string;
  revenue_model: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  date: string;
}

function App() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedFundingStage, setSelectedFundingStage] = useState('All Stages');
  const [sortBy, setSortBy] = useState('name');
  const [showPortfolio, setShowPortfolio] = useState(false);

  // User ID (in real app, this would come from Cognito auth)
  const [userId] = useState<string>(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', id);
    }
    return id;
  });

  // Bookmark management with backend integration
  const [bookmarkedStartups, setBookmarkedStartups] = useState<Set<string>>(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // Fetch bookmarks from backend
  const fetchBookmarks = async () => {
    setLoadingBookmarks(true);
    try {
      const response = await fetch(`${API_URL}/bookmarks/${userId}`);
      if (response.ok) {
        const bookmarks = await response.json();
        const bookmarkIds = new Set<string>(bookmarks.map((b: any) => b.startup_id));
        setBookmarkedStartups(bookmarkIds);
        console.log('Loaded bookmarks from backend:', bookmarkIds.size);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('bookmarkedStartups');
        if (saved) {
          setBookmarkedStartups(new Set(JSON.parse(saved)));
          console.log('Loaded bookmarks from localStorage (backend unavailable)');
        }
      }
    } catch (error) {
      console.error('Error fetching bookmarks (using localStorage):', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('bookmarkedStartups');
      if (saved) {
        setBookmarkedStartups(new Set(JSON.parse(saved)));
      }
    } finally {
      setLoadingBookmarks(false);
    }
  };

  // Load bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  // Toggle bookmark
  const toggleBookmark = async (startupId: string, startupName: string) => {
    const isBookmarked = bookmarkedStartups.has(startupId);
    
    // Optimistic update
    const newBookmarks = new Set(bookmarkedStartups);
    if (isBookmarked) {
      newBookmarks.delete(startupId);
    } else {
      newBookmarks.add(startupId);
    }
    setBookmarkedStartups(newBookmarks);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`${API_URL}/bookmarks/${userId}/${startupId}`, {
          method: 'DELETE'
        });
        console.log('Bookmark removed');
      } else {
        // Add bookmark
        await fetch(`${API_URL}/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            startup_id: startupId,
            startup_name: startupName
          })
        });
        console.log('Bookmark added');
      }
    } catch (error) {
      console.error('Error toggling bookmark (using localStorage fallback):', error);
      // Revert on error
      localStorage.setItem('bookmarkedStartups', JSON.stringify(Array.from(newBookmarks)));
    }
  };

  // ========== FIXED FETCH STARTUPS FUNCTION ==========
  const fetchStartups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching startups from AWS:', `${API_URL}/startups`);
      
      // Get the authentication token
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('Not authenticated. Please sign in again.');
      }
      
      console.log('Auth token obtained, making authenticated request...');
      
      // Make authenticated request with token
      const response = await fetch(`${API_URL}/startups`, {
        method: 'GET',
        headers: {
          'Authorization': token,  // Send the JWT token
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data from AWS:', data);
      
      // Handle different response formats from Lambda
      if (data.startups && Array.isArray(data.startups)) {
        setStartups(data.startups);
        console.log('Loaded startups:', data.startups.length);
      } else if (Array.isArray(data)) {
        setStartups(data);
        console.log('Loaded startups:', data.length);
      } else {
        console.warn('Unexpected data format:', data);
        setStartups([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching startups:', err);
      setError(err.message || 'Failed to fetch startups from AWS');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleViewStartup = (startup: Startup) => {
    setSelectedStartup(startup);
  };

  const handleCloseModal = () => {
    setSelectedStartup(null);
  };

  // Market News Data
  const marketNews: NewsItem[] = [
    {
      id: 1,
      title: "Venture Capital Funding Reaches Record High in Q4 2024",
      summary: "Global VC investments exceeded $150B in the last quarter, with AI and climate tech leading the surge.",
      category: "VC Trends",
      date: "2024-12-15"
    },
    {
      id: 2,
      title: "Fintech Startups Dominate Series A Funding Rounds",
      summary: "Payment processing and digital banking solutions attracted over $8B in early-stage funding.",
      category: "FinTech",
      date: "2024-12-10"
    },
    {
      id: 3,
      title: "SaaS Market Expected to Grow 20% in 2025",
      summary: "Enterprise software adoption continues to accelerate, with B2B SaaS companies showing strong growth metrics.",
      category: "Market Analysis",
      date: "2024-12-08"
    },
    {
      id: 4,
      title: "Clean Energy Startups Attract Major Investment",
      summary: "Renewable energy and carbon capture technologies received $12B in new funding commitments.",
      category: "CleanTech",
      date: "2024-12-05"
    },
    {
      id: 5,
      title: "Healthcare AI Companies See Valuation Surge",
      summary: "Medical diagnosis and drug discovery platforms raised significant capital at premium valuations.",
      category: "HealthTech",
      date: "2024-12-03"
    },
    {
      id: 6,
      title: "Cybersecurity Remains Top Priority for Enterprise Investors",
      summary: "With increasing cyber threats, security startups secured $6B in strategic investments.",
      category: "Cybersecurity",
      date: "2024-11-28"
    }
  ];

  // Filter and sort startups
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || startup.industry === selectedIndustry;
    const matchesFundingStage = selectedFundingStage === 'All Stages' || startup.funding_stage === selectedFundingStage;
    const matchesPortfolio = !showPortfolio || bookmarkedStartups.has(startup.startup_id);
    
    return matchesSearch && matchesIndustry && matchesFundingStage && matchesPortfolio;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'founded_year') {
      return b.founded_year - a.founded_year;
    }
    return 0;
  });

  // Get unique industries and funding stages
  const industries = ['All Industries', ...Array.from(new Set(startups.map(s => s.industry)))];
  const fundingStages = ['All Stages', ...Array.from(new Set(startups.map(s => s.funding_stage)))];

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="app">
          {/* Header */}
          <header className="app-header">
            <div className="header-content">
              <h1>🚀 Startup Investor Platform</h1>
              <div className="header-actions">
                <span className="user-email">{user?.signInDetails?.loginId}</span>
                <button onClick={signOut} className="signout-button">
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          {/* Market News Section */}
          <section className="market-news-section">
            <div className="container">
              <h2 className="section-title">📰 Market News & Trends</h2>
              <div className="news-grid">
                {marketNews.map(news => (
                  <div key={news.id} className="news-card">
                    <span className="news-category">{news.category}</span>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-summary">{news.summary}</p>
                    <p className="news-date">{news.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analytics Dashboard - Temporarily disabled */}
          {/* <section>
            <div className="container">
              <AnalyticsDashboard />
            </div>
          </section> */}

          {/* Recommended Startups - Temporarily disabled */}
          {/* <section>
            <div className="container">
              <RecommendedStartups 
                userId={userId} 
                onStartupClick={handleViewStartup}
              />
            </div>
          </section> */}

          {/* Main Content */}
          <main className="main-content">
            <div className="container">
              <div className="dashboard-header">
                <h2 className="section-title">Discover Startups</h2>
                <div className="stats">
                  <span className="stat-item">{startups.length} Startups</span>
                  <span className="stat-item">{bookmarkedStartups.size} Bookmarked</span>
                </div>
              </div>

              {/* Filters */}
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="filter-select"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>

                <select
                  value={selectedFundingStage}
                  onChange={(e) => setSelectedFundingStage(e.target.value)}
                  className="filter-select"
                >
                  {fundingStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="founded_year">Sort by Year</option>
                </select>

                <button
                  onClick={() => setShowPortfolio(!showPortfolio)}
                  className={`portfolio-filter ${showPortfolio ? 'active' : ''}`}
                >
                  {showPortfolio ? '⭐ My Portfolio' : '☆ My Portfolio'} ({bookmarkedStartups.size})
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading startups from AWS...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={fetchStartups} className="retry-button">
                    Try Again
                  </button>
                </div>
              )}

              {/* Startups Grid */}
              {!loading && !error && (
                <div className="startups-grid">
                  {filteredStartups.map((startup) => (
                    <div key={startup.startup_id} className="startup-card">
                      <div className="card-header">
                        <h3>{startup.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(startup.startup_id, startup.name);
                          }}
                          className="bookmark-btn"
                          title={bookmarkedStartups.has(startup.startup_id) ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          <span className={bookmarkedStartups.has(startup.startup_id) ? 'star-filled' : 'star-outline'}>
                            {bookmarkedStartups.has(startup.startup_id) ? '★' : '☆'}
                          </span>
                        </button>
                      </div>
                      <div className="card-tags">
                        <span className="tag industry-tag">{startup.industry}</span>
                        <span className="tag stage-tag">{startup.funding_stage}</span>
                      </div>
                      <p className="card-description">{startup.description}</p>
                      <div className="card-info">
                        <div className="info-item">
                          <span className="info-label">Location:</span>
                          <span className="info-value">{startup.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Founded:</span>
                          <span className="info-value">{startup.founded_year}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Funding:</span>
                          <span className="info-value">{startup.funding_amount}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Team Size:</span>
                          <span className="info-value">{startup.team_size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewStartup(startup)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && filteredStartups.length === 0 && (
                <div className="empty-state">
                  <p>No startups found matching your criteria.</p>
                </div>
              )}
            </div>
          </main>

          {/* Startup Detail Modal */}
          {selectedStartup && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
                <div className="modal-header">
                  <div>
                    <h2>{selectedStartup.name}</h2>
                    <div className="modal-tags">
                      <span className="tag industry-tag">{selectedStartup.industry}</span>
                      <span className="tag stage-tag">{selectedStartup.funding_stage}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(selectedStartup.startup_id, selectedStartup.name);
                    }}
                    className="bookmark-btn large"
                  >
                    <span className={bookmarkedStartups.has(selectedStartup.startup_id) ? 'star-filled' : 'star-outline'}>
                      {bookmarkedStartups.has(selectedStartup.startup_id) ? '★' : '☆'}
                    </span>
                  </button>
                </div>
                <div className="modal-body">
                  <section className="modal-section">
                    <h3>About</h3>
                    <p>{selectedStartup.description}</p>
                  </section>

                  <section className="modal-section">
                    <h3>Key Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Location</span>
                        <span className="info-value">{selectedStartup.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Founded</span>
                        <span className="info-value">{selectedStartup.founded_year}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Funding</span>
                        <span className="info-value">{selectedStartup.funding_amount}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Team Size</span>
                        <span className="info-value">{selectedStartup.team_size}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Website</span>
                        <a href={selectedStartup.website} target="_blank" rel="noopener noreferrer" className="info-link">
                          Visit Website →
                        </a>
                      </div>
                    </div>
                  </section>

                  <section className="modal-section">
                    <h3>Revenue Model</h3>
                    <p>{selectedStartup.revenue_model}</p>
                  </section>

                  <button className="contact-btn">
                    📧 Contact Startup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="app-footer">
            <div className="container">
              <p>© 2024 Startup Investor Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </Authenticator>
  );
}

export default App;

