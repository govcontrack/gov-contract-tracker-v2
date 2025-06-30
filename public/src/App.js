import React, { useState, useEffect } from 'react';
import { Search, Bell, Bookmark, Calendar, DollarSign, Building, Filter, TrendingUp, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const GovContractTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [contracts, setContracts] = useState([]);
  const [savedContracts, setSavedContracts] = useState([]);
  const [userProfile, setUserProfile] = useState({
    companyName: '',
    naicsCodes: [],
    businessType: '',
    certifications: []
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('qVuggsD5W09tnL5XaddODHzmObMzq9FZL7cQr3ZB');
  const [userTier, setUserTier] = useState('free');

  // Mock data for demonstration
  const mockContracts = [
    {
      id: '1',
      title: 'IT Infrastructure Modernization Services',
      agency: 'Department of Veterans Affairs',
      naicsCode: '541512',
      type: 'Full and Open Competition',
      value: '$2,500,000 - $5,000,000',
      dueDate: '2025-07-15',
      postedDate: '2025-06-20',
      description: 'Modernize legacy IT systems and implement cloud-based solutions.',
      location: 'Washington, DC',
      setAside: 'None',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Cybersecurity Assessment Services',
      agency: 'Department of Homeland Security',
      naicsCode: '541511',
      type: 'Small Business Set-Aside',
      value: '$750,000 - $1,200,000',
      dueDate: '2025-07-22',
      postedDate: '2025-06-25',
      description: 'Comprehensive cybersecurity assessment and vulnerability testing.',
      location: 'Multiple Locations',
      setAside: 'Small Business',
      status: 'Active'
    },
    {
      id: '3',
      title: 'Data Analytics Platform Development',
      agency: 'Environmental Protection Agency',
      naicsCode: '541511',
      type: 'SDVOSB Set-Aside',
      value: '$1,800,000 - $3,200,000',
      dueDate: '2025-08-01',
      postedDate: '2025-06-28',
      description: 'Develop and implement advanced data analytics platform for environmental monitoring.',
      location: 'Research Triangle Park, NC',
      setAside: 'Service-Disabled Veteran-Owned Small Business',
      status: 'Active'
    }
  ];

  // Tier limits
  const tierLimits = {
    free: {
      searchResults: 10,
      savedContracts: 5,
      alerts: 1,
      features: ['basic_search', 'basic_save']
    },
    premium: {
      searchResults: 1000,
      savedContracts: 100,
      alerts: 20,
      features: ['advanced_filters', 'email_alerts', 'analytics', 'export']
    },
    enterprise: {
      searchResults: -1,
      savedContracts: -1,
      alerts: -1,
      features: ['team_collaboration', 'api_access', 'custom_reports', 'priority_support']
    }
  };

  const hasFeature = (feature) => {
    return tierLimits[userTier].features.includes(feature);
  };

  const isWithinLimit = (type, current) => {
    const limit = tierLimits[userTier][type];
    return limit === -1 || current < limit;
  };

  const stats = {
    totalOpportunities: 1247,
    deadlinesThisWeek: 23,
    savedContracts: savedContracts.length,
    matchingProfile: 89
  };

  // Function to fetch real contract data from SAM.gov API
  const fetchContractsFromAPI = async (searchParams = {}) => {
    if (!apiKey) {
      console.log('API key not provided - using mock data');
      return mockContracts;
    }

    setLoading(true);
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const baseUrl = 'https://api.sam.gov/opportunities/v2/search';
      const params = new URLSearchParams({
        api_key: apiKey,
        limit: '25',
        postedFrom: '06/01/2025',
        postedTo: '12/31/2025',
        ...searchParams
      });

      const fullUrl = encodeURIComponent(`${baseUrl}?${params}`);
      const response = await fetch(`${proxyUrl}${fullUrl}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const transformedContracts = data.opportunitiesData?.map(opportunity => ({
        id: opportunity.noticeId || Math.random().toString(),
        title: opportunity.title || 'No title',
        agency: opportunity.department || opportunity.subAgency || opportunity.office || 'Unknown Agency',
        naicsCode: opportunity.naicsCode || 'N/A',
        type: opportunity.typeOfSetAsideDescription || 'Open Competition',
        value: opportunity.baseAndAllOptionsValue || 'Not specified',
        dueDate: opportunity.responseDeadLine?.split('T')[0] || 'TBD',
        postedDate: opportunity.postedDate?.split('T')[0] || 'Unknown',
        description: (opportunity.description || 'No description available').substring(0, 200) + '...',
        location: opportunity.placeOfPerformance?.city?.cityName || opportunity.placeOfPerformance?.state?.name || 'Multiple Locations',
        setAside: opportunity.typeOfSetAsideDescription || 'None',
        status: 'Active'
      })) || [];

      console.log('Transformed contracts:', transformedContracts);
      return transformedContracts.length > 0 ? transformedContracts : mockContracts;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      console.log('Falling back to mock data due to API error');
      return mockContracts;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [apiKey]);

  const loadContracts = async () => {
    const contractData = await fetchContractsFromAPI();
    setContracts(contractData);
  };

  const handleSaveContract = (contractId) => {
    if (!isWithinLimit('savedContracts', savedContracts.length)) {
      alert(`Upgrade to Premium to save more than ${tierLimits[userTier].savedContracts} contracts!`);
      return;
    }
    
    const contract = contracts.find(c => c.id === contractId);
    if (contract && !savedContracts.find(s => s.id === contractId)) {
      setSavedContracts([...savedContracts, contract]);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (apiKey) {
      const searchParams = {};
      if (query) {
        searchParams.keyword = query;
      }
      const results = await fetchContractsFromAPI(searchParams);
      setContracts(results);
    } else {
      if (query) {
        const filtered = mockContracts.filter(contract => 
          contract.title.toLowerCase().includes(query.toLowerCase()) ||
          contract.agency.toLowerCase().includes(query.toLowerCase()) ||
          contract.description.toLowerCase().includes(query.toLowerCase())
        );
        setContracts(filtered);
      } else {
        setContracts(mockContracts);
      }
    }
  };

  const formatDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysLeft) => {
    if (daysLeft <= 7) return 'text-red-600 bg-red-50';
    if (daysLeft <= 14) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const renderPricingModal = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-8 shadow-sm border">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Free</h3>
            <div className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-500">/month</span></div>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ 10 search results</li>
              <li>✓ Save 5 contracts</li>
              <li>✓ Basic alerts</li>
              <li>✗ Advanced filters</li>
              <li>✗ Analytics</li>
            </ul>
            <button 
              onClick={() => setUserTier('free')}
              className={`w-full py-2 px-4 rounded ${userTier === 'free' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Current Plan
            </button>
          </div>

          <div className="border-2 border-blue-500 rounded-lg p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-4">$49<span className="text-sm text-gray-500">/month</span></div>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ 1,000 search results</li>
              <li>✓ Save 100 contracts</li>
              <li>✓ Email alerts</li>
              <li>✓ Advanced filters</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Export data</li>
            </ul>
            <button 
              onClick={() => setUserTier('premium')}
              className="w-full py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Upgrade to Premium
            </button>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-4">$199<span className="text-sm text-gray-500">/month</span></div>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ Unlimited everything</li>
              <li>✓ Team collaboration</li>
              <li>✓ API access</li>
              <li>✓ Custom reports</li>
              <li>✓ Priority support</li>
            </ul>
            <button 
              onClick={() => setUserTier('enterprise')}
              className="w-full py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Contact Sales
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              🔍 Data Source: {contracts === mockContracts ? '📋 Demo Data' : '🌐 Live Government Data'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {contracts === mockContracts 
                ? 'Currently showing sample contracts. API may not be connected.' 
                : `Connected to SAM.gov API - Showing ${contracts.length} real opportunities`}
            </p>
          </div>
          <button
            onClick={loadContracts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOpportunities.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.deadlinesThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Bookmark className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saved Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.savedContracts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Match</p>
              <p className="text-2xl font-bold text-gray-900">{stats.matchingProfile}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Opportunities</h3>
        </div>
        <div className="divide-y">
          {contracts.slice(0, 3).map((contract) => {
            const daysLeft = formatDaysUntilDue(contract.dueDate);
            return (
              <div key={contract.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                    <p className="text-gray-600 mt-1">{contract.agency}</p>
                    <p className="text-gray-500 text-sm mt-2">{contract.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {contract.value}
                      </span>
                      <span>NAICS: {contract.naicsCode}</span>
                      <span className="text-blue-600">{contract.setAside !== 'None' ? contract.setAside : 'Open Competition'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(daysLeft)}`}>
                      {daysLeft} days left
                    </span>
                    <button
                      onClick={() => handleSaveContract(contract.id)}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {contracts === mockContracts ? (
              <div className="flex items-center text-orange-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Using Demo Data</span>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Live SAM.gov Data</span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {contracts.length} opportunities shown
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts by title, agency, or keywords..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Contract Opportunities 
            {userTier === 'free' && (
              <span className="text-sm text-orange-600 ml-2">
                (Showing {Math.min(contracts.length, tierLimits.free.searchResults)} of {contracts.length} - 
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className="underline ml-1 hover:text-orange-700"
                >
                  Upgrade for more
                </button>)
              </span>
            )}
          </h3>
          {!hasFeature('advanced_filters') && (
            <button 
              onClick={() => setActiveTab('pricing')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              🔓 Unlock Advanced Filters
            </button>
          )}
        </div>
        <div className="divide-y">
          {contracts.slice(0, userTier === 'free' ? tierLimits.free.searchResults : contracts.length).map((contract) => {
            const daysLeft = formatDaysUntilDue(contract.dueDate);
            return (
              <div key={contract.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(daysLeft)}`}>
                        Due: {contract.dueDate}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 font-medium">{contract.agency}</p>
                    <p className="text-gray-500 text-sm mt-2">{contract.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-gray-500">Value:</span>
                        <p className="font-medium">{contract.value}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">NAICS:</span>
                        <p className="font-medium">{contract.naicsCode}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Set-Aside:</span>
                        <p className="font-medium">{contract.setAside}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{contract.location}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => handleSaveContract(contract.id)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save Contract
                      </button>
                      <button 
                        onClick={() => hasFeature('email_alerts') ? null : setActiveTab('pricing')}
                        className={`flex items-center px-3 py-1 text-sm rounded border ${
                          hasFeature('email_alerts') 
                            ? 'text-green-600 hover:bg-green-50 border-green-200' 
                            : 'text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        {hasFeature('email_alerts') ? 'Set Alert' : '🔒 Set Alert'}
                      </button>
                      {!hasFeature('export') && (
                        <button 
                          onClick={() => setActiveTab('pricing')}
                          className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-50 rounded border cursor-not-allowed"
                        >
                          🔒 Export
                        </button>
                      )}
                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded border">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSaved = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Saved Contracts ({savedContracts.length})
          </h3>
        </div>
        {savedContracts.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No saved contracts yet</h4>
            <p className="text-gray-500">Save contracts from the search page to track them here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {savedContracts.map((contract) => {
              const daysLeft = formatDaysUntilDue(contract.dueDate);
              return (
                <div key={contract.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                      <p className="text-gray-600 mt-1">{contract.agency}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {contract.value}
                        </span>
                        <span>Due: {contract.dueDate}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(daysLeft)}`}>
                      {daysLeft} days left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">API Configuration</h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">SAM.gov API Key</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your SAM.gov API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Your API key from sam.gov - used to fetch live contract data
          </p>
        </div>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h4 className="font-medium text-blue-900">API Status</h4>
            <p className="text-sm text-blue-700">
              {apiKey ? 'Connected - Using live SAM.gov data' : 'Using demo data - Add API key above'}
            </p>
          </div>
          {apiKey && (
            <button 
              onClick={loadContracts}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Connection'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
              value={userProfile.companyName}
              onChange={(e) => setUserProfile({...userProfile, companyName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userProfile.businessType}
              onChange={(e) => setUserProfile({...userProfile, businessType: e.target.value})}
            >
              <option value="">Select business type</option>
              <option value="small">Small Business</option>
              <option value="small-disadvantaged">Small Disadvantaged Business</option>
              <option value="woman-owned">Woman-Owned Small Business</option>
              <option value="veteran-owned">Veteran-Owned Small Business</option>
              <option value="sdvosb">Service-Disabled Veteran-Owned Small Business</option>
              <option value="hubzone">HUBZone Small Business</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-
