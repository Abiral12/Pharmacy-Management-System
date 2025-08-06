"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  X
} from 'lucide-react';

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'bank_transfer';
  dateCreated: string;
  datePaid?: string;
  dueDate: string;
}

interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BillingWindowProps {
  onClose: () => void;
}

const BillingWindow: React.FC<BillingWindowProps> = ({ onClose }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'reports'>('invoices');

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: 'INV-001',
        patientName: 'Ram Sharma',
        patientId: 'PAT-001',
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
        dueDate: '2024-01-30'
      },
      {
        id: 'INV-002',
        patientName: 'Sita Gurung',
        patientId: 'PAT-002',
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
      },
      {
        id: 'INV-003',
        patientName: 'Bikash Thapa',
        patientId: 'PAT-003',
        items: [
          { id: '1', name: 'Metformin 500mg', description: '60 tablets', quantity: 1, unitPrice: 55, total: 55 }
        ],
        subtotal: 55,
        tax: 7.15,
        discount: 0,
        total: 62.15,
        status: 'overdue',
        dateCreated: '2024-01-10',
        dueDate: '2024-01-25'
      }
    ];
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Filter invoices based on search and status
  useEffect(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = searchQuery === '' || 
        invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredInvoices(filtered);
  }, [invoices, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePaymentUpdate = (invoiceId: string, paymentMethod: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: 'paid' as const, 
            paymentMethod: paymentMethod as any,
            datePaid: new Date().toISOString().split('T')[0]
          }
        : invoice
    ));
  };

  const getTotalRevenue = () => {
    return invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  };

  const getPendingAmount = () => {
    return invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-800">Billing & Payment Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateInvoice(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
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
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'payments'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          Payments
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
          Financial Reports
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'invoices' && (
          <div className="p-4">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoices by patient name or invoice ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(getTotalRevenue())}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
                    <p className="text-2xl font-bold text-yellow-700">{formatCurrency(getPendingAmount())}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Invoices</p>
                    <p className="text-2xl font-bold text-blue-700">{invoices.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Invoices List */}
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Invoices Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No invoices match your search criteria.' 
                    : 'Start by creating your first invoice.'}
                </p>
                <button
                  onClick={() => setShowCreateInvoice(true)}
                  className="flex items-center mx-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Invoice
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{invoice.id}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{invoice.patientName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">{formatCurrency(invoice.total)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {formatDate(invoice.dateCreated)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(invoice.dueDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {invoice.status === 'pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handlePaymentUpdate(invoice.id, 'cash')}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Mark Paid
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceDetails(true);
                          }}
                          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-6">
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Payment Processing</h3>
              <p className="text-gray-500">Advanced payment processing features coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Financial Reports</h3>
              <p className="text-gray-500">Comprehensive financial reporting features coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceDetails && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setShowInvoiceDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Invoice ID</label>
                    <p className="font-semibold">{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Patient</label>
                    <p className="font-semibold">{selectedInvoice.patientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date Created</label>
                    <p>{formatDate(selectedInvoice.dateCreated)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Unit Price</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item) => (
                          <tr key={item.id} className="border-t border-gray-200">
                            <td className="px-4 py-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-500">{item.description}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (13%):</span>
                      <span>{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BillingWindow;