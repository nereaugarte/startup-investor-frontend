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

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const sampleData: Startup[] = [
        {
          startup_id: 'startup_001',
          name: 'OpenAI',
          industry: 'Artificial Intelligence',
          funding_stage: 'Series C',
          description: 'Leading AI research company developing GPT models and ChatGPT. Creating safe and beneficial artificial general intelligence.',
          location: 'San Francisco, CA',
          founded_year: 2015,
          website: 'https://openai.com'
        },
        {
          startup_id: 'startup_002',
          name: 'Stripe',
          industry: 'FinTech',
          funding_stage: 'Series I',
          description: 'Payment processing platform for internet businesses. Handles billions in transactions for millions of companies worldwide.',
          location: 'San Francisco, CA',
          founded_year: 2010,
          website: 'https://stripe.com'
        },
        {
          startup_id: 'startup_003',
          name: 'Databricks',
          industry: 'Data & Analytics',
          funding_stage: 'Series I',
          description: 'Unified analytics platform built on Apache Spark. Enables data teams to collaborate on AI and ML workloads.',
          location: 'San Francisco, CA',
          founded_year: 2013,
          website: 'https://databricks.com'
        },
        {
          startup_id: 'startup_004',
          name: 'Figma',
          industry: 'Design & Productivity',
          funding_stage: 'Series E',
          description: 'Collaborative interface design tool in the browser. Used by teams at Airbnb, Microsoft, and thousands of companies.',
          location: 'San Francisco, CA',
          founded_year: 2012,
          website: 'https://figma.com'
        },
        {
          startup_id: 'startup_005',
          name: 'Notion',
          industry: 'Productivity',
          funding_stage: 'Series C',
          description: 'All-in-one workspace for notes, docs, wikis, and project management. Serving millions of users and teams globally.',
          location: 'San Francisco, CA',
          founded_year: 2016,
          website: 'https://notion.so'
        },
        {
          startup_id: 'startup_006',
          name: 'Canva',
          industry: 'Design & Media',
          funding_stage: 'Series C',
          description: 'Online graphic design platform with drag-and-drop interface. Empowers 100M+ users to create professional designs.',
          location: 'Sydney, Australia',
          founded_year: 2012,
          website: 'https://canva.com'
        },
        {
          startup_id: 'startup_007',
          name: 'Discord',
          industry: 'Social & Communication',
          funding_stage: 'Series H',
          description: 'Voice, video and text communication platform for communities. 150M+ monthly active users across gaming and beyond.',
          location: 'San Francisco, CA',
          founded_year: 2015,
          website: 'https://discord.com'
        },
        {
          startup_id: 'startup_008',
          name: 'Plaid',
          industry: 'FinTech',
          funding_stage: 'Series D',
          description: 'Financial services API platform connecting apps to user bank accounts. Powers fintech apps like Venmo and Robinhood.',
          location: 'San Francisco, CA',
          founded_year: 2013,
          website: 'https://plaid.com'
        },
        {
          startup_id: 'startup_009',
          name: 'Airtable',
          industry: 'Productivity',
          funding_stage: 'Series F',
          description: 'Low-code platform combining spreadsheets with database power. Used by 300,000+ organizations for workflow automation.',
          location: 'San Francisco, CA',
          founded_year: 2012,
          website: 'https://airtable.com'
        },
        {
          startup_id: 'startup_010',
          name: 'Instacart',
          industry: 'E-commerce',
          funding_stage: 'Series I',
          description: 'Online grocery delivery and pickup service. Partnered with 1,400+ retail banners serving North America.',
          location: 'San Francisco, CA',
          founded_year: 2012,
          website: 'https://instacart.com'
        },
        {
          startup_id: 'startup_011',
          name: 'Chime',
          industry: 'FinTech',
          funding_stage: 'Series G',
          description: 'Mobile banking app with no hidden fees. Serving 13M+ accounts with early direct deposit and automated savings.',
          location: 'San Francisco, CA',
          founded_year: 2013,
          website: 'https://chime.com'
        },
        {
          startup_id: 'startup_012',
          name: 'Deel',
          industry: 'HR Tech',
          funding_stage: 'Series D',
          description: 'Global payroll and compliance platform for remote teams. Enables companies to hire anyone, anywhere compliantly.',
          location: 'San Francisco, CA',
          founded_year: 2019,
          website: 'https://deel.com'
        },
        {
          startup_id: 'startup_013',
          name: 'Anthropic',
          industry: 'Artificial Intelligence',
          funding_stage: 'Series C',
          description: 'AI safety company building reliable, interpretable, and steerable AI systems. Creators of Claude AI assistant.',
          location: 'San Francisco, CA',
          founded_year: 2021,
          website: 'https://anthropic.com'
        },
        {
          startup_id: 'startup_014',
          name: 'Snowflake',
          industry: 'Data & Analytics',
          funding_stage: 'Public',
          description: 'Cloud data platform enabling data storage, processing, and analytics. Serving thousands of enterprise customers.',
          location: 'Bozeman, MT',
          founded_year: 2012,
          website: 'https://snowflake.com'
        },
        {
          startup_id: 'startup_015',
          name: 'Webflow',
          industry: 'Design & Productivity',
          funding_stage: 'Series C',
          description: 'Visual web development platform for designers. Build production-ready websites without writing code.',
          location: 'San Francisco, CA',
          founded_year: 2013,
          website: 'https://webflow.com'
        },
        {
          startup_id: 'startup_016',
          name: 'Ramp',
          industry: 'FinTech',
          funding_stage: 'Series D',
          description: 'Corporate card and spend management platform. Helps companies save an average of 3.3% through automation and controls.',
          location: 'New York, NY',
          founded_year: 2019,
          website: 'https://ramp.com'
        },
        {
          startup_id: 'startup_017',
          name: 'Verkada',
          industry: 'Security & IoT',
          funding_stage: 'Series D',
          description: 'Cloud-based physical security platform. Smart cameras, access control, and environmental sensors for enterprises.',
          location: 'San Mateo, CA',
          founded_year: 2016,
          website: 'https://verkada.com'
        },
        {
          startup_id: 'startup_018',
          name: 'Figma',
          industry: 'Design Tools',
          funding_stage: 'Series E',
          description: 'Collaborative design platform where teams create, test, and ship better designs together in the browser.',
          location: 'San Francisco, CA',
          founded_year: 2012,
          website: 'https://figma.com'
        },
        {
          startup_id: 'startup_019',
          name: 'Rippling',
          industry: 'HR Tech',
          funding_stage: 'Series D',
          description: 'Unified workforce platform managing HR, IT, and Finance. One system for payroll, benefits, devices, and apps.',
          location: 'San Francisco, CA',
          founded_year: 2016,
          website: 'https://rippling.com'
        },
        {
          startup_id: 'startup_020',
          name: 'Gong',
          industry: 'Sales Tech',
          funding_stage: 'Series E',
          description: 'Revenue intelligence platform capturing customer interactions. AI-powered insights for sales teams.',
          location: 'San Francisco, CA',
          founded_year: 2015,
          website: 'https://gong.io'
        },
        {
          startup_id: 'startup_021',
          name: 'Scale AI',
          industry: 'Artificial Intelligence',
          funding_stage: 'Series E',
          description: 'Data platform for AI, providing high-quality training data. Powering ML models for autonomous vehicles and more.',
          location: 'San Francisco, CA',
          founded_year: 2016,
          website: 'https://scale.com'
        },
        {
          startup_id: 'startup_022',
          name: 'Gusto',
          industry: 'HR Tech',
          funding_stage: 'Series E',
          description: 'Modern payroll, benefits, and HR platform for small businesses. Serving 300,000+ businesses nationwide.',
          location: 'San Francisco, CA',
          founded_year: 2011,
          website: 'https://gusto.com'
        },
        {
          startup_id: 'startup_023',
          name: 'Toast',
          industry: 'Restaurant Tech',
          funding_stage: 'Public',
          description: 'Restaurant point-of-sale and management platform. All-in-one solution for front and back of house operations.',
          location: 'Boston, MA',
          founded_year: 2011,
          website: 'https://toasttab.com'
        },
        {
          startup_id: 'startup_024',
          name: 'Brex',
          industry: 'FinTech',
          funding_stage: 'Series D',
          description: 'Corporate credit card and spend management for startups. No personal guarantee required, higher limits.',
          location: 'San Francisco, CA',
          founded_year: 2017,
          website: 'https://brex.com'
        },
        {
          startup_id: 'startup_025',
          name: 'Superhuman',
          industry: 'Productivity',
          funding_stage: 'Series C',
          description: 'Blazingly fast email client built for high-performing teams. Average user saves 4+ hours per week.',
          location: 'San Francisco, CA',
          founded_year: 2015,
          website: 'https://superhuman.com'
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

