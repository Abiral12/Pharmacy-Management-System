// Comprehensive Notification Management System

import { PharmacyNotification } from '../components/notifications/NotificationCenter';

export interface NotificationTemplate {
  type: PharmacyNotification['type'];
  category: PharmacyNotification['category'];
  priority: PharmacyNotification['priority'];
  titleTemplate: string;
  messageTemplate: string;
  actions?: Array<{
    label: string;
    actionType: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

export class NotificationManager {
  private static STORAGE_KEY = 'pharmacy_notifications';
  private static SETTINGS_KEY = 'pharmacy_notification_settings';
  private static notifications: PharmacyNotification[] = [];
  private static listeners: Array<(notifications: PharmacyNotification[]) => void> = [];

  // Notification templates for different pharmacy events
  private static templates: Record<string, NotificationTemplate> = {
    // Inventory notifications
    LOW_STOCK: {
      type: 'warning',
      category: 'inventory',
      priority: 'medium',
      titleTemplate: 'Low Stock Alert',
      messageTemplate: '{itemName} is running low with only {quantity} {unit} remaining',
      actions: [
        { label: 'Reorder', actionType: 'reorder', variant: 'primary' },
        { label: 'View Details', actionType: 'view_item', variant: 'secondary' }
      ]
    },
    OUT_OF_STOCK: {
      type: 'error',
      category: 'inventory',
      priority: 'high',
      titleTemplate: 'Out of Stock',
      messageTemplate: '{itemName} is completely out of stock',
      actions: [
        { label: 'Urgent Reorder', actionType: 'urgent_reorder', variant: 'danger' },
        { label: 'Find Alternative', actionType: 'find_alternative', variant: 'secondary' }
      ]
    },
    EXPIRY_WARNING: {
      type: 'warning',
      category: 'inventory',
      priority: 'medium',
      titleTemplate: 'Expiry Warning',
      messageTemplate: '{itemName} expires in {days} days',
      actions: [
        { label: 'Mark for Disposal', actionType: 'mark_disposal', variant: 'secondary' },
        { label: 'Promote Sale', actionType: 'promote_sale', variant: 'primary' }
      ]
    },
    EXPIRED_ITEM: {
      type: 'error',
      category: 'inventory',
      priority: 'critical',
      titleTemplate: 'Expired Item',
      messageTemplate: '{itemName} has expired and must be removed immediately',
      actions: [
        { label: 'Remove Now', actionType: 'remove_expired', variant: 'danger' }
      ]
    },

    // Prescription notifications
    PRESCRIPTION_READY: {
      type: 'success',
      category: 'prescription',
      priority: 'medium',
      titleTemplate: 'Prescription Ready',
      messageTemplate: 'Prescription for {patientName} is ready for pickup',
      actions: [
        { label: 'Notify Patient', actionType: 'notify_patient', variant: 'primary' },
        { label: 'View Prescription', actionType: 'view_prescription', variant: 'secondary' }
      ]
    },
    PRESCRIPTION_OVERDUE: {
      type: 'warning',
      category: 'prescription',
      priority: 'medium',
      titleTemplate: 'Prescription Overdue',
      messageTemplate: 'Prescription for {patientName} has not been picked up for {days} days',
      actions: [
        { label: 'Contact Patient', actionType: 'contact_patient', variant: 'primary' },
        { label: 'Return to Stock', actionType: 'return_stock', variant: 'secondary' }
      ]
    },
    DRUG_INTERACTION: {
      type: 'error',
      category: 'prescription',
      priority: 'critical',
      titleTemplate: 'Drug Interaction Alert',
      messageTemplate: 'Potential interaction detected between {drug1} and {drug2}',
      actions: [
        { label: 'Review Interaction', actionType: 'review_interaction', variant: 'danger' },
        { label: 'Contact Doctor', actionType: 'contact_doctor', variant: 'primary' }
      ]
    },

    // Patient notifications
    PATIENT_REGISTERED: {
      type: 'success',
      category: 'patient',
      priority: 'low',
      titleTemplate: 'New Patient Registered',
      messageTemplate: '{patientName} has been successfully registered',
      actions: [
        { label: 'View Profile', actionType: 'view_patient', variant: 'primary' }
      ]
    },
    PATIENT_ALLERGY_ALERT: {
      type: 'warning',
      category: 'patient',
      priority: 'high',
      titleTemplate: 'Allergy Alert',
      messageTemplate: '{patientName} is allergic to {allergen}',
      actions: [
        { label: 'Review Allergies', actionType: 'review_allergies', variant: 'primary' }
      ]
    },

    // System notifications
    SYSTEM_UPDATE: {
      type: 'info',
      category: 'system',
      priority: 'low',
      titleTemplate: 'System Update Available',
      messageTemplate: 'PharmOS Pro {version} is available for download',
      actions: [
        { label: 'Update Now', actionType: 'system_update', variant: 'primary' },
        { label: 'Later', actionType: 'dismiss', variant: 'secondary' }
      ]
    },
    BACKUP_COMPLETE: {
      type: 'success',
      category: 'system',
      priority: 'low',
      titleTemplate: 'Backup Complete',
      messageTemplate: 'Daily backup completed successfully at {time}',
      actions: []
    },
    SYSTEM_ERROR: {
      type: 'error',
      category: 'system',
      priority: 'high',
      titleTemplate: 'System Error',
      messageTemplate: 'An error occurred: {errorMessage}',
      actions: [
        { label: 'View Details', actionType: 'view_error', variant: 'primary' },
        { label: 'Report Issue', actionType: 'report_issue', variant: 'secondary' }
      ]
    }
  };

  // Initialize notification manager
  static initialize(): void {
    this.loadNotifications();
  }

  // Create a new notification
  static createNotification(
    templateKey: string,
    data: Record<string, any>,
    customOptions?: Partial<PharmacyNotification>
  ): PharmacyNotification {
    const template = this.templates[templateKey];
    if (!template) {
      throw new Error(`Notification template '${templateKey}' not found`);
    }

    const notification: PharmacyNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${performance.now()}`,
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: this.interpolateTemplate(template.titleTemplate, data),
      message: this.interpolateTemplate(template.messageTemplate, data),
      timestamp: new Date(),
      isRead: false,
      isArchived: false,
      actions: template.actions?.map(action => ({
        label: action.label,
        action: () => this.handleNotificationAction(templateKey, action.actionType, data),
        variant: action.variant
      })),
      metadata: data,
      ...customOptions
    };

    return notification;
  }

  // Add notification to the system
  static addNotification(
    templateKey: string,
    data: Record<string, any>,
    customOptions?: Partial<PharmacyNotification>
  ): void {
    const notification = this.createNotification(templateKey, data, customOptions);
    this.notifications.unshift(notification);
    this.saveNotifications();
    this.notifyListeners();

    // Auto-archive old notifications (keep last 100)
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
      this.saveNotifications();
    }
  }

  // Get all notifications
  static getNotifications(): PharmacyNotification[] {
    return [...this.notifications];
  }

  // Get unread notifications
  static getUnreadNotifications(): PharmacyNotification[] {
    return this.notifications.filter(n => !n.isRead && !n.isArchived);
  }

  // Get critical notifications
  static getCriticalNotifications(): PharmacyNotification[] {
    return this.notifications.filter(n => n.priority === 'critical' && !n.isRead);
  }

  // Mark notification as read
  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  static markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Archive notification
  static archiveNotification(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isArchived = true;
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Delete notification
  static deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Clear all notifications
  static clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Subscribe to notification changes
  static subscribe(listener: (notifications: PharmacyNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Handle notification actions
  private static handleNotificationAction(
    templateKey: string,
    actionType: string,
    data: Record<string, any>
  ): void {
    // This would integrate with the actual pharmacy system
    console.log(`Handling action: ${actionType} for template: ${templateKey}`, data);
    
    switch (actionType) {
      case 'reorder':
        // Integrate with inventory reorder system
        break;
      case 'notify_patient':
        // Integrate with patient notification system
        break;
      case 'contact_doctor':
        // Integrate with doctor contact system
        break;
      case 'system_update':
        // Integrate with system update mechanism
        break;
      // Add more action handlers as needed
    }
  }

  // Interpolate template strings with data
  private static interpolateTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  // Load notifications from storage
  private static loadNotifications(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.notifications = [];
    }
  }

  // Save notifications to storage
  private static saveNotifications(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Notify all listeners
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // Utility methods for common notification scenarios
  static notifyLowStock(itemName: string, quantity: number, unit: string): void {
    this.addNotification('LOW_STOCK', { itemName, quantity, unit });
  }

  static notifyOutOfStock(itemName: string): void {
    this.addNotification('OUT_OF_STOCK', { itemName });
  }

  static notifyExpiryWarning(itemName: string, days: number): void {
    this.addNotification('EXPIRY_WARNING', { itemName, days });
  }

  static notifyExpiredItem(itemName: string): void {
    this.addNotification('EXPIRED_ITEM', { itemName });
  }

  static notifyPrescriptionReady(patientName: string): void {
    this.addNotification('PRESCRIPTION_READY', { patientName });
  }

  static notifyDrugInteraction(drug1: string, drug2: string): void {
    this.addNotification('DRUG_INTERACTION', { drug1, drug2 });
  }

  static notifyPatientRegistered(patientName: string): void {
    this.addNotification('PATIENT_REGISTERED', { patientName });
  }

  static notifyAllergyAlert(patientName: string, allergen: string): void {
    this.addNotification('PATIENT_ALLERGY_ALERT', { patientName, allergen });
  }

  static notifySystemUpdate(version: string): void {
    this.addNotification('SYSTEM_UPDATE', { version });
  }

  static notifyBackupComplete(time: string): void {
    this.addNotification('BACKUP_COMPLETE', { time });
  }

  static notifySystemError(errorMessage: string): void {
    this.addNotification('SYSTEM_ERROR', { errorMessage });
  }
}

// Initialize the notification manager
if (typeof window !== 'undefined') {
  NotificationManager.initialize();
}