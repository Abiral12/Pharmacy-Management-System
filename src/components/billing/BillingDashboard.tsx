"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Invoice, InvoiceItem, BillingStats } from '@/types/billing';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { validateInvoiceData } from '@/utils/validation';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import BillingStats from './BillingStats';
import PaymentProcessor from './PaymentProcessor';

interface BillingDashboardProps {
  onClose: () => void;
}

const BillingDashboard: React.FC<BillingDashboardProps> = ({ onClose }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'payments' | 'reports'>('dashboard');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [billingStats, setBillingStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadBillingData();
  }, []);

  // Filter invoices based on search, status, and date range
  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, statusFilter, dateRange]);

  const loadBillingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load from localStorage or API
      const storedInvoices = localStorage.getItem('pharmacy_invoices');
      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices);
        setInvoices(parsedInvoices);
        calculateStats(parsedInvoices);
      } else {
        // Load mock data for demonstration
        const mockInvoices = await loadMockData();
        setInvoices(mockInvoices);
        calculateStats(mockInvoices);
      }
    } catch (err) {
      setError('Failed to load billing data. Please try again.');
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = async (): Promise<Invoice[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'INV-001',
        customerName: 'Ram Sharma',
        customerId: 'CUST-001',
        items: [
          { id: '1', name: 'Paracetamol 500mg', description: '30 tablets', quantity: 2, unitPrice: 25, total: 50 },
          { id: '2', name: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 }
        ],
        subtotal: 550,
        tax: 71.5,
        discount: 0,
        total: 621.5,
        status: 'paid',
        paymentMethod: 'cash',
        dateCreated: '2024-01-15',
        datePaid: '2024-01-15',
        dueDate: '2024-01-30',
        notes: 'Regular customer - priority service'
      },
      {
        id: 'INV-002',
        customerName: 'Sita Gurung',
        customerId: 'CUST-002',
        items: [
          { id: '1', name: 'Amoxicillin 250mg', description: '21 capsules', quantity: 1, unitPrice: 45, total: 45 },
          { id: '2', name: 'Vitamin D3', description: '30 tablets', quantity: 1, unitPrice: 120, total: 120 }
        ],
        subtotal: 165,
        tax: 21.45,
        discount: 10,
        total: 176.45,
        status: 'pending',
        dateCreated: '2024-01-16',
        dueDate: '2024-01-31'
      }
    ];
  };

  const filterInvoices = () => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = searchQuery === '' || 
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      const matchesDateRange = (!dateRange.start || new Date(invoice.dateCreated) >= new Date(dateRange.start)) &&
                              (!dateRange.end || new Date(invoice.dateCreated) <= new Date(dateRange.end));
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
    
    setFilteredInvoices(filtered);
  };

  const calculateStats = (invoiceData: Invoice[]) => {
    const stats: BillingStats = {
      totalRevenue: invoiceData.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: invoiceData.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
      totalInvoices: invoiceData.length,
      paidInvoices: invoiceData.filter(inv => inv.status === 'paid').length,
      pendingInvoices: invoiceData.filter(inv => inv.status === 'pending').length,
      overdueInvoices: invoiceData.filter(inv => inv.status === 'overdue').length,
      averageInvoiceValue: invoiceData.length > 0 ? invoiceData.reduce((sum, inv) => sum + inv.total, 0) / invoiceData.length : 0,
      monthlyRevenue: calculateMonthlyRevenue(invoiceData),
      topCustomers: calculateTopCustomers(invoiceData)
    };
    
    setBillingStats(stats);
  };

  const calculateMonthlyRevenue = (invoiceData: Invoice[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return invoiceData
      .filter(inv => {
        const invDate = new Date(inv.dateCreated);
        return invDate.getMonth() === currentMonth && 
               invDate.getFullYear() === currentYear && 
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  const calculateTopCustomers = (invoiceData: Invoice[]) => {
    const customerTotals = invoiceData
      .filter(inv => inv.status === 'paid')
      .reduce((acc, inv) => {
        acc[inv.customerName] = (acc[inv.customerName] || 0) + inv.total;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(customerTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }));
  };

  const handleCreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'dateCreated'>) => {
    setLoading(true);
    setError(null);

    try {
      // Validate invoice data
      const validation = validateInvoiceData(invoiceData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const newInvoice: Invoice = {
        ...invoiceData,
        id: `INV-${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0]
      };

      const updatedInvoices = [...invoices, newInvoice];
      setInvoices(updatedInvoices);
      calculateStats(updatedInvoices);
      
      // Save to localStorage
      localStorage.setItem('pharmacy_invoices', JSON.stringify(updatedInvoices));
      
      setShowInvoiceForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    setLoading(true);
    setError(null);

    try {
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, ...updates } : inv
      );
      
      setInvoices(updatedInvoices);
      calculateStats(updatedInvoices);
      
      // Save to localStorage
      localStorage.setItem('pharmacy_invoices', JSON.stringify(updatedInvoices));
    } catch (err) {
      setError('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
      setInvoices(updatedInvoices);
      calculateStats(updatedInvoices);
      
      // Save to localStorage
      localStorage.setItem('pharmacy_invoices', JSON.stringify(updatedInvoices));
    } catch (err) {
      setError('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (format: 'pdf' | 'csv' | 'excel') => {
    setLoading(true);
    setError(null);

    try {
      // Implementation would depend on chosen export libraries
      // For now, we'll simulate the export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataToExport = filteredInvoices.map(invoice => ({
        'Invoice ID': invoice.id,
        'Customer': invoice.customerName,
        'Date': formatDate(invoice.dateCreated),
        'Total': formatCurrency(invoice.total),
        'Status': invoice.status.toUpperCase(),
        'Payment Method': invoice.paymentMethod || 'N/A'
      }));

      // Create and download file (simplified implementation)
      const dataStr = format === 'csv' 
        ? convertToCSV(dataToExport)
        : JSON.stringify(dataToExport, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing-report-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Billing Management</h2>
            <p className="text-sm text-gray-600">Comprehensive billing and payment system</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInvoiceForm(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </button>
          <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => handleExportData('csv')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-6 py-3 font-medium transition-colors flex items-center space-x-2 ${
              activeTab === id
                ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && billingStats && (
          <BillingStats stats={billingStats} />
        )}
        
        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={filteredInvoices}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onUpdateInvoice={handleUpdateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onSelectInvoice={setSelectedInvoice}
          />
        )}
        
        {activeTab === 'payments' && (
          <PaymentProcessor
            invoices={invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue')}
            onProcessPayment={handleUpdateInvoice}
          />
        )}
        
        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Advanced Reports</h3>
              <p className="text-gray-500">Detailed financial reports and analytics coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          onSubmit={handleCreateInvoice}
          onCancel={() => setShowInvoiceForm(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default BillingDashboard;