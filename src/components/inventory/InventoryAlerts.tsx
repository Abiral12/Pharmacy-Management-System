"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Package,
  X,
  CheckCircle,
  Filter,
  Calendar,
  TrendingDown,
  AlertCircle,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  RefreshCw,
  Activity,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { InventoryManager } from '../../utils/inventoryManager';
import { InventoryAlert } from '../../types/inventory';

interface InventoryAlertsProps {
  onClose?: () => void;
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ onClose }) => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'active'>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthCheck, setHealthCheck] = useState<any>(null);

  // Load alerts from inventory manager
  useEffect(() => {
    loadAlerts();
    performHealthCheck();
  }, []);

  const loadAlerts = () => {
    setIsLoading(true);
    try {
      const inventoryAlerts = InventoryManager.getAlerts();
      setAlerts(inventoryAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performHealthCheck = () => {
    try {
      const health = InventoryManager.runInventoryHealthCheck();
      setHealthCheck(health);
    } catch (error) {
      console.error('Error performing health check:', error);
    }
  };

  const refreshAlerts = () => {
    // Perform automated monitoring to check for new alerts
    InventoryManager.performAutomatedMonitoring();
    loadAlerts();
    performHealthCheck();
  };

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = severity === 'critical' ? 'w-6 h-6' : 'w-5 h-5';
    
    switch (type) {
      case 'out_of_stock':
        return <Package className={`${iconClass} text-red-500`} />;
      case 'critical_low_stock':
        return <Zap className={`${iconClass} text-red-600`} />;
      case 'low_stock':
        return <TrendingDown className={`${iconClass} text-orange-500`} />;
      case 'expiry_warning':
        return <Clock className={`${iconClass} text-yellow-500`} />;
      case 'expired':
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      case 'overstock':
        return <BarChart3 className={`${iconClass} text-blue-500`} />;
      default:
        return <AlertCircle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-600 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread' && alert.isRead) return false;
    if (filter === 'critical' && alert.severity !== 'critical') return false;
    if (filter === 'active' && alert.isResolved) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead && !a.isResolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.isResolved).length;
  const activeCount = alerts.filter(a => !a.isResolved).length;

  const handleMarkAsRead = (alertId: string) => {
    InventoryManager.markAlertAsRead(alertId);
    loadAlerts();
  };

  const handleResolve = (alertId: string) => {
    InventoryManager.resolveAlert(alertId, 'User');
    loadAlerts();
    performHealthCheck();
  };

  const handleBulkAction = (action: 'read' | 'resolve' | 'delete') => {
    switch (action) {
      case 'read':
        selectedAlerts.forEach(id => InventoryManager.markAlertAsRead(id));
        break;
      case 'resolve':
        InventoryManager.bulkResolveAlerts(selectedAlerts, 'User');
        break;
      case 'delete':
        // Note: Delete functionality would need to be implemented in InventoryManager
        console.log('Delete functionality not yet implemented');
        break;
    }
    setSelectedAlerts([]);
    loadAlerts();
    performHealthCheck();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Monitoring</h1>
            <p className="text-gray-600 mt-1">
              {activeCount} active alerts • {unreadCount} unread
              {criticalCount > 0 && (
                <span className="text-red-600 font-medium ml-2">
                  • {criticalCount} critical
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshAlerts}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Refresh alerts"
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

        {/* Health Status */}
        {healthCheck && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Inventory Health</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthCheck.overallHealth)}`}>
                {healthCheck.overallHealth.charAt(0).toUpperCase() + healthCheck.overallHealth.slice(1)}
              </span>
            </div>
            
            {healthCheck.issues.length > 0 && (
              <div className="space-y-2">
                {healthCheck.issues.map((issue: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{issue.description}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {healthCheck.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {healthCheck.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mt-4">
          {[
            { key: 'all', label: 'All', count: alerts.length },
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'critical', label: 'Critical', count: criticalCount }
          ].map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === filterType.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterType.label} ({filterType.count})
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedAlerts.length} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('read')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction('resolve')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No alerts found.' : `No ${filter} alerts match your current filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`
                    border-l-4 rounded-r-lg p-4 bg-white shadow-sm cursor-pointer transition-all duration-200
                    ${getSeverityColor(alert.severity)}
                    ${!alert.isRead ? 'shadow-md' : 'opacity-75'}
                    ${alert.isResolved ? 'opacity-50' : ''}
                    hover:shadow-lg hover:scale-[1.01]
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAlerts([...selectedAlerts, alert.id]);
                        } else {
                          setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                        }
                      }}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type, alert.severity)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {alert.itemName}
                            {alert.isResolved && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Resolved
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          
                          {/* Metadata display */}
                          {alert.metadata && (
                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              {alert.metadata.currentStock !== undefined && (
                                <div>Current Stock: {alert.metadata.currentStock} {alert.metadata.unit}</div>
                              )}
                              {alert.metadata.minimumStock !== undefined && (
                                <div>Minimum Stock: {alert.metadata.minimumStock} {alert.metadata.unit}</div>
                              )}
                              {alert.metadata.daysUntilExpiry !== undefined && (
                                <div>Days Until Expiry: {alert.metadata.daysUntilExpiry}</div>
                              )}
                              {alert.metadata.location && (
                                <div>Location: {alert.metadata.location}</div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(alert.dateCreated)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {alert.severity}
                              </span>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {alert.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            Action: {alert.actionRequired}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!alert.isRead && !alert.isResolved && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <div className="flex space-x-1">
                            {!alert.isResolved && (
                              <>
                                <button
                                  onClick={() => handleMarkAsRead(alert.id)}
                                  className="p-1 hover:bg-white/50 rounded transition-colors"
                                  title={alert.isRead ? "Mark as unread" : "Mark as read"}
                                >
                                  {alert.isRead ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                </button>
                                <button
                                  onClick={() => handleResolve(alert.id)}
                                  className="p-1 hover:bg-white/50 rounded transition-colors"
                                  title="Resolve alert"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
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

export default InventoryAlerts;