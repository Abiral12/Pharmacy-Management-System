// Unit Tests for Notification Manager

import { NotificationManager } from '../../utils/notificationManager';
import { PharmacyNotification } from '../../components/notifications/NotificationCenter';

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

describe('NotificationManager', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset the notification manager state
    NotificationManager.clearAllNotifications();
  });

  describe('createNotification', () => {
    it('should create a low stock notification', () => {
      const notification = NotificationManager.createNotification('LOW_STOCK', {
        itemName: 'Aspirin',
        quantity: 5,
        unit: 'tablets'
      });

      expect(notification).toBeDefined();
      expect(notification.type).toBe('warning');
      expect(notification.category).toBe('inventory');
      expect(notification.priority).toBe('medium');
      expect(notification.title).toBe('Low Stock Alert');
      expect(notification.message).toBe('Aspirin is running low with only 5 tablets remaining');
      expect(notification.isRead).toBe(false);
      expect(notification.isArchived).toBe(false);
      expect(notification.actions).toHaveLength(2);
    });

    it('should create an out of stock notification', () => {
      const notification = NotificationManager.createNotification('OUT_OF_STOCK', {
        itemName: 'Ibuprofen'
      });

      expect(notification.type).toBe('error');
      expect(notification.category).toBe('inventory');
      expect(notification.priority).toBe('high');
      expect(notification.title).toBe('Out of Stock');
      expect(notification.message).toBe('Ibuprofen is completely out of stock');
      expect(notification.actions).toHaveLength(2);
    });

    it('should create an expiry warning notification', () => {
      const notification = NotificationManager.createNotification('EXPIRY_WARNING', {
        itemName: 'Paracetamol',
        days: 15
      });

      expect(notification.type).toBe('warning');
      expect(notification.category).toBe('inventory');
      expect(notification.priority).toBe('medium');
      expect(notification.title).toBe('Expiry Warning');
      expect(notification.message).toBe('Paracetamol expires in 15 days');
    });

    it('should create an expired item notification', () => {
      const notification = NotificationManager.createNotification('EXPIRED_ITEM', {
        itemName: 'Amoxicillin'
      });

      expect(notification.type).toBe('error');
      expect(notification.category).toBe('inventory');
      expect(notification.priority).toBe('critical');
      expect(notification.title).toBe('Expired Item');
      expect(notification.message).toBe('Amoxicillin has expired and must be removed immediately');
    });

    it('should create a prescription ready notification', () => {
      const notification = NotificationManager.createNotification('PRESCRIPTION_READY', {
        patientName: 'John Doe'
      });

      expect(notification.type).toBe('success');
      expect(notification.category).toBe('prescription');
      expect(notification.priority).toBe('medium');
      expect(notification.title).toBe('Prescription Ready');
      expect(notification.message).toBe('Prescription for John Doe is ready for pickup');
    });

    it('should create a drug interaction alert', () => {
      const notification = NotificationManager.createNotification('DRUG_INTERACTION', {
        drug1: 'Warfarin',
        drug2: 'Aspirin'
      });

      expect(notification.type).toBe('error');
      expect(notification.category).toBe('prescription');
      expect(notification.priority).toBe('critical');
      expect(notification.title).toBe('Drug Interaction Alert');
      expect(notification.message).toBe('Potential interaction detected between Warfarin and Aspirin');
    });

    it('should create a patient registered notification', () => {
      const notification = NotificationManager.createNotification('PATIENT_REGISTERED', {
        patientName: 'Jane Smith'
      });

      expect(notification.type).toBe('success');
      expect(notification.category).toBe('patient');
      expect(notification.priority).toBe('low');
      expect(notification.title).toBe('New Patient Registered');
      expect(notification.message).toBe('Jane Smith has been successfully registered');
    });

    it('should throw error for unknown template', () => {
      expect(() => {
        NotificationManager.createNotification('UNKNOWN_TEMPLATE', {});
      }).toThrow('Notification template \'UNKNOWN_TEMPLATE\' not found');
    });

    it('should apply custom options', () => {
      const notification = NotificationManager.createNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 10,
        unit: 'tablets'
      }, {
        priority: 'critical',
        isRead: true
      });

      expect(notification.priority).toBe('critical');
      expect(notification.isRead).toBe(true);
    });
  });

  describe('addNotification', () => {
    it('should add notification to the system', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      const notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Test Medicine is running low with only 5 tablets remaining');
    });

    it('should maintain notification order (newest first)', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      });

      NotificationManager.addNotification('OUT_OF_STOCK', {
        itemName: 'Medicine B'
      });

      const notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(2);
      expect(notifications[0].message).toBe('Medicine B is completely out of stock');
      expect(notifications[1].message).toBe('Medicine A is running low with only 5 tablets remaining');
    });

    it('should limit notifications to 100', () => {
      // Add 105 notifications
      for (let i = 0; i < 105; i++) {
        NotificationManager.addNotification('LOW_STOCK', {
          itemName: `Medicine ${i}`,
          quantity: 5,
          unit: 'tablets'
        });
      }

      const notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(100);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return only unread notifications', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      });

      NotificationManager.addNotification('OUT_OF_STOCK', {
        itemName: 'Medicine B'
      }, { isRead: true });

      const unreadNotifications = NotificationManager.getUnreadNotifications();
      expect(unreadNotifications).toHaveLength(1);
      expect(unreadNotifications[0].message).toBe('Medicine A is running low with only 5 tablets remaining');
    });

    it('should exclude archived notifications', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      }, { isArchived: true });

      const unreadNotifications = NotificationManager.getUnreadNotifications();
      expect(unreadNotifications).toHaveLength(0);
    });
  });

  describe('getCriticalNotifications', () => {
    it('should return only critical unread notifications', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      }); // medium priority

      NotificationManager.addNotification('EXPIRED_ITEM', {
        itemName: 'Medicine B'
      }); // critical priority

      NotificationManager.addNotification('DRUG_INTERACTION', {
        drug1: 'Drug A',
        drug2: 'Drug B'
      }, { isRead: true }); // critical but read

      const criticalNotifications = NotificationManager.getCriticalNotifications();
      expect(criticalNotifications).toHaveLength(1);
      expect(criticalNotifications[0].message).toBe('Medicine B has expired and must be removed immediately');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      const notifications = NotificationManager.getNotifications();
      const notificationId = notifications[0].id;

      expect(notifications[0].isRead).toBe(false);

      NotificationManager.markAsRead(notificationId);

      const updatedNotifications = NotificationManager.getNotifications();
      expect(updatedNotifications[0].isRead).toBe(true);
    });

    it('should handle non-existent notification ID', () => {
      expect(() => {
        NotificationManager.markAsRead('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      });

      NotificationManager.addNotification('OUT_OF_STOCK', {
        itemName: 'Medicine B'
      });

      let notifications = NotificationManager.getNotifications();
      expect(notifications.every(n => !n.isRead)).toBe(true);

      NotificationManager.markAllAsRead();

      notifications = NotificationManager.getNotifications();
      expect(notifications.every(n => n.isRead)).toBe(true);
    });
  });

  describe('archiveNotification', () => {
    it('should archive notification and mark as read', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      const notifications = NotificationManager.getNotifications();
      const notificationId = notifications[0].id;

      NotificationManager.archiveNotification(notificationId);

      const updatedNotifications = NotificationManager.getNotifications();
      expect(updatedNotifications[0].isArchived).toBe(true);
      expect(updatedNotifications[0].isRead).toBe(true);
    });
  });

  describe('deleteNotification', () => {
    it('should remove notification from system', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      let notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(1);

      const notificationId = notifications[0].id;
      NotificationManager.deleteNotification(notificationId);

      notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(0);
    });
  });

  describe('clearAllNotifications', () => {
    it('should remove all notifications', () => {
      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Medicine A',
        quantity: 5,
        unit: 'tablets'
      });

      NotificationManager.addNotification('OUT_OF_STOCK', {
        itemName: 'Medicine B'
      });

      let notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(2);

      NotificationManager.clearAllNotifications();

      notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(0);
    });
  });

  describe('utility methods', () => {
    it('should provide convenience methods for common notifications', () => {
      NotificationManager.notifyLowStock('Aspirin', 10, 'tablets');
      NotificationManager.notifyOutOfStock('Ibuprofen');
      NotificationManager.notifyExpiryWarning('Paracetamol', 7);
      NotificationManager.notifyExpiredItem('Amoxicillin');
      NotificationManager.notifyPrescriptionReady('John Doe');
      NotificationManager.notifyDrugInteraction('Warfarin', 'Aspirin');
      NotificationManager.notifyPatientRegistered('Jane Smith');
      NotificationManager.notifyAllergyAlert('Bob Johnson', 'Penicillin');
      NotificationManager.notifySystemUpdate('2.0.0');
      NotificationManager.notifyBackupComplete('10:30 AM');
      NotificationManager.notifySystemError('Database connection failed');

      const notifications = NotificationManager.getNotifications();
      expect(notifications).toHaveLength(11);

      // Check specific notification types
      const lowStockNotification = notifications.find(n => n.title === 'Low Stock Alert');
      expect(lowStockNotification).toBeDefined();
      expect(lowStockNotification!.message).toBe('Aspirin is running low with only 10 tablets remaining');

      const drugInteractionNotification = notifications.find(n => n.title === 'Drug Interaction Alert');
      expect(drugInteractionNotification).toBeDefined();
      expect(drugInteractionNotification!.priority).toBe('critical');

      const systemUpdateNotification = notifications.find(n => n.title === 'System Update Available');
      expect(systemUpdateNotification).toBeDefined();
      expect(systemUpdateNotification!.category).toBe('system');
    });
  });

  describe('subscription system', () => {
    it('should notify subscribers of changes', () => {
      const mockListener = jest.fn();
      const unsubscribe = NotificationManager.subscribe(mockListener);

      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          message: 'Test Medicine is running low with only 5 tablets remaining'
        })
      ]));

      unsubscribe();

      NotificationManager.addNotification('OUT_OF_STOCK', {
        itemName: 'Another Medicine'
      });

      // Should not be called again after unsubscribe
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscribers', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();

      NotificationManager.subscribe(mockListener1);
      NotificationManager.subscribe(mockListener2);

      NotificationManager.addNotification('LOW_STOCK', {
        itemName: 'Test Medicine',
        quantity: 5,
        unit: 'tablets'
      });

      expect(mockListener1).toHaveBeenCalledTimes(1);
      expect(mockListener2).toHaveBeenCalledTimes(1);
    });
  });
});