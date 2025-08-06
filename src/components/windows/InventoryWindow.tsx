"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Building,
  X,
  Save,
  RefreshCw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  costPrice: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  supplierContact: string;
  location: string;
  dateAdded: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

interface InventoryWindowProps {
  onClose: () => void;
}

const InventoryWindow: React.FC<InventoryWindowProps> = ({ onClose }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'reports'>('inventory');

  // Form state for adding/editing items
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated' | 'status'>>({
    name: '',
    genericName: '',
    category: 'Pain Relief',
    quantity: 0,
    minStockLevel: 10,
    unitPrice: 0,
    costPrice: 0,
    expiryDate: '',
    batchNumber: '',
    supplier: '',
    supplierContact: '',
    location: 'Main Store'
  });

  const categories = [
    'Pain Relief', 'Antibiotics', 'Diabetes', 'Cardiovascular', 'Respiratory',
    'Gastric', 'Vitamins', 'Supplements', 'First Aid', 'Others'
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: 'INV-001',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Pain Relief',
        quantity: 150,
        minStockLevel: 50,
        unitPrice: 25,
        costPrice: 18,
        expiryDate: '2025-06-15',
        batchNumber: 'PC2024001',
        supplier: 'MediCorp Ltd',
        supplierContact: '+977-1-4567890',
        location: 'Shelf A1',
        dateAdded: '2024-01-15',
        lastUpdated: '2024-01-15',
        status: 'in_stock'
      },
      {
        id: 'INV-002',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        category: 'Antibiotics',
        quantity: 25,
        minStockLevel: 30,
        unitPrice: 45,
        costPrice: 35,
        expiryDate: '2024-12-20',
        batchNumber: 'AM2024002',
        supplier: 'PharmaCare Inc',
        supplierContact: '+977-1-4567891',
        location: 'Shelf B2',
        dateAdded: '2024-01-10',
        lastUpdated: '2024-01-16',
        status: 'low_stock'
      },
      {
        id: 'INV-003',
        name: 'Metformin 500mg',
        genericName: 'Metformin HCl',
        category: 'Diabetes',
        quantity: 0,
        minStockLevel: 20,
        unitPrice: 55,
        costPrice: 42,
        expiryDate: '2024-11-30',
        batchNumber: 'MF2024004',
        supplier: 'PharmaCare Inc',
        supplierContact: '+977-1-4567891',
        location: 'Shelf C1',
        dateAdded: '2024-01-05',
        lastUpdated: '2024-01-16',
        status: 'out_of_stock'
      },
      {
        id: 'INV-004',
        name: 'Vitamin D3 1000IU',
        category: 'Vitamins',
        quantity: 80,
        minStockLevel: 25,
        unitPrice: 120,
        costPrice: 95,
        expiryDate: '2024-03-15',
        batchNumber: 'VD2024001',
        supplier: 'HealthPlus Ltd',
        supplierContact: '+977-1-4567892',
        location: 'Shelf D1',
        dateAdded: '2024-01-08',
        lastUpdated: '2024-01-12',
        status: 'expired'
      }
    ];
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  // Filter inventory based on search, category, and status
  useEffect(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredInventory(filtered);
  }, [inventory, searchQuery, categoryFilter, statusFilter]);

  // Update item status based on quantity and expiry
  const updateItemStatus = (item: InventoryItem): InventoryItem => {
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    
    let status: InventoryItem['status'];
    if (expiryDate < today) {
      status = 'expired';
    } else if (item.quantity === 0) {
      status = 'out_of_stock';
    } else if (item.quantity <= item.minStockLevel) {
      status = 'low_stock';
    } else {
      status = 'in_stock';
    }
    
    return { ...item, status };
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      ...formData,
      id: `INV-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'in_stock'
    };
    
    const updatedItem = updateItemStatus(newItem);
    setInventory(prev => [...prev, updatedItem]);
    resetForm();
    setShowAddForm(false);
    setActiveTab('inventory');
  };

  const handleEditItem = () => {
    if (!selectedItem) return;
    
    const updatedItem: InventoryItem = {
      ...selectedItem,
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    const finalItem = updateItemStatus(updatedItem);
    setInventory(prev => prev.map(item => 
      item.id === selectedItem.id ? finalItem : item
    ));
    resetForm();
    setShowEditForm(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleStockUpdate = (itemId: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString().split('T')[0] };
        return updateItemStatus(updatedItem);
      }
      return item;
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      category: 'Pain Relief',
      quantity: 0,
      minStockLevel: 10,
      unitPrice: 0,
      costPrice: 0,
      expiryDate: '',
      batchNumber: '',
      supplier: '',
      supplierContact: '',
      location: 'Main Store'
    });
  };

  const openEditForm = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      genericName: item.genericName,
      category: item.category,
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      supplier: item.supplier,
      supplierContact: item.supplierContact,
      location: item.location
    });
    setShowEditForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const getLowStockCount = () => {
    return inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  };

  const getExpiredCount = () => {
    return inventory.filter(item => item.status === 'expired').length;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-800">Inventory Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'add'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add New Item
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'reports'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Reports
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'inventory' && (
          <div className="p-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Items</p>
                    <p className="text-2xl font-bold text-blue-700">{inventory.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Value</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(getTotalValue())}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-700">{getLowStockCount()}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Expired</p>
                    <p className="text-2xl font-bold text-red-700">{getExpiredCount()}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, batch number, or supplier..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Inventory List */}
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No items match your search criteria.'
                    : 'Start by adding your first inventory item.'}
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="flex items-center mx-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          {item.genericName && (
                            <span className="text-sm text-gray-500">({item.genericName})</span>
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(item.unitPrice)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Exp: {formatDate(item.expiryDate)}</span>
                            {getDaysUntilExpiry(item.expiryDate) < 30 && getDaysUntilExpiry(item.expiryDate) > 0 && (
                              <span className="text-orange-600 text-xs">({getDaysUntilExpiry(item.expiryDate)} days)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>{item.supplier}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Quick Stock Update */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleStockUpdate(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reduce Stock"
                          >
                            <TrendingDown className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium px-2">{item.quantity}</span>
                          <button
                            onClick={() => handleStockUpdate(item.id, item.quantity + 1)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Add Stock"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => openEditForm(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Inventory Item</h3>

              <form className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Paracetamol 500mg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Generic Name
                      </label>
                      <input
                        type="text"
                        value={formData.genericName}
                        onChange={(e) => setFormData(prev => ({ ...prev, genericName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Acetaminophen"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batch Number *
                      </label>
                      <input
                        type="text"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., PC2024001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Stock Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock Level *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.minStockLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Location *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Shelf A1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Supplier Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Name *
                      </label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., MediCorp Ltd"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Contact *
                      </label>
                      <input
                        type="text"
                        value={formData.supplierContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplierContact: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., +977-1-4567890"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('inventory');
                    }}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Inventory Reports</h3>
              <p className="text-gray-500">Detailed inventory reports and analytics coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Item: {selectedItem.name}</h3>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setSelectedItem(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditItem}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Item</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InventoryWindow;