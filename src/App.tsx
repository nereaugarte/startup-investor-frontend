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
            <StartupDashboard />
          </main>
        </div>
      )}
    </Authenticator>
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
          name: 'TechCorp',
          industry: 'FinTech',
          funding_stage: 'Series A',
          description: 'AI-powered financial analytics platform helping businesses make data-driven decisions.',
          location: 'San Francisco, CA',
          founded_year: 2020,
          website: 'https://techcorp.example.com'
        },
        {
          startup_id: 'startup_002',
          name: 'HealthAI',
          industry: 'HealthTech',
          funding_stage: 'Seed',
          description: 'Machine learning for medical diagnostics and patient care optimization.',
          location: 'Boston, MA',
          founded_year: 2021,
          website: 'https://healthai.example.com'
        },
        {
          startup_id: 'startup_003',
          name: 'EduLearn',
          industry: 'EdTech',
          funding_stage: 'Series B',
          description: 'Personalized learning platform using adaptive algorithms.',
          location: 'Austin, TX',
          founded_year: 2019,
          website: 'https://edulearn.example.com'
        },
        {
          startup_id: 'startup_004',
          name: 'GreenEnergy',
          industry: 'CleanTech',
          funding_stage: 'Series A',
          description: 'Renewable energy solutions for residential and commercial buildings.',
          location: 'Denver, CO',
          founded_year: 2020,
          website: 'https://greenenergy.example.com'
        },
        {
          startup_id: 'startup_005',
          name: 'CloudSecure',
          industry: 'Cybersecurity',
          funding_stage: 'Seed',
          description: 'Next-generation cloud security and threat detection platform.',
          location: 'Seattle, WA',
          founded_year: 2022,
          website: 'https://cloudsecure.example.com'
        },
        {
          startup_id: 'startup_006',
          name: 'FoodTech Labs',
          industry: 'FoodTech',
          funding_stage: 'Pre-Seed',
          description: 'Sustainable food production using vertical farming technology.',
          location: 'New York, NY',
          founded_year: 2023,
          website: 'https://foodtechlabs.example.com'
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
