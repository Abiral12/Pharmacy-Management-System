// Enhanced Inventory Management Utilities

import { 
  InventoryItem, 
  InventoryItemFormData, 
  InventoryStats, 
  StockMovement, 
  InventoryAlert,
  InventoryStatus,
  MedicationCategory,
  calculateDaysUntilExpiry,
  determineInventoryStatus
} from '../types/inventory';
import { NotificationManager } from './notificationManager';

export class InventoryManager {
  private static STORAGE_KEY = 'pharmacy_inventory';
  private static MOVEMENTS_KEY = 'pharmacy_stock_movements';
  private static ALERTS_KEY = 'pharmacy_inventory_alerts';

  // Get all inventory items
  static getInventoryItems(): InventoryItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultInventory();
  }

  // Save inventory items
  static saveInventoryItems(items: InventoryItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  // Add new inventory item
  static addInventoryItem(formData: InventoryItemFormData, addedBy: string): InventoryItem {
    const items = this.getInventoryItems();
    const daysUntilExpiry = calculateDaysUntilExpiry(formData.expiryDate);
    
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productInfo: {
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        manufacturer: formData.manufacturer,
        batchNumber: formData.batchNumber,
        description: formData.description,
        activeIngredient: formData.activeIngredient,
        strength: formData.strength,
        dosageForm: formData.dosageForm,
      },
      stockInfo: {
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        maximumStock: formData.maximumStock,
        unit: formData.unit,
        location: formData.location,
        reservedStock: 0,
      },
      expiryInfo: {
        expiryDate: formData.expiryDate,
        daysUntilExpiry,
        isExpired: daysUntilExpiry < 0,
        isNearExpiry: daysUntilExpiry <= 30 && daysUntilExpiry >= 0,
      },
      supplier: {
        supplierName: formData.supplierName,
        supplierContact: formData.supplierContact,
        supplierEmail: formData.supplierEmail,
      },
      metadata: {
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        addedBy,
        barcode: formData.barcode,
        sku: formData.sku,
      },
      status: determineInventoryStatus({
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        daysUntilExpiry,
      }),
    };

    items.push(newItem);
    this.saveInventoryItems(items);
    
    // Record stock movement
    this.recordStockMovement({
      itemId: newItem.id,
      itemName: newItem.productInfo.name,
      type: 'in',
      quantity: formData.currentStock,
      previousStock: 0,
      newStock: formData.currentStock,
      reason: 'Initial stock entry',
      performedBy: addedBy,
    });

    // Check for alerts
    this.checkAndCreateAlerts(newItem);

    return newItem;
  }

  // Update inventory item
  static updateInventoryItem(id: string, formData: InventoryItemFormData, modifiedBy: string): InventoryItem | null {
    const items = this.getInventoryItems();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return null;

    const existingItem = items[itemIndex];
    const daysUntilExpiry = calculateDaysUntilExpiry(formData.expiryDate);
    
    const updatedItem: InventoryItem = {
      ...existingItem,
      productInfo: {
        ...existingItem.productInfo,
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        manufacturer: formData.manufacturer,
        batchNumber: formData.batchNumber,
        description: formData.description,
        activeIngredient: formData.activeIngredient,
        strength: formData.strength,
        dosageForm: formData.dosageForm,
      },
      stockInfo: {
        ...existingItem.stockInfo,
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        maximumStock: formData.maximumStock,
        unit: formData.unit,
        location: formData.location,
      },
      expiryInfo: {
        expiryDate: formData.expiryDate,
        daysUntilExpiry,
        isExpired: daysUntilExpiry < 0,
        isNearExpiry: daysUntilExpiry <= 30 && daysUntilExpiry >= 0,
      },
      supplier: {
        ...existingItem.supplier,
        supplierName: formData.supplierName,
        supplierContact: formData.supplierContact,
        supplierEmail: formData.supplierEmail,
      },
      metadata: {
        ...existingItem.metadata,
        lastUpdated: new Date().toISOString(),
        lastModifiedBy: modifiedBy,
        barcode: formData.barcode,
        sku: formData.sku,
      },
      status: determineInventoryStatus({
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        daysUntilExpiry,
      }),
    };

    // Record stock movement if stock changed
    if (existingItem.stockInfo.currentStock !== formData.currentStock) {
      this.recordStockMovement({
        itemId: id,
        itemName: formData.name,
        type: 'adjustment',
        quantity: formData.currentStock - existingItem.stockInfo.currentStock,
        previousStock: existingItem.stockInfo.currentStock,
        newStock: formData.currentStock,
        reason: 'Manual adjustment',
        performedBy: modifiedBy,
      });
    }

    items[itemIndex] = updatedItem;
    this.saveInventoryItems(items);
    
    // Check for alerts
    this.checkAndCreateAlerts(updatedItem);

    return updatedItem;
  }

  // Delete inventory item (move to recycle bin)
  static deleteInventoryItem(id: string): boolean {
    const items = this.getInventoryItems();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return false;

    const deletedItem = items[itemIndex];
    items.splice(itemIndex, 1);
    this.saveInventoryItems(items);

    // Move to recycle bin (this would integrate with the recycle bin system)
    // For now, we'll just remove it from the main inventory

    return true;
  }

  // Update stock quantity
  static updateStock(id: string, newQuantity: number, reason: string, performedBy: string): boolean {
    const items = this.getInventoryItems();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return false;

    const item = items[itemIndex];
    const previousStock = item.stockInfo.currentStock;
    const quantityChange = newQuantity - previousStock;

    item.stockInfo.currentStock = newQuantity;
    item.metadata.lastUpdated = new Date().toISOString();
    item.metadata.lastModifiedBy = performedBy;
    item.status = determineInventoryStatus({
      currentStock: newQuantity,
      minimumStock: item.stockInfo.minimumStock,
      daysUntilExpiry: item.expiryInfo.daysUntilExpiry,
    });

    items[itemIndex] = item;
    this.saveInventoryItems(items);

    // Record stock movement
    this.recordStockMovement({
      itemId: id,
      itemName: item.productInfo.name,
      type: quantityChange > 0 ? 'in' : 'out',
      quantity: Math.abs(quantityChange),
      previousStock,
      newStock: newQuantity,
      reason,
      performedBy,
    });

    // Check for alerts
    this.checkAndCreateAlerts(item);

    return true;
  }

  // Get inventory statistics
  static getInventoryStats(): InventoryStats {
    const items = this.getInventoryItems();
    const movements = this.getStockMovements();
    
    const categoryDistribution: Record<MedicationCategory, number> = {
      'Pain Relief': 0,
      'Antibiotics': 0,
      'Diabetes': 0,
      'Cardiovascular': 0,
      'Hypertension': 0,
      'Gastric': 0,
      'Respiratory': 0,
      'Dermatology': 0,
      'Neurology': 0,
      'Others': 0,
    };

    let totalStockUnits = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;
    let expiredItems = 0;
    let nearExpiryItems = 0;

    items.forEach(item => {
      categoryDistribution[item.productInfo.category]++;
      totalStockUnits += item.stockInfo.currentStock;
      
      if (item.status === 'low_stock') lowStockItems++;
      if (item.status === 'out_of_stock') outOfStockItems++;
      if (item.status === 'expired') expiredItems++;
      if (item.status === 'near_expiry') nearExpiryItems++;
    });

    return {
      totalItems: items.length,
      totalCategories: Object.keys(categoryDistribution).filter(cat => categoryDistribution[cat as MedicationCategory] > 0).length,
      lowStockItems,
      outOfStockItems,
      expiredItems,
      nearExpiryItems,
      totalStockUnits,
      categoryDistribution,
      stockMovements: movements.slice(-10), // Last 10 movements
    };
  }

  // Record stock movement
  private static recordStockMovement(movement: Omit<StockMovement, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;
    
    const movements = this.getStockMovements();
    const newMovement: StockMovement = {
      ...movement,
      id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    movements.push(newMovement);
    
    // Keep only last 1000 movements
    if (movements.length > 1000) {
      movements.splice(0, movements.length - 1000);
    }
    
    localStorage.setItem(this.MOVEMENTS_KEY, JSON.stringify(movements));
  }

  // Get stock movements
  static getStockMovements(): StockMovement[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.MOVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Enhanced alert system with comprehensive monitoring
  private static checkAndCreateAlerts(item: InventoryItem): void {
    const alerts: InventoryAlert[] = [];
    const existingAlerts = this.getAlerts();

    // Check if alert already exists for this item and type
    const hasExistingAlert = (type: string) => 
      existingAlerts.some(alert => 
        alert.itemId === item.id && 
        alert.type === type && 
        !alert.isResolved
      );

    // Low stock alert
    if (item.status === 'low_stock' && !hasExistingAlert('low_stock')) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'low_stock',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} is running low (${item.stockInfo.currentStock} units remaining)`,
        severity: 'medium',
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: 'Reorder stock',
        metadata: {
          currentStock: item.stockInfo.currentStock,
          minimumStock: item.stockInfo.minimumStock,
          unit: item.stockInfo.unit,
          location: item.stockInfo.location
        }
      });

      // Trigger notification
      NotificationManager.notifyLowStock(
        item.productInfo.name,
        item.stockInfo.currentStock,
        item.stockInfo.unit
      );
    }

    // Critical low stock alert (when stock is 25% below minimum)
    const criticalThreshold = Math.floor(item.stockInfo.minimumStock * 0.25);
    if (item.stockInfo.currentStock <= criticalThreshold && item.stockInfo.currentStock > 0 && !hasExistingAlert('critical_low_stock')) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'critical_low_stock',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} is critically low (${item.stockInfo.currentStock} units remaining)`,
        severity: 'high',
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: 'Urgent reorder required',
        metadata: {
          currentStock: item.stockInfo.currentStock,
          minimumStock: item.stockInfo.minimumStock,
          criticalThreshold,
          unit: item.stockInfo.unit
        }
      });
    }

    // Out of stock alert
    if (item.status === 'out_of_stock' && !hasExistingAlert('out_of_stock')) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'out_of_stock',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} is out of stock`,
        severity: 'high',
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: 'Urgent reorder required',
        metadata: {
          lastStockDate: item.metadata.lastUpdated,
          minimumStock: item.stockInfo.minimumStock,
          unit: item.stockInfo.unit
        }
      });

      // Trigger notification
      NotificationManager.notifyOutOfStock(item.productInfo.name);
    }

    // Expiry alerts with different thresholds
    if (item.status === 'near_expiry' && !hasExistingAlert('expiry_warning')) {
      const severity = item.expiryInfo.daysUntilExpiry <= 7 ? 'high' : 'medium';
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'expiry_warning',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} expires in ${item.expiryInfo.daysUntilExpiry} days`,
        severity,
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: item.expiryInfo.daysUntilExpiry <= 7 ? 'Immediate action required' : 'Plan for disposal or promotion',
        metadata: {
          expiryDate: item.expiryInfo.expiryDate,
          daysUntilExpiry: item.expiryInfo.daysUntilExpiry,
          currentStock: item.stockInfo.currentStock,
          unit: item.stockInfo.unit
        }
      });

      // Trigger notification
      NotificationManager.notifyExpiryWarning(
        item.productInfo.name,
        item.expiryInfo.daysUntilExpiry
      );
    }

    if (item.status === 'expired' && !hasExistingAlert('expired')) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'expired',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} has expired`,
        severity: 'critical',
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: 'Remove from inventory immediately',
        metadata: {
          expiryDate: item.expiryInfo.expiryDate,
          daysExpired: Math.abs(item.expiryInfo.daysUntilExpiry),
          currentStock: item.stockInfo.currentStock,
          unit: item.stockInfo.unit
        }
      });

      // Trigger notification
      NotificationManager.notifyExpiredItem(item.productInfo.name);
    }

    // Overstock alert (when stock exceeds maximum by 50%)
    if (item.stockInfo.maximumStock && 
        item.stockInfo.currentStock > item.stockInfo.maximumStock * 1.5 && 
        !hasExistingAlert('overstock')) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
        type: 'overstock',
        itemId: item.id,
        itemName: item.productInfo.name,
        category: item.productInfo.category,
        message: `${item.productInfo.name} is overstocked (${item.stockInfo.currentStock} units)`,
        severity: 'low',
        dateCreated: new Date().toISOString(),
        isRead: false,
        isResolved: false,
        actionRequired: 'Consider reducing future orders',
        metadata: {
          currentStock: item.stockInfo.currentStock,
          maximumStock: item.stockInfo.maximumStock,
          overstockAmount: item.stockInfo.currentStock - item.stockInfo.maximumStock,
          unit: item.stockInfo.unit
        }
      });
    }

    // Save alerts
    if (alerts.length > 0) {
      this.saveAlerts(alerts);
    }
  }

  // Save alerts
  private static saveAlerts(newAlerts: InventoryAlert[]): void {
    if (typeof window === 'undefined') return;
    
    const existingAlerts = this.getAlerts();
    const allAlerts = [...existingAlerts, ...newAlerts];
    
    // Remove duplicates based on itemId and type
    const uniqueAlerts = allAlerts.filter((alert, index, self) => 
      index === self.findIndex(a => a.itemId === alert.itemId && a.type === alert.type && !a.isResolved)
    );
    
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(uniqueAlerts));
  }

  // Get alerts
  static getAlerts(): InventoryAlert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Advanced monitoring methods
  static getActiveAlerts(): InventoryAlert[] {
    return this.getAlerts().filter(alert => !alert.isResolved && !alert.isRead);
  }

  static getCriticalAlerts(): InventoryAlert[] {
    return this.getAlerts().filter(alert => 
      alert.severity === 'critical' && !alert.isResolved
    );
  }

  static getAlertsByCategory(category: MedicationCategory): InventoryAlert[] {
    return this.getAlerts().filter(alert => alert.category === category);
  }

  static getAlertsByType(type: string): InventoryAlert[] {
    return this.getAlerts().filter(alert => alert.type === type);
  }

  // Mark alert as read
  static markAlertAsRead(alertId: string): void {
    if (typeof window === 'undefined') return;
    
    const alerts = this.getAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isRead = true;
      localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
    }
  }

  // Resolve alert
  static resolveAlert(alertId: string, resolvedBy?: string): void {
    if (typeof window === 'undefined') return;
    
    const alerts = this.getAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isResolved = true;
      alerts[alertIndex].resolvedDate = new Date().toISOString();
      if (resolvedBy) {
        alerts[alertIndex].resolvedBy = resolvedBy;
      }
      localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
    }
  }

  // Bulk resolve alerts
  static bulkResolveAlerts(alertIds: string[], resolvedBy?: string): void {
    alertIds.forEach(id => this.resolveAlert(id, resolvedBy));
  }

  // Get items requiring immediate attention
  static getItemsRequiringAttention(): InventoryItem[] {
    const items = this.getInventoryItems();
    return items.filter(item => 
      item.status === 'out_of_stock' || 
      item.status === 'expired' ||
      (item.status === 'near_expiry' && item.expiryInfo.daysUntilExpiry <= 7) ||
      (item.status === 'low_stock' && item.stockInfo.currentStock <= item.stockInfo.minimumStock * 0.25)
    );
  }

  // Get expiring items within specified days
  static getExpiringItems(withinDays: number = 30): InventoryItem[] {
    const items = this.getInventoryItems();
    return items.filter(item => 
      item.expiryInfo.daysUntilExpiry <= withinDays && 
      item.expiryInfo.daysUntilExpiry >= 0
    ).sort((a, b) => a.expiryInfo.daysUntilExpiry - b.expiryInfo.daysUntilExpiry);
  }

  // Get low stock items
  static getLowStockItems(): InventoryItem[] {
    const items = this.getInventoryItems();
    return items.filter(item => 
      item.status === 'low_stock' || item.status === 'out_of_stock'
    ).sort((a, b) => a.stockInfo.currentStock - b.stockInfo.currentStock);
  }

  // Get items by location for physical inventory checks
  static getItemsByLocation(location: string): InventoryItem[] {
    const items = this.getInventoryItems();
    return items.filter(item => 
      item.stockInfo.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Generate reorder suggestions
  static getReorderSuggestions(): Array<{
    item: InventoryItem;
    suggestedQuantity: number;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    reason: string;
  }> {
    const items = this.getInventoryItems();
    const suggestions: Array<{
      item: InventoryItem;
      suggestedQuantity: number;
      priority: 'urgent' | 'high' | 'medium' | 'low';
      reason: string;
    }> = [];

    items.forEach(item => {
      let suggestedQuantity = 0;
      let priority: 'urgent' | 'high' | 'medium' | 'low' = 'low';
      let reason = '';

      if (item.status === 'out_of_stock') {
        suggestedQuantity = item.stockInfo.maximumStock || item.stockInfo.minimumStock * 2;
        priority = 'urgent';
        reason = 'Out of stock - immediate reorder required';
      } else if (item.status === 'low_stock') {
        const criticalThreshold = item.stockInfo.minimumStock * 0.25;
        if (item.stockInfo.currentStock <= criticalThreshold) {
          suggestedQuantity = (item.stockInfo.maximumStock || item.stockInfo.minimumStock * 2) - item.stockInfo.currentStock;
          priority = 'high';
          reason = 'Critically low stock';
        } else {
          suggestedQuantity = item.stockInfo.minimumStock - item.stockInfo.currentStock + (item.stockInfo.minimumStock * 0.5);
          priority = 'medium';
          reason = 'Below minimum stock level';
        }
      }

      if (suggestedQuantity > 0) {
        suggestions.push({
          item,
          suggestedQuantity: Math.ceil(suggestedQuantity),
          priority,
          reason
        });
      }
    });

    // Sort by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // Run comprehensive inventory health check
  static runInventoryHealthCheck(): {
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      count: number;
      description: string;
    }>;
    recommendations: string[];
  } {
    const items = this.getInventoryItems();
    const alerts = this.getActiveAlerts();
    const issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      count: number;
      description: string;
    }> = [];
    const recommendations: string[] = [];

    // Count different types of issues
    const outOfStockCount = items.filter(item => item.status === 'out_of_stock').length;
    const expiredCount = items.filter(item => item.status === 'expired').length;
    const criticalLowStockCount = items.filter(item => 
      item.status === 'low_stock' && 
      item.stockInfo.currentStock <= item.stockInfo.minimumStock * 0.25
    ).length;
    const nearExpiryCount = items.filter(item => 
      item.status === 'near_expiry' && 
      item.expiryInfo.daysUntilExpiry <= 7
    ).length;

    // Add issues
    if (outOfStockCount > 0) {
      issues.push({
        type: 'out_of_stock',
        severity: 'critical',
        count: outOfStockCount,
        description: `${outOfStockCount} items are completely out of stock`
      });
      recommendations.push('Immediately reorder out-of-stock items to prevent service disruption');
    }

    if (expiredCount > 0) {
      issues.push({
        type: 'expired',
        severity: 'critical',
        count: expiredCount,
        description: `${expiredCount} items have expired and must be removed`
      });
      recommendations.push('Remove expired items from inventory immediately for safety compliance');
    }

    if (criticalLowStockCount > 0) {
      issues.push({
        type: 'critical_low_stock',
        severity: 'high',
        count: criticalLowStockCount,
        description: `${criticalLowStockCount} items are critically low on stock`
      });
      recommendations.push('Prioritize reordering critically low stock items');
    }

    if (nearExpiryCount > 0) {
      issues.push({
        type: 'near_expiry',
        severity: 'medium',
        count: nearExpiryCount,
        description: `${nearExpiryCount} items expire within 7 days`
      });
      recommendations.push('Plan disposal or promotion for items expiring soon');
    }

    // Determine overall health
    let overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'excellent';
    
    if (outOfStockCount > 0 || expiredCount > 0) {
      overallHealth = 'critical';
    } else if (criticalLowStockCount > 0) {
      overallHealth = 'poor';
    } else if (nearExpiryCount > 0 || issues.length > 0) {
      overallHealth = 'fair';
    } else if (alerts.length > 0) {
      overallHealth = 'good';
    }

    return {
      overallHealth,
      issues,
      recommendations
    };
  }

  // Automated monitoring - should be called periodically
  static performAutomatedMonitoring(): void {
    const items = this.getInventoryItems();
    
    // Re-evaluate all items for new alerts
    items.forEach(item => {
      // Recalculate expiry info
      const daysUntilExpiry = calculateDaysUntilExpiry(item.expiryInfo.expiryDate);
      item.expiryInfo.daysUntilExpiry = daysUntilExpiry;
      item.expiryInfo.isExpired = daysUntilExpiry < 0;
      item.expiryInfo.isNearExpiry = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
      
      // Update status
      item.status = determineInventoryStatus({
        currentStock: item.stockInfo.currentStock,
        minimumStock: item.stockInfo.minimumStock,
        daysUntilExpiry
      });
      
      // Check for new alerts
      this.checkAndCreateAlerts(item);
    });
    
    // Save updated items
    this.saveInventoryItems(items);
  }

  // Get default inventory for initial setup
  private static getDefaultInventory(): InventoryItem[] {
    const defaultItems = [
      {
        name: 'Paracetamol 500mg',
        category: 'Pain Relief' as MedicationCategory,
        manufacturer: 'MediCorp Ltd',
        batchNumber: 'PC2024001',
        currentStock: 150,
        minimumStock: 50,
        unit: 'tablets',
        location: 'Shelf A1',
        expiryDate: '2025-06-15',
        supplierName: 'MediCorp Ltd',
        supplierContact: '+1234567890',
      },
      {
        name: 'Amoxicillin 250mg',
        category: 'Antibiotics' as MedicationCategory,
        manufacturer: 'PharmaCare Inc',
        batchNumber: 'AM2024002',
        currentStock: 8,
        minimumStock: 20,
        unit: 'capsules',
        location: 'Shelf B2',
        expiryDate: '2024-12-20',
        supplierName: 'PharmaCare Inc',
        supplierContact: '+1234567891',
      },
      {
        name: 'Metformin 500mg',
        category: 'Diabetes' as MedicationCategory,
        manufacturer: 'DiabetesCare Ltd',
        batchNumber: 'MF2024003',
        currentStock: 0,
        minimumStock: 25,
        unit: 'tablets',
        location: 'Shelf C3',
        expiryDate: '2024-11-30',
        supplierName: 'DiabetesCare Ltd',
        supplierContact: '+1234567892',
      },
    ];

    return defaultItems.map(item => this.createInventoryItemFromFormData(item, 'System'));
  }

  private static createInventoryItemFromFormData(formData: any, addedBy: string): InventoryItem {
    const daysUntilExpiry = calculateDaysUntilExpiry(formData.expiryDate);
    
    return {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productInfo: {
        name: formData.name,
        category: formData.category,
        manufacturer: formData.manufacturer,
        batchNumber: formData.batchNumber,
      },
      stockInfo: {
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        unit: formData.unit,
        location: formData.location,
      },
      expiryInfo: {
        expiryDate: formData.expiryDate,
        daysUntilExpiry,
        isExpired: daysUntilExpiry < 0,
        isNearExpiry: daysUntilExpiry <= 30 && daysUntilExpiry >= 0,
      },
      supplier: {
        supplierName: formData.supplierName,
        supplierContact: formData.supplierContact,
      },
      metadata: {
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        addedBy,
      },
      status: determineInventoryStatus({
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        daysUntilExpiry,
      }),
    };
  }
}