// Unit Tests for Inventory Manager

import { InventoryManager } from '../../utils/inventoryManager';
import { InventoryItemFormData, MedicationCategory } from '../../types/inventory';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('InventoryManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addInventoryItem', () => {
    it('should add a new inventory item successfully', () => {
      const formData: InventoryItemFormData = {
        name: 'Test Medicine',
        category: 'Pain Relief' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'TEST001',
        currentStock: 100,
        minimumStock: 20,
        unit: 'tablets',
        location: 'Shelf A1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const result = InventoryManager.addInventoryItem(formData, 'TestUser');

      expect(result).toBeDefined();
      expect(result.productInfo.name).toBe('Test Medicine');
      expect(result.productInfo.category).toBe('Pain Relief');
      expect(result.stockInfo.currentStock).toBe(100);
      expect(result.stockInfo.minimumStock).toBe(20);
      expect(result.metadata.addedBy).toBe('TestUser');
    });

    it('should set correct status based on stock levels', () => {
      const lowStockData: InventoryItemFormData = {
        name: 'Low Stock Medicine',
        category: 'Antibiotics' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'LOW001',
        currentStock: 5,
        minimumStock: 20,
        unit: 'tablets',
        location: 'Shelf B1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const result = InventoryManager.addInventoryItem(lowStockData, 'TestUser');
      expect(result.status).toBe('low_stock');
    });

    it('should set out_of_stock status when stock is zero', () => {
      const outOfStockData: InventoryItemFormData = {
        name: 'Out of Stock Medicine',
        category: 'Diabetes' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'OUT001',
        currentStock: 0,
        minimumStock: 10,
        unit: 'tablets',
        location: 'Shelf C1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const result = InventoryManager.addInventoryItem(outOfStockData, 'TestUser');
      expect(result.status).toBe('out_of_stock');
    });

    it('should calculate days until expiry correctly', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const formData: InventoryItemFormData = {
        name: 'Expiry Test Medicine',
        category: 'Others' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'EXP001',
        currentStock: 50,
        minimumStock: 10,
        unit: 'tablets',
        location: 'Shelf D1',
        expiryDate: futureDate.toISOString().split('T')[0],
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const result = InventoryManager.addInventoryItem(formData, 'TestUser');
      expect(result.expiryInfo.daysUntilExpiry).toBeCloseTo(30, 0);
      expect(result.expiryInfo.isNearExpiry).toBe(true);
    });
  });

  describe('updateInventoryItem', () => {
    it('should update an existing inventory item', () => {
      // First add an item
      const formData: InventoryItemFormData = {
        name: 'Original Medicine',
        category: 'Pain Relief' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'ORIG001',
        currentStock: 100,
        minimumStock: 20,
        unit: 'tablets',
        location: 'Shelf A1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const addedItem = InventoryManager.addInventoryItem(formData, 'TestUser');

      // Update the item
      const updateData: InventoryItemFormData = {
        ...formData,
        name: 'Updated Medicine',
        currentStock: 150
      };

      const updatedItem = InventoryManager.updateInventoryItem(addedItem.id, updateData, 'UpdateUser');

      expect(updatedItem).toBeDefined();
      expect(updatedItem!.productInfo.name).toBe('Updated Medicine');
      expect(updatedItem!.stockInfo.currentStock).toBe(150);
      expect(updatedItem!.metadata.lastModifiedBy).toBe('UpdateUser');
    });

    it('should return null for non-existent item', () => {
      const formData: InventoryItemFormData = {
        name: 'Non-existent Medicine',
        category: 'Others' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'NONE001',
        currentStock: 50,
        minimumStock: 10,
        unit: 'tablets',
        location: 'Shelf Z1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const result = InventoryManager.updateInventoryItem('non-existent-id', formData, 'TestUser');
      expect(result).toBeNull();
    });
  });

  describe('updateStock', () => {
    it('should update stock quantity and create movement record', () => {
      // Add an item first
      const formData: InventoryItemFormData = {
        name: 'Stock Update Medicine',
        category: 'Cardiovascular' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'STOCK001',
        currentStock: 100,
        minimumStock: 20,
        unit: 'tablets',
        location: 'Shelf E1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const addedItem = InventoryManager.addInventoryItem(formData, 'TestUser');

      // Update stock
      const result = InventoryManager.updateStock(addedItem.id, 150, 'Restocked', 'StockUser');

      expect(result).toBe(true);

      // Verify stock was updated
      const items = InventoryManager.getInventoryItems();
      const updatedItem = items.find(item => item.id === addedItem.id);
      expect(updatedItem!.stockInfo.currentStock).toBe(150);

      // Verify movement was recorded
      const movements = InventoryManager.getStockMovements();
      expect(movements.length).toBeGreaterThan(0);
      const latestMovement = movements[movements.length - 1];
      expect(latestMovement.itemId).toBe(addedItem.id);
      expect(latestMovement.newStock).toBe(150);
      expect(latestMovement.reason).toBe('Restocked');
    });

    it('should return false for non-existent item', () => {
      const result = InventoryManager.updateStock('non-existent-id', 100, 'Test', 'TestUser');
      expect(result).toBe(false);
    });
  });

  describe('getInventoryStats', () => {
    it('should calculate correct inventory statistics', () => {
      // Clear any existing data
      localStorage.clear();

      // Add test items with different statuses
      const items = [
        {
          name: 'In Stock Item',
          category: 'Pain Relief' as MedicationCategory,
          manufacturer: 'Test Pharma',
          batchNumber: 'IN001',
          currentStock: 100,
          minimumStock: 20,
          unit: 'tablets',
          location: 'Shelf A1',
          expiryDate: '2025-12-31',
          supplierName: 'Test Supplier',
          supplierContact: '+1234567890'
        },
        {
          name: 'Low Stock Item',
          category: 'Antibiotics' as MedicationCategory,
          manufacturer: 'Test Pharma',
          batchNumber: 'LOW001',
          currentStock: 5,
          minimumStock: 20,
          unit: 'tablets',
          location: 'Shelf B1',
          expiryDate: '2025-12-31',
          supplierName: 'Test Supplier',
          supplierContact: '+1234567890'
        },
        {
          name: 'Out of Stock Item',
          category: 'Diabetes' as MedicationCategory,
          manufacturer: 'Test Pharma',
          batchNumber: 'OUT001',
          currentStock: 0,
          minimumStock: 10,
          unit: 'tablets',
          location: 'Shelf C1',
          expiryDate: '2025-12-31',
          supplierName: 'Test Supplier',
          supplierContact: '+1234567890'
        }
      ];

      items.forEach(item => {
        InventoryManager.addInventoryItem(item, 'TestUser');
      });

      const stats = InventoryManager.getInventoryStats();

      expect(stats.totalItems).toBe(3);
      expect(stats.lowStockItems).toBe(1);
      expect(stats.outOfStockItems).toBe(1);
      expect(stats.totalStockUnits).toBe(105); // 100 + 5 + 0
      expect(stats.categoryDistribution['Pain Relief']).toBe(1);
      expect(stats.categoryDistribution['Antibiotics']).toBe(1);
      expect(stats.categoryDistribution['Diabetes']).toBe(1);
    });
  });

  describe('deleteInventoryItem', () => {
    it('should remove item from inventory', () => {
      const formData: InventoryItemFormData = {
        name: 'Delete Test Medicine',
        category: 'Others' as MedicationCategory,
        manufacturer: 'Test Pharma',
        batchNumber: 'DEL001',
        currentStock: 50,
        minimumStock: 10,
        unit: 'tablets',
        location: 'Shelf F1',
        expiryDate: '2025-12-31',
        supplierName: 'Test Supplier',
        supplierContact: '+1234567890'
      };

      const addedItem = InventoryManager.addInventoryItem(formData, 'TestUser');
      const initialCount = InventoryManager.getInventoryItems().length;

      const result = InventoryManager.deleteInventoryItem(addedItem.id);

      expect(result).toBe(true);
      expect(InventoryManager.getInventoryItems().length).toBe(initialCount - 1);
    });

    it('should return false for non-existent item', () => {
      const result = InventoryManager.deleteInventoryItem('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('getAlerts', () => {
    it('should generate alerts for problematic items', () => {
      // Clear existing data
      localStorage.clear();

      // Add items that should generate alerts
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);

      const nearExpiryDate = new Date();
      nearExpiryDate.setDate(nearExpiryDate.getDate() + 15);

      const items = [
        {
          name: 'Expired Medicine',
          category: 'Others' as MedicationCategory,
          manufacturer: 'Test Pharma',
          batchNumber: 'EXP001',
          currentStock: 50,
          minimumStock: 10,
          unit: 'tablets',
          location: 'Shelf G1',
          expiryDate: expiredDate.toISOString().split('T')[0],
          supplierName: 'Test Supplier',
          supplierContact: '+1234567890'
        },
        {
          name: 'Near Expiry Medicine',
          category: 'Others' as MedicationCategory,
          manufacturer: 'Test Pharma',
          batchNumber: 'NEAR001',
          currentStock: 50,
          minimumStock: 10,
          unit: 'tablets',
          location: 'Shelf H1',
          expiryDate: nearExpiryDate.toISOString().split('T')[0],
          supplierName: 'Test Supplier',
          supplierContact: '+1234567890'
        }
      ];

      items.forEach(item => {
        InventoryManager.addInventoryItem(item, 'TestUser');
      });

      const alerts = InventoryManager.getAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      // Check for expired item alert
      const expiredAlert = alerts.find(alert => alert.type === 'expired');
      expect(expiredAlert).toBeDefined();
      expect(expiredAlert!.severity).toBe('critical');

      // Check for near expiry alert
      const nearExpiryAlert = alerts.find(alert => alert.type === 'expiry_warning');
      expect(nearExpiryAlert).toBeDefined();
      expect(nearExpiryAlert!.severity).toBe('medium');
    });
  });
});