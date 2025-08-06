// Enhanced TypeScript interfaces for Pharmacy OS Terminal

// Enums and utility types
export type PrescriptionStatus = 'pending' | 'processing' | 'ready' | 'dispensed';
export type MedicationCategory = 'Pain Relief' | 'Antibiotics' | 'Diabetes' | 'Cardiovascular' | 'Others';
export type ItemType = 'patient' | 'prescription' | 'inventory';
export type Gender = 'male' | 'female' | 'other';
export type AllergySeverity = 'mild' | 'moderate' | 'severe';

// Supporting interfaces
export interface Allergy {
  name: string;
  severity: AllergySeverity;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expiryDate: string;
}

export interface Medication {
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface InteractionWarning {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  medications: string[];
  description: string;
  recommendation: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Enhanced Patient Model
export interface Patient {
  id: string;
  personalInfo: {
    name: string;
    age: number;
    dateOfBirth: string;
    gender: Gender;
    phone: string;
    email?: string;
    address: string;
  };
  medicalInfo: {
    allergies: Allergy[];
    medicalHistory: string;
    emergencyContact: EmergencyContact;
    insuranceInfo?: InsuranceInfo;
  };
  metadata: {
    dateAdded: string;
    lastUpdated: string;
    createdBy: string;
  };
}

// Enhanced Prescription Model
export interface Prescription {
  id: string;
  patientInfo: {
    patientId: string;
    patientName: string;
  };
  prescriptionDetails: {
    doctorName: string;
    doctorLicense: string;
    medications: Medication[];
    instructions: string;
    notes?: string;
  };
  status: PrescriptionStatus;
  timestamps: {
    dateCreated: string;
    dateProcessed?: string;
    dateReady?: string;
    dateDispensed?: string;
  };
  validation: {
    isValidated: boolean;
    validatedBy?: string;
    validationNotes?: string;
  };
}

// Enhanced Inventory Model (Price Removed)
export interface InventoryItem {
  id: string;
  productInfo: {
    name: string;
    genericName?: string;
    category: MedicationCategory;
    manufacturer: string;
    batchNumber: string;
  };
  stockInfo: {
    currentStock: number;
    minimumStock: number;
    unit: string;
    location: string;
  };
  expiryInfo: {
    expiryDate: string;
    daysUntilExpiry: number;
    isExpired: boolean;
  };
  supplier: {
    supplierName: string;
    supplierContact: string;
    lastOrderDate?: string;
  };
  metadata: {
    dateAdded: string;
    lastUpdated: string;
    addedBy: string;
  };
}

// Recycle Bin Model
export interface RecycleBinItem {
  id: string;
  originalId: string;
  itemType: ItemType;
  displayName: string;
  deletionInfo: {
    deletedDate: string;
    deletedBy: string;
    reason?: string;
  };
  originalData: any;
  canRestore: boolean;
  autoDeleteDate: string;
}

// Search and filter interfaces
export interface SearchCriteria {
  query?: string;
  patientName?: string;
  prescriptionId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: PrescriptionStatus;
}

export interface InventorySearchCriteria {
  query?: string;
  category?: MedicationCategory;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  expiryStatus?: 'fresh' | 'expiring_soon' | 'expired';
}

// Data input interfaces for forms
export interface PatientData {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  allergies: Allergy[];
  medicalHistory: string;
  emergencyContact: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
}

export interface PrescriptionData {
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorLicense: string;
  medications: Medication[];
  instructions: string;
  notes?: string;
}

export interface InventoryItemData {
  name: string;
  genericName?: string;
  category: MedicationCategory;
  manufacturer: string;
  batchNumber: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  location: string;
  expiryDate: string;
  supplierName: string;
  supplierContact: string;
}

// Manager interfaces
export interface PrescriptionManager {
  createPrescription(data: PrescriptionData): Promise<Prescription>;
  updatePrescriptionStatus(id: string, status: PrescriptionStatus): Promise<void>;
  validatePrescription(prescription: Prescription): ValidationResult;
  checkDrugInteractions(medications: Medication[]): InteractionWarning[];
  searchPrescriptions(criteria: SearchCriteria): Prescription[];
}

export interface PatientManager {
  addPatient(data: PatientData): Promise<Patient>;
  updatePatient(id: string, data: Partial<PatientData>): Promise<Patient>;
  searchPatients(query: string): Patient[];
  getPatientHistory(id: string): Prescription[];
  validatePatientData(data: PatientData): ValidationResult;
}

export interface InventoryManager {
  addInventoryItem(data: InventoryItemData): Promise<InventoryItem>;
  updateStock(id: string, quantity: number): Promise<void>;
  checkLowStock(): InventoryItem[];
  checkExpiryAlerts(): InventoryItem[];
  categorizeItems(): Map<MedicationCategory, InventoryItem[]>;
  searchInventory(criteria: InventorySearchCriteria): InventoryItem[];
}

export interface RecycleBinManager {
  moveToRecycleBin(item: any, type: ItemType): Promise<RecycleBinItem>;
  restoreItem(recycleBinId: string): Promise<void>;
  permanentlyDelete(recycleBinId: string): Promise<void>;
  getRecycleBinContents(): RecycleBinItem[];
  bulkRestore(ids: string[]): Promise<void>;
  emptyRecycleBin(): Promise<void>;
}