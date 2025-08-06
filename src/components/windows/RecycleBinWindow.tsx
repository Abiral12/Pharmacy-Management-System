"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  RotateCcw,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  User,
  Package,
  FileText,
  Users,
  Database,
  CheckSquare,
  Square,
  RefreshCw,
  X
} from 'lucide-react';
import { RecycleBinItem, ItemType } from '@/types/pharmacy';
import { RecycleBinManager } from '@/utils/recycleBinManager';

interface RecycleBinWindowProps {
  onItemRestore?: (item: any, type: ItemType) => void;
  onBulkRestore?: (items: any[]) => void;
}

const RecycleBinWindow: React.FC<RecycleBinWindowProps> = ({
  onItemRestore,
  onBulkRestore
}) => {
  const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ItemType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'date' | 'deletedBy'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const recycleBinManager = RecycleBinManager.getInstance();

  // Load recycle bin contents
  const loadRecycleBinContents = () => {
    try {
      let items = recycleBinManager.getRecycleBinContents();
      
      // Apply search filter
      if (searchQuery) {
        items = recycleBinManager.searchRecycleBin(searchQuery);
      }
      
      // Apply type filter
      if (filterType !== 'all') {
        items = items.filter(item => item.itemType === filterType);
      }
      
      // Apply sorting
      items = recycleBinManager.sortRecycleBin(sortBy, sortOrder);
      
      setRecycleBinItems(items);
    } catch (error) {
      console.error('Error loading recycle bin contents:', error);
    }
  };

  useEffect(() => {
    loadRecycleBinContents();
  }, [searchQuery, filterType, sortBy, sortOrder]);

  // Handle item restoration
  const handleRestoreItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const restoredData = await recycleBinManager.restoreItem(itemId);
      const item = recycleBinItems.find(item => item.id === itemId);
      
      if (item && onItemRestore) {
        onItemRestore(restoredData, item.itemType);
      }
      
      loadRecycleBinContents();
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } catch (error) {
      console.error('Error restoring item:', error);
      alert('Failed to restore item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk restoration
  const handleBulkRestore = async () => {
    if (selectedItems.size === 0) return;
    
    setIsLoading(true);
    try {
      const itemIds = Array.from(selectedItems);
      const restoredItems = await recycleBinManager.bulkRestore(itemIds);
      
      if (onBulkRestore) {
        onBulkRestore(restoredItems);
      }
      
      loadRecycleBinContents();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error bulk restoring items:', error);
      alert('Failed to restore selected items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (itemId: string) => {
    setIsLoading(true);
    try {
      await recycleBinManager.permanentlyDelete(itemId);
      loadRecycleBinContents();
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setShowConfirmDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error permanently deleting item:', error);
      alert('Failed to permanently delete item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle empty recycle bin
  const handleEmptyRecycleBin = async () => {
    if (window.confirm('Are you sure you want to permanently delete all items in the recycle bin? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await recycleBinManager.emptyRecycleBin();
        loadRecycleBinContents();
        setSelectedItems(new Set());
      } catch (error) {
        console.error('Error emptying recycle bin:', error);
        alert('Failed to empty recycle bin. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.size === recycleBinItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(recycleBinItems.map(item => item.id)));
    }
  };

  // Get icon for item type
  const getItemTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'patient':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'inventory':
        return <Database className="w-4 h-4 text-purple-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate days since deletion
  const getDaysSinceDeletion = (dateString: string) => {
    const deletionDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - deletionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Trash2 className="w-6 h-6 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Recycle Bin</h2>
          <span className="text-sm text-gray-500">
            ({recycleBinItems.length} items)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadRecycleBinContents}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {recycleBinItems.length > 0 && (
            <button
              onClick={handleEmptyRecycleBin}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Empty Bin
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search recycle bin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ItemType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="patient">Patients</option>
            <option value="prescription">Prescriptions</option>
            <option value="inventory">Inventory</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="type-asc">Type A-Z</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="flex items-center justify-between bg-teal-50 p-3 rounded-lg">
            <span className="text-sm text-teal-700">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkRestore}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Restore Selected
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {recycleBinItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Trash2 className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Recycle Bin is Empty</h3>
            <p className="text-sm text-center max-w-md">
              Deleted items will appear here. You can restore them or permanently delete them.
            </p>
          </div>
        ) : (
          <div className="p-4">
            {/* Select All Checkbox */}
            <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
              <button
                onClick={selectAllItems}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {selectedItems.size === recycleBinItems.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Select All</span>
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {recycleBinItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedItems.has(item.id) ? 'border-teal-300 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className="mt-1"
                    >
                      {selectedItems.has(item.id) ? (
                        <CheckSquare className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {getItemTypeIcon(item.itemType)}
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.displayName}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {item.itemType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Deleted {getDaysSinceDeletion(item.deletionInfo.deletedDate)} days ago</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>by {item.deletionInfo.deletedBy}</span>
                        </div>
                      </div>

                      {item.deletionInfo.reason && (
                        <p className="text-sm text-gray-600 mt-1">
                          Reason: {item.deletionInfo.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestoreItem(item.id)}
                        disabled={!item.canRestore || isLoading}
                        className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Restore Item"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item.id);
                          setShowConfirmDialog(true);
                        }}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Permanently Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Permanently Delete Item
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete this item? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => itemToDelete && handlePermanentDelete(itemToDelete)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecycleBinWindow;