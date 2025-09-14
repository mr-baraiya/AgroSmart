import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, TrendingUp, Calendar, MapPin, Filter, ChevronLeft, ChevronRight, Star, Navigation } from 'lucide-react';
import Header from '../../Components/common/Header';

const MandiPricesPage = () => {
  const [mandiData, setMandiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending'); // 'pending', 'granted', 'denied'
  const [sortBy, setSortBy] = useState('location'); // 'location', 'price', 'commodity'
  const [nearbyStatesBasedOnLocation, setNearbyStatesBasedOnLocation] = useState([]);
  const [showAutoSelectNotification, setShowAutoSelectNotification] = useState(false);

  // Popular cities/states for prioritized display
  const popularLocations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  // Default nearby states (fallback when location not available)
  const defaultNearbyStates = ['Haryana', 'Gujarat', 'Maharashtra', 'Punjab', 'Uttar Pradesh'];

  // State coordinates for distance calculation
  const stateCoordinates = {
    'Haryana': { lat: 29.0588, lng: 76.0856 },
    'Gujarat': { lat: 23.0225, lng: 72.5714 },
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179 },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
    'West Bengal': { lat: 22.9868, lng: 87.8550 },
    'Bihar': { lat: 25.0961, lng: 85.3131 },
    'Jharkhand': { lat: 23.6102, lng: 85.2799 },
    'Odisha': { lat: 20.9517, lng: 85.0985 },
    'Assam': { lat: 26.2006, lng: 92.9376 },
    'Kerala': { lat: 10.8505, lng: 76.2711 },
    'Telangana': { lat: 18.1124, lng: 79.0193 },
    'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
    'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
    'Goa': { lat: 15.2993, lng: 74.1240 },
    'Manipur': { lat: 24.6637, lng: 93.9063 },
    'Meghalaya': { lat: 25.4670, lng: 91.3662 },
    'Tripura': { lat: 23.9408, lng: 91.9882 },
    'Nagaland': { lat: 26.1584, lng: 94.5624 },
    'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
    'Mizoram': { lat: 23.1645, lng: 92.9376 },
    'Sikkim': { lat: 27.5330, lng: 88.5122 },
    'Chandigarh': { lat: 30.7333, lng: 76.7794 },
    'Delhi': { lat: 28.7041, lng: 77.1025 }
  };

  useEffect(() => {
    fetchMandiPrices();
    getUserLocation();
  }, []);

  useEffect(() => {
    // Filter and sort data
    let filtered = mandiData;

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.commodity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(item => 
        item.state?.toLowerCase() === selectedState.toLowerCase()
      );
    }

    if (selectedCommodity) {
      filtered = filtered.filter(item => 
        item.commodity?.toLowerCase().includes(selectedCommodity.toLowerCase())
      );
    }

    if (selectedMarket) {
      filtered = filtered.filter(item => 
        item.market?.toLowerCase().includes(selectedMarket.toLowerCase())
      );
    }

    // Sort data based on selected criteria
    filtered.sort((a, b) => {
      if (sortBy === 'location') {
        // Use user location-based nearby states if available, otherwise fallback to default
        const nearbyStates = nearbyStatesBasedOnLocation.length > 0 
          ? nearbyStatesBasedOnLocation 
          : defaultNearbyStates;

        // Prioritize nearby states first, then popular locations
        const aIsNearby = nearbyStates.some(state => 
          a.state?.toLowerCase().includes(state.toLowerCase())
        );
        const bIsNearby = nearbyStates.some(state => 
          b.state?.toLowerCase().includes(state.toLowerCase())
        );
        
        if (aIsNearby && !bIsNearby) return -1;
        if (!aIsNearby && bIsNearby) return 1;
        
        const aIsPopular = popularLocations.some(city => 
          a.district?.toLowerCase().includes(city.toLowerCase()) ||
          a.market?.toLowerCase().includes(city.toLowerCase())
        );
        const bIsPopular = popularLocations.some(city => 
          b.district?.toLowerCase().includes(city.toLowerCase()) ||
          b.market?.toLowerCase().includes(city.toLowerCase())
        );
        
        if (aIsPopular && !bIsPopular) return -1;
        if (!aIsPopular && bIsPopular) return 1;
        
        return a.state?.localeCompare(b.state) || 0;
      } else if (sortBy === 'price') {
        const aPrice = parseFloat(a.modal_price?.replace(/[^\d.]/g, '') || 0);
        const bPrice = parseFloat(b.modal_price?.replace(/[^\d.]/g, '') || 0);
        return bPrice - aPrice; // Highest price first
      } else if (sortBy === 'commodity') {
        return a.commodity?.localeCompare(b.commodity) || 0;
      }
      return 0;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedState, selectedCommodity, selectedMarket, mandiData, sortBy, nearbyStatesBasedOnLocation]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Get states sorted by distance from user's location
  const getNearbyStatesFromLocation = (userLat, userLng) => {
    const statesWithDistance = Object.entries(stateCoordinates).map(([state, coords]) => ({
      state,
      distance: calculateDistance(userLat, userLng, coords.lat, coords.lng)
    }));

    // Sort by distance and return top 5 nearest states
    return statesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(item => item.state);
  };

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      setLocationPermission('pending');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          setUserLocation({
            latitude: userLat,
            longitude: userLng
          });
          setLocationPermission('granted');

          // Calculate nearby states based on user's actual location
          const nearbyStates = getNearbyStatesFromLocation(userLat, userLng);
          setNearbyStatesBasedOnLocation(nearbyStates);

          // Get detailed location info and auto-select filters
          await autoSelectLocationFilters(userLat, userLng);
        },
        (error) => {
          console.log('Location access denied:', error);
          setLocationPermission('denied');
          // Fallback to default nearby states
          setNearbyStatesBasedOnLocation(defaultNearbyStates);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache location for 5 minutes
        }
      );
    } else {
      setLocationPermission('denied');
      setNearbyStatesBasedOnLocation(defaultNearbyStates);
    }
  };

  // Function to get state and district from coordinates using reverse geocoding
  const autoSelectLocationFilters = async (lat, lng) => {
    try {
      // First try to detect state based on coordinates and state boundaries
      const detectedState = getStateFromCoordinates(lat, lng);
      
      if (detectedState) {
        console.log(`🎯 Auto-detected state: ${detectedState}`);
        setSelectedState(detectedState);
        setShowAutoSelectNotification(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowAutoSelectNotification(false);
        }, 5000);
        
        // Try to get district info using reverse geocoding API (free service)
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          
          if (response.ok) {
            const locationData = await response.json();
            const district = locationData.city || locationData.locality || locationData.principalSubdivision;
            
            if (district) {
              console.log(`🎯 Auto-detected district: ${district}`);
              // Check if this district/city appears in our mandi data
              const matchingMarket = mandiData.find(item => 
                item.district?.toLowerCase().includes(district.toLowerCase()) ||
                item.market?.toLowerCase().includes(district.toLowerCase())
              );
              
              if (matchingMarket) {
                setSelectedMarket(matchingMarket.market);
              }
            }
          }
        } catch (geocodingError) {
          console.log('Reverse geocoding failed, using state detection only:', geocodingError);
        }
      }
    } catch (error) {
      console.log('Auto-location detection failed:', error);
    }
  };

  // Function to detect state from coordinates using approximate boundaries
  const getStateFromCoordinates = (lat, lng) => {
    // Gujarat boundaries (approximate)
    if (lat >= 20.0 && lat <= 24.7 && lng >= 68.0 && lng <= 74.5) {
      return 'Gujarat';
    }
    // Rajasthan boundaries (approximate)  
    if (lat >= 23.0 && lat <= 30.2 && lng >= 69.5 && lng <= 78.5) {
      return 'Rajasthan';
    }
    // Maharashtra boundaries (approximate)
    if (lat >= 15.6 && lat <= 22.0 && lng >= 72.6 && lng <= 80.9) {
      return 'Maharashtra';
    }
    // Haryana boundaries (approximate)
    if (lat >= 27.6 && lat <= 30.9 && lng >= 74.4 && lng <= 77.4) {
      return 'Haryana';
    }
    // Punjab boundaries (approximate)
    if (lat >= 29.5 && lat <= 32.5 && lng >= 73.9 && lng <= 76.9) {
      return 'Punjab';
    }
    // Uttar Pradesh boundaries (approximate)
    if (lat >= 23.8 && lat <= 30.4 && lng >= 77.0 && lng <= 84.6) {
      return 'Uttar Pradesh';
    }
    // Madhya Pradesh boundaries (approximate)
    if (lat >= 21.1 && lat <= 26.9 && lng >= 74.0 && lng <= 82.8) {
      return 'Madhya Pradesh';
    }
    // Karnataka boundaries (approximate)
    if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.6) {
      return 'Karnataka';
    }
    // Tamil Nadu boundaries (approximate)
    if (lat >= 8.0 && lat <= 13.6 && lng >= 76.2 && lng <= 80.3) {
      return 'Tamil Nadu';
    }
    // West Bengal boundaries (approximate)
    if (lat >= 21.5 && lat <= 27.2 && lng >= 85.8 && lng <= 89.9) {
      return 'West Bengal';
    }
    // Delhi boundaries (approximate)
    if (lat >= 28.4 && lat <= 28.9 && lng >= 76.8 && lng <= 77.3) {
      return 'Delhi';
    }
    
    // Add more states as needed
    return null;
  };

  const fetchMandiPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiKey = import.meta.env.VITE_AGMARKNET_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not configured. Please set VITE_AGMARKNET_API_KEY in your .env file.');
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(
        `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=2000`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.records && Array.isArray(data.records)) {
        setMandiData(data.records);
        setFilteredData(data.records);
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('Mandi API request timed out');
        setError('Request timed out. The government API is currently slow. Please try again later.');
      } else if (err.message.includes('Failed to fetch')) {
        console.error('Network error while fetching mandi prices');
        setError('Network error. Please check your internet connection and try again.');
      } else {
        console.error('Error fetching mandi prices:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 'NR' || price === '0') return 'N/A';
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Get unique values for filters
  const uniqueStates = [...new Set(mandiData.map(item => item.state).filter(Boolean))].sort();
  const uniqueCommodities = [...new Set(mandiData.map(item => item.commodity).filter(Boolean))].sort();
  const uniqueMarkets = [...new Set(mandiData.map(item => item.market).filter(Boolean))].sort();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isNearbyLocation = (state, district) => {
    const nearbyStates = nearbyStatesBasedOnLocation.length > 0 
      ? nearbyStatesBasedOnLocation 
      : defaultNearbyStates;
      
    return nearbyStates.some(nearbyState => 
      state?.toLowerCase().includes(nearbyState.toLowerCase())
    ) || popularLocations.some(city => 
      district?.toLowerCase().includes(city.toLowerCase())
    );
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading mandi prices...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchMandiPrices}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
        <p className="text-gray-600">No mandi prices match your search criteria.</p>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header />
      
      {/* Main Content with top padding to account for fixed header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mandi Prices
              </h1>
              <p className="text-gray-600">
                Live agricultural commodity prices from markets across India
              </p>
            </div>
          </div>
          
          {/* Location Status */}
          <div className="flex flex-wrap gap-3 mt-4">
            {locationPermission === 'granted' && userLocation && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <Navigation className="w-4 h-4" />
                <span>Showing nearby locations first</span>
              </div>
            )}
            
            {locationPermission === 'denied' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span>Using default nearby states</span>
                </div>
                <button
                  onClick={getUserLocation}
                  className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Detect Location</span>
                </button>
              </div>
            )}
            
            {nearbyStatesBasedOnLocation.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <Star className="w-4 h-4" />
                <span>Nearby: {nearbyStatesBasedOnLocation.slice(0, 3).join(', ')}{nearbyStatesBasedOnLocation.length > 3 ? '...' : ''}</span>
              </div>
            )}
            
            {locationPermission === 'pending' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Getting your location...</span>
              </div>
            )}
            
            {showAutoSelectNotification && selectedState && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <MapPin className="w-4 h-4" />
                <span>📍 Auto-selected: {selectedState}{selectedMarket && `, ${selectedMarket}`}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters & Search</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search commodity, market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Commodity Filter */}
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Commodities</option>
              {uniqueCommodities.map(commodity => (
                <option key={commodity} value={commodity}>{commodity}</option>
              ))}
            </select>

            {/* Market Filter */}
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Markets</option>
              {uniqueMarkets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="location">Sort by Location</option>
              <option value="price">Sort by Price</option>
              <option value="commodity">Sort by Commodity</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">States Covered</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueStates.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commodities</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueCommodities.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : filteredData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commodity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Max Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modal Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 transition-colors ${
                          isNearbyLocation(item.state, item.district) 
                            ? 'bg-green-50 border-l-4 border-green-500' 
                            : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">
                              {item.commodity || 'N/A'}
                            </div>
                            {isNearbyLocation(item.state, item.district) && (
                              <Star className="w-4 h-4 ml-2 text-green-500 fill-current" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{item.district || 'N/A'}</div>
                              <div className="text-gray-500">{item.state || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.market || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                            {formatPrice(item.min_price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            {formatPrice(item.max_price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {formatPrice(item.modal_price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(item.arrival_date)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-4">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 py-2 text-sm text-gray-500">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Data sourced from AGMARKNET Open Data API | Government of India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiPricesPage;