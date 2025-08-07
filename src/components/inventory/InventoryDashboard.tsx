"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Upload,
  Eye,
  X,
  Check,
  Clock,
  MapPin,
  Calendar,
  Building,
  Phone,
  Tag,
  Bell,
  Activity
} from 'lucide-react';
import { InventoryManager } from '../../utils/inventoryManager';
import { 
  InventoryItem, 
  InventoryItemFormData, 
  MedicationCategory,
  getStatusLabel,
  getStatusColor
} from '../../types/inventory';

// Shadcn-style components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-gray-900 text-white hover:bg-gray-800",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-900",
    link: "underline-offset-4 hover:underline text-primary"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300 text-gray-900",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white"
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Select = ({ children, value, onValueChange, placeholder }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MedicationCategory | "">("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [formData, setFormData] = useState<InventoryItemFormData>({
    name: "",
    category: "Others",
    manufacturer: "",
    batchNumber: "",
    currentStock: 0,
    minimumStock: 0,
    unit: "tablets",
    location: "",
    expiryDate: "",
    supplierName: "",
    supplierContact: "",
  });

  // Load inventory data on component mount
  useEffect(() => {
    const items = InventoryManager.getInventoryItems();
    const inventoryStats = InventoryManager.getInventoryStats();
    const inventoryAlerts = InventoryManager.getAlerts();
    setInventory(items);
    setStats(inventoryStats);
    setAlerts(inventoryAlerts.filter(alert => !alert.isResolved).slice(0, 3)); // Show top 3 unresolved alerts
  }, []);

  // Refresh data when inventory changes
  const refreshData = () => {
    const items = InventoryManager.getInventoryItems();
    const inventoryStats = InventoryManager.getInventoryStats();
    setInventory(items);
    setStats(inventoryStats);
  };

  // Get unique categories from predefined list
  const categories: MedicationCategory[] = [
    'Pain Relief', 'Antibiotics', 'Diabetes', 'Cardiovascular', 
    'Hypertension', 'Gastric', 'Respiratory', 'Dermatology', 
    'Neurology', 'Others'
  ];

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.productInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productInfo.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productInfo.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.productInfo.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in_stock': { variant: 'success', label: 'In Stock' },
      'low_stock': { variant: 'warning', label: 'Low Stock' },
      'out_of_stock': { variant: 'destructive', label: 'Out of Stock' },
      'expired': { variant: 'destructive', label: 'Expired' },
      'near_expiry': { variant: 'warning', label: 'Near Expiry' },
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: 'Unknown' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Others",
      manufacturer: "",
      batchNumber: "",
      currentStock: 0,
      minimumStock: 0,
      unit: "tablets",
      location: "",
      expiryDate: "",
      supplierName: "",
      supplierContact: "",
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        InventoryManager.updateInventoryItem(editingItem.id, formData, 'Current User');
      } else {
        // Add new item
        InventoryManager.addInventoryItem(formData, 'Current User');
      }
      
      refreshData();
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Error saving item. Please try again.');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.productInfo.name,
      genericName: item.productInfo.genericName,
      category: item.productInfo.category,
      manufacturer: item.productInfo.manufacturer,
      batchNumber: item.productInfo.batchNumber,
      description: item.productInfo.description,
      activeIngredient: item.productInfo.activeIngredient,
      strength: item.productInfo.strength,
      dosageForm: item.productInfo.dosageForm,
      currentStock: item.stockInfo.currentStock,
      minimumStock: item.stockInfo.minimumStock,
      maximumStock: item.stockInfo.maximumStock,
      unit: item.stockInfo.unit,
      location: item.stockInfo.location,
      expiryDate: item.expiryInfo.expiryDate,
      supplierName: item.supplier.supplierName,
      supplierContact: item.supplier.supplierContact,
      supplierEmail: item.supplier.supplierEmail,
      barcode: item.metadata.barcode,
      sku: item.metadata.sku,
    });
    setShowAddDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to move this item to recycle bin?")) {
      InventoryManager.deleteInventoryItem(id);
      refreshData();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your pharmacy inventory efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {showAlerts && alerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 mb-2">Inventory Alerts ({alerts.length})</h3>
                  <div className="space-y-2">
                    {alerts.map((alert, index) => (
                      <div key={alert.id || index} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-900">{alert.message}</span>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'warning'}>
                            {alert.severity?.toUpperCase() || 'ALERT'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {alert.dateCreated ? new Date(alert.dateCreated).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    ))}
                  </div>
                  {alerts.length > 3 && (
                    <p className="text-sm text-red-700 mt-2">
                      And {alerts.length - 3} more alerts requiring attention...
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlerts(false)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalItems || 0}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.lowStockItems || 0}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats?.outOfStockItems || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Near Expiry</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.nearExpiryItems || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items, suppliers, or batch numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="All Categories"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                placeholder="All Status"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Inventory Items</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expiry</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.productInfo.name}</p>
                        <p className="text-sm text-gray-500">Batch: {item.productInfo.batchNumber}</p>
                        <p className="text-sm text-gray-500">{item.productInfo.manufacturer}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.productInfo.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.stockInfo.currentStock} {item.stockInfo.unit}</p>
                        <p className="text-sm text-gray-500">Min: {item.stockInfo.minimumStock}</p>
                        <p className="text-sm text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.stockInfo.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{new Date(item.expiryInfo.expiryDate).toLocaleDateString()}</p>
                        <p className={`text-sm ${item.expiryInfo.daysUntilExpiry < 30 ? 'text-red-500' : 'text-gray-500'}`}>
                          {item.expiryInfo.daysUntilExpiry > 0 ? `${item.expiryInfo.daysUntilExpiry} days` : 'Expired'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.supplier.supplierName}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {item.supplier.supplierContact}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value as MedicationCategory})}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer
                </label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number
                </label>
                <Input
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <Input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock
                </label>
                <Input
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({...formData, minimumStock: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({...formData, unit: value})}
                >
                  <option value="tablets">Tablets</option>
                  <option value="capsules">Capsules</option>
                  <option value="bottles">Bottles</option>
                  <option value="boxes">Boxes</option>
                  <option value="vials">Vials</option>
                  <option value="tubes">Tubes</option>
                  <option value="sachets">Sachets</option>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Shelf A1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <Input
                  value={formData.supplierName}
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Contact
                </label>
                <Input
                  value={formData.supplierContact}
                  onChange={(e) => setFormData({...formData, supplierContact: e.target.value})}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <Input
                value={formData.description || ""}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about the medication"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryDashboard;