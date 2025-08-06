import { 
  PatientData, 
  PrescriptionData, 
  InventoryItemData, 
  ValidationResult, 
  Medication, 
  InteractionWarning 
} from '@/types/pharmacy';

// Utility functions for validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Nepal phone number format: +977-XXXXXXXXX or 98XXXXXXXX
  const phoneRegex = /^(\+977-?)?[98]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidAge = (age: number): boolean => {
  return age > 0 && age <= 150;
};

export const isValidStock = (stock: number): boolean => {
  return stock >= 0 && Number.isInteger(stock);
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date > today;
};

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Patient data validation
export const validatePatientData = (data: PatientData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Patient name must be at least 2 characters long');
  }

  if (!isValidAge(data.age)) {
    errors.push('Patient age must be between 1 and 150');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Please provide a valid phone number (Nepal format)');
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push('Address must be at least 5 characters long');
  }

  if (!isValidDate(data.dateOfBirth)) {
    errors.push('Please provide a valid date of birth');
  }

  // Optional field validation
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  // Emergency contact validation
  if (!data.emergencyContact.name || data.emergencyContact.name.trim().length < 2) {
    errors.push('Emergency contact name is required');
  }

  if (!data.emergencyContact.phone || !isValidPhone(data.emergencyContact.phone)) {
    errors.push('Emergency contact must have a valid phone number');
  }

  if (data.emergencyContact.email && !isValidEmail(data.emergencyContact.email)) {
    errors.push('Emergency contact email must be valid if provided');
  }

  // Age consistency check
  const birthYear = new Date(data.dateOfBirth).getFullYear();
  const currentYear = new Date().getFullYear();
  const calculatedAge = currentYear - birthYear;
  
  if (Math.abs(calculatedAge - data.age) > 1) {
    warnings.push('Age and date of birth may not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Prescription data validation
export const validatePrescriptionData = (data: PrescriptionData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!data.patientId || data.patientId.trim().length === 0) {
    errors.push('Patient selection is required');
  }

  if (!data.doctorName || data.doctorName.trim().length < 2) {
    errors.push('Doctor name must be at least 2 characters long');
  }

  if (!data.doctorLicense || data.doctorLicense.trim().length < 3) {
    errors.push('Doctor license number is required');
  }

  if (!data.medications || data.medications.length === 0) {
    errors.push('At least one medication must be prescribed');
  }

  // Medication validation
  data.medications.forEach((medication, index) => {
    if (!medication.name || medication.name.trim().length < 2) {
      errors.push(`Medication ${index + 1}: Name is required`);
    }

    if (!medication.dosage || medication.dosage.trim().length === 0) {
      errors.push(`Medication ${index + 1}: Dosage is required`);
    }

    if (!medication.frequency || medication.frequency.trim().length === 0) {
      errors.push(`Medication ${index + 1}: Frequency is required`);
    }

    if (!medication.duration || medication.duration.trim().length === 0) {
      errors.push(`Medication ${index + 1}: Duration is required`);
    }

    if (!medication.quantity || medication.quantity <= 0) {
      errors.push(`Medication ${index + 1}: Quantity must be greater than 0`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Inventory data validation
export const validateInventoryData = (data: InventoryItemData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Medication name must be at least 2 characters long');
  }

  if (!data.manufacturer || data.manufacturer.trim().length < 2) {
    errors.push('Manufacturer name is required');
  }

  if (!data.batchNumber || data.batchNumber.trim().length < 3) {
    errors.push('Batch number is required');
  }

  if (!isValidStock(data.currentStock)) {
    errors.push('Current stock must be a non-negative integer');
  }

  if (!isValidStock(data.minimumStock)) {
    errors.push('Minimum stock must be a non-negative integer');
  }

  if (!data.unit || data.unit.trim().length === 0) {
    errors.push('Unit of measurement is required');
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.push('Storage location is required');
  }

  if (!isValidDate(data.expiryDate)) {
    errors.push('Please provide a valid expiry date');
  }

  if (!data.supplierName || data.supplierName.trim().length < 2) {
    errors.push('Supplier name is required');
  }

  if (!data.supplierContact || data.supplierContact.trim().length < 5) {
    errors.push('Supplier contact information is required');
  }

  // Business logic validation
  if (data.currentStock < data.minimumStock) {
    warnings.push('Current stock is below minimum stock level');
  }

  if (isValidDate(data.expiryDate)) {
    const daysUntilExpiry = calculateDaysUntilExpiry(data.expiryDate);
    
    if (daysUntilExpiry < 0) {
      errors.push('Expiry date cannot be in the past');
    } else if (daysUntilExpiry < 30) {
      warnings.push('Item expires within 30 days');
    } else if (daysUntilExpiry < 90) {
      warnings.push('Item expires within 90 days');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Drug interaction checking (simplified implementation)
export const checkDrugInteractions = (medications: Medication[]): InteractionWarning[] => {
  const warnings: InteractionWarning[] = [];
  
  // Common drug interaction patterns (simplified for demo)
  const interactionPatterns = [
    {
      drugs: ['warfarin', 'aspirin'],
      severity: 'high' as const,
      description: 'Increased risk of bleeding',
      recommendation: 'Monitor patient closely for signs of bleeding'
    },
    {
      drugs: ['metformin', 'insulin'],
      severity: 'moderate' as const,
      description: 'Risk of hypoglycemia',
      recommendation: 'Monitor blood glucose levels regularly'
    },
    {
      drugs: ['paracetamol', 'acetaminophen'],
      severity: 'moderate' as const,
      description: 'Same active ingredient - risk of overdose',
      recommendation: 'Do not prescribe together'
    }
  ];

  const medicationNames = medications.map(med => med.name.toLowerCase());

  interactionPatterns.forEach(pattern => {
    const matchingDrugs = pattern.drugs.filter(drug => 
      medicationNames.some(medName => medName.includes(drug))
    );

    if (matchingDrugs.length >= 2) {
      warnings.push({
        severity: pattern.severity,
        medications: matchingDrugs,
        description: pattern.description,
        recommendation: pattern.recommendation
      });
    }
  });

  return warnings;
};

// Form validation helpers
export const getFieldError = (fieldName: string, errors: string[]): string | undefined => {
  return errors.find(error => error.toLowerCase().includes(fieldName.toLowerCase()));
};

export const hasFieldError = (fieldName: string, errors: string[]): boolean => {
  return errors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
};

export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return `• ${errors.join('\n• ')}`;
};