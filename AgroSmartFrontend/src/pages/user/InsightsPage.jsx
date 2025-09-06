import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Sprout,
  Droplets,
  Bug,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInsight, setExpandedInsight] = useState(null);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockInsights = [
      {
        id: 1,
        title: 'Soil Moisture Levels Critical in Field A',
        description: 'Soil moisture has dropped below optimal levels. Immediate irrigation recommended to prevent crop stress.',
        priority: 'high',
        status: 'pending',
        type: 'irrigation',
        createdAt: '2025-09-06T10:30:00',
        fieldName: 'Field A',
        cropType: 'Tomatoes',
        recommendation: 'Increase irrigation frequency to twice daily until soil moisture reaches 60-70%',
        impact: 'Crop yield may decrease by 15-20% if not addressed within 24 hours',
        confidence: 92
      },
      {
        id: 2,
        title: 'Optimal Harvest Time for Wheat Crop',
        description: 'Weather conditions and crop maturity analysis suggests optimal harvest window is approaching.',
        priority: 'medium',
        status: 'resolved',
        type: 'harvest',
        createdAt: '2025-09-05T14:15:00',
        fieldName: 'Field C',
        cropType: 'Wheat',
        recommendation: 'Schedule harvest for next week (September 12-16) for maximum yield',
        impact: 'Optimal timing can increase yield by 8-12%',
        confidence: 87
      },
      {
        id: 3,
        title: 'Pest Activity Detected in Corn Field',
        description: 'Increased pest activity observed. Early intervention recommended to prevent widespread damage.',
        priority: 'high',
        status: 'in-progress',
        type: 'pest-control',
        createdAt: '2025-09-06T08:45:00',
        fieldName: 'Field B',
        cropType: 'Corn',
        recommendation: 'Apply organic pesticide treatment and increase monitoring frequency',
        impact: 'Early intervention can prevent 30-40% crop loss',
        confidence: 78
      },
      {
        id: 4,
        title: 'Fertilizer Application Timing',
        description: 'Soil nutrient analysis indicates optimal timing for next fertilizer application.',
        priority: 'low',
        status: 'pending',
        type: 'fertilization',
        createdAt: '2025-09-04T16:20:00',
        fieldName: 'Field A',
        cropType: 'Tomatoes',
        recommendation: 'Apply nitrogen-rich fertilizer in early morning hours for best absorption',
        impact: 'Proper timing can improve nutrient uptake by 20%',
        confidence: 95
      },
      {
        id: 5,
        title: 'Weather Impact on Irrigation Schedule',
        description: 'Upcoming rainfall forecast suggests adjusting irrigation schedule to optimize water usage.',
        priority: 'medium',
        status: 'pending',
        type: 'irrigation',
        createdAt: '2025-09-06T12:00:00',
        fieldName: 'All Fields',
        cropType: 'Multiple',
        recommendation: 'Reduce irrigation by 40% over next 3 days due to expected rainfall',
        impact: 'Water savings of approximately 2000L while maintaining crop health',
        confidence: 84
      }
    ];

    setInsights(mockInsights);
    setFilteredInsights(mockInsights);
  }, []);

  useEffect(() => {
    let filtered = insights;

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(insight => insight.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(insight => insight.priority === filters.priority);
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter(insight => insight.type === filters.type);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(insight => 
        insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.cropType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInsights(filtered);
  }, [insights, filters, searchTerm]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'harvest':
        return <Sprout className="w-5 h-5 text-green-500" />;
      case 'pest-control':
        return <Bug className="w-5 h-5 text-red-500" />;
      case 'fertilization':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const markAsResolved = (insightId) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'resolved' }
          : insight
      )
    );
    setExpandedInsight(null);
    toast.success('Insight marked as resolved!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-purple-600 rounded-xl text-white">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Insights</h1>
              <p className="text-gray-600">AI-powered farming recommendations</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex space-x-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {insights.filter(i => i.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {insights.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {insights.filter(i => i.status === 'resolved').length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by:</span>
              </div>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="irrigation">Irrigation</option>
                <option value="harvest">Harvest</option>
                <option value="pest-control">Pest Control</option>
                <option value="fertilization">Fertilization</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Insights List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getTypeIcon(insight.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {insight.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                              {insight.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(insight.status)}`}>
                              {insight.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{insight.fieldName} • {insight.cropType}</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(insight.createdAt)}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">Confidence: {insight.confidence}%</span>
                            {expandedInsight === insight.id ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedInsight === insight.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
                            <p className="text-gray-700 mb-4">{insight.recommendation}</p>
                            
                            <h4 className="font-semibold text-gray-900 mb-2">Potential Impact</h4>
                            <p className="text-gray-700">{insight.impact}</p>
                          </div>
                          
                          <div className="flex flex-col justify-between">
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Confidence Level</h4>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${insight.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 mt-1">{insight.confidence}% confident</span>
                            </div>
                            
                            {insight.status !== 'resolved' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsResolved(insight.id);
                                }}
                                className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark as Resolved</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredInsights.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
