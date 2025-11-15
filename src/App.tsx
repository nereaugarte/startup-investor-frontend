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

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const sampleData: Startup[] = [
        {
          startup_id: 'startup_001',
          name: 'NeuralFlow AI',
          industry: 'Artificial Intelligence',
          funding_stage: 'Series A',
          description: 'Enterprise AI platform that automates complex business workflows using large language models and custom ML pipelines.',
          location: 'San Francisco, CA',
          founded_year: 2022,
          website: 'https://neuralflow.ai'
        },
        {
          startup_id: 'startup_002',
          name: 'MediScan Pro',
          industry: 'HealthTech',
          funding_stage: 'Series B',
          description: 'AI-powered medical imaging analysis that detects early-stage cancers with 99.2% accuracy, integrated with hospital PACS systems.',
          location: 'Boston, MA',
          founded_year: 2020,
          website: 'https://mediscanpro.com'
        },
        {
          startup_id: 'startup_003',
          name: 'PayFlow',
          industry: 'FinTech',
          funding_stage: 'Series A',
          description: 'B2B payment infrastructure for cross-border transactions, reducing fees by 70% and settlement time to under 1 hour.',
          location: 'New York, NY',
          founded_year: 2021,
          website: 'https://payflow.io'
        },
        {
          startup_id: 'startup_004',
          name: 'CarbonZero',
          industry: 'CleanTech',
          funding_stage: 'Seed',
          description: 'Direct air carbon capture technology using novel sorbent materials. Currently removing 1,000 tons CO2/year per unit.',
          location: 'Denver, CO',
          founded_year: 2023,
          website: 'https://carbonzero.tech'
        },
        {
          startup_id: 'startup_005',
          name: 'LearnPath',
          industry: 'EdTech',
          funding_stage: 'Series A',
          description: 'Adaptive learning platform using cognitive science to personalize education paths. 40% improvement in student outcomes.',
          location: 'Austin, TX',
          founded_year: 2021,
          website: 'https://learnpath.edu'
        },
        {
          startup_id: 'startup_006',
          name: 'SecureStack',
          industry: 'Cybersecurity',
          funding_stage: 'Series B',
          description: 'Zero-trust security platform for cloud-native applications. Automated threat detection and response in milliseconds.',
          location: 'Seattle, WA',
          founded_year: 2020,
          website: 'https://securestack.io'
        },
        {
          startup_id: 'startup_007',
          name: 'FarmGenius',
          industry: 'AgTech',
          funding_stage: 'Seed',
          description: 'Precision agriculture platform using satellite imagery and IoT sensors to optimize crop yields and reduce water usage by 35%.',
          location: 'Des Moines, IA',
          founded_year: 2023,
          website: 'https://farmgenius.ag'
        },
        {
          startup_id: 'startup_008',
          name: 'QuantumLeap',
          industry: 'Quantum Computing',
          funding_stage: 'Series A',
          description: 'Quantum computing as a service for pharmaceutical and financial modeling. 1000x speedup on specific optimization problems.',
          location: 'Cambridge, MA',
          founded_year: 2022,
          website: 'https://quantumleap.tech'
        },
        {
          startup_id: 'startup_009',
          name: 'RoboChef',
          industry: 'FoodTech',
          funding_stage: 'Pre-Seed',
          description: 'Autonomous kitchen robots for restaurant chains. Reduces labor costs by 60% while maintaining consistent food quality.',
          location: 'Los Angeles, CA',
          founded_year: 2024,
          website: 'https://robochef.kitchen'
        },
        {
          startup_id: 'startup_010',
          name: 'SpaceLink',
          industry: 'SpaceTech',
          funding_stage: 'Series B',
          description: 'Low-earth orbit satellite constellation for global IoT connectivity. Provides coverage in remote areas with 99.9% uptime.',
          location: 'Houston, TX',
          founded_year: 2019,
          website: 'https://spacelink.global'
        },
        {
          startup_id: 'startup_011',
          name: 'BioForge',
          industry: 'Biotech',
          funding_stage: 'Series A',
          description: 'Synthetic biology platform for sustainable materials production. Creating leather alternatives from engineered microorganisms.',
          location: 'San Diego, CA',
          founded_year: 2022,
          website: 'https://bioforge.bio'
        },
        {
          startup_id: 'startup_012',
          name: 'PropTech360',
          industry: 'PropTech',
          funding_stage: 'Seed',
          description: 'AI-powered real estate investment analysis platform. Predicts property values with 94% accuracy using market and demographic data.',
          location: 'Miami, FL',
          founded_year: 2023,
          website: 'https://proptech360.com'
        }
      ];

      setStartups(sampleData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch startups');
      setLoading(false);
    }
  };

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !filterIndustry || startup.industry === filterIndustry;
    const matchesStage = !filterStage || startup.funding_stage === filterStage;
    return matchesSearch && matchesIndustry && matchesStage;
  });

  const industries = Array.from(new Set(startups.map(s => s.industry)));
  const stages = Array.from(new Set(startups.map(s => s.funding_stage)));

  if (loading) {
    return <div className="loading">Loading startups...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="section-title">🏢 Browse Startups</h2>
      
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
      </div>

      <div className="stats">
        Showing {filteredStartups.length} of {startups.length} startups
      </div>

      <div className="startup-grid">
        {filteredStartups.map(startup => (
          <StartupCard key={startup.startup_id} startup={startup} />
        ))}
      </div>
    </div>
  );
}

function StartupCard({ startup }: { startup: Startup }) {
  const handleContact = () => {
    alert('Contact request sent to ' + startup.name + '! They will receive your information via email.');
  };

  const getBadgeClass = () => {
    return 'stage-badge ' + startup.funding_stage.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="startup-card">
      <div className="card-header">
        <h3>{startup.name}</h3>
        <span className={getBadgeClass()}>{startup.funding_stage}</span>
      </div>
      <div className="card-body">
        <p className="industry">
          <strong>Industry:</strong> {startup.industry}
        </p>
        <p className="description">{startup.description}</p>
        <p className="location">📍 {startup.location}</p>
        <p className="founded">Founded: {startup.founded_year}</p>
      </div>
      <div className="card-footer">
        <a href={startup.website} target="_blank" rel="noopener noreferrer" className="website-link">
          🌐 Website
        </a>
        <button onClick={handleContact} className="contact-btn">
          ✉️ Contact
        </button>
      </div>
    </div>
  );
}

export default App;

