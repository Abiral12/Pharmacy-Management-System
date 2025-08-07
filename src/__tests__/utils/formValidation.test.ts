// Unit Tests for Form Validation

import { FormValidator, PharmacyValidationRules, PharmacyCustomValidations } from '../../utils/formValidation';

describe('FormValidator', () => {
  describe('validateField', () => {
    it('should validate required fields correctly', () => {
      const validator = new FormValidator({
        name: { required: true }
      });

      expect(validator.validateField('name', '')).toBe('Name is required');
      expect(validator.validateField('name', null)).toBe('Name is required');
      expect(validator.validateField('name', undefined)).toBe('Name is required');
      expect(validator.validateField('name', 'John Doe')).toBeNull();
    });

    it('should validate string length correctly', () => {
      const validator = new FormValidator({
        password: { minLength: 8, maxLength: 20 }
      });

      expect(validator.validateField('password', 'short')).toBe('Password must be at least 8 characters');
      expect(validator.validateField('password', 'a'.repeat(25))).toBe('Password must not exceed 20 characters');
      expect(validator.validateField('password', 'validpassword')).toBeNull();
    });

    it('should validate email format correctly', () => {
      const validator = new FormValidator({
        email: { email: true }
      });

      expect(validator.validateField('email', 'invalid-email')).toBe('Email must be a valid email address');
      expect(validator.validateField('email', 'test@')).toBe('Email must be a valid email address');
      expect(validator.validateField('email', '@example.com')).toBe('Email must be a valid email address');
      expect(validator.validateField('email', 'test@example.com')).toBeNull();
    });

    it('should validate phone numbers correctly', () => {
      const validator = new FormValidator({
        phone: { phone: true }
      });

      expect(validator.validateField('phone', '123')).toBe('Phone must be a valid phone number');
      expect(validator.validateField('phone', 'abc123')).toBe('Phone must be a valid phone number');
      expect(validator.validateField('phone', '+1234567890')).toBeNull();
      expect(validator.validateField('phone', '1234567890')).toBeNull();
    });

    it('should validate numbers correctly', () => {
      const validator = new FormValidator({
        age: { number: true, min: 0, max: 150 }
      });

      expect(validator.validateField('age', 'not-a-number')).toBe('Age must be a valid number');
      expect(validator.validateField('age', -5)).toBe('Age must be at least 0');
      expect(validator.validateField('age', 200)).toBe('Age must not exceed 150');
      expect(validator.validateField('age', 25)).toBeNull();
      expect(validator.validateField('age', '30')).toBeNull();
    });

    it('should validate patterns correctly', () => {
      const validator = new FormValidator({
        batchNumber: { pattern: /^[A-Z0-9\-]+$/i }
      });

      expect(validator.validateField('batchNumber', 'invalid batch!')).toBe('Batch number format is invalid');
      expect(validator.validateField('batchNumber', 'BATCH-001')).toBeNull();
      expect(validator.validateField('batchNumber', 'batch123')).toBeNull();
    });

    it('should validate dates correctly', () => {
      const validator = new FormValidator({
        expiryDate: { date: true, futureDate: true },
        birthDate: { date: true, pastDate: true }
      });

      expect(validator.validateField('expiryDate', 'invalid-date')).toBe('Expiry date must be a valid date');
      expect(validator.validateField('expiryDate', '2020-01-01')).toBe('Expiry date must be a future date');
      
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validator.validateField('expiryDate', futureDate.toISOString().split('T')[0])).toBeNull();

      expect(validator.validateField('birthDate', 'invalid-date')).toBe('Birth date must be a valid date');
      expect(validator.validateField('birthDate', '2030-01-01')).toBe('Birth date must be a past date');
      expect(validator.validateField('birthDate', '1990-01-01')).toBeNull();
    });

    it('should handle custom validation functions', () => {
      const validator = new FormValidator({
        username: {
          custom: (value) => {
            if (value === 'admin') {
              return 'Username "admin" is not allowed';
            }
            return null;
          }
        }
      });

      expect(validator.validateField('username', 'admin')).toBe('Username "admin" is not allowed');
      expect(validator.validateField('username', 'user123')).toBeNull();
    });

    it('should skip validation for empty non-required fields', () => {
      const validator = new FormValidator({
        optionalField: { minLength: 5 }
      });

      expect(validator.validateField('optionalField', '')).toBeNull();
      expect(validator.validateField('optionalField', null)).toBeNull();
      expect(validator.validateField('optionalField', undefined)).toBeNull();
    });
  });

  describe('validateAll', () => {
    it('should validate all fields and return results', () => {
      const validator = new FormValidator({
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        age: { required: true, number: true, min: 0 }
      });

      const invalidData = {
        name: 'A',
        email: 'invalid-email',
        age: -5
      };

      const result = validator.validateAll(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name must be at least 2 characters');
      expect(result.errors.email).toBe('Email must be a valid email address');
      expect(result.errors.age).toBe('Age must be at least 0');
    });

    it('should return valid result for correct data', () => {
      const validator = new FormValidator({
        name: { required: true, minLength: 2 },
        email: { required: true, email: true },
        age: { required: true, number: true, min: 0 }
      });

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const result = validator.validateAll(validData);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});

describe('PharmacyValidationRules', () => {
  it('should have correct patient validation rules', () => {
    expect(PharmacyValidationRules.patientName.required).toBe(true);
    expect(PharmacyValidationRules.patientName.minLength).toBe(2);
    expect(PharmacyValidationRules.patientName.maxLength).toBe(100);
    expect(PharmacyValidationRules.patientName.pattern).toBeDefined();

    expect(PharmacyValidationRules.patientAge.required).toBe(true);
    expect(PharmacyValidationRules.patientAge.number).toBe(true);
    expect(PharmacyValidationRules.patientAge.min).toBe(0);
    expect(PharmacyValidationRules.patientAge.max).toBe(150);

    expect(PharmacyValidationRules.patientPhone.required).toBe(true);
    expect(PharmacyValidationRules.patientPhone.phone).toBe(true);

    expect(PharmacyValidationRules.patientEmail.email).toBe(true);
  });

  it('should have correct medication validation rules', () => {
    expect(PharmacyValidationRules.medicationName.required).toBe(true);
    expect(PharmacyValidationRules.medicationName.minLength).toBe(2);
    expect(PharmacyValidationRules.medicationName.maxLength).toBe(100);

    expect(PharmacyValidationRules.dosage.required).toBe(true);
    expect(PharmacyValidationRules.dosage.pattern).toBeDefined();

    expect(PharmacyValidationRules.quantity.required).toBe(true);
    expect(PharmacyValidationRules.quantity.number).toBe(true);
    expect(PharmacyValidationRules.quantity.min).toBe(1);

    expect(PharmacyValidationRules.expiryDate.required).toBe(true);
    expect(PharmacyValidationRules.expiryDate.date).toBe(true);
    expect(PharmacyValidationRules.expiryDate.futureDate).toBe(true);
  });

  it('should have correct inventory validation rules', () => {
    expect(PharmacyValidationRules.stockQuantity.required).toBe(true);
    expect(PharmacyValidationRules.stockQuantity.number).toBe(true);
    expect(PharmacyValidationRules.stockQuantity.min).toBe(0);

    expect(PharmacyValidationRules.minimumStock.required).toBe(true);
    expect(PharmacyValidationRules.minimumStock.number).toBe(true);
    expect(PharmacyValidationRules.minimumStock.min).toBe(0);

    expect(PharmacyValidationRules.supplierName.required).toBe(true);
    expect(PharmacyValidationRules.supplierName.minLength).toBe(2);
    expect(PharmacyValidationRules.supplierName.maxLength).toBe(100);

    expect(PharmacyValidationRules.supplierContact.required).toBe(true);
    expect(PharmacyValidationRules.supplierContact.phone).toBe(true);
  });

  it('should have correct prescription validation rules', () => {
    expect(PharmacyValidationRules.doctorName.required).toBe(true);
    expect(PharmacyValidationRules.doctorName.minLength).toBe(2);
    expect(PharmacyValidationRules.doctorName.maxLength).toBe(100);
    expect(PharmacyValidationRules.doctorName.pattern).toBeDefined();

    expect(PharmacyValidationRules.doctorLicense.required).toBe(true);
    expect(PharmacyValidationRules.doctorLicense.pattern).toBeDefined();

    expect(PharmacyValidationRules.prescriptionNotes.maxLength).toBe(500);
  });
});

describe('PharmacyCustomValidations', () => {
  describe('validatePrescriptionDate', () => {
    it('should reject prescriptions older than 30 days', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35);
      const dateString = oldDate.toISOString().split('T')[0];

      const result = PharmacyCustomValidations.validatePrescriptionDate(dateString);
      expect(result).toBe('Prescription is too old (more than 30 days)');
    });

    it('should reject future prescription dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];

      const result = PharmacyCustomValidations.validatePrescriptionDate(dateString);
      expect(result).toBe('Prescription date cannot be in the future');
    });

    it('should accept valid prescription dates', () => {
      const validDate = new Date();
      validDate.setDate(validDate.getDate() - 5);
      const dateString = validDate.toISOString().split('T')[0];

      const result = PharmacyCustomValidations.validatePrescriptionDate(dateString);
      expect(result).toBeNull();
    });
  });

  describe('validateInsurance', () => {
    it('should reject short insurance numbers', () => {
      const result = PharmacyCustomValidations.validateInsurance('123');
      expect(result).toBe('Insurance number must be at least 8 characters');
    });

    it('should accept valid insurance numbers', () => {
      const result = PharmacyCustomValidations.validateInsurance('12345678');
      expect(result).toBeNull();
    });

    it('should accept empty insurance numbers', () => {
      const result = PharmacyCustomValidations.validateInsurance('');
      expect(result).toBeNull();
    });
  });

  describe('validateControlledSubstance', () => {
    it('should limit controlled substances to 90-day supply', () => {
      const result = PharmacyCustomValidations.validateControlledSubstance('Oxycodone', 120);
      expect(result).toBe('Controlled substances limited to 90-day supply');
    });

    it('should accept valid quantities', () => {
      const result = PharmacyCustomValidations.validateControlledSubstance('Oxycodone', 60);
      expect(result).toBeNull();
    });
  });

  describe('validateDrugInteraction', () => {
    it('should return null for no interactions', () => {
      const result = PharmacyCustomValidations.validateDrugInteraction(['Aspirin', 'Tylenol']);
      expect(result).toBeNull();
    });
  });
});

describe('Integration Tests', () => {
  it('should validate complete patient form', () => {
    const validator = new FormValidator({
      patientName: PharmacyValidationRules.patientName,
      patientAge: PharmacyValidationRules.patientAge,
      patientPhone: PharmacyValidationRules.patientPhone,
      patientEmail: PharmacyValidationRules.patientEmail,
      patientAddress: PharmacyValidationRules.patientAddress
    });

    const validPatientData = {
      patientName: 'John Doe',
      patientAge: 35,
      patientPhone: '+1234567890',
      patientEmail: 'john@example.com',
      patientAddress: '123 Main St, City, State 12345'
    };

    const result = validator.validateAll(validPatientData);
    expect(result.isValid).toBe(true);
  });

  it('should validate complete inventory form', () => {
    const validator = new FormValidator({
      medicationName: PharmacyValidationRules.medicationName,
      stockQuantity: PharmacyValidationRules.stockQuantity,
      minimumStock: PharmacyValidationRules.minimumStock,
      supplierName: PharmacyValidationRules.supplierName,
      supplierContact: PharmacyValidationRules.supplierContact,
      expiryDate: PharmacyValidationRules.expiryDate,
      batchNumber: PharmacyValidationRules.batchNumber
    });

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const validInventoryData = {
      medicationName: 'Aspirin 100mg',
      stockQuantity: 100,
      minimumStock: 20,
      supplierName: 'MediSupply Inc',
      supplierContact: '+1234567890',
      expiryDate: futureDate.toISOString().split('T')[0],
      batchNumber: 'ASP-2024-001'
    };

    const result = validator.validateAll(validInventoryData);
    expect(result.isValid).toBe(true);
  });

  it('should validate complete prescription form', () => {
    const validator = new FormValidator({
      doctorName: PharmacyValidationRules.doctorName,
      doctorLicense: PharmacyValidationRules.doctorLicense,
      medicationName: PharmacyValidationRules.medicationName,
      dosage: PharmacyValidationRules.dosage,
      frequency: PharmacyValidationRules.frequency,
      quantity: PharmacyValidationRules.quantity,
      prescriptionNotes: PharmacyValidationRules.prescriptionNotes
    });

    const validPrescriptionData = {
      doctorName: 'Dr. Jane Smith',
      doctorLicense: 'MD-12345',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: '1 time daily',
      quantity: 30,
      prescriptionNotes: 'Take with food'
    };

    const result = validator.validateAll(validPrescriptionData);
    expect(result.isValid).toBe(true);
  });
});