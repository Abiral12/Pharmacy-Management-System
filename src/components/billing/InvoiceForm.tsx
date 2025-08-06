"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Save,
  Calculator,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Invoice, InvoiceItem } from '@/types/billing';
import { validateInvoiceData, validateInvoiceItem } from '@/utils/validation';
import { formatCurrency } from '@/utils/formatters';

interface InvoiceFormProps {
  onSubmit: (invoice: Omit<Invoice, 'id' | 'dateCreated'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Invoice>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData
}) => {
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'dateCreated'>>({
    customerName: initialData?.customerName || '',
    customerId: initialData?.customerId || '',
    customerEmail: initialData?.customerEmail || '',
    customerPhone: initialData?.customerPhone || '',
    customerAddress: initialData?.customerAddress || '',
    items: initialData?.items || [],
    subtotal: initialData?.subtotal || 0,
    tax: initialData?.tax || 0,
    discount: initialData?.discount || 0,
    total: initialData?.total || 0,
    status: initialData?.status || 'pending',
    paymentMethod: initialData?.paymentMethod,
    dueDate: initialData?.dueDate || '',
    notes: initialData?.notes || '',
    terms: initialData?.terms || '',
    currency: initialData?.currency || 'NPR'
  });

  const [currentItem, setCurrentItem] = useState<Omit<InvoiceItem, 'id' | 'total'>>({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [taxRate, setTaxRate] = useState(13); // Default 13% VAT for Nepal

  // Calculate totals whenever items, tax rate, or discount changes
  useEffect(() => {
    calculateTotals();
  }, [formData.items, taxRate, formData.discount]);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax - formData.discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total: Math.max(0, total)
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleItemChange = (field: keyof typeof currentItem, value: any) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    // Validate current item
    const itemValidation = validateInvoiceItem({
      ...currentItem,
      total: currentItem.quantity * currentItem.unitPrice
    });

    if (!itemValidation.isValid) {
      setErrors(itemValidation.errors);
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      ...currentItem,
      total: currentItem.quantity * currentItem.unitPrice
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset current item
    setCurrentItem({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    });

    setErrors([]);
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, updates: Partial<InvoiceItem>) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              ...updates, 
              total: (updates.quantity || item.quantity) * (updates.unitPrice || item.unitPrice)
            }
          : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateInvoiceData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const generateDueDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Invoice' : 'Create New Invoice'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-600" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Optional customer ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+977-9812345678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Customer address"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-teal-600" />
              Invoice Items
            </h4>

            {/* Existing Items */}
            {formData.items.length > 0 && (
              <div className="mb-6 space-y-3">
                {formData.items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                          <div className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded font-medium">
                            {formatCurrency(item.total)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.description && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          placeholder="Item description"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Item */}
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
              <h5 className="font-medium text-gray-900 mb-3">Add New Item</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={currentItem.name}
                    onChange={(e) => handleItemChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentItem.unitPrice}
                    onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-medium">
                    {formatCurrency(currentItem.quantity * currentItem.unitPrice)}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={currentItem.description}
                  onChange={(e) => handleItemChange('description', e.target.value)}
                  placeholder="Item description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Invoice Settings */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <div className="flex space-x-1">
                    {[7, 15, 30].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => handleInputChange('dueDate', generateDueDate(days))}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Payment terms and conditions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Right Column - Totals */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-4">Invoice Summary</h5>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Tax:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                  <span className="font-medium">{formatCurrency(formData.tax)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <span className="font-medium">{formatCurrency(formData.discount)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-teal-600">{formatCurrency(formData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {initialData ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InvoiceForm;