"use client";

import { useState, useEffect, useCallback } from 'react';
import { NotificationManager } from '../utils/notificationManager';
import { PharmacyNotification } from '../components/notifications/NotificationCenter';

export interface NotificationSettings {
  enableToasts: boolean;
  enableSounds: boolean;
  autoHideDuration: number;
  maxToasts: number;
  toastPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  categories: {
    system: boolean;
    prescription: boolean;
    inventory: boolean;
    patient: boolean;
    billing: boolean;
    alert: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

const defaultSettings: NotificationSettings = {
  enableToasts: true,
  enableSounds: true,
  autoHideDuration: 5000,
  maxToasts: 5,
  toastPosition: 'top-right',
  categories: {
    system: true,
    prescription: true,
    inventory: true,
    patient: true,
    billing: true,
    alert: true
  },
  priorities: {
    low: true,
    medium: true,
    high: true,
    critical: true
  }
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<PharmacyNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pharmacy_notification_settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Load initial notifications
    setNotifications(NotificationManager.getNotifications());

    return unsubscribe;
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('pharmacy_notification_settings', JSON.stringify(updatedSettings));
  }, [settings]);

  // Notification actions
  const markAsRead = useCallback((notificationId: string) => {
    NotificationManager.markAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    NotificationManager.markAllAsRead();
  }, []);

  const archiveNotification = useCallback((notificationId: string) => {
    NotificationManager.archiveNotification(notificationId);
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    NotificationManager.deleteNotification(notificationId);
  }, []);

  const clearAllNotifications = useCallback(() => {
    NotificationManager.clearAllNotifications();
  }, []);

  const handleNotificationAction = useCallback((notificationId: string, actionIndex: number) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && notification.actions && notification.actions[actionIndex]) {
      notification.actions[actionIndex].action();
      // Mark as read after action
      markAsRead(notificationId);
    }
  }, [notifications, markAsRead]);

  // Quick notification creators
  const notifyLowStock = useCallback((itemName: string, quantity: number, unit: string) => {
    NotificationManager.notifyLowStock(itemName, quantity, unit);
  }, []);

  const notifyOutOfStock = useCallback((itemName: string) => {
    NotificationManager.notifyOutOfStock(itemName);
  }, []);

  const notifyExpiryWarning = useCallback((itemName: string, days: number) => {
    NotificationManager.notifyExpiryWarning(itemName, days);
  }, []);

  const notifyExpiredItem = useCallback((itemName: string) => {
    NotificationManager.notifyExpiredItem(itemName);
  }, []);

  const notifyPrescriptionReady = useCallback((patientName: string) => {
    NotificationManager.notifyPrescriptionReady(patientName);
  }, []);

  const notifyDrugInteraction = useCallback((drug1: string, drug2: string) => {
    NotificationManager.notifyDrugInteraction(drug1, drug2);
  }, []);

  const notifyPatientRegistered = useCallback((patientName: string) => {
    NotificationManager.notifyPatientRegistered(patientName);
  }, []);

  const notifyAllergyAlert = useCallback((patientName: string, allergen: string) => {
    NotificationManager.notifyAllergyAlert(patientName, allergen);
  }, []);

  const notifySystemUpdate = useCallback((version: string) => {
    NotificationManager.notifySystemUpdate(version);
  }, []);

  const notifyBackupComplete = useCallback((time: string) => {
    NotificationManager.notifyBackupComplete(time);
  }, []);

  const notifySystemError = useCallback((errorMessage: string) => {
    NotificationManager.notifySystemError(errorMessage);
  }, []);

  // Custom notification creator
  const addCustomNotification = useCallback((
    templateKey: string,
    data: Record<string, any>,
    customOptions?: Partial<PharmacyNotification>
  ) => {
    NotificationManager.addNotification(templateKey, data, customOptions);
  }, []);

  // Filtered notifications based on settings
  const filteredNotifications = notifications.filter(notification => {
    // Filter by category
    if (!settings.categories[notification.category as keyof typeof settings.categories]) {
      return false;
    }
    
    // Filter by priority
    if (!settings.priorities[notification.priority as keyof typeof settings.priorities]) {
      return false;
    }
    
    return true;
  });

  // Statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead && !n.isArchived).length,
    critical: notifications.filter(n => n.priority === 'critical' && !n.isRead).length,
    archived: notifications.filter(n => n.isArchived).length,
    byCategory: {
      system: notifications.filter(n => n.category === 'system').length,
      prescription: notifications.filter(n => n.category === 'prescription').length,
      inventory: notifications.filter(n => n.category === 'inventory').length,
      patient: notifications.filter(n => n.category === 'patient').length,
      billing: notifications.filter(n => n.category === 'billing').length,
      alert: notifications.filter(n => n.category === 'alert').length,
    },
    byPriority: {
      low: notifications.filter(n => n.priority === 'low').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      high: notifications.filter(n => n.priority === 'high').length,
      critical: notifications.filter(n => n.priority === 'critical').length,
    }
  };

  return {
    // Data
    notifications: filteredNotifications,
    allNotifications: notifications,
    settings,
    stats,
    isLoading,

    // Actions
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAllNotifications,
    handleNotificationAction,
    updateSettings,

    // Quick creators
    notifyLowStock,
    notifyOutOfStock,
    notifyExpiryWarning,
    notifyExpiredItem,
    notifyPrescriptionReady,
    notifyDrugInteraction,
    notifyPatientRegistered,
    notifyAllergyAlert,
    notifySystemUpdate,
    notifyBackupComplete,
    notifySystemError,
    addCustomNotification,

    // Utilities
    getUnreadNotifications: () => NotificationManager.getUnreadNotifications(),
    getCriticalNotifications: () => NotificationManager.getCriticalNotifications(),
  };
};

// Sound notification hook
export const useNotificationSounds = (enabled: boolean = true) => {
  const playNotificationSound = useCallback((type: PharmacyNotification['type'], priority: PharmacyNotification['priority']) => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      // Create audio context for better browser support
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (frequency: number, duration: number, volume: number = 0.1) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      // Different sounds for different types and priorities
      switch (priority) {
        case 'critical':
          // Urgent alarm sound
          playTone(800, 0.2, 0.15);
          setTimeout(() => playTone(600, 0.2, 0.15), 200);
          setTimeout(() => playTone(800, 0.2, 0.15), 400);
          break;
        case 'high':
          // Alert sound
          playTone(600, 0.3, 0.12);
          setTimeout(() => playTone(800, 0.2, 0.12), 300);
          break;
        case 'medium':
          // Notification sound
          playTone(500, 0.2, 0.08);
          break;
        case 'low':
          // Gentle notification
          playTone(400, 0.15, 0.05);
          break;
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, [enabled]);

  return { playNotificationSound };
};