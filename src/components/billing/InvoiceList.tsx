"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { Invoice } from '@/types/billing';
import { formatCurrency, formatDate, formatStatusBadge } from '@/utils/formatters';

interface InvoiceListProps {
  invoices: Invoice[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onUpdateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onUpdateInvoice,
  onDeleteInvoice,
  onSelectInvoice
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Invoice>('dateCreated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(inv => inv.id));
    }
  };

  const handleBulkAction = (action: 'delete' | 'export' | 'mark_paid') => {
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices?`)) {
          selectedInvoices.forEach(id => onDeleteInvoice(id));
          setSelectedInvoices([]);
        }
        break;
      case 'mark_paid':
        selectedInvoices.forEach(id => 
          onUpdateInvoice(id, { 
            status: 'paid', 
            datePaid: new Date().toISOString().split('T')[0] 
          })
        );
        setSelectedInvoices([]);
        break;
      case 'export':
        // Export functionality would be implemented here
        console.log('Exporting invoices:', selectedInvoices);
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoices by customer name or invoice ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
              showFilters ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  onDateRangeChange({ start: '', end: '' });
                  onStatusFilterChange('all');
                  onSearchChange('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-lg"
        >
          <span className="text-sm text-teal-700">
            {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('mark_paid')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Mark Paid
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedInvoices([])}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Invoice List */}
      {sortedInvoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Invoices Found</h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter !== 'all' || dateRange.start || dateRange.end
              ? 'No invoices match your search criteria.'
              : 'Start by creating your first invoice.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedInvoices.length === invoices.length}
                onChange={handleSelectAll}
                className="mr-4 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <div className="grid grid-cols-6 gap-4 flex-1 text-sm font-medium text-gray-700">
                <button
                  onClick={() => handleSort('id')}
                  className="text-left hover:text-gray-900 transition-colors"
                >
                  Invoice ID
                </button>
                <button
                  onClick={() => handleSort('customerName')}
                  className="text-left hover:text-gray-900 transition-colors"
                >
                  Customer
                </button>
                <button
                  onClick={() => handleSort('dateCreated')}
                  className="text-left hover:text-gray-900 transition-colors"
                >
                  Date
                </button>
                <button
                  onClick={() => handleSort('total')}
                  className="text-left hover:text-gray-900 transition-colors"
                >
                  Amount
                </button>
                <button
                  onClick={() => handleSort('status')}
                  className="text-left hover:text-gray-900 transition-colors"
                >
                  Status
                </button>
                <span>Actions</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {sortedInvoices.map((invoice) => {
              const statusBadge = formatStatusBadge(invoice.status);
              
              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => handleSelectInvoice(invoice.id)}
                      className="mr-4 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <div className="grid grid-cols-6 gap-4 flex-1 text-sm">
                      <div className="font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-gray-700">{invoice.customerName}</div>
                      <div className="text-gray-700">{formatDate(invoice.dateCreated)}</div>
                      <div className="font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{statusBadge.text}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSelectInvoice(invoice)}
                          className="p-1 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(invoice.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;