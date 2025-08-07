// Enhanced Form Validation Utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  phone?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
  date?: boolean;
  futureDate?: boolean;
  pastDate?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export class FormValidator {
  private rules: Record<string, ValidationRule> = {};
  private values: Record<string, any> = {};

  constructor(rules: Record<string, ValidationRule>) {
    this.rules = rules;
  }

  // Set form values
  setValues(values: Record<string, any>): void {
    this.values = values;
  }

  // Validate a single field
  validateField(fieldName: string, value: any): string | null {
    const rule = this.rules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.formatFieldName(fieldName)} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.formatFieldName(fieldName)} must not exceed ${rule.maxLength} characters`;
      }

      // Email validation
      if (rule.email && !this.isValidEmail(value)) {
        return `${this.formatFieldName(fieldName)} must be a valid email address`;
      }

      // Phone validation
      if (rule.phone && !this.isValidPhone(value)) {
        return `${this.formatFieldName(fieldName)} must be a valid phone number`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${this.formatFieldName(fieldName)} format is invalid`;
      }
    }

    // Number validations
    if (rule.number) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue)) {
        return `${this.formatFieldName(fieldName)} must be a valid number`;
      }

      if (rule.min !== undefined && numValue < rule.min) {
        return `${this.formatFieldName(fieldName)} must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && numValue > rule.max) {
        return `${this.formatFieldName(fieldName)} must not exceed ${rule.max}`;
      }
    }

    // Date validations
    if (rule.date) {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return `${this.formatFieldName(fieldName)} must be a valid date`;
      }

      if (rule.futureDate && dateValue <= new Date()) {
        return `${this.formatFieldName(fieldName)} must be a future date`;
      }

      if (rule.pastDate && dateValue >= new Date()) {
        return `${this.formatFieldName(fieldName)} must be a past date`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  // Validate all fields
  validateAll(values: Record<string, any>): ValidationResult {
    this.setValues(values);
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(this.rules).forEach(fieldName => {
      const error = this.validateField(fieldName, values[fieldName]);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Format field name for display
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (supports various formats)
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }
}

// Predefined validation rules for common pharmacy fields
export const PharmacyValidationRules = {
  // Patient validation rules
  patientName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-\.]+$/
  },
  patientAge: {
    required: true,
    number: true,
    min: 0,
    max: 150
  },
  patientPhone: {
    required: true,
    phone: true
  },
  patientEmail: {
    email: true
  },
  patientAddress: {
    required: true,
    minLength: 10,
    maxLength: 200
  },

  // Medication validation rules
  medicationName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  dosage: {
    required: true,
    pattern: /^\d+(\.\d+)?\s*(mg|g|ml|l|units?)$/i
  },
  frequency: {
    required: true,
    pattern: /^\d+\s*(times?|x)\s*(daily|per day|a day)$/i
  },
  quantity: {
    required: true,
    number: true,
    min: 1
  },
  batchNumber: {
    required: true,
    pattern: /^[A-Z0-9\-]+$/i
  },
  expiryDate: {
    required: true,
    date: true,
    futureDate: true
  },

  // Inventory validation rules
  stockQuantity: {
    required: true,
    number: true,
    min: 0
  },
  minimumStock: {
    required: true,
    number: true,
    min: 0
  },
  supplierName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  supplierContact: {
    required: true,
    phone: true
  },

  // Prescription validation rules
  doctorName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-\.]+$/
  },
  doctorLicense: {
    required: true,
    pattern: /^[A-Z0-9\-]+$/i
  },
  prescriptionNotes: {
    maxLength: 500
  }
};

// Custom validation functions for specific pharmacy use cases
export const PharmacyCustomValidations = {
  // Validate drug interaction
  validateDrugInteraction: (medications: string[]) => {
    // This would integrate with a drug interaction database
    // For now, return null (no error)
    return null;
  },

  // Validate prescription date
  validatePrescriptionDate: (date: string) => {
    const prescriptionDate = new Date(date);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    if (prescriptionDate < thirtyDaysAgo) {
      return 'Prescription is too old (more than 30 days)';
    }
    
    if (prescriptionDate > today) {
      return 'Prescription date cannot be in the future';
    }
    
    return null;
  },

  // Validate insurance information
  validateInsurance: (insuranceNumber: string) => {
    if (insuranceNumber && insuranceNumber.length < 8) {
      return 'Insurance number must be at least 8 characters';
    }
    return null;
  },

  // Validate controlled substance
  validateControlledSubstance: (medicationName: string, quantity: number) => {
    // This would check against a controlled substances database
    // For now, just check quantity limits
    if (quantity > 90) {
      return 'Controlled substances limited to 90-day supply';
    }
    return null;
  }
};

// Form validation hook for React components
export const useFormValidation = (rules: Record<string, ValidationRule>) => {
  const validator = new FormValidator(rules);

  const validateField = (fieldName: string, value: any) => {
    return validator.validateField(fieldName, value);
  };

  const validateForm = (values: Record<string, any>) => {
    return validator.validateAll(values);
  };

  return { validateField, validateForm };
};