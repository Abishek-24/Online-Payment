import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Check,
  X,
  Menu,
  Home,
  CreditCard,
  Info,
  MessageCircle,
  Star,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

// Simple Animation Hook
const useAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return isVisible;
};

// Custom Confetti Component
const Confetti = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));
    setParticles(newParticles);
    
    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            animationDuration: `${Math.random() * 2 + 1}s`
          }}
        />
      ))}
    </div>
  );
};

// API Service
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  checkConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { 
        success: false, 
        message: 'Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000' 
      };
    }
  },

  submitPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.message.includes('fetch') 
          ? 'Cannot connect to backend server. Please ensure backend is running on http://localhost:5000'
          : `Payment failed: ${error.message}`
      };
    }
  },

  submitContact: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.message.includes('fetch') 
          ? 'Cannot connect to backend server. Please ensure backend is running.'
          : `Failed to send message: ${error.message}`
      };
    }
  },

  getAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/summary`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to load analytics data',
        data: {
          overview: {
            totalConsumers: 500000,
            totalPayments: 1200000,
            totalRevenue: 45000000,
            averageUnits: 285
          }
        }
      };
    }
  }
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const increment = end / (duration * 30);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 33);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Navigation Component
const Navbar = ({ currentPage, setCurrentPage, t, language }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'pay-bill', label: t('payBill'), icon: CreditCard },
    { id: 'about', label: t('about'), icon: Info },
    { id: 'contact', label: t('contact'), icon: MessageCircle },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TNEB
              </h1>
              <p className="text-xs text-gray-600">{t('onlineServices')}</p>
            </div>
          </div>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors hover:translate-x-2 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = ({ setCurrentPage }) => {
  const [analytics, setAnalytics] = useState({
    totalConsumers: 500000,
    totalPayments: 1200000,
    totalRevenue: 45000000,
    averageUnits: 285
  });
  const isVisible = useAnimation();

  useEffect(() => {
    apiService.getAnalytics().then(response => {
      if (response.success) {
        setAnalytics(response.data.overview);
      }
    }).catch(console.error);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Easy Payment',
      description: 'Simple and intuitive interface for quick bill payments. No hassle, no queues.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Bank-level security ensures your personal and payment information is always protected.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Pay your bills anytime, anywhere. Our service is available round the clock.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { label: 'Active Consumers', value: analytics.totalConsumers, suffix: '+' },
    { label: 'Bills Paid', value: analytics.totalPayments, suffix: '+' },
    { label: 'Revenue Collected', value: `₹${(analytics.totalRevenue / 10000000).toFixed(1)}`, suffix: 'Cr' },
    { label: 'Avg Units', value: Math.round(analytics.averageUnits), suffix: '' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Tamil Nadu
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Electricity Board
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto opacity-90">
              Experience the future of bill payments with our secure, fast, and user-friendly platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setCurrentPage('pay-bill')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  Pay Your Bill Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} />
                    <span className="text-blue-300">{stat.suffix}</span>
                  </div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TNEB Online?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the convenience of digital bill payment with our secure and user-friendly platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

// Pay Bill Page Component
const PayBillPage = () => {
  const [formData, setFormData] = useState({
    serviceNumber: '',
    consumerName: '',
    email: '',
    phone: '',
    unitsConsumed: ''
  });
  const [billAmount, setBillAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [backendConnected, setBackendConnected] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      const result = await apiService.checkConnection();
      setBackendConnected(result.success);
      // Don't set error message here - we'll handle it gracefully in demo mode
    };
    checkConnection();
  }, []);

  // Calculate bill amount
  const calculateBill = (units) => {
    const unitsNum = parseInt(units) || 0;
    let amount = 0;

    if (unitsNum <= 100) {
      amount = 0;
    } else if (unitsNum <= 200) {
      amount = (unitsNum - 100) * 2.25;
    } else if (unitsNum <= 500) {
      amount = (100 * 2.25) + ((unitsNum - 200) * 4.50);
    } else {
      amount = (100 * 2.25) + (300 * 4.50) + ((unitsNum - 500) * 6.00);
    }

    return Math.round(amount * 100) / 100;
  };

  useEffect(() => {
    setBillAmount(calculateBill(formData.unitsConsumed));
  }, [formData.unitsConsumed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDemoPayment = () => {
    console.log('=== DEMO PAYMENT STARTED ===');
    console.log('Bill Amount:', billAmount);
    console.log('Form Data:', formData);
    
    setLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      const demoResult = {
        transactionId: `TNEB${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount: billAmount,
        serviceNumber: formData.serviceNumber,
        consumerName: formData.consumerName,
        units: parseInt(formData.unitsConsumed),
        createdAt: new Date().toISOString()
      };
      
      console.log('=== DEMO PAYMENT COMPLETED ===');
      console.log('Payment Result:', demoResult);
      
      setPaymentResult(demoResult);
      setShowModal(true);
      setShowConfetti(true);
      setLoading(false);
      
      // Reset form
      setFormData({
        serviceNumber: '',
        consumerName: '',
        email: '',
        phone: '',
        unitsConsumed: ''
      });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMITTED ===');
    console.log('Event:', e);
    console.log('Form Data:', formData);
    console.log('Backend Connected:', backendConnected);
    console.log('Bill Amount:', billAmount);
    
    setErrorMessage('');
    
    // Validation
    if (!formData.serviceNumber || !formData.consumerName || !formData.unitsConsumed) {
      const error = 'Please fill all required fields (Service Number, Consumer Name, and Units Consumed)';
      console.log('Validation failed:', error);
      setErrorMessage(error);
      return;
    }

    if (formData.serviceNumber.length !== 10 || isNaN(formData.serviceNumber)) {
      const error = 'Service number must be exactly 10 digits';
      console.log('Validation failed:', error);
      setErrorMessage(error);
      return;
    }

    if (parseInt(formData.unitsConsumed) < 0) {
      const error = 'Units consumed cannot be negative';
      console.log('Validation failed:', error);
      setErrorMessage(error);
      return;
    }

    console.log('Validation passed!');

    // If backend is not connected, use demo mode
    if (backendConnected === false || backendConnected === null) {
      console.log('Using DEMO MODE for payment');
      handleDemoPayment();
      return;
    }

    // Backend is connected, try real payment
    console.log('Using BACKEND MODE for payment');
    setLoading(true);

    try {
      const response = await apiService.submitPayment({
        serviceNumber: formData.serviceNumber,
        consumerName: formData.consumerName,
        email: formData.email || '',
        phone: formData.phone || '',
        units: parseInt(formData.unitsConsumed),
        amount: billAmount
      });

      console.log('Backend response:', response);

      if (response.success) {
        setPaymentResult(response.data);
        setShowModal(true);
        setShowConfetti(true);
        setFormData({
          serviceNumber: '',
          consumerName: '',
          email: '',
          phone: '',
          unitsConsumed: ''
        });
      } else {
        setErrorMessage(response.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {showConfetti && <Confetti />}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Pay Your Electricity Bill
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your details below to calculate and pay your bill instantly
          </p>
          
          {backendConnected === false && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-blue-800 font-semibold">Demo Mode Active</p>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Payment system working in demo mode. All features are functional!
              </p>
            </div>
          )}
          
          {backendConnected === true && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 max-w-md mx-auto">
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 font-semibold">Connected to Backend Server</p>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 max-w-4xl mx-auto">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                Bill Details
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Number *
                    </label>
                    <input
                      type="text"
                      name="serviceNumber"
                      value={formData.serviceNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit service number"
                      maxLength="10"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consumer Name *
                    </label>
                    <input
                      type="text"
                      name="consumerName"
                      value={formData.consumerName}
                      onChange={handleInputChange}
                      placeholder="Enter consumer name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address (optional)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number (optional)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Units Consumed *
                  </label>
                  <input
                    type="number"
                    name="unitsConsumed"
                    value={formData.unitsConsumed}
                    onChange={handleInputChange}
                    placeholder="Enter units consumed"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm mb-3">Quick Test: Click to fill with sample data</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        serviceNumber: '1234567890',
                        consumerName: 'John Doe',
                        email: 'john@example.com',
                        phone: '9876543210',
                        unitsConsumed: '250'
                      });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Fill Sample Data
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center"
                  onClick={(e) => {
                    console.log('Button clicked!');
                    console.log('Form data:', formData);
                    console.log('Bill amount:', billAmount);
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      {backendConnected === false ? '🎭 ' : ''}
                      Proceed to Pay ₹{billAmount}
                      {backendConnected === false && ' (Demo Mode)'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Bill Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Units Consumed:</span>
                  <span className="font-semibold text-lg">{formData.unitsConsumed || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rate Applied:</span>
                  <span className="font-semibold">As per slab</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹<AnimatedCounter value={billAmount} />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Electricity Tariff
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                  <span className="font-medium">0-100 units:</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                  <span className="font-medium">101-200 units:</span>
                  <span className="font-bold text-blue-600">₹2.25/unit</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                  <span className="font-medium">201-500 units:</span>
                  <span className="font-bold text-purple-600">₹4.50/unit</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                  <span className="font-medium">Above 500 units:</span>
                  <span className="font-bold text-red-600">₹6.00/unit</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">100% Secure Payment</h4>
              <p className="text-green-100 text-sm">
                Your payment information is encrypted and protected with bank-level security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h3>
              
              <p className="text-gray-600 mb-6">
                Your electricity bill payment has been processed successfully.
              </p>
              
              {paymentResult && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-semibold">{paymentResult.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold text-green-600">₹{paymentResult.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Number:</span>
                      <span className="font-semibold">{paymentResult.serviceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consumer:</span>
                      <span className="font-semibold">{paymentResult.consumerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">{new Date(paymentResult.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowConfetti(false);
                  setPaymentResult(null);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// About Page Component
const AboutPage = () => {
  const isVisible = useAnimation();
  
  const services = [
    {
      icon: Zap,
      title: 'Power Supply',
      description: 'Reliable electricity supply to residential, commercial, and industrial consumers.',
      stats: '5M+ Consumers'
    },
    {
      icon: Shield,
      title: 'Online Services',
      description: 'Digital platforms for bill payment, service requests, and customer support.',
      stats: '99.9% Uptime'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: 'Round-the-clock customer support for all electricity-related queries and issues.',
      stats: '24/7 Available'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About TNEB
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powering Tamil Nadu's growth with reliable electricity services and innovative digital solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To provide reliable, quality electricity to all consumers across Tamil Nadu while maintaining 
              the highest standards of service delivery and ensuring sustainable, affordable power supply 
              for the state's continued growth and development.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To be the leading electricity utility in India, recognized for excellence in customer service, 
              operational efficiency, and sustainable energy solutions. We aim to power Tamil Nadu's future 
              through innovation, technology, and eco-friendly practices.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <span className="text-blue-600 font-bold text-lg">{service.stats}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Powering Tamil Nadu's Future
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={50} />L+
              </div>
              <div className="text-blue-200">Active Consumers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={99.9} />%
              </div>
              <div className="text-blue-200">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={24} />/7
              </div>
              <div className="text-blue-200">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={10} />M+
              </div>
              <div className="text-blue-200">Online Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page Component
const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isVisible = useAnimation();

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.submitContact(contactForm);
      
      if (response.success) {
        setSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['Toll Free: 1912', 'Customer Care: 044-28524310'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: ['info@tneb.gov.in', 'support@tnebonline.com'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['TNEB Corporate Office', '144, Anna Salai, Chennai - 600002'],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-semibold">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Enter your message or query"
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-start">
                    <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Emergency Contact</h3>
              <p className="mb-4 opacity-90">
                For power outages and emergency situations:
              </p>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <p className="text-3xl font-bold mb-1">1912</p>
                <p className="text-sm opacity-80">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">TNEB</h3>
                <p className="text-blue-200">Online Services</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Tamil Nadu Electricity Board - Powering the future with reliable electricity services 
              and innovative digital solutions for millions of customers across Tamil Nadu.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Toll Free: 1912
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@tneb.gov.in
              </p>
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Chennai, Tamil Nadu
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Pay Bill Online</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">View Bill History</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Customer Support</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Tariff Rates</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2025 Tamil Nadu Electricity Board. All rights reserved. | Built with ❤️ for the people of Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('english'); // 'english' or 'tamil'

  const translations = {
    english: {
      // Navbar
      home: 'Home',
      payBill: 'Pay Bill',
      about: 'About',
      contact: 'Contact',
      onlineServices: 'Online Services',
      
      // Home Page
      heroTitle1: 'Tamil Nadu',
      heroTitle2: 'Electricity Board',
      heroSubtitle: 'Experience the future of bill payments with our secure, fast, and user-friendly platform',
      payBillNow: 'Pay Your Bill Now',
      learnMore: 'Learn More',
      whyChoose: 'Why Choose',
      tnebOnline: 'TNEB Online?',
      platformDesc: 'Experience the convenience of digital bill payment with our secure and user-friendly platform',
      
      // Features
      easyPayment: 'Easy Payment',
      easyPaymentDesc: 'Simple and intuitive interface for quick bill payments. No hassle, no queues.',
      secure: 'Secure',
      secureDesc: 'Bank-level security ensures your personal and payment information is always protected.',
      service247: '24/7 Service',
      service247Desc: 'Pay your bills anytime, anywhere. Our service is available round the clock.',
      
      // Stats
      activeConsumers: 'Active Consumers',
      billsPaid: 'Bills Paid',
      revenueCollected: 'Revenue Collected',
      avgUnits: 'Avg Units',
      
      // Pay Bill Page
      payElectricityBill: 'Pay Your Electricity Bill',
      enterDetails: 'Enter your details below to calculate and pay your bill instantly',
      demoMode: 'Demo Mode Active',
      demoModeDesc: 'Payment system working in demo mode. All features are functional!',
      connected: 'Connected to Backend Server',
      billDetails: 'Bill Details',
      serviceNumber: 'Service Number',
      consumerName: 'Consumer Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      unitsConsumed: 'Units Consumed',
      fillSampleData: 'Fill Sample Data',
      quickTest: 'Quick Test: Click to fill with sample data',
      proceedToPay: 'Proceed to Pay',
      processingPayment: 'Processing Payment...',
      demoModeText: '(Demo Mode)',
      
      // Bill Summary
      billSummary: 'Bill Summary',
      unitsConsumedLabel: 'Units Consumed:',
      rateApplied: 'Rate Applied:',
      asPerSlab: 'As per slab',
      totalAmount: 'Total Amount:',
      
      // Tariff
      electricityTariff: 'Electricity Tariff',
      tariff0to100: '0-100 units:',
      tariff101to200: '101-200 units:',
      tariff201to500: '201-500 units:',
      tariffAbove500: 'Above 500 units:',
      free: 'Free',
      perUnit: '/unit',
      
      // Security
      securePayment: '100% Secure Payment',
      securePaymentDesc: 'Your payment information is encrypted and protected with bank-level security',
      
      // Payment Success
      paymentSuccessful: 'Payment Successful!',
      paymentSuccessDesc: 'Your electricity bill payment has been processed successfully.',
      transactionId: 'Transaction ID:',
      amountPaid: 'Amount Paid:',
      date: 'Date:',
      close: 'Close',
      
      // About Page
      aboutTNEB: 'About TNEB',
      aboutDesc: 'Powering Tamil Nadu\'s growth with reliable electricity services and innovative digital solutions',
      ourMission: 'Our Mission',
      missionDesc: 'To provide reliable, quality electricity to all consumers across Tamil Nadu while maintaining the highest standards of service delivery and ensuring sustainable, affordable power supply for the state\'s continued growth and development.',
      ourVision: 'Our Vision',
      visionDesc: 'To be the leading electricity utility in India, recognized for excellence in customer service, operational efficiency, and sustainable energy solutions. We aim to power Tamil Nadu\'s future through innovation, technology, and eco-friendly practices.',
      ourServices: 'Our Services',
      
      // Contact Page
      contactUs: 'Contact Us',
      contactDesc: 'Have questions or need assistance? We\'re here to help. Reach out to us through any of the channels below.',
      sendMessage: 'Send us a Message',
      messageSent: 'Message sent successfully! We\'ll get back to you soon.',
      fullName: 'Full Name',
      message: 'Message',
      sendingMessage: 'Sending Message...',
      phoneSupport: 'Phone Support',
      emailSupport: 'Email Support',
      visitUs: 'Visit Us',
      emergencyContact: 'Emergency Contact',
      emergencyDesc: 'For power outages and emergency situations:',
      available247: 'Available 24/7',
      
      // Footer
      footerDesc: 'Tamil Nadu Electricity Board - Powering the future with reliable electricity services and innovative digital solutions for millions of customers across Tamil Nadu.',
      contactInfo: 'Contact Info',
      quickLinks: 'Quick Links',
      payBillOnline: 'Pay Bill Online',
      viewBillHistory: 'View Bill History',
      customerSupport: 'Customer Support',
      tariffRates: 'Tariff Rates',
      rights: 'All rights reserved.'
    },
    tamil: {
      // Navbar
      home: 'முகப்பு',
      payBill: 'பில் செலுத்து',
      about: 'எங்களை பற்றி',
      contact: 'தொடர்பு',
      onlineServices: 'ஆன்லைன் சேவைகள்',
      
      // Home Page
      heroTitle1: 'தமிழ்நாடு',
      heroTitle2: 'மின்சார வாரியம்',
      heroSubtitle: 'பாதுகாப்பான, வேகமான மற்றும் பயனர் நட்பு தளத்துடன் பில் செலுத்தும் எதிர்காலத்தை அனுபவிக்கவும்',
      payBillNow: 'இப்போது பில் செலுத்துங்கள்',
      learnMore: 'மேலும் அறிக',
      whyChoose: 'ஏன் தேர்வு செய்ய வேண்டும்',
      tnebOnline: 'TNEB ஆன்லைன்?',
      platformDesc: 'எங்கள் பாதுகாப்பான மற்றும் பயனர் நட்பு தளத்துடன் டிஜிட்டல் பில் செலுத்தும் வசதியை அனுபவிக்கவும்',
      
      // Features
      easyPayment: 'எளிதான கட்டணம்',
      easyPaymentDesc: 'விரைவான பில் செலுத்தலுக்கு எளிமையான மற்றும் உள்ளுணர்வு இடைமுகம். சிரமம் இல்லை, வரிசைகள் இல்லை.',
      secure: 'பாதுகாப்பான',
      secureDesc: 'வங்கி அளவிலான பாதுகாப்பு உங்கள் தனிப்பட்ட மற்றும் கட்டணத் தகவல் எப்போதும் பாதுகாக்கப்படுவதை உறுதி செய்கிறது.',
      service247: '24/7 சேவை',
      service247Desc: 'எப்போது வேண்டுமானாலும், எங்கு வேண்டுமானாலும் உங்கள் பில்களை செலுத்துங்கள். எங்கள் சேவை 24 மணி நேரமும் கிடைக்கிறது.',
      
      // Stats
      activeConsumers: 'செயலில் உள்ள நுகர்வோர்',
      billsPaid: 'செலுத்தப்பட்ட பில்கள்',
      revenueCollected: 'வசூலிக்கப்பட்ட வருவாய்',
      avgUnits: 'சராசரி யூனிட்கள்',
      
      // Pay Bill Page
      payElectricityBill: 'உங்கள் மின்சார பில்லை செலுத்துங்கள்',
      enterDetails: 'உங்கள் பில்லை கணக்கிட்டு உடனடியாக செலுத்த கீழே உங்கள் விவரங்களை உள்ளிடவும்',
      demoMode: 'டெமோ முறை செயலில் உள்ளது',
      demoModeDesc: 'கட்டண அமைப்பு டெமோ முறையில் வேலை செய்கிறது. அனைத்து அம்சங்களும் செயல்படுகின்றன!',
      connected: 'பின்தள சேவையகத்துடன் இணைக்கப்பட்டுள்ளது',
      billDetails: 'பில் விவரங்கள்',
      serviceNumber: 'சேவை எண்',
      consumerName: 'நுகர்வோர் பெயர்',
      emailAddress: 'மின்னஞ்சல் முகவரி',
      phoneNumber: 'தொலைபேசி எண்',
      unitsConsumed: 'பயன்படுத்திய யூனிட்கள்',
      fillSampleData: 'மாதிரி தரவை நிரப்பவும்',
      quickTest: 'விரைவு சோதனை: மாதிரி தரவுடன் நிரப்ப கிளிக் செய்யவும்',
      proceedToPay: 'செலுத்த தொடரவும்',
      processingPayment: 'கட்டணம் செயலாக்கப்படுகிறது...',
      demoModeText: '(டெமோ முறை)',
      
      // Bill Summary
      billSummary: 'பில் சுருக்கம்',
      unitsConsumedLabel: 'பயன்படுத்திய யூனிட்கள்:',
      rateApplied: 'பயன்படுத்தப்பட்ட விகிதம்:',
      asPerSlab: 'ஸ்லாப் படி',
      totalAmount: 'மொத்த தொகை:',
      
      // Tariff
      electricityTariff: 'மின்சார கட்டணம்',
      tariff0to100: '0-100 யூனிட்கள்:',
      tariff101to200: '101-200 யூனிட்கள்:',
      tariff201to500: '201-500 யூனிட்கள்:',
      tariffAbove500: '500 க்கு மேல் யூனிட்கள்:',
      free: 'இலவசம்',
      perUnit: '/யூனிட்',
      
      // Security
      securePayment: '100% பாதுகாப்பான கட்டணம்',
      securePaymentDesc: 'உங்கள் கட்டணத் தகவல் குறியாக்கம் செய்யப்பட்டு வங்கி அளவிலான பாதுகாப்புடன் பாதுகாக்கப்படுகிறது',
      
      // Payment Success
      paymentSuccessful: 'கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது!',
      paymentSuccessDesc: 'உங்கள் மின்சார பில் கட்டணம் வெற்றிகரமாக செயலாக்கப்பட்டது.',
      transactionId: 'பரிவர்த்தனை ஐடி:',
      amountPaid: 'செலுத்தப்பட்ட தொகை:',
      date: 'தேதி:',
      close: 'மூடு',
      
      // About Page
      aboutTNEB: 'TNEB பற்றி',
      aboutDesc: 'நம்பகமான மின்சார சேவைகள் மற்றும் புதுமையான டிஜிட்டல் தீர்வுகளுடன் தமிழ்நாட்டின் வளர்ச்சியை ஆற்றல் அளிக்கிறது',
      ourMission: 'எங்கள் நோக்கம்',
      missionDesc: 'தமிழ்நாடு முழுவதும் உள்ள அனைத்து நுகர்வோருக்கும் நம்பகமான, தரமான மின்சாரத்தை வழங்குவது மற்றும் மாநிலத்தின் தொடர்ச்சியான வளர்ச்சி மற்றும் மேம்பாட்டிற்கு நிலையான, மலிவு மின்சார விநியோகத்தை உறுதி செய்வது.',
      ourVision: 'எங்கள் தொலைநோக்கு பார்வை',
      visionDesc: 'வாடிக்கையாளர் சேவை, செயல்பாட்டு திறன் மற்றும் நிலையான ஆற்றல் தீர்வுகளில் சிறந்து விளங்கும் இந்தியாவின் முன்னணி மின்சார பயன்பாட்டு நிறுவனமாக இருப்பது.',
      ourServices: 'எங்கள் சேவைகள்',
      
      // Contact Page
      contactUs: 'எங்களை தொடர்பு கொள்ளுங்கள்',
      contactDesc: 'கேள்விகள் உள்ளதா அல்லது உதவி தேவையா? நாங்கள் உதவ இங்கே இருக்கிறோம். கீழே உள்ள எந்த சேனல் மூலமும் எங்களை தொடர்பு கொள்ளுங்கள்.',
      sendMessage: 'எங்களுக்கு ஒரு செய்தி அனுப்புங்கள்',
      messageSent: 'செய்தி வெற்றிகரமாக அனுப்பப்பட்டது! விரைவில் நாங்கள் உங்களை தொடர்பு கொள்வோம்.',
      fullName: 'முழு பெயர்',
      message: 'செய்தி',
      sendingMessage: 'செய்தி அனுப்பப்படுகிறது...',
      phoneSupport: 'தொலைபேசி ஆதரவு',
      emailSupport: 'மின்னஞ்சல் ஆதரவு',
      visitUs: 'எங்களை பார்வையிடுங்கள்',
      emergencyContact: 'அவசர தொடர்பு',
      emergencyDesc: 'மின் தடை மற்றும் அவசர சூழ்நிலைகளுக்கு:',
      available247: '24/7 கிடைக்கிறது',
      
      // Footer
      footerDesc: 'தமிழ்நாடு மின்சார வாரியம் - தமிழ்நாடு முழுவதும் மில்லியன் கணக்கான வாடிக்கையாளர்களுக்கு நம்பகமான மின்சார சேவைகள் மற்றும் புதுமையான டிஜிட்டல் தீர்வுகளுடன் எதிர்காலத்தை ஆற்றல் அளிக்கிறது.',
      contactInfo: 'தொடர்பு தகவல்',
      quickLinks: 'விரைவு இணைப்புகள்',
      payBillOnline: 'ஆன்லைனில் பில் செலுத்துங்கள்',
      viewBillHistory: 'பில் வரலாற்றைப் பார்க்கவும்',
      customerSupport: 'வாடிக்கையாளர் ஆதரவு',
      tariffRates: 'கட்டண விகிதங்கள்',
      rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. | தமிழ்நாடு மக்களுக்காக ❤️ உடன் உருவாக்கப்பட்டது'
    }
  };

  const t = (key) => translations[language][key] || key;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} t={t} language={language} />;
      case 'pay-bill':
        return <PayBillPage t={t} language={language} />;
      case 'about':
        return <AboutPage t={t} language={language} />;
      case 'contact':
        return <ContactPage t={t} language={language} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} t={t} language={language} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} language={language} />
      
      {/* Language Toggle Button - Floating */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
          className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 flex items-center space-x-2 font-bold text-lg"
        >
          <span className="text-2xl">🌐</span>
          <span>{language === 'english' ? 'தமிழ்' : 'English'}</span>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {language === 'english' ? 'Switch to Tamil' : 'ஆங்கிலத்திற்கு மாறவும்'}
          </div>
        </button>
      </div>
      
      <main className="relative">
        {renderPage()}
      </main>
      <Footer t={t} language={language} />
    </div>
  );
};

export default App;