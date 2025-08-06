// Comprehensive Billing System Types

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
  taxRate?: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'digital_wallet';
  paymentReference?: string;
  dateCreated: string;
  datePaid?: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  createdBy?: string;
  lastModified?: string;
  modifiedBy?: string;
  currency: string;
  exchangeRate?: number;
  tags?: string[];
  attachments?: string[];
}

export interface BillingStats {
  totalRevenue: number;
  pendingAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
  monthlyRevenue: number;
  topCustomers: Array<{ name: string; total: number }>;
  revenueGrowth?: number;
  collectionRate?: number;
  averagePaymentTime?: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference?: string;
  notes?: string;
  processedBy?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: number;
  preferredPaymentMethod?: string;
  totalPurchases: number;
  outstandingBalance: number;
  lastPurchaseDate?: string;
  customerSince: string;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

export interface BillingSettings {
  taxRate: number;
  currency: string;
  paymentTerms: number;
  latePaymentFee: number;
  invoicePrefix: string;
  invoiceNumbering: 'sequential' | 'random';
  defaultPaymentMethod: string;
  autoSendReminders: boolean;
  reminderDays: number[];
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    taxId?: string;
  };
}

export interface BillingReport {
  id: string;
  name: string;
  type: 'revenue' | 'outstanding' | 'customer' | 'tax' | 'payment_method' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, any>;
  data: any[];
  generatedAt: string;
  generatedBy: string;
  format: 'table' | 'chart' | 'summary';
}

export interface BillingValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel' | 'json';
  includeHeaders: boolean;
  dateFormat: string;
  currencyFormat: string;
  fields: string[];
  filters?: Record<string, any>;
}

// Utility types for form handling
export type InvoiceFormData = Omit<Invoice, 'id' | 'dateCreated' | 'lastModified'>;
export type InvoiceItemFormData = Omit<InvoiceItem, 'id' | 'total'>;
export type CustomerFormData = Omit<Customer, 'id' | 'totalPurchases' | 'outstandingBalance' | 'customerSince'>;

// API response types
export interface BillingApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Event types for billing system
export interface BillingEvent {
  id: string;
  type: 'invoice_created' | 'payment_received' | 'invoice_overdue' | 'payment_failed' | 'refund_processed';
  invoiceId: string;
  customerId?: string;
  amount?: number;
  timestamp: string;
  details: Record<string, any>;
  processedBy?: string;
}

// Search and filter types
export interface BillingSearchCriteria {
  query?: string;
  status?: Invoice['status'][];
  paymentMethod?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  customerId?: string;
  tags?: string[];
}

export interface BillingSortOptions {
  field: keyof Invoice;
  direction: 'asc' | 'desc';
}

// Dashboard widget types
export interface BillingWidget {
  id: string;
  type: 'stat' | 'chart' | 'table' | 'list';
  title: string;
  data: any;
  config: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
  refreshInterval?: number;
}

// Notification types
export interface BillingNotification {
  id: string;
  type: 'payment_reminder' | 'overdue_notice' | 'payment_received' | 'invoice_created';
  recipientType: 'customer' | 'admin' | 'staff';
  recipientId: string;
  subject: string;
  message: string;
  scheduledFor?: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  invoiceId?: string;
  customerId?: string;
}

// Audit trail types
export interface BillingAuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'payment' | 'refund' | 'export';
  entityType: 'invoice' | 'payment' | 'customer' | 'settings';
  entityId: string;
  userId: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}