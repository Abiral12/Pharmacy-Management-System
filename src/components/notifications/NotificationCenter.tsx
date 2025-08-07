"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  MoreVertical,
  Trash2,
  MarkAsUnread,
  Archive,
  Settings
} from 'lucide-react';

export interface PharmacyNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'prescription' | 'inventory' | 'patient';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'prescription' | 'inventory' | 'patient' | 'billing' | 'alert';
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  notifications: PharmacyNotification[];
  onNotificationRead: (id: string) => void;
  onNotificationArchive: (id: string) => void;
  onNotificationDelete: (id: string) => void;
  onNotificationAction: (id: string, actionIndex: number) => void;
  onClose?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onNotificationRead,
  onNotificationArchive,
  onNotificationDelete,
  onNotificationAction,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'critical' ? 'w-6 h-6' : 'w-5 h-5';
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'prescription':
        return <Clock className={`${iconClass} text-blue-500`} />;
      case 'inventory':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'patient':
        return <Info className={`${iconClass} text-purple-500`} />;
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'archived' && !notification.isArchived) return false;
    if (filter === 'all' && notification.isArchived) return false;
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.isRead).length;

  const handleBulkAction = (action: 'read' | 'archive' | 'delete') => {
    selectedNotifications.forEach(id => {
      switch (action) {
        case 'read':
          onNotificationRead(id);
          break;
        case 'archive':
          onNotificationArchive(id);
          break;
        case 'delete':
          onNotificationDelete(id);
          break;
      }
    });
    setSelectedNotifications([]);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="w-96 h-screen bg-white shadow-2xl border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount} unread
                {criticalCount > 0 && (
                  <span className="text-red-600 font-medium ml-2">
                    • {criticalCount} critical
                  </span>
                )}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1">
          {['all', 'unread', 'archived'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-100">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="system">System</option>
          <option value="prescription">Prescriptions</option>
          <option value="inventory">Inventory</option>
          <option value="patient">Patients</option>
          <option value="billing">Billing</option>
          <option value="alert">Alerts</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedNotifications.length} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('read')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No notifications</p>
            <p className="text-sm text-center">
              {filter === 'unread' ? 'All caught up!' : 
               filter === 'archived' ? 'No archived notifications' :
               'You\'re all set!'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`
                    border-l-4 rounded-r-lg p-4 cursor-pointer transition-all duration-200
                    ${getPriorityColor(notification.priority)}
                    ${!notification.isRead ? 'shadow-md' : 'opacity-75'}
                    hover:shadow-lg hover:scale-[1.02]
                  `}
                  onClick={() => !notification.isRead && onNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications([...selectedNotifications, notification.id]);
                        } else {
                          setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                notification.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {notification.priority}
                              </span>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {notification.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <div className="relative group">
                            <button className="p-1 hover:bg-white/50 rounded transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNotificationArchive(notification.id);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Archive className="w-4 h-4" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNotificationDelete(notification.id);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationAction(notification.id, index);
                              }}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                action.variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                                'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleBulkAction('read')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;