"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Calendar,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Settings,
  X,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';
import { InventoryManager } from '../../utils/inventoryManager';
import { InventoryItem, StockMovement } from '../../types/inventory';

interface InventoryMonitorProps {
  onClose?: () => void;
}

const InventoryMonitor: React.FC<InventoryMonitorProps> = ({ onClose }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'expiry' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [showMovements, setShowMovements] = useState(false);

  // Load data from inventory manager
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const inventoryItems = InventoryManager.getInventoryItems();
      const movements = InventoryManager.getStockMovements();
      setItems(inventoryItems);
      setStockMovements(movements.slice(-20)); // Last 20 movements
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort items
  useEffect(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.productInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productInfo.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productInfo.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.productInfo.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.productInfo.name.toLowerCase();
          bValue = b.productInfo.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.stockInfo.currentStock;
          bValue = b.stockInfo.currentStock;
          break;
        case 'expiry':
          aValue = a.expiryInfo.daysUntilExpiry;
          bValue = b.expiryInfo.daysUntilExpiry;
          break;
        case 'status':
          const statusOrder = { 'out_of_stock': 0, 'expired': 1, 'low_stock': 2, 'near_expiry': 3, 'in_stock': 4 };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 5;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 5;
          break;
        default:
          aValue = a.productInfo.name;
          bValue = b.productInfo.name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low_stock':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'near_expiry':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_stock':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <Package className="w-4 h-4 text-red-600" />;
      case 'low_stock':
        return <TrendingDown className="w-4 h-4 text-orange-600" />;
      case 'near_expiry':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'in_stock':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'adjustment':
        return <Settings className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const categories = [...new Set(items.map(item => item.productInfo.category))];
  const statuses = ['all', 'in_stock', 'low_stock', 'out_of_stock', 'near_expiry', 'expired'];

  const refreshData = () => {
    // Perform automated monitoring to refresh data
    InventoryManager.performAutomatedMonitoring();
    loadData();
  };

  const criticalCount = filteredItems.filter(i => i.status === 'out_of_stock' || i.status === 'expired').length;
  const warningCount = filteredItems.filter(i => i.status === 'low_stock' || i.status === 'near_expiry').length;
  const goodCount = filteredItems.filter(i => i.status === 'in_stock').length;

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Monitor</h1>
            <p className="text-gray-600 mt-1">Real-time inventory tracking and monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMovements(!showMovements)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                showMovements 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Activity className="w-4 h-4 mr-2 inline" />
              Stock Movements
            </button>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            {statuses.slice(1).map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as typeof sortBy);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="stock-desc">Stock High-Low</option>
            <option value="expiry-asc">Expiry Soon-Late</option>
            <option value="expiry-desc">Expiry Late-Soon</option>
            <option value="status-asc">Status Priority</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </span>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical: {criticalCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Warning: {warningCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good: {goodCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stock Movements Panel */}
      {showMovements && (
        <div className="bg-white border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
          <div className="max-h-64 overflow-y-auto">
            {stockMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No stock movements recorded</p>
            ) : (
              <div className="space-y-3">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getMovementIcon(movement.type)}
                      <div>
                        <p className="font-medium text-gray-900">{movement.itemName}</p>
                        <p className="text-sm text-gray-600">{movement.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        movement.type === 'in' ? 'text-green-600' : 
                        movement.type === 'out' ? 'text-red-600' : 
                        'text-blue-600'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(movement.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading inventory data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.productInfo.name}</h3>
                      <p className="text-sm text-gray-600">{item.productInfo.category}</p>
                      {item.productInfo.genericName && (
                        <p className="text-xs text-gray-500">Generic: {item.productInfo.genericName}</p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span>{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className={`font-medium ${
                        item.stockInfo.currentStock === 0 ? 'text-red-600' :
                        item.stockInfo.currentStock <= item.stockInfo.minimumStock ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {item.stockInfo.currentStock} {item.stockInfo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Stock:</span>
                      <span className="text-gray-900">{item.stockInfo.minimumStock} {item.stockInfo.unit}</span>
                    </div>
                    {item.stockInfo.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.stockInfo.location}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires in:</span>
                      <span className={`font-medium ${
                        item.expiryInfo.daysUntilExpiry < 0 ? 'text-red-600' :
                        item.expiryInfo.daysUntilExpiry <= 30 ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {item.expiryInfo.daysUntilExpiry < 0 ? 'Expired' : `${item.expiryInfo.daysUntilExpiry} days`}
                      </span>
                    </div>
                    {item.productInfo.batchNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Batch:</span>
                        <span className="text-gray-900 font-mono text-xs">{item.productInfo.batchNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(item.metadata.lastUpdated).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {item.stockInfo.reservedStock && item.stockInfo.reservedStock > 0 && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {item.stockInfo.reservedStock} reserved
                          </span>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryMonitor;