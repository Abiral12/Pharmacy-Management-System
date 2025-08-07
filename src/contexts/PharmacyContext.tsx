"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { InventoryItem } from '../types/inventory';
import { PharmacyNotification } from '../components/notifications/NotificationCenter';
import { StorageManager } from '../utils/storageManager';
import { NotificationManager } from '../utils/notificationManager';
import { InventoryManager } from '../utils/inventoryManager';

// Define the application state structure
export interface PharmacyState {
  // User and session
  user: {
    id: string;
    name: string;
    role: 'admin' | 'pharmacist' | 'technician';
    permissions: string[];
    isAuthenticated: boolean;
  } | null;

  // Inventory state
  inventory: {
    items: InventoryItem[];
    stats: any;
    alerts: any[];
    isLoading: boolean;
    lastUpdated: Date | null;
  };

  // Patients state
  patients: {
    list: any[];
    currentPatient: any | null;
    searchResults: any[];
    isLoading: boolean;
    lastUpdated: Date | null;
  };

  // Prescriptions state
  prescriptions: {
    list: any[];
    currentPrescription: any | null;
    pendingPrescriptions: any[];
    readyPrescriptions: any[];
    isLoading: boolean;
    lastUpdated: Date | null;
  };

  // Notifications state
  notifications: {
    list: PharmacyNotification[];
    unreadCount: number;
    criticalCount: number;
    isLoading: boolean;
  };

  // UI state
  ui: {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
    activeWindow: string | null;
    windows: any[];
    isNotificationCenterOpen: boolean;
    isSpotlightOpen: boolean;
    currentView: string;
  };

  // System state
  system: {
    isOnline: boolean;
    lastSync: Date | null;
    version: string;
    settings: Record<string, any>;
    isLoading: boolean;
  };
}

// Define action types
export type PharmacyAction =
  // User actions
  | { type: 'SET_USER'; payload: PharmacyState['user'] }
  | { type: 'LOGOUT' }
  
  // Inventory actions
  | { type: 'SET_INVENTORY_LOADING'; payload: boolean }
  | { type: 'SET_INVENTORY_ITEMS'; payload: InventoryItem[] }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: { id: string; item: Partial<InventoryItem> } }
  | { type: 'REMOVE_INVENTORY_ITEM'; payload: string }
  | { type: 'SET_INVENTORY_STATS'; payload: any }
  | { type: 'SET_INVENTORY_ALERTS'; payload: any[] }
  
  // Patient actions
  | { type: 'SET_PATIENTS_LOADING'; payload: boolean }
  | { type: 'SET_PATIENTS'; payload: any[] }
  | { type: 'ADD_PATIENT'; payload: any }
  | { type: 'UPDATE_PATIENT'; payload: { id: string; patient: Partial<any> } }
  | { type: 'REMOVE_PATIENT'; payload: string }
  | { type: 'SET_CURRENT_PATIENT'; payload: any | null }
  | { type: 'SET_PATIENT_SEARCH_RESULTS'; payload: any[] }
  
  // Prescription actions
  | { type: 'SET_PRESCRIPTIONS_LOADING'; payload: boolean }
  | { type: 'SET_PRESCRIPTIONS'; payload: any[] }
  | { type: 'ADD_PRESCRIPTION'; payload: any }
  | { type: 'UPDATE_PRESCRIPTION'; payload: { id: string; prescription: Partial<any> } }
  | { type: 'REMOVE_PRESCRIPTION'; payload: string }
  | { type: 'SET_CURRENT_PRESCRIPTION'; payload: any | null }
  | { type: 'SET_PENDING_PRESCRIPTIONS'; payload: any[] }
  | { type: 'SET_READY_PRESCRIPTIONS'; payload: any[] }
  
  // Notification actions
  | { type: 'SET_NOTIFICATIONS'; payload: PharmacyNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: PharmacyNotification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<PharmacyNotification> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  
  // UI actions
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_WINDOW'; payload: string | null }
  | { type: 'ADD_WINDOW'; payload: any }
  | { type: 'REMOVE_WINDOW'; payload: string }
  | { type: 'TOGGLE_NOTIFICATION_CENTER' }
  | { type: 'TOGGLE_SPOTLIGHT' }
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  
  // System actions
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'SET_SYSTEM_SETTINGS'; payload: Record<string, any> }
  | { type: 'SET_SYSTEM_LOADING'; payload: boolean }
  | { type: 'HYDRATE_STATE'; payload: Partial<PharmacyState> };

// Initial state
const initialState: PharmacyState = {
  user: null,
  inventory: {
    items: [],
    stats: null,
    alerts: [],
    isLoading: false,
    lastUpdated: null,
  },
  patients: {
    list: [],
    currentPatient: null,
    searchResults: [],
    isLoading: false,
    lastUpdated: null,
  },
  prescriptions: {
    list: [],
    currentPrescription: null,
    pendingPrescriptions: [],
    readyPrescriptions: [],
    isLoading: false,
    lastUpdated: null,
  },
  notifications: {
    list: [],
    unreadCount: 0,
    criticalCount: 0,
    isLoading: false,
  },
  ui: {
    theme: 'light',
    sidebarCollapsed: false,
    activeWindow: null,
    windows: [],
    isNotificationCenterOpen: false,
    isSpotlightOpen: false,
    currentView: 'dashboard',
  },
  system: {
    isOnline: navigator.onLine,
    lastSync: null,
    version: '1.0.0',
    settings: {},
    isLoading: false,
  },
};

// Reducer function
function pharmacyReducer(state: PharmacyState, action: PharmacyAction): PharmacyState {
  switch (action.type) {
    // User actions
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };

    // Inventory actions
    case 'SET_INVENTORY_LOADING':
      return {
        ...state,
        inventory: { ...state.inventory, isLoading: action.payload }
      };
    case 'SET_INVENTORY_ITEMS':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: action.payload,
          lastUpdated: new Date(),
          isLoading: false
        }
      };
    case 'ADD_INVENTORY_ITEM':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: [action.payload, ...state.inventory.items],
          lastUpdated: new Date()
        }
      };
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: state.inventory.items.map(item =>
            item.id === action.payload.id
              ? { ...item, ...action.payload.item }
              : item
          ),
          lastUpdated: new Date()
        }
      };
    case 'REMOVE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: state.inventory.items.filter(item => item.id !== action.payload),
          lastUpdated: new Date()
        }
      };
    case 'SET_INVENTORY_STATS':
      return {
        ...state,
        inventory: { ...state.inventory, stats: action.payload }
      };
    case 'SET_INVENTORY_ALERTS':
      return {
        ...state,
        inventory: { ...state.inventory, alerts: action.payload }
      };

    // Patient actions
    case 'SET_PATIENTS_LOADING':
      return {
        ...state,
        patients: { ...state.patients, isLoading: action.payload }
      };
    case 'SET_PATIENTS':
      return {
        ...state,
        patients: {
          ...state.patients,
          list: action.payload,
          lastUpdated: new Date(),
          isLoading: false
        }
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          list: [action.payload, ...state.patients.list],
          lastUpdated: new Date()
        }
      };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          list: state.patients.list.map(patient =>
            patient.id === action.payload.id
              ? { ...patient, ...action.payload.patient }
              : patient
          ),
          lastUpdated: new Date()
        }
      };
    case 'REMOVE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          list: state.patients.list.filter(patient => patient.id !== action.payload),
          lastUpdated: new Date()
        }
      };
    case 'SET_CURRENT_PATIENT':
      return {
        ...state,
        patients: { ...state.patients, currentPatient: action.payload }
      };
    case 'SET_PATIENT_SEARCH_RESULTS':
      return {
        ...state,
        patients: { ...state.patients, searchResults: action.payload }
      };

    // Prescription actions
    case 'SET_PRESCRIPTIONS_LOADING':
      return {
        ...state,
        prescriptions: { ...state.prescriptions, isLoading: action.payload }
      };
    case 'SET_PRESCRIPTIONS':
      return {
        ...state,
        prescriptions: {
          ...state.prescriptions,
          list: action.payload,
          lastUpdated: new Date(),
          isLoading: false
        }
      };
    case 'ADD_PRESCRIPTION':
      return {
        ...state,
        prescriptions: {
          ...state.prescriptions,
          list: [action.payload, ...state.prescriptions.list],
          lastUpdated: new Date()
        }
      };
    case 'UPDATE_PRESCRIPTION':
      return {
        ...state,
        prescriptions: {
          ...state.prescriptions,
          list: state.prescriptions.list.map(prescription =>
            prescription.id === action.payload.id
              ? { ...prescription, ...action.payload.prescription }
              : prescription
          ),
          lastUpdated: new Date()
        }
      };
    case 'REMOVE_PRESCRIPTION':
      return {
        ...state,
        prescriptions: {
          ...state.prescriptions,
          list: state.prescriptions.list.filter(prescription => prescription.id !== action.payload),
          lastUpdated: new Date()
        }
      };
    case 'SET_CURRENT_PRESCRIPTION':
      return {
        ...state,
        prescriptions: { ...state.prescriptions, currentPrescription: action.payload }
      };
    case 'SET_PENDING_PRESCRIPTIONS':
      return {
        ...state,
        prescriptions: { ...state.prescriptions, pendingPrescriptions: action.payload }
      };
    case 'SET_READY_PRESCRIPTIONS':
      return {
        ...state,
        prescriptions: { ...state.prescriptions, readyPrescriptions: action.payload }
      };

    // Notification actions
    case 'SET_NOTIFICATIONS':
      const unreadCount = action.payload.filter(n => !n.isRead && !n.isArchived).length;
      const criticalCount = action.payload.filter(n => n.priority === 'critical' && !n.isRead).length;
      return {
        ...state,
        notifications: {
          list: action.payload,
          unreadCount,
          criticalCount,
          isLoading: false
        }
      };
    case 'ADD_NOTIFICATION':
      const newUnreadCount = state.notifications.unreadCount + (action.payload.isRead ? 0 : 1);
      const newCriticalCount = state.notifications.criticalCount + 
        (action.payload.priority === 'critical' && !action.payload.isRead ? 1 : 0);
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: [action.payload, ...state.notifications.list],
          unreadCount: newUnreadCount,
          criticalCount: newCriticalCount
        }
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: state.notifications.list.map(notification =>
            notification.id === action.payload.id
              ? { ...notification, ...action.payload.updates }
              : notification
          )
        }
      };
    case 'REMOVE_NOTIFICATION':
      const removedNotification = state.notifications.list.find(n => n.id === action.payload);
      const updatedUnreadCount = removedNotification && !removedNotification.isRead 
        ? state.notifications.unreadCount - 1 
        : state.notifications.unreadCount;
      const updatedCriticalCount = removedNotification && 
        removedNotification.priority === 'critical' && !removedNotification.isRead
        ? state.notifications.criticalCount - 1
        : state.notifications.criticalCount;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: state.notifications.list.filter(notification => notification.id !== action.payload),
          unreadCount: Math.max(0, updatedUnreadCount),
          criticalCount: Math.max(0, updatedCriticalCount)
        }
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: state.notifications.list.map(notification =>
            notification.id === action.payload
              ? { ...notification, isRead: true }
              : notification
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1),
          criticalCount: state.notifications.list.find(n => 
            n.id === action.payload && n.priority === 'critical'
          ) ? Math.max(0, state.notifications.criticalCount - 1) : state.notifications.criticalCount
        }
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: state.notifications.list.map(notification => ({ ...notification, isRead: true })),
          unreadCount: 0,
          criticalCount: 0
        }
      };

    // UI actions
    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
      };
    case 'SET_ACTIVE_WINDOW':
      return {
        ...state,
        ui: { ...state.ui, activeWindow: action.payload }
      };
    case 'ADD_WINDOW':
      return {
        ...state,
        ui: {
          ...state.ui,
          windows: [...state.ui.windows, action.payload],
          activeWindow: action.payload.id
        }
      };
    case 'REMOVE_WINDOW':
      return {
        ...state,
        ui: {
          ...state.ui,
          windows: state.ui.windows.filter(window => window.id !== action.payload),
          activeWindow: state.ui.activeWindow === action.payload ? null : state.ui.activeWindow
        }
      };
    case 'TOGGLE_NOTIFICATION_CENTER':
      return {
        ...state,
        ui: { ...state.ui, isNotificationCenterOpen: !state.ui.isNotificationCenterOpen }
      };
    case 'TOGGLE_SPOTLIGHT':
      return {
        ...state,
        ui: { ...state.ui, isSpotlightOpen: !state.ui.isSpotlightOpen }
      };
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        ui: { ...state.ui, currentView: action.payload }
      };

    // System actions
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        system: { ...state.system, isOnline: action.payload }
      };
    case 'SET_LAST_SYNC':
      return {
        ...state,
        system: { ...state.system, lastSync: action.payload }
      };
    case 'SET_SYSTEM_SETTINGS':
      return {
        ...state,
        system: { ...state.system, settings: action.payload }
      };
    case 'SET_SYSTEM_LOADING':
      return {
        ...state,
        system: { ...state.system, isLoading: action.payload }
      };
    case 'HYDRATE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Create context
const PharmacyContext = createContext<{
  state: PharmacyState;
  dispatch: React.Dispatch<PharmacyAction>;
} | null>(null);

// Provider component
export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pharmacyReducer, initialState);

  // Initialize and sync with external systems
  useEffect(() => {
    // Load persisted state
    const loadPersistedState = async () => {
      try {
        const settings = StorageManager.getItem('pharmacy_settings', {});
        const userPreferences = StorageManager.getItem('user_preferences', {});
        
        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            system: {
              ...state.system,
              settings: { ...settings }
            },
            ui: {
              ...state.ui,
              theme: userPreferences.theme || 'light',
              sidebarCollapsed: userPreferences.sidebarCollapsed || false
            }
          }
        });

        // Load inventory data
        dispatch({ type: 'SET_INVENTORY_LOADING', payload: true });
        const inventoryItems = InventoryManager.getInventoryItems();
        const inventoryStats = InventoryManager.getInventoryStats();
        const inventoryAlerts = InventoryManager.getAlerts();
        
        dispatch({ type: 'SET_INVENTORY_ITEMS', payload: inventoryItems });
        dispatch({ type: 'SET_INVENTORY_STATS', payload: inventoryStats });
        dispatch({ type: 'SET_INVENTORY_ALERTS', payload: inventoryAlerts });

        // Load notifications
        const notifications = NotificationManager.getNotifications();
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });

      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    };

    loadPersistedState();

    // Subscribe to notification changes
    const unsubscribeNotifications = NotificationManager.subscribe((notifications) => {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    });

    // Listen for online/offline events
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribeNotifications();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist state changes
  useEffect(() => {
    // Persist UI preferences
    StorageManager.setItem('user_preferences', {
      theme: state.ui.theme,
      sidebarCollapsed: state.ui.sidebarCollapsed,
      currentView: state.ui.currentView
    });
  }, [state.ui.theme, state.ui.sidebarCollapsed, state.ui.currentView]);

  useEffect(() => {
    // Persist system settings
    StorageManager.setItem('pharmacy_settings', state.system.settings);
  }, [state.system.settings]);

  return (
    <PharmacyContext.Provider value={{ state, dispatch }}>
      {children}
    </PharmacyContext.Provider>
  );
};

// Custom hook to use the pharmacy context
export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};

// Custom hooks for specific state slices
export const useInventory = () => {
  const { state, dispatch } = usePharmacy();
  return {
    inventory: state.inventory,
    setLoading: (loading: boolean) => dispatch({ type: 'SET_INVENTORY_LOADING', payload: loading }),
    setItems: (items: InventoryItem[]) => dispatch({ type: 'SET_INVENTORY_ITEMS', payload: items }),
    addItem: (item: InventoryItem) => dispatch({ type: 'ADD_INVENTORY_ITEM', payload: item }),
    updateItem: (id: string, updates: Partial<InventoryItem>) => 
      dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id, item: updates } }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_INVENTORY_ITEM', payload: id }),
    setStats: (stats: any) => dispatch({ type: 'SET_INVENTORY_STATS', payload: stats }),
    setAlerts: (alerts: any[]) => dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts })
  };
};

export const useNotifications = () => {
  const { state, dispatch } = usePharmacy();
  return {
    notifications: state.notifications,
    addNotification: (notification: PharmacyNotification) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    updateNotification: (id: string, updates: Partial<PharmacyNotification>) =>
      dispatch({ type: 'UPDATE_NOTIFICATION', payload: { id, updates } }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    markAsRead: (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    markAllAsRead: () => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })
  };
};

export const useUI = () => {
  const { state, dispatch } = usePharmacy();
  return {
    ui: state.ui,
    setTheme: (theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setActiveWindow: (windowId: string | null) => dispatch({ type: 'SET_ACTIVE_WINDOW', payload: windowId }),
    addWindow: (window: any) => dispatch({ type: 'ADD_WINDOW', payload: window }),
    removeWindow: (windowId: string) => dispatch({ type: 'REMOVE_WINDOW', payload: windowId }),
    toggleNotificationCenter: () => dispatch({ type: 'TOGGLE_NOTIFICATION_CENTER' }),
    toggleSpotlight: () => dispatch({ type: 'TOGGLE_SPOTLIGHT' }),
    setCurrentView: (view: string) => dispatch({ type: 'SET_CURRENT_VIEW', payload: view })
  };
};/
/ Enhanced hooks with optimistic updates and data operations
export const usePatients = () => {
  const { state, dispatch } = usePharmacy();
  
  return {
    patients: state.patients,
    
    // Optimistic patient operations
    addPatient: async (patientData: any) => {
      // Optimistic update
      const tempId = `temp_${Date.now()}`;
      const optimisticPatient = { ...patientData, id: tempId };
      dispatch({ type: 'ADD_PATIENT', payload: optimisticPatient });
      
      try {
        // Actual operation (would be API call in real app)
        const savedPatient = { ...patientData, id: `pat_${Date.now()}` };
        
        // Replace optimistic update with real data
        dispatch({ type: 'UPDATE_PATIENT', payload: { id: tempId, patient: savedPatient } });
        return savedPatient;
      } catch (error) {
        // Rollback optimistic update
        dispatch({ type: 'REMOVE_PATIENT', payload: tempId });
        throw error;
      }
    },
    
    updatePatient: async (id: string, updates: Partial<any>) => {
      // Store original for rollback
      const original = state.patients.list.find(p => p.id === id);
      
      // Optimistic update
      dispatch({ type: 'UPDATE_PATIENT', payload: { id, patient: updates } });
      
      try {
        // Actual operation
        const updatedPatient = { ...original, ...updates };
        return updatedPatient;
      } catch (error) {
        // Rollback
        if (original) {
          dispatch({ type: 'UPDATE_PATIENT', payload: { id, patient: original } });
        }
        throw error;
      }
    },
    
    removePatient: async (id: string) => {
      // Store original for rollback
      const original = state.patients.list.find(p => p.id === id);
      
      // Optimistic update
      dispatch({ type: 'REMOVE_PATIENT', payload: id });
      
      try {
        // Actual operation
        return true;
      } catch (error) {
        // Rollback
        if (original) {
          dispatch({ type: 'ADD_PATIENT', payload: original });
        }
        throw error;
      }
    },
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_PATIENTS_LOADING', payload: loading }),
    setPatients: (patients: any[]) => dispatch({ type: 'SET_PATIENTS', payload: patients }),
    setCurrentPatient: (patient: any | null) => dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient }),
    setSearchResults: (results: any[]) => dispatch({ type: 'SET_PATIENT_SEARCH_RESULTS', payload: results })
  };
};

export const usePrescriptions = () => {
  const { state, dispatch } = usePharmacy();
  
  return {
    prescriptions: state.prescriptions,
    
    // Optimistic prescription operations
    addPrescription: async (prescriptionData: any) => {
      const tempId = `temp_${Date.now()}`;
      const optimisticPrescription = { ...prescriptionData, id: tempId };
      dispatch({ type: 'ADD_PRESCRIPTION', payload: optimisticPrescription });
      
      try {
        const savedPrescription = { ...prescriptionData, id: `rx_${Date.now()}` };
        dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { id: tempId, prescription: savedPrescription } });
        return savedPrescription;
      } catch (error) {
        dispatch({ type: 'REMOVE_PRESCRIPTION', payload: tempId });
        throw error;
      }
    },
    
    updatePrescription: async (id: string, updates: Partial<any>) => {
      const original = state.prescriptions.list.find(p => p.id === id);
      dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { id, prescription: updates } });
      
      try {
        const updatedPrescription = { ...original, ...updates };
        return updatedPrescription;
      } catch (error) {
        if (original) {
          dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { id, prescription: original } });
        }
        throw error;
      }
    },
    
    removePrescription: async (id: string) => {
      const original = state.prescriptions.list.find(p => p.id === id);
      dispatch({ type: 'REMOVE_PRESCRIPTION', payload: id });
      
      try {
        return true;
      } catch (error) {
        if (original) {
          dispatch({ type: 'ADD_PRESCRIPTION', payload: original });
        }
        throw error;
      }
    },
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_PRESCRIPTIONS_LOADING', payload: loading }),
    setPrescriptions: (prescriptions: any[]) => dispatch({ type: 'SET_PRESCRIPTIONS', payload: prescriptions }),
    setCurrentPrescription: (prescription: any | null) => dispatch({ type: 'SET_CURRENT_PRESCRIPTION', payload: prescription }),
    setPendingPrescriptions: (prescriptions: any[]) => dispatch({ type: 'SET_PENDING_PRESCRIPTIONS', payload: prescriptions }),
    setReadyPrescriptions: (prescriptions: any[]) => dispatch({ type: 'SET_READY_PRESCRIPTIONS', payload: prescriptions })
  };
};

// Enhanced inventory hook with optimistic updates
export const useInventoryEnhanced = () => {
  const { state, dispatch } = usePharmacy();
  
  return {
    inventory: state.inventory,
    
    // Optimistic inventory operations
    addItem: async (itemData: any) => {
      const tempId = `temp_${Date.now()}`;
      const optimisticItem = { ...itemData, id: tempId };
      dispatch({ type: 'ADD_INVENTORY_ITEM', payload: optimisticItem });
      
      try {
        // Use InventoryManager for actual operation
        const savedItem = InventoryManager.addInventoryItem(itemData, 'Current User');
        dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id: tempId, item: savedItem } });
        
        // Update stats and alerts
        const stats = InventoryManager.getInventoryStats();
        const alerts = InventoryManager.getAlerts();
        dispatch({ type: 'SET_INVENTORY_STATS', payload: stats });
        dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts });
        
        return savedItem;
      } catch (error) {
        dispatch({ type: 'REMOVE_INVENTORY_ITEM', payload: tempId });
        throw error;
      }
    },
    
    updateItem: async (id: string, updates: Partial<InventoryItem>) => {
      const original = state.inventory.items.find(item => item.id === id);
      dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id, item: updates } });
      
      try {
        // Use InventoryManager for actual operation
        const updatedItem = InventoryManager.updateInventoryItem(id, updates as any, 'Current User');
        if (updatedItem) {
          // Update stats and alerts
          const stats = InventoryManager.getInventoryStats();
          const alerts = InventoryManager.getAlerts();
          dispatch({ type: 'SET_INVENTORY_STATS', payload: stats });
          dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts });
        }
        return updatedItem;
      } catch (error) {
        if (original) {
          dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id, item: original } });
        }
        throw error;
      }
    },
    
    removeItem: async (id: string) => {
      const original = state.inventory.items.find(item => item.id === id);
      dispatch({ type: 'REMOVE_INVENTORY_ITEM', payload: id });
      
      try {
        const success = InventoryManager.deleteInventoryItem(id);
        if (success) {
          // Update stats and alerts
          const stats = InventoryManager.getInventoryStats();
          const alerts = InventoryManager.getAlerts();
          dispatch({ type: 'SET_INVENTORY_STATS', payload: stats });
          dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts });
        }
        return success;
      } catch (error) {
        if (original) {
          dispatch({ type: 'ADD_INVENTORY_ITEM', payload: original });
        }
        throw error;
      }
    },
    
    updateStock: async (id: string, newQuantity: number, reason: string) => {
      const original = state.inventory.items.find(item => item.id === id);
      if (!original) return false;
      
      // Optimistic update
      const optimisticUpdate = {
        ...original,
        stockInfo: { ...original.stockInfo, currentStock: newQuantity }
      };
      dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id, item: optimisticUpdate } });
      
      try {
        const success = InventoryManager.updateStock(id, newQuantity, reason, 'Current User');
        if (success) {
          // Refresh data from manager
          const items = InventoryManager.getInventoryItems();
          const stats = InventoryManager.getInventoryStats();
          const alerts = InventoryManager.getAlerts();
          
          dispatch({ type: 'SET_INVENTORY_ITEMS', payload: items });
          dispatch({ type: 'SET_INVENTORY_STATS', payload: stats });
          dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts });
        }
        return success;
      } catch (error) {
        // Rollback
        dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { id, item: original } });
        throw error;
      }
    },
    
    refreshData: async () => {
      dispatch({ type: 'SET_INVENTORY_LOADING', payload: true });
      try {
        const items = InventoryManager.getInventoryItems();
        const stats = InventoryManager.getInventoryStats();
        const alerts = InventoryManager.getAlerts();
        
        dispatch({ type: 'SET_INVENTORY_ITEMS', payload: items });
        dispatch({ type: 'SET_INVENTORY_STATS', payload: stats });
        dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts });
      } catch (error) {
        console.error('Error refreshing inventory data:', error);
      } finally {
        dispatch({ type: 'SET_INVENTORY_LOADING', payload: false });
      }
    },
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_INVENTORY_LOADING', payload: loading }),
    setItems: (items: InventoryItem[]) => dispatch({ type: 'SET_INVENTORY_ITEMS', payload: items }),
    setStats: (stats: any) => dispatch({ type: 'SET_INVENTORY_STATS', payload: stats }),
    setAlerts: (alerts: any[]) => dispatch({ type: 'SET_INVENTORY_ALERTS', payload: alerts })
  };
};

// System management hook
export const useSystem = () => {
  const { state, dispatch } = usePharmacy();
  
  return {
    system: state.system,
    
    // System operations
    updateSettings: async (newSettings: Record<string, any>) => {
      const originalSettings = state.system.settings;
      
      // Optimistic update
      dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: { ...originalSettings, ...newSettings } });
      
      try {
        // Persist settings
        StorageManager.setItem('pharmacy_settings', { ...originalSettings, ...newSettings });
        return true;
      } catch (error) {
        // Rollback
        dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: originalSettings });
        throw error;
      }
    },
    
    performSync: async () => {
      dispatch({ type: 'SET_SYSTEM_LOADING', payload: true });
      
      try {
        // Perform data synchronization
        // In a real app, this would sync with a server
        
        // Update last sync time
        const now = new Date();
        dispatch({ type: 'SET_LAST_SYNC', payload: now });
        
        return true;
      } catch (error) {
        console.error('Sync failed:', error);
        throw error;
      } finally {
        dispatch({ type: 'SET_SYSTEM_LOADING', payload: false });
      }
    },
    
    setOnlineStatus: (isOnline: boolean) => dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_SYSTEM_LOADING', payload: loading })
  };
};

// Data synchronization hook
export const useDataSync = () => {
  const { state } = usePharmacy();
  const inventory = useInventoryEnhanced();
  const patients = usePatients();
  const prescriptions = usePrescriptions();
  const system = useSystem();
  
  return {
    // Sync all data
    syncAll: async () => {
      try {
        await system.performSync();
        await inventory.refreshData();
        // In a real app, would also sync patients and prescriptions
        return true;
      } catch (error) {
        console.error('Full sync failed:', error);
        return false;
      }
    },
    
    // Check if data needs sync
    needsSync: () => {
      const lastSync = state.system.lastSync;
      if (!lastSync) return true;
      
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return new Date(lastSync) < fiveMinutesAgo;
    },
    
    // Get sync status
    getSyncStatus: () => ({
      isOnline: state.system.isOnline,
      lastSync: state.system.lastSync,
      isLoading: state.system.isLoading,
      needsSync: state.system.lastSync ? 
        new Date(state.system.lastSync) < new Date(Date.now() - 5 * 60 * 1000) : 
        true
    })
  };
};

// Performance monitoring hook
export const usePerformance = () => {
  const { state } = usePharmacy();
  
  return {
    // Get performance metrics
    getMetrics: () => ({
      inventoryItemCount: state.inventory.items.length,
      patientCount: state.patients.list.length,
      prescriptionCount: state.prescriptions.list.length,
      notificationCount: state.notifications.list.length,
      windowCount: state.ui.windows.length,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    }),
    
    // Check if performance optimization is needed
    needsOptimization: () => {
      const metrics = {
        inventoryItemCount: state.inventory.items.length,
        patientCount: state.patients.list.length,
        prescriptionCount: state.prescriptions.list.length,
        notificationCount: state.notifications.list.length
      };
      
      return (
        metrics.inventoryItemCount > 1000 ||
        metrics.patientCount > 5000 ||
        metrics.prescriptionCount > 10000 ||
        metrics.notificationCount > 500
      );
    }
  };
};