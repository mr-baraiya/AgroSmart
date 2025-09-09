import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  AlertTriangle,
  UserCheck,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X,
  Download,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  DonutChart
} from 'recharts';
import { smartInsightService } from '../../services';
import { useServerStatusContext } from '../../contexts/ServerStatusProvider';
import CustomAlert from '../../Components/common/CustomAlert';
import Swal from 'sweetalert2';

const SmartInsightsPage = () => {
  const { handleApiError } = useServerStatusContext();
  
  // State management
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    priority: '',
    status: ''
  });
  
  // Analytics data
  const [analytics, setAnalytics] = useState({
    byType: [],
    byPriority: [],
    byStatus: []
  });
  
  // Selected insights for bulk operations
  const [selectedInsights, setSelectedInsights] = useState([]);
  
  // Alert state
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Fetch insights with pagination and filters
  const fetchInsights = async (page = currentPage, size = pageSize, appliedFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        pageSize: size,
        ...appliedFilters
      };
      
      const response = await smartInsightService.getAll(params);
      
      if (response.data) {
        setInsights(response.data.items || []);
        setTotalItems(response.data.totalCount || 0);
        setTotalPages(Math.ceil((response.data.totalCount || 0) / size));
        
        // Calculate analytics
        calculateAnalytics(response.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      const apiResponse = handleApiError(err);
      setError(apiResponse.message || 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data for charts
  const calculateAnalytics = (insightsData) => {
    const typeCount = insightsData.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {});
    
    const priorityCount = insightsData.reduce((acc, insight) => {
      acc[insight.priority] = (acc[insight.priority] || 0) + 1;
      return acc;
    }, {});
    
    const statusCount = insightsData.reduce((acc, insight) => {
      const status = insight.isResolved ? 'Resolved' : 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    setAnalytics({
      byType: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      byPriority: Object.entries(priorityCount).map(([name, value]) => ({ name, value })),
      byStatus: Object.entries(statusCount).map(([name, value]) => ({ name, value }))
    });
  };

  // Icon and color helpers
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Alert': return <AlertTriangle className="w-4 h-4" />;
      case 'Recommendation': return <UserCheck className="w-4 h-4" />;
      case 'Reminder': return <Clock className="w-4 h-4" />;
      case 'Tip': return <Lightbulb className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'Recommendation': return 'bg-green-100 text-green-800 border-green-200';
      case 'Reminder': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tip': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-500';
      case 'Medium': return 'border-yellow-500';
      case 'Low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Event handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedInsights([]);
    fetchInsights(page, pageSize, filters);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedInsights([]);
    fetchInsights(1, size, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    setSelectedInsights([]);
    fetchInsights(1, pageSize, newFilters);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedInsights(insights.map(insight => insight.id));
    } else {
      setSelectedInsights([]);
    }
  };

  const handleSelectInsight = (insightId, isSelected) => {
    if (isSelected) {
      setSelectedInsights(prev => [...prev, insightId]);
    } else {
      setSelectedInsights(prev => prev.filter(id => id !== insightId));
    }
  };

  const toggleResolveStatus = async (insightId) => {
    try {
      await smartInsightService.toggleResolve(insightId);
      fetchInsights(); // Refresh data
      
      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Insight status updated successfully',
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
        showCancel: false
      });
    } catch (err) {
      console.error('Error toggling insight status:', err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update insight status',
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
        showCancel: false
      });
    }
  };

  const deleteInsight = async (insightId) => {
    const result = await Swal.fire({
      title: 'Delete Insight',
      text: 'Are you sure you want to delete this insight? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await smartInsightService.delete(insightId);
        fetchInsights(); // Refresh data
        
        Swal.fire('Deleted!', 'Insight has been deleted successfully.', 'success');
      } catch (err) {
        console.error('Error deleting insight:', err);
        Swal.fire('Error!', 'Failed to delete insight.', 'error');
      }
    }
  };

  const bulkDelete = async () => {
    if (selectedInsights.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Delete Selected Insights',
      text: `Are you sure you want to delete ${selectedInsights.length} selected insights? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selectedInsights.map(id => smartInsightService.delete(id)));
        setSelectedInsights([]);
        fetchInsights(); // Refresh data
        
        Swal.fire('Deleted!', 'Selected insights have been deleted successfully.', 'success');
      } catch (err) {
        console.error('Error bulk deleting insights:', err);
        Swal.fire('Error!', 'Failed to delete some insights.', 'error');
      }
    }
  };

  const bulkResolve = async () => {
    if (selectedInsights.length === 0) return;
    
    try {
      await Promise.all(selectedInsights.map(id => smartInsightService.toggleResolve(id)));
      setSelectedInsights([]);
      fetchInsights(); // Refresh data
      
      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: `${selectedInsights.length} insights updated successfully`,
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
        showCancel: false
      });
    } catch (err) {
      console.error('Error bulk updating insights:', err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update some insights',
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
        showCancel: false
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Chart colors
  const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  // Load initial data
  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Smart Insights
          </h1>
          <p className="text-gray-600">Manage and monitor AI-powered insights and recommendations</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {/* Add insight modal logic */}}
        >
          <Plus className="w-4 h-4" />
          Add Insight
        </button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Insights by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.byType}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {analytics.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Insights by Priority */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.byPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.byStatus}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {analytics.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Active' ? '#10b981' : '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or message..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Alert">Alert</option>
              <option value="Recommendation">Recommendation</option>
              <option value="Reminder">Reminder</option>
              <option value="Tip">Tip</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInsights.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedInsights.length} insight{selectedInsights.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={bulkResolve}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Toggle Status
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-medium">
              {totalItems} insight{totalItems !== 1 ? 's' : ''} found
            </span>
            {totalItems > pageSize && (
              <span className="text-xs text-gray-500">
                • Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
          
          {insights.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedInsights.length === insights.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Select All (Page)</span>
            </label>
          )}
        </div>

        {/* Insights List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => fetchInsights()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first insight.</p>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Insight
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  className={`rounded-xl border p-4 shadow-md hover:shadow-lg transition-all ${getPriorityColor(insight.priority)} ${
                    selectedInsights.includes(insight.id) ? 'bg-blue-50' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedInsights.includes(insight.id)}
                        onChange={(e) => handleSelectInsight(insight.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getTypeBadgeClass(insight.type)}`}>
                        {getTypeIcon(insight.type)}
                        {insight.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(insight.createdAt)}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-700 mb-3">{insight.message}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Source: {insight.sourceType}
                    </span>
                    <span className={`flex items-center gap-1 ${getPriorityTextColor(insight.priority)}`}>
                      <Zap className="w-4 h-4" />
                      Priority: {insight.priority}
                    </span>
                    {insight.validUntil && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Valid Until: {formatDate(insight.validUntil)}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      insight.isResolved ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {insight.isResolved ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {insight.isResolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleResolveStatus(insight.id)}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                        insight.isResolved
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {insight.isResolved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {insight.isResolved ? 'Mark Active' : 'Mark Resolved'}
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteInsight(insight.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">items per page</span>
              </div>

              {/* Pagination info and controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        showCancel={alert.showCancel}
      />
    </div>
  );
};

export default SmartInsightsPage;
