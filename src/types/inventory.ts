// Enhanced Inventory System Types (Price-Free)

export type MedicationCategory = 
  | 'Pain Relief'
  | 'Antibiotics' 
  | 'Diabetes'
  | 'Cardiovascular'
  | 'Hypertension'
  | 'Gastric'
  | 'Respiratory'
  | 'Dermatology'
  | 'Neurology'
  | 'Others';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'near_expiry';

export interface InventoryItem {
  id: string;
  productInfo: {
    name: string;
    genericName?: string;
    category: MedicationCategory;
    manufacturer: string;
    batchNumber: string;
    description?: string;
    activeIngredient?: string;
    strength?: string;
    dosageForm?: string;
  };
  stockInfo: {
    currentStock: number;
    minimumStock: number;
    maximumStock?: number;
    unit: string;
    location: string;
    reservedStock?: number;
  };
  expiryInfo: {
    expiryDate: string;
    daysUntilExpiry: number;
    isExpired: boolean;
    isNearExpiry: boolean;
  };
  supplier: {
    supplierName: string;
    supplierContact: string;
    supplierEmail?: string;
    lastOrderDate?: string;
    leadTime?: number;
  };
  metadata: {
    dateAdded: string;
    lastUpdated: string;
    addedBy: string;
    lastModifiedBy?: string;
    barcode?: string;
    sku?: string;
  };
  status: InventoryStatus;
}

export interface InventoryItemFormData {
  name: string;
  genericName?: string;
  category: MedicationCategory;
  manufacturer: string;
  batchNumber: string;
  description?: string;
  activeIngredient?: string;
  strength?: string;
  dosageForm?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unit: string;
  location: string;
  expiryDate: string;
  supplierName: string;
  supplierContact: string;
  supplierEmail?: string;
  barcode?: string;
  sku?: string;
}

export interface InventoryStats {
  totalItems: number;
  totalCategories: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
  nearExpiryItems: number;
  totalStockUnits: number;
  categoryDistribution: Record<MedicationCategory, number>;
  stockMovements: StockMovement[];
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'adjustment' | 'expired' | 'damaged';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  timestamp: string;
  performedBy: string;
  notes?: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiry_warning' | 'expired' | 'reorder_point';
  itemId: string;
  itemName: string;
  category: MedicationCategory;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateCreated: string;
  isRead: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  actionRequired?: string;
}

export interface InventorySearchCriteria {
  query?: string;
  category?: MedicationCategory[];
  status?: InventoryStatus[];
  supplier?: string[];
  location?: string[];
  expiryRange?: {
    start: string;
    end: string;
  };
  stockRange?: {
    min: number;
    max: number;
  };
  manufacturer?: string[];
}

export interface InventorySortOptions {
  field: keyof InventoryItem | 'name' | 'category' | 'stock' | 'expiry' | 'supplier';
  direction: 'asc' | 'desc';
}

export interface InventoryReport {
  id: string;
  name: string;
  type: 'stock_levels' | 'expiry_report' | 'movement_history' | 'category_analysis' | 'supplier_report';
  dateRange: {
    start: string;
    end: string;
  };
  filters: InventorySearchCriteria;
  data: any[];
  generatedAt: string;
  generatedBy: string;
  format: 'table' | 'chart' | 'summary';
}

export interface InventoryValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface BulkOperation {
  id: string;
  type: 'update_stock' | 'update_expiry' | 'change_location' | 'bulk_delete';
  itemIds: string[];
  operation: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  performedBy: string;
  results?: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

export interface InventoryAuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'stock_adjustment' | 'bulk_operation';
  entityType: 'inventory_item' | 'stock_movement' | 'bulk_operation';
  entityId: string;
  userId: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

// Utility functions for inventory calculations
export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const determineInventoryStatus = (item: {
  currentStock: number;
  minimumStock: number;
  daysUntilExpiry: number;
}): InventoryStatus => {
  if (item.daysUntilExpiry < 0) return 'expired';
  if (item.daysUntilExpiry <= 30) return 'near_expiry';
  if (item.currentStock === 0) return 'out_of_stock';
  if (item.currentStock <= item.minimumStock) return 'low_stock';
  return 'in_stock';
};

export const getStatusColor = (status: InventoryStatus): string => {
  switch (status) {
    case 'in_stock': return 'green';
    case 'low_stock': return 'orange';
    case 'out_of_stock': return 'red';
    case 'expired': return 'red';
    case 'near_expiry': return 'yellow';
    default: return 'gray';
  }
};

export const getStatusLabel = (status: InventoryStatus): string => {
  switch (status) {
    case 'in_stock': return 'In Stock';
    case 'low_stock': return 'Low Stock';
    case 'out_of_stock': return 'Out of Stock';
    case 'expired': return 'Expired';
    case 'near_expiry': return 'Near Expiry';
    default: return 'Unknown';
  }
};