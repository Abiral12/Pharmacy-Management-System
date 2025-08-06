import { RecycleBinItem, ItemType, Patient, Prescription, InventoryItem } from '@/types/pharmacy';

export class RecycleBinManager {
  private static instance: RecycleBinManager;
  private recycleBinKey = 'pharmacy_recycle_bin';

  private constructor() {}

  public static getInstance(): RecycleBinManager {
    if (!RecycleBinManager.instance) {
      RecycleBinManager.instance = new RecycleBinManager();
    }
    return RecycleBinManager.instance;
  }

  // Get all recycle bin contents from localStorage
  public getRecycleBinContents(): RecycleBinItem[] {
    try {
      const stored = localStorage.getItem(this.recycleBinKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recycle bin contents:', error);
      return [];
    }
  }

  // Save recycle bin contents to localStorage
  private saveRecycleBinContents(items: RecycleBinItem[]): void {
    try {
      localStorage.setItem(this.recycleBinKey, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving recycle bin contents:', error);
      throw new Error('Failed to save recycle bin data');
    }
  }

  // Move an item to recycle bin
  public async moveToRecycleBin(
    item: Patient | Prescription | InventoryItem, 
    type: ItemType,
    deletedBy: string = 'system',
    reason?: string
  ): Promise<RecycleBinItem> {
    try {
      const recycleBinItem: RecycleBinItem = {
        id: `rb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalId: item.id,
        itemType: type,
        displayName: this.getDisplayName(item, type),
        deletionInfo: {
          deletedDate: new Date().toISOString(),
          deletedBy,
          reason
        },
        originalData: { ...item },
        canRestore: true,
        autoDeleteDate: this.calculateAutoDeleteDate()
      };

      const currentItems = this.getRecycleBinContents();
      currentItems.push(recycleBinItem);
      this.saveRecycleBinContents(currentItems);

      return recycleBinItem;
    } catch (error) {
      console.error('Error moving item to recycle bin:', error);
      throw new Error('Failed to move item to recycle bin');
    }
  }

  // Restore an item from recycle bin
  public async restoreItem(recycleBinId: string): Promise<any> {
    try {
      const currentItems = this.getRecycleBinContents();
      const itemIndex = currentItems.findIndex(item => item.id === recycleBinId);

      if (itemIndex === -1) {
        throw new Error('Item not found in recycle bin');
      }

      const itemToRestore = currentItems[itemIndex];
      
      if (!itemToRestore.canRestore) {
        throw new Error('This item cannot be restored');
      }

      // Remove from recycle bin
      currentItems.splice(itemIndex, 1);
      this.saveRecycleBinContents(currentItems);

      // Return the original data for restoration
      return itemToRestore.originalData;
    } catch (error) {
      console.error('Error restoring item:', error);
      throw new Error('Failed to restore item from recycle bin');
    }
  }

  // Permanently delete an item from recycle bin
  public async permanentlyDelete(recycleBinId: string): Promise<void> {
    try {
      const currentItems = this.getRecycleBinContents();
      const filteredItems = currentItems.filter(item => item.id !== recycleBinId);

      if (filteredItems.length === currentItems.length) {
        throw new Error('Item not found in recycle bin');
      }

      this.saveRecycleBinContents(filteredItems);
    } catch (error) {
      console.error('Error permanently deleting item:', error);
      throw new Error('Failed to permanently delete item');
    }
  }

  // Bulk restore multiple items
  public async bulkRestore(ids: string[]): Promise<any[]> {
    try {
      const restoredItems: any[] = [];
      const currentItems = this.getRecycleBinContents();
      const itemsToRestore = currentItems.filter(item => ids.includes(item.id));
      
      if (itemsToRestore.length === 0) {
        throw new Error('No items found for restoration');
      }

      // Check if all items can be restored
      const nonRestorableItems = itemsToRestore.filter(item => !item.canRestore);
      if (nonRestorableItems.length > 0) {
        throw new Error(`${nonRestorableItems.length} items cannot be restored`);
      }

      // Remove restored items from recycle bin
      const remainingItems = currentItems.filter(item => !ids.includes(item.id));
      this.saveRecycleBinContents(remainingItems);

      // Collect original data for restoration
      itemsToRestore.forEach(item => {
        restoredItems.push(item.originalData);
      });

      return restoredItems;
    } catch (error) {
      console.error('Error bulk restoring items:', error);
      throw new Error('Failed to restore selected items');
    }
  }

  // Empty the entire recycle bin
  public async emptyRecycleBin(): Promise<void> {
    try {
      this.saveRecycleBinContents([]);
    } catch (error) {
      console.error('Error emptying recycle bin:', error);
      throw new Error('Failed to empty recycle bin');
    }
  }

  // Get recycle bin statistics
  public getRecycleBinStats(): {
    totalItems: number;
    itemsByType: Record<ItemType, number>;
    oldestItem?: string;
    newestItem?: string;
  } {
    const items = this.getRecycleBinContents();
    const stats = {
      totalItems: items.length,
      itemsByType: {
        patient: 0,
        prescription: 0,
        inventory: 0
      } as Record<ItemType, number>,
      oldestItem: undefined as string | undefined,
      newestItem: undefined as string | undefined
    };

    if (items.length === 0) {
      return stats;
    }

    // Count items by type
    items.forEach(item => {
      stats.itemsByType[item.itemType]++;
    });

    // Find oldest and newest items
    const sortedByDate = items.sort((a, b) => 
      new Date(a.deletionInfo.deletedDate).getTime() - new Date(b.deletionInfo.deletedDate).getTime()
    );

    stats.oldestItem = sortedByDate[0]?.deletionInfo.deletedDate;
    stats.newestItem = sortedByDate[sortedByDate.length - 1]?.deletionInfo.deletedDate;

    return stats;
  }

  // Check if recycle bin is empty
  public isEmpty(): boolean {
    return this.getRecycleBinContents().length === 0;
  }

  // Get items that are due for auto-deletion
  public getItemsDueForAutoDeletion(): RecycleBinItem[] {
    const currentItems = this.getRecycleBinContents();
    const now = new Date();

    return currentItems.filter(item => {
      const autoDeleteDate = new Date(item.autoDeleteDate);
      return autoDeleteDate <= now;
    });
  }

  // Clean up items that are past their auto-delete date
  public async cleanupExpiredItems(): Promise<number> {
    try {
      const currentItems = this.getRecycleBinContents();
      const now = new Date();
      
      const validItems = currentItems.filter(item => {
        const autoDeleteDate = new Date(item.autoDeleteDate);
        return autoDeleteDate > now;
      });

      const deletedCount = currentItems.length - validItems.length;
      
      if (deletedCount > 0) {
        this.saveRecycleBinContents(validItems);
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired items:', error);
      return 0;
    }
  }

  // Helper method to generate display name for different item types
  private getDisplayName(item: any, type: ItemType): string {
    switch (type) {
      case 'patient':
        return item.personalInfo?.name || item.name || `Patient ${item.id}`;
      case 'prescription':
        return `Prescription ${item.id} - ${item.patientInfo?.patientName || item.patientName || 'Unknown Patient'}`;
      case 'inventory':
        return item.productInfo?.name || item.name || `Inventory Item ${item.id}`;
      default:
        return `${type} ${item.id}`;
    }
  }

  // Helper method to calculate auto-delete date (30 days from now)
  private calculateAutoDeleteDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  }

  // Search recycle bin items
  public searchRecycleBin(query: string): RecycleBinItem[] {
    const items = this.getRecycleBinContents();
    const lowercaseQuery = query.toLowerCase();

    return items.filter(item => 
      item.displayName.toLowerCase().includes(lowercaseQuery) ||
      item.itemType.toLowerCase().includes(lowercaseQuery) ||
      item.deletionInfo.deletedBy.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Sort recycle bin items
  public sortRecycleBin(
    sortBy: 'name' | 'type' | 'date' | 'deletedBy',
    order: 'asc' | 'desc' = 'desc'
  ): RecycleBinItem[] {
    const items = this.getRecycleBinContents();

    return items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.displayName.localeCompare(b.displayName);
          break;
        case 'type':
          comparison = a.itemType.localeCompare(b.itemType);
          break;
        case 'date':
          comparison = new Date(a.deletionInfo.deletedDate).getTime() - 
                      new Date(b.deletionInfo.deletedDate).getTime();
          break;
        case 'deletedBy':
          comparison = a.deletionInfo.deletedBy.localeCompare(b.deletionInfo.deletedBy);
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }
}