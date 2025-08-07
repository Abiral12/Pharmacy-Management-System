// Comprehensive Local Storage Management System

export interface StorageConfig {
  version: string;
  maxSize: number; // in MB
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  backupEnabled: boolean;
  maxBackups: number;
}

export interface StorageMetadata {
  key: string;
  size: number;
  lastModified: Date;
  version: string;
  checksum?: string;
  compressed?: boolean;
  encrypted?: boolean;
}

export interface BackupInfo {
  id: string;
  timestamp: Date;
  keys: string[];
  size: number;
  description?: string;
}

export class StorageManager {
  private static readonly CONFIG_KEY = 'pharmacy_storage_config';
  private static readonly METADATA_KEY = 'pharmacy_storage_metadata';
  private static readonly BACKUP_KEY = 'pharmacy_storage_backups';
  
  private static config: StorageConfig = {
    version: '1.0.0',
    maxSize: 50, // 50MB
    compressionEnabled: true,
    encryptionEnabled: false,
    backupEnabled: true,
    maxBackups: 5
  };

  private static metadata: Map<string, StorageMetadata> = new Map();
  private static backups: BackupInfo[] = [];

  // Initialize storage manager
  static initialize(): void {
    this.loadConfig();
    this.loadMetadata();
    this.loadBackups();
    this.performMaintenance();
  }

  // Set storage configuration
  static setConfig(newConfig: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  // Get storage configuration
  static getConfig(): StorageConfig {
    return { ...this.config };
  }

  // Store data with metadata
  static setItem<T>(key: string, data: T, options?: {
    compress?: boolean;
    encrypt?: boolean;
    backup?: boolean;
  }): boolean {
    try {
      let serializedData = JSON.stringify(data);
      let compressed = false;
      let encrypted = false;

      // Compression
      if ((options?.compress ?? this.config.compressionEnabled) && serializedData.length > 1000) {
        serializedData = this.compress(serializedData);
        compressed = true;
      }

      // Encryption (placeholder - would use actual encryption in production)
      if (options?.encrypt ?? this.config.encryptionEnabled) {
        serializedData = this.encrypt(serializedData);
        encrypted = true;
      }

      // Check storage quota
      const estimatedSize = this.estimateSize(serializedData);
      if (!this.checkQuota(estimatedSize)) {
        console.warn('Storage quota exceeded, attempting cleanup...');
        this.performCleanup();
        if (!this.checkQuota(estimatedSize)) {
          throw new Error('Insufficient storage space');
        }
      }

      // Store the data
      localStorage.setItem(key, serializedData);

      // Update metadata
      const metadata: StorageMetadata = {
        key,
        size: estimatedSize,
        lastModified: new Date(),
        version: this.config.version,
        checksum: this.generateChecksum(serializedData),
        compressed,
        encrypted
      };

      this.metadata.set(key, metadata);
      this.saveMetadata();

      // Create backup if enabled
      if (options?.backup ?? this.config.backupEnabled) {
        this.createBackup([key], `Auto backup for ${key}`);
      }

      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  }

  // Retrieve data with validation
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const rawData = localStorage.getItem(key);
      if (!rawData) {
        return defaultValue ?? null;
      }

      const metadata = this.metadata.get(key);
      let data = rawData;

      // Validate checksum if available
      if (metadata?.checksum) {
        const currentChecksum = this.generateChecksum(data);
        if (currentChecksum !== metadata.checksum) {
          console.warn(`Data integrity check failed for key: ${key}`);
          // Attempt to restore from backup
          const restored = this.restoreFromBackup(key);
          if (restored) {
            return this.getItem(key, defaultValue);
          }
        }
      }

      // Decrypt if needed
      if (metadata?.encrypted) {
        data = this.decrypt(data);
      }

      // Decompress if needed
      if (metadata?.compressed) {
        data = this.decompress(data);
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return defaultValue ?? null;
    }
  }

  // Remove item and update metadata
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      this.metadata.delete(key);
      this.saveMetadata();
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  }

  // Clear all managed storage
  static clear(): boolean {
    try {
      // Remove all managed keys
      for (const key of this.metadata.keys()) {
        localStorage.removeItem(key);
      }
      
      this.metadata.clear();
      this.saveMetadata();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Get storage statistics
  static getStorageStats(): {
    totalSize: number;
    usedSize: number;
    availableSize: number;
    itemCount: number;
    items: StorageMetadata[];
  } {
    const items = Array.from(this.metadata.values());
    const usedSize = items.reduce((total, item) => total + item.size, 0);
    const maxSizeBytes = this.config.maxSize * 1024 * 1024;

    return {
      totalSize: maxSizeBytes,
      usedSize,
      availableSize: maxSizeBytes - usedSize,
      itemCount: items.length,
      items: items.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
    };
  }

  // Create backup
  static createBackup(keys?: string[], description?: string): string | null {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const keysToBackup = keys || Array.from(this.metadata.keys());
      const backupData: Record<string, any> = {};
      let totalSize = 0;

      // Collect data for backup
      for (const key of keysToBackup) {
        const data = localStorage.getItem(key);
        if (data) {
          backupData[key] = data;
          totalSize += this.estimateSize(data);
        }
      }

      // Store backup
      const backupKey = `${this.BACKUP_KEY}_${backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      // Update backup info
      const backupInfo: BackupInfo = {
        id: backupId,
        timestamp: new Date(),
        keys: keysToBackup,
        size: totalSize,
        description
      };

      this.backups.unshift(backupInfo);

      // Maintain backup limit
      if (this.backups.length > this.config.maxBackups) {
        const oldBackups = this.backups.splice(this.config.maxBackups);
        oldBackups.forEach(backup => {
          localStorage.removeItem(`${this.BACKUP_KEY}_${backup.id}`);
        });
      }

      this.saveBackups();
      return backupId;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  }

  // Restore from backup
  static restoreFromBackup(backupId: string, keys?: string[]): boolean {
    try {
      const backupKey = `${this.BACKUP_KEY}_${backupId}`;
      const backupData = localStorage.getItem(backupKey);
      
      if (!backupData) {
        console.error('Backup not found:', backupId);
        return false;
      }

      const data = JSON.parse(backupData);
      const keysToRestore = keys || Object.keys(data);

      for (const key of keysToRestore) {
        if (data[key]) {
          localStorage.setItem(key, data[key]);
          // Update metadata would need to be recalculated
        }
      }

      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }

  // Get backup list
  static getBackups(): BackupInfo[] {
    return [...this.backups];
  }

  // Delete backup
  static deleteBackup(backupId: string): boolean {
    try {
      const backupKey = `${this.BACKUP_KEY}_${backupId}`;
      localStorage.removeItem(backupKey);
      
      this.backups = this.backups.filter(backup => backup.id !== backupId);
      this.saveBackups();
      
      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      return false;
    }
  }

  // Perform maintenance tasks
  static performMaintenance(): void {
    this.validateData();
    this.performCleanup();
    this.optimizeStorage();
  }

  // Validate stored data integrity
  private static validateData(): void {
    const corruptedKeys: string[] = [];

    for (const [key, metadata] of this.metadata.entries()) {
      try {
        const data = localStorage.getItem(key);
        if (!data) {
          corruptedKeys.push(key);
          continue;
        }

        if (metadata.checksum) {
          const currentChecksum = this.generateChecksum(data);
          if (currentChecksum !== metadata.checksum) {
            console.warn(`Data corruption detected for key: ${key}`);
            corruptedKeys.push(key);
          }
        }
      } catch (error) {
        console.error(`Error validating key ${key}:`, error);
        corruptedKeys.push(key);
      }
    }

    // Remove corrupted entries
    corruptedKeys.forEach(key => {
      this.metadata.delete(key);
      localStorage.removeItem(key);
    });

    if (corruptedKeys.length > 0) {
      this.saveMetadata();
      console.log(`Cleaned up ${corruptedKeys.length} corrupted entries`);
    }
  }

  // Cleanup old or unused data
  private static performCleanup(): void {
    const stats = this.getStorageStats();
    const maxSizeBytes = this.config.maxSize * 1024 * 1024;

    if (stats.usedSize > maxSizeBytes * 0.9) { // 90% threshold
      // Sort by last modified (oldest first)
      const sortedItems = stats.items.sort((a, b) => 
        a.lastModified.getTime() - b.lastModified.getTime()
      );

      let freedSpace = 0;
      const targetFreeSpace = maxSizeBytes * 0.2; // Free 20%

      for (const item of sortedItems) {
        if (freedSpace >= targetFreeSpace) break;
        
        // Don't remove critical system data
        if (item.key.includes('config') || item.key.includes('metadata')) {
          continue;
        }

        this.removeItem(item.key);
        freedSpace += item.size;
      }

      console.log(`Cleanup completed: freed ${freedSpace} bytes`);
    }
  }

  // Optimize storage by recompressing data
  private static optimizeStorage(): void {
    for (const [key, metadata] of this.metadata.entries()) {
      if (!metadata.compressed && metadata.size > 1000) {
        try {
          const data = this.getItem(key);
          if (data) {
            this.setItem(key, data, { compress: true });
          }
        } catch (error) {
          console.error(`Error optimizing key ${key}:`, error);
        }
      }
    }
  }

  // Check storage quota
  private static checkQuota(additionalSize: number): boolean {
    const stats = this.getStorageStats();
    return (stats.usedSize + additionalSize) <= stats.totalSize;
  }

  // Estimate data size in bytes
  private static estimateSize(data: string): number {
    return new Blob([data]).size;
  }

  // Generate simple checksum
  private static generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  // Simple compression (placeholder)
  private static compress(data: string): string {
    // In production, use a proper compression library like pako
    return btoa(data);
  }

  // Simple decompression (placeholder)
  private static decompress(data: string): string {
    // In production, use a proper compression library like pako
    return atob(data);
  }

  // Simple encryption (placeholder)
  private static encrypt(data: string): string {
    // In production, use proper encryption like Web Crypto API
    return btoa(data);
  }

  // Simple decryption (placeholder)
  private static decrypt(data: string): string {
    // In production, use proper decryption like Web Crypto API
    return atob(data);
  }

  // Load configuration
  private static loadConfig(): void {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading storage config:', error);
    }
  }

  // Save configuration
  private static saveConfig(): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving storage config:', error);
    }
  }

  // Load metadata
  private static loadMetadata(): void {
    try {
      const stored = localStorage.getItem(this.METADATA_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.metadata = new Map(
          Object.entries(data).map(([key, value]: [string, any]) => [
            key,
            { ...value, lastModified: new Date(value.lastModified) }
          ])
        );
      }
    } catch (error) {
      console.error('Error loading storage metadata:', error);
    }
  }

  // Save metadata
  private static saveMetadata(): void {
    try {
      const data = Object.fromEntries(this.metadata.entries());
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving storage metadata:', error);
    }
  }

  // Load backups
  private static loadBackups(): void {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      if (stored) {
        this.backups = JSON.parse(stored).map((backup: any) => ({
          ...backup,
          timestamp: new Date(backup.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  }

  // Save backups
  private static saveBackups(): void {
    try {
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(this.backups));
    } catch (error) {
      console.error('Error saving backups:', error);
    }
  }

  // Restore from specific backup key
  private static restoreFromBackup(key: string): boolean {
    // Find the most recent backup containing this key
    for (const backup of this.backups) {
      if (backup.keys.includes(key)) {
        return this.restoreFromBackup(backup.id, [key]);
      }
    }
    return false;
  }
}

// Initialize storage manager when module loads
if (typeof window !== 'undefined') {
  StorageManager.initialize();
}

// Data migration utilities
export class DataMigration {
  private static readonly MIGRATION_KEY = 'pharmacy_data_migrations';
  private static migrations: Array<{
    version: string;
    description: string;
    migrate: () => Promise<boolean>;
  }> = [];

  // Register migration
  static registerMigration(version: string, description: string, migrate: () => Promise<boolean>): void {
    this.migrations.push({ version, description, migrate });
    this.migrations.sort((a, b) => a.version.localeCompare(b.version));
  }

  // Run pending migrations
  static async runMigrations(): Promise<boolean> {
    try {
      const completedMigrations = this.getCompletedMigrations();
      const pendingMigrations = this.migrations.filter(m => 
        !completedMigrations.includes(m.version)
      );

      for (const migration of pendingMigrations) {
        console.log(`Running migration ${migration.version}: ${migration.description}`);
        const success = await migration.migrate();
        
        if (success) {
          this.markMigrationComplete(migration.version);
          console.log(`Migration ${migration.version} completed successfully`);
        } else {
          console.error(`Migration ${migration.version} failed`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error running migrations:', error);
      return false;
    }
  }

  // Get completed migrations
  private static getCompletedMigrations(): string[] {
    try {
      const stored = localStorage.getItem(this.MIGRATION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Mark migration as complete
  private static markMigrationComplete(version: string): void {
    try {
      const completed = this.getCompletedMigrations();
      if (!completed.includes(version)) {
        completed.push(version);
        localStorage.setItem(this.MIGRATION_KEY, JSON.stringify(completed));
      }
    } catch (error) {
      console.error('Error marking migration complete:', error);
    }
  }
}

// Data integrity checker
export class DataIntegrityChecker {
  // Check all data integrity
  static async checkIntegrity(): Promise<{
    isValid: boolean;
    errors: Array<{
      key: string;
      error: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
    recommendations: string[];
  }> {
    const errors: Array<{
      key: string;
      error: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }> = [];
    const recommendations: string[] = [];

    // Check storage metadata consistency
    const stats = StorageManager.getStorageStats();
    for (const item of stats.items) {
      try {
        const data = localStorage.getItem(item.key);
        if (!data) {
          errors.push({
            key: item.key,
            error: 'Data missing but metadata exists',
            severity: 'high'
          });
          continue;
        }

        // Check checksum if available
        if (item.checksum) {
          const currentChecksum = (StorageManager as any).generateChecksum(data);
          if (currentChecksum !== item.checksum) {
            errors.push({
              key: item.key,
              error: 'Data corruption detected (checksum mismatch)',
              severity: 'critical'
            });
          }
        }

        // Check data structure validity
        try {
          JSON.parse(data);
        } catch {
          errors.push({
            key: item.key,
            error: 'Invalid JSON data',
            severity: 'critical'
          });
        }
      } catch (error) {
        errors.push({
          key: item.key,
          error: `Validation error: ${error}`,
          severity: 'medium'
        });
      }
    }

    // Generate recommendations
    if (errors.length > 0) {
      recommendations.push('Run data repair to fix corrupted entries');
      
      const criticalErrors = errors.filter(e => e.severity === 'critical').length;
      if (criticalErrors > 0) {
        recommendations.push('Restore from backup immediately for critical errors');
      }
    }

    if (stats.usedSize > stats.totalSize * 0.8) {
      recommendations.push('Consider increasing storage limit or cleaning up old data');
    }

    return {
      isValid: errors.length === 0,
      errors,
      recommendations
    };
  }

  // Repair corrupted data
  static async repairData(): Promise<boolean> {
    try {
      const integrity = await this.checkIntegrity();
      let repairedCount = 0;

      for (const error of integrity.errors) {
        if (error.severity === 'critical') {
          // Try to restore from backup
          const backups = StorageManager.getBackups();
          for (const backup of backups) {
            if (backup.keys.includes(error.key)) {
              const success = StorageManager.restoreFromBackup(backup.id, [error.key]);
              if (success) {
                repairedCount++;
                break;
              }
            }
          }
        } else if (error.error === 'Data missing but metadata exists') {
          // Remove orphaned metadata
          StorageManager.removeItem(error.key);
          repairedCount++;
        }
      }

      console.log(`Data repair completed: ${repairedCount} items repaired`);
      return repairedCount > 0;
    } catch (error) {
      console.error('Error during data repair:', error);
      return false;
    }
  }
}

// Export utility functions for common pharmacy data operations
export const PharmacyStorage = {
  // Patient data
  savePatient: (patient: any) => StorageManager.setItem(`patient_${patient.id}`, patient, { backup: true }),
  getPatient: (id: string) => StorageManager.getItem(`patient_${id}`),
  removePatient: (id: string) => StorageManager.removeItem(`patient_${id}`),
  getAllPatients: (): any[] => {
    const stats = StorageManager.getStorageStats();
    return stats.items
      .filter(item => item.key.startsWith('patient_'))
      .map(item => StorageManager.getItem(item.key))
      .filter(Boolean);
  },

  // Prescription data
  savePrescription: (prescription: any) => StorageManager.setItem(`prescription_${prescription.id}`, prescription, { backup: true }),
  getPrescription: (id: string) => StorageManager.getItem(`prescription_${id}`),
  removePrescription: (id: string) => StorageManager.removeItem(`prescription_${id}`),
  getAllPrescriptions: (): any[] => {
    const stats = StorageManager.getStorageStats();
    return stats.items
      .filter(item => item.key.startsWith('prescription_'))
      .map(item => StorageManager.getItem(item.key))
      .filter(Boolean);
  },

  // Inventory data
  saveInventoryItem: (item: any) => StorageManager.setItem(`inventory_${item.id}`, item, { backup: true }),
  getInventoryItem: (id: string) => StorageManager.getItem(`inventory_${id}`),
  removeInventoryItem: (id: string) => StorageManager.removeItem(`inventory_${id}`),
  getAllInventoryItems: (): any[] => {
    const stats = StorageManager.getStorageStats();
    return stats.items
      .filter(item => item.key.startsWith('inventory_'))
      .map(item => StorageManager.getItem(item.key))
      .filter(Boolean);
  },

  // System settings
  saveSettings: (settings: any) => StorageManager.setItem('pharmacy_settings', settings, { backup: true }),
  getSettings: () => StorageManager.getItem('pharmacy_settings', {}),

  // User preferences
  saveUserPreferences: (preferences: any) => StorageManager.setItem('user_preferences', preferences),
  getUserPreferences: () => StorageManager.getItem('user_preferences', {}),

  // Bulk operations
  exportData: async (): Promise<string> => {
    const stats = StorageManager.getStorageStats();
    const exportData: Record<string, any> = {};
    
    for (const item of stats.items) {
      const data = StorageManager.getItem(item.key);
      if (data) {
        exportData[item.key] = data;
      }
    }

    return JSON.stringify({
      version: StorageManager.getConfig().version,
      timestamp: new Date().toISOString(),
      data: exportData
    }, null, 2);
  },

  importData: async (jsonData: string): Promise<boolean> => {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.data) {
        throw new Error('Invalid import format');
      }

      // Create backup before import
      StorageManager.createBackup(undefined, 'Pre-import backup');

      // Import data
      for (const [key, value] of Object.entries(importData.data)) {
        StorageManager.setItem(key, value);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Maintenance operations
  performMaintenance: () => StorageManager.performMaintenance(),
  getStorageStats: () => StorageManager.getStorageStats(),
  createBackup: (description?: string) => StorageManager.createBackup(undefined, description),
  getBackups: () => StorageManager.getBackups(),
  restoreBackup: (backupId: string) => StorageManager.restoreFromBackup(backupId),
  deleteBackup: (backupId: string) => StorageManager.deleteBackup(backupId),

  // Data integrity
  checkIntegrity: () => DataIntegrityChecker.checkIntegrity(),
  repairData: () => DataIntegrityChecker.repairData(),

  // Migration support
  runMigrations: () => DataMigration.runMigrations(),
  registerMigration: (version: string, description: string, migrate: () => Promise<boolean>) => 
    DataMigration.registerMigration(version, description, migrate)
};

// Register default migrations
DataMigration.registerMigration('1.0.1', 'Add patient metadata fields', async () => {
  try {
    const patients = PharmacyStorage.getAllPatients();
    for (const patient of patients) {
      if (!patient.metadata) {
        patient.metadata = {
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          createdBy: 'System Migration',
          visitCount: 0,
          isActive: true
        };
        PharmacyStorage.savePatient(patient);
      }
    }
    return true;
  } catch {
    return false;
  }
});

DataMigration.registerMigration('1.0.2', 'Add prescription validation fields', async () => {
  try {
    const prescriptions = PharmacyStorage.getAllPrescriptions();
    for (const prescription of prescriptions) {
      if (!prescription.validation) {
        prescription.validation = {
          isValidated: false,
          drugInteractions: []
        };
        PharmacyStorage.savePrescription(prescription);
      }
    }
    return true;
  } catch {
    return false;
  }
});

DataMigration.registerMigration('1.0.3', 'Add inventory status fields', async () => {
  try {
    const items = PharmacyStorage.getAllInventoryItems();
    for (const item of items) {
      if (!item.status) {
        // Determine status based on stock and expiry
        const currentStock = item.stockInfo?.currentStock || 0;
        const minimumStock = item.stockInfo?.minimumStock || 0;
        const daysUntilExpiry = item.expiryInfo?.daysUntilExpiry || 999;
        
        if (currentStock === 0) {
          item.status = 'out_of_stock';
        } else if (currentStock <= minimumStock) {
          item.status = 'low_stock';
        } else if (daysUntilExpiry < 0) {
          item.status = 'expired';
        } else if (daysUntilExpiry <= 30) {
          item.status = 'near_expiry';
        } else {
          item.status = 'in_stock';
        }
        
        PharmacyStorage.saveInventoryItem(item);
      }
    }
    return true;
  } catch {
    return false;
  }
});