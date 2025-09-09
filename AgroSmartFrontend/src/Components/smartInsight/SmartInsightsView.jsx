import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Plus,
  Search,
  Download,
  Grid,
  List,
  BarChart3
} from 'lucide-react';
import { smartInsightService } from '../../services';
import { useServerStatusContext } from '../../contexts/ServerStatusProvider';
import OfflineState from '../common/OfflineState';
import SmartInsightTable from './SmartInsightTable';
import SmartInsightFilter from './SmartInsightFilter';
import SmartInsightAnalytics from './SmartInsightAnalytics';
import CustomAlert from '../common/CustomAlert';
import Swal from 'sweetalert2';

const SmartInsightsView = () => {
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();
  
  // State management
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    byType: {},
    byPriority: {}
  });
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Edit modal states
  const [editModal, setEditModal] = useState({
    isOpen: false,
    insight: null,
    loading: false
  });
  const [editForm, setEditForm] = useState({
    title: '',
    message: '',
    insightType: '',
    priority: '',
    status: '',
    sourceType: '',
    targetUserId: null,
    validUntil: '',
    isResolved: false
  });

  // Info modal state
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    insight: null
  });

  // Calculate analytics
  const calculateAnalytics = (insightsData) => {
    const total = insightsData.length;
    const active = insightsData.filter(insight => !insight.isResolved).length;
    const resolved = insightsData.filter(insight => insight.isResolved).length;
    
    const byType = insightsData.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {});
    
    const byPriority = insightsData.reduce((acc, insight) => {
      acc[insight.priority] = (acc[insight.priority] || 0) + 1;
      return acc;
    }, {});
    
    setAnalytics({
      total,
      active,
      resolved,
      byType,
      byPriority
    });
  };

  // Fetch insights function
  const fetchInsights = useCallback(async (appliedFilters = null, forcePagination = false, page = null, pageSize = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    const currentPageToUse = page !== null ? page : currentPage;
    const itemsPerPageToUse = pageSize !== null ? pageSize : itemsPerPage;
    
    // Debug: Log filters being sent to API
    console.log('🔍 fetchInsights called with filters:', filtersToUse);
    console.log('🔍 hasFilters:', hasFilters, 'forcePagination:', forcePagination);
    console.log('🔍 currentPage:', currentPageToUse, 'itemsPerPage:', itemsPerPageToUse);
    
    // Use filter loading for filter operations, regular loading for initial load
    if (appliedFilters !== null && !forcePagination) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    setIsServerError(false);
    
    try {
      let response;
      if (hasFilters && !forcePagination) {
        // Use the filter API when filters are applied
        console.log('📡 Calling getFiltered with:', filtersToUse);
        response = await smartInsightService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters or when pagination is forced
        const params = {
          page: currentPageToUse,
          pageSize: itemsPerPageToUse
        };
        console.log('📡 Calling getAll with params:', params);
        response = await smartInsightService.getAll(params);
      }
      
      console.log('📨 Raw API response:', response);
      
      // Handle different response structures
      let insightsData = [];
      let totalCount = 0;
      
      if (Array.isArray(response.data)) {
        // Direct array response
        insightsData = response.data;
        totalCount = response.data.length;
        console.log('✅ Using direct array response');
      } else if (response.data && Array.isArray(response.data.items)) {
        // Paginated response with items
        insightsData = response.data.items;
        totalCount = response.data.totalCount || response.data.items.length;
        console.log('✅ Using paginated response with items');
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        insightsData = response.data.data;
        totalCount = response.data.totalCount || response.data.data.length;
        console.log('✅ Using nested data structure');
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object, let's see if we can extract data from it
        console.log('🔍 Response.data is object:', Object.keys(response.data));
        
        // Try to find array properties
        const possibleArrays = Object.values(response.data).filter(value => Array.isArray(value));
        if (possibleArrays.length > 0) {
          insightsData = possibleArrays[0];
          totalCount = insightsData.length;
          console.log('✅ Found array in response data');
        } else {
          insightsData = [];
          totalCount = 0;
          console.log('❌ No arrays found in response data');
        }
      } else {
        // Default to empty array
        insightsData = [];
        totalCount = 0;
        console.log('❌ Using default empty array');
      }
      
      console.log('📊 Final insights data:', insightsData.length, 'items');
      console.log('📊 Total count:', totalCount);
      setInsights(insightsData);
      setTotalItems(totalCount);
      
      // Calculate analytics
      calculateAnalytics(insightsData);
    } catch (err) {
      console.error("Error fetching insights:", err);
      const apiResponse = handleApiError(err);
      if (apiResponse.isServerDown) {
        setIsServerError(true);
        setError('Backend server is currently offline. Please check your connection and try again.');
      } else {
        setError(apiResponse.message || 'Failed to fetch insights. Please try again.');
      }
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  // Load initial data
  useEffect(() => {
    // Only fetch insights after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching insights...');
      fetchInsights(null, true, 1, itemsPerPage); // Force pagination for initial load
    }
  }, [isInitialCheck, itemsPerPage, fetchInsights]);

  // Helper functions for alerts
  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  // Pagination helper functions
  const getTotalPages = () => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePageChange = (page) => {
    console.log(`🔄 Page changed to: ${page}`);
    setCurrentPage(page);
    setSelectedInsights([]); // Clear selection when changing pages
    // Immediately fetch data for the new page
    fetchInsights(null, true, page, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    console.log(`🔄 Items per page changed to: ${newItemsPerPage}`);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedInsights([]); // Clear selection
    // Immediately fetch data with new page size
    fetchInsights(null, true, 1, newItemsPerPage);
  };

  // Export insights data
  const exportData = async () => {
    try {
      const csvContent = [
        ['Title', 'Type', 'Priority', 'Status', 'Message', 'Source', 'Created Date', 'Valid Until'],
        ...insights.map(insight => [
          insight.title || '',
          insight.type || '',
          insight.priority || '',
          insight.isResolved ? 'Resolved' : 'Active',
          insight.message || '',
          insight.sourceType || '',
          insight.createdAt ? new Date(insight.createdAt).toLocaleDateString() : '',
          insight.validUntil ? new Date(insight.validUntil).toLocaleDateString() : ''
        ])
      ];
      
      const csvString = csvContent.map(row => 
        row.map(field => `"${field}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `insights_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      showAlert('error', 'Export Failed', 'Failed to export insights data. Please try again.');
    }
  };

  // Filter handling
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setSelectedInsights([]); // Clear selections
    fetchInsights(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSelectedInsights([]);
    fetchInsights({});
  };

  // Bulk operations
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      // Only select insights on current page (data is already paginated from API)
      const currentPageInsightIds = insights.map(insight => insight.insightId || insight.id);
      setSelectedInsights(prev => [...new Set([...prev, ...currentPageInsightIds])]);
    } else {
      // Deselect insights on current page (data is already paginated from API)
      const currentPageInsightIds = insights.map(insight => insight.insightId || insight.id);
      setSelectedInsights(prev => prev.filter(id => !currentPageInsightIds.includes(id)));
    }
  };

  const handleSelectInsight = (insightId, isSelected) => {
    if (isSelected) {
      setSelectedInsights(prev => [...prev, insightId]);
    } else {
      setSelectedInsights(prev => prev.filter(id => id !== insightId));
    }
  };

  // CRUD operations
  const handleAdd = () => {
    // TODO: Implement add insight modal
    console.log('Add insight clicked');
  };

  const handleEdit = (insight) => {
    console.log('Edit insight:', insight);
    setEditForm({
      title: insight.title || '',
      message: insight.message || '',
      insightType: insight.type || insight.insightType || '',
      priority: insight.priority || '',
      status: insight.status || '',
      sourceType: insight.sourceType || '',
      targetUserId: insight.targetUserId || null,
      validUntil: insight.validUntil || '',
      isResolved: insight.isResolved || false
    });
    setEditModal({
      isOpen: true,
      insight: insight,
      loading: false
    });
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim() || !editForm.message.trim()) {
      showAlert('error', 'Validation Error', 'Title and message are required.');
      return;
    }

    setEditModal(prev => ({ ...prev, loading: true }));

    try {
      // Construct the payload according to API specification
      const updatedInsight = {
        insightId: editModal.insight.insightId || editModal.insight.id,
        insightType: editForm.insightType || editModal.insight.type || editModal.insight.insightType,
        title: editForm.title,
        message: editForm.message,
        priority: editForm.priority || editModal.insight.priority,
        status: editForm.status || editModal.insight.status,
        sourceType: editForm.sourceType || editModal.insight.sourceType,
        targetUserId: editForm.targetUserId || editModal.insight.targetUserId || null,
        validUntil: editForm.validUntil || editModal.insight.validUntil,
        createdAt: editModal.insight.createdAt,
        isResolved: editForm.isResolved
      };

      console.log('📤 Sending update payload:', updatedInsight);

      await smartInsightService.update(editModal.insight.insightId || editModal.insight.id, updatedInsight);
      
      // Refresh the data
      fetchInsights(null, true, currentPage, itemsPerPage);
      
      // Close modal
      setEditModal({ isOpen: false, insight: null, loading: false });
      setEditForm({
        title: '',
        message: '',
        insightType: '',
        priority: '',
        status: '',
        sourceType: '',
        targetUserId: null,
        validUntil: '',
        isResolved: false
      });

      showAlert('success', 'Success', 'Insight updated successfully');
    } catch (err) {
      console.error('Error updating insight:', err);
      console.error('Error details:', err.response?.data);
      showAlert('error', 'Error', `Failed to update insight: ${err.response?.data?.message || err.message}`);
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEditCancel = () => {
    setEditModal({ isOpen: false, insight: null, loading: false });
    setEditForm({
      title: '',
      message: '',
      insightType: '',
      priority: '',
      status: '',
      sourceType: '',
      targetUserId: null,
      validUntil: '',
      isResolved: false
    });
  };

  const handleDelete = async (insight) => {
    const result = await Swal.fire({
      title: 'Delete Insight',
      text: `Are you sure you want to delete "${insight.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await smartInsightService.delete(insight.insightId || insight.id);
        fetchInsights(null, true, currentPage, itemsPerPage); // Refresh data with pagination
        
        Swal.fire('Deleted!', 'Insight has been deleted successfully.', 'success');
      } catch (err) {
        console.error('Error deleting insight:', err);
        Swal.fire('Error!', 'Failed to delete insight.', 'error');
      }
    }
  };

  const handleInfo = (insight) => {
    console.log('View insight details:', insight);
    setInfoModal({
      isOpen: true,
      insight: insight
    });
  };

  const handleInfoClose = () => {
    setInfoModal({
      isOpen: false,
      insight: null
    });
  };

  const toggleResolveStatus = async (insight) => {
    try {
      await smartInsightService.toggleResolve(insight.insightId || insight.id);
      fetchInsights(null, true, currentPage, itemsPerPage); // Refresh data with pagination
      
      showAlert('success', 'Success', 'Insight status updated successfully');
    } catch (err) {
      console.error('Error toggling insight status:', err);
      showAlert('error', 'Error', 'Failed to update insight status');
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
        fetchInsights(null, true, currentPage, itemsPerPage); // Refresh data with pagination
        
        Swal.fire('Deleted!', 'Selected insights have been deleted successfully.', 'success');
      } catch (err) {
        console.error('Error bulk deleting insights:', err);
        Swal.fire('Error!', 'Failed to delete some insights.', 'error');
      }
    }
  };

  const retryConnection = () => {
    setIsServerError(false);
    setError(null);
    fetchInsights(null, true, currentPage, itemsPerPage); // Refresh with pagination
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Smart Insights
          </h1>
          <p className="text-gray-600">Manage and monitor AI-powered insights and recommendations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Export Button */}
          <button
            onClick={exportData}
            disabled={insights.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Insight
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <SmartInsightAnalytics analytics={analytics} />

      {/* Filter Section */}
      <SmartInsightFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        loading={filterLoading}
      />

      {/* Bulk Actions */}
      {selectedInsights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedInsights.length} insight{selectedInsights.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={bulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-visible">
        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-medium">
                {totalItems} insight{totalItems !== 1 ? 's' : ''} found
                {Object.keys(filters).length > 0 && ' (filtered)'}
              </span>
              {totalItems > itemsPerPage && (
                <span className="text-xs text-gray-500">
                  • Page {currentPage} of {getTotalPages()}
                </span>
              )}
            </div>
            
            {insights.length > 0 && viewMode === 'table' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(() => {
                    // Data is already paginated from API
                    const currentPageInsightIds = insights.map(insight => insight.insightId || insight.id);
                    return currentPageInsightIds.length > 0 && currentPageInsightIds.every(id => selectedInsights.includes(id));
                  })()}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Select All (Page)</span>
              </label>
            )}
          </div>
        )}
        
        <div className="overflow-x-auto overflow-y-visible">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading insights...</div>
          ) : error ? (
            isServerError ? (
              <OfflineState 
                message={error}
                onRetry={retryConnection}
              />
            ) : (
              <div className="p-6 text-red-500 text-center">{error}</div>
            )
          ) : (
            <SmartInsightTable
              insights={insights}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
              onToggleResolve={toggleResolveStatus}
              selectedInsights={selectedInsights}
              onSelectInsight={handleSelectInsight}
              viewMode={viewMode}
            />
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
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
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
                    ←
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = getTotalPages();
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
                    disabled={currentPage === getTotalPages()}
                    className={`p-2 rounded ${
                      currentPage === getTotalPages() 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Modal */}
      {infoModal.isOpen && infoModal.insight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insight Details</h3>
              <button
                onClick={handleInfoClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {infoModal.insight.title || 'No title'}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {infoModal.insight.message || 'No message'}
                </div>
              </div>

              {/* Type and Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {infoModal.insight.type || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      infoModal.insight.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      infoModal.insight.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      infoModal.insight.priority?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {infoModal.insight.priority || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    infoModal.insight.isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {infoModal.insight.isResolved ? 'Resolved' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Source and Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {infoModal.insight.source || 'System Generated'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {infoModal.insight.createdAt ? 
                      new Date(infoModal.insight.createdAt).toLocaleDateString() : 
                      'Unknown'
                    }
                  </div>
                </div>
              </div>

              {/* Valid Until */}
              {infoModal.insight.validUntil && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {new Date(infoModal.insight.validUntil).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insight ID</label>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                  {infoModal.insight.insightId || infoModal.insight.id || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleInfoClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleInfoClose();
                  handleEdit(infoModal.insight);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Insight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Insight</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter insight title"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter insight message"
                />
              </div>

              {/* Type and Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={editForm.insightType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, insightType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Weather">Weather</option>
                    <option value="Soil">Soil</option>
                    <option value="Crop">Crop</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Pest">Pest</option>
                    <option value="Disease">Disease</option>
                    <option value="Alert">Alert</option>
                    <option value="Recommendation">Recommendation</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Status and Source Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Source Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
                  <select
                    value={editForm.sourceType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sourceType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Source</option>
                    <option value="System">System</option>
                    <option value="Sensor">Sensor</option>
                    <option value="User">User</option>
                    <option value="Weather">Weather</option>
                    <option value="AI">AI</option>
                  </select>
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
                <input
                  type="datetime-local"
                  value={editForm.validUntil ? new Date(editForm.validUntil).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, validUntil: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Resolved Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isResolved}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isResolved: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as Resolved</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleEditCancel}
                disabled={editModal.loading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editModal.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {editModal.loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {editModal.loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onClose={closeAlert}
        showCancel={alert.showCancel}
      />
    </div>
  );
};

export default SmartInsightsView;
