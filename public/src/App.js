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
      location
