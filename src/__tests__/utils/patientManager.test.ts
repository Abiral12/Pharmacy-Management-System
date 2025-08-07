// Unit Tests for Patient Manager

import { PatientManager, Patient, Allergy } from '../../utils/patientManager';

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

describe('PatientManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockPatientData = {
    personalInfo: {
      name: 'John Doe',
      dateOfBirth: '1990-01-15',
      gender: 'male' as const,
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St, City, State 12345'
    },
    medicalInfo: {
      allergies: [
        {
          name: 'Penicillin',
          severity: 'severe' as const,
          reaction: 'Anaphylaxis',
          notes: 'Avoid all penicillin-based antibiotics',
          dateReported: '2020-01-01'
        }
      ],
      medicalHistory: 'Hypertension, managed with medication',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891',
        email: 'jane@example.com'
      },
      chronicConditions: ['Hypertension'],
      currentMedications: ['Lisinopril 10mg']
    },
    preferences: {
      preferredContactMethod: 'phone' as const,
      languagePreference: 'English'
    },
    createdBy: 'TestUser'
  };

  describe('addPatient', () => {
    it('should add a new patient successfully', () => {
      const patient = PatientManager.addPatient(mockPatientData);

      expect(patient).toBeDefined();
      expect(patient.id).toMatch(/^pat_/);
      expect(patient.personalInfo.name).toBe('John Doe');
      expect(patient.personalInfo.age).toBe(35); // Calculated from DOB
      expect(patient.medicalInfo.allergies).toHaveLength(1);
      expect(patient.metadata.createdBy).toBe('TestUser');
      expect(patient.metadata.isActive).toBe(true);
      expect(patient.metadata.visitCount).toBe(0);
    });

    it('should calculate age from date of birth', () => {
      const patientData = {
        ...mockPatientData,
        personalInfo: {
          ...mockPatientData.personalInfo,
          dateOfBirth: '2000-06-15' // Should be ~24-25 years old
        }
      };

      const patient = PatientManager.addPatient(patientData);
      expect(patient.personalInfo.age).toBeGreaterThanOrEqual(24);
      expect(patient.personalInfo.age).toBeLessThanOrEqual(25);
    });

    it('should create allergy alerts for severe allergies', () => {
      PatientManager.addPatient(mockPatientData);

      const alerts = PatientManager.getPatientAlerts();
      const allergyAlert = alerts.find(alert => alert.type === 'allergy_alert');

      expect(allergyAlert).toBeDefined();
      expect(allergyAlert!.severity).toBe('high');
      expect(allergyAlert!.message).toContain('severe allergy to Penicillin');
    });

    it('should handle patients without allergies', () => {
      const patientDataNoAllergies = {
        ...mockPatientData,
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          allergies: []
        }
      };

      const patient = PatientManager.addPatient(patientDataNoAllergies);
      expect(patient.medicalInfo.allergies).toHaveLength(0);

      const alerts = PatientManager.getPatientAlerts();
      const allergyAlert = alerts.find(alert => alert.type === 'allergy_alert');
      expect(allergyAlert).toBeUndefined();
    });

    it('should check insurance expiry on creation', () => {
      const patientDataWithInsurance = {
        ...mockPatientData,
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          insuranceInfo: {
            provider: 'Test Insurance',
            policyNumber: 'POL123456',
            groupNumber: 'GRP789',
            expiryDate: '2025-03-15',
            isActive: true
          }
        }
      };

      PatientManager.addPatient(patientDataWithInsurance);

      // Should not create expiry alert for future date
      const alerts = PatientManager.getPatientAlerts();
      const expiryAlert = alerts.find(alert => alert.type === 'insurance_expiry');
      expect(expiryAlert).toBeUndefined();
    });

    it('should create insurance expiry alert for soon-to-expire insurance', () => {
      const soonExpiryDate = new Date();
      soonExpiryDate.setDate(soonExpiryDate.getDate() + 15); // 15 days from now

      const patientDataWithExpiringInsurance = {
        ...mockPatientData,
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          insuranceInfo: {
            provider: 'Test Insurance',
            policyNumber: 'POL123456',
            expiryDate: soonExpiryDate.toISOString().split('T')[0],
            isActive: true
          }
        }
      };

      PatientManager.addPatient(patientDataWithExpiringInsurance);

      const alerts = PatientManager.getPatientAlerts();
      const expiryAlert = alerts.find(alert => alert.type === 'insurance_expiry');
      expect(expiryAlert).toBeDefined();
      expect(expiryAlert!.severity).toBe('medium');
    });
  });

  describe('updatePatient', () => {
    it('should update patient information successfully', () => {
      const patient = PatientManager.addPatient(mockPatientData);

      const updates = {
        personalInfo: {
          ...patient.personalInfo,
          phone: '+9876543210'
        }
      };

      const updatedPatient = PatientManager.updatePatient(patient.id, updates, 'UpdateUser');

      expect(updatedPatient).toBeDefined();
      expect(updatedPatient!.personalInfo.phone).toBe('+9876543210');
      expect(updatedPatient!.metadata.lastModifiedBy).toBe('UpdateUser');
    });

    it('should create alerts for new severe allergies', () => {
      const patient = PatientManager.addPatient({
        ...mockPatientData,
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          allergies: [] // Start with no allergies
        }
      });

      const newAllergy: Allergy = {
        name: 'Sulfa',
        severity: 'severe',
        reaction: 'Rash and swelling',
        dateReported: new Date().toISOString()
      };

      const updates = {
        medicalInfo: {
          ...patient.medicalInfo,
          allergies: [newAllergy]
        }
      };

      PatientManager.updatePatient(patient.id, updates, 'UpdateUser');

      const alerts = PatientManager.getPatientAlerts();
      const allergyAlert = alerts.find(alert => 
        alert.type === 'allergy_alert' && 
        alert.message.includes('Sulfa')
      );

      expect(allergyAlert).toBeDefined();
      expect(allergyAlert!.severity).toBe('high');
      expect(allergyAlert!.message).toContain('New severe allergy added: Sulfa');
    });

    it('should return null for non-existent patient', () => {
      const result = PatientManager.updatePatient('non-existent-id', {}, 'UpdateUser');
      expect(result).toBeNull();
    });
  });

  describe('searchPatients', () => {
    it('should search patients by name', () => {
      const patient1 = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, name: 'John Doe' }
      });

      const patient2 = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, name: 'Jane Smith' }
      });

      const results = PatientManager.searchPatients('john');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(patient1.id);
    });

    it('should search patients by phone number', () => {
      const patient = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, phone: '+1111111111' }
      });

      const results = PatientManager.searchPatients('1111111111');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(patient.id);
    });

    it('should search patients by email', () => {
      const patient = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, email: 'unique@example.com' }
      });

      const results = PatientManager.searchPatients('unique');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(patient.id);
    });
  });

  describe('getPatientsWithAllergies', () => {
    it('should return patients with allergies', () => {
      const patientWithAllergies = PatientManager.addPatient(mockPatientData);
      
      const patientWithoutAllergies = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, name: 'No Allergies Patient' },
        medicalInfo: { ...mockPatientData.medicalInfo, allergies: [] }
      });

      const patientsWithAllergies = PatientManager.getPatientsWithAllergies();
      expect(patientsWithAllergies).toHaveLength(1);
      expect(patientsWithAllergies[0].id).toBe(patientWithAllergies.id);
    });
  });

  describe('getPatientsWithSevereAllergies', () => {
    it('should return patients with severe allergies only', () => {
      const patientWithSevereAllergy = PatientManager.addPatient(mockPatientData);
      
      const patientWithMildAllergy = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, name: 'Mild Allergy Patient' },
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          allergies: [{
            name: 'Pollen',
            severity: 'mild',
            dateReported: '2020-01-01'
          }]
        }
      });

      const patientsWithSevereAllergies = PatientManager.getPatientsWithSevereAllergies();
      expect(patientsWithSevereAllergies).toHaveLength(1);
      expect(patientsWithSevereAllergies[0].id).toBe(patientWithSevereAllergy.id);
    });
  });

  describe('getPatientsByAgeRange', () => {
    it('should filter patients by age range', () => {
      const youngPatient = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { 
          ...mockPatientData.personalInfo, 
          name: 'Young Patient',
          dateOfBirth: '2005-01-01' // ~19 years old
        }
      });

      const oldPatient = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { 
          ...mockPatientData.personalInfo, 
          name: 'Old Patient',
          dateOfBirth: '1950-01-01' // ~74 years old
        }
      });

      const middleAgedPatients = PatientManager.getPatientsByAgeRange(30, 40);
      const youngPatients = PatientManager.getPatientsByAgeRange(18, 25);
      const oldPatients = PatientManager.getPatientsByAgeRange(70, 80);

      expect(middleAgedPatients).toHaveLength(1); // John Doe is ~35
      expect(youngPatients).toHaveLength(1);
      expect(oldPatients).toHaveLength(1);
    });
  });

  describe('recordPatientVisit', () => {
    it('should record patient visit and update metadata', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      
      expect(patient.metadata.visitCount).toBe(0);
      expect(patient.metadata.lastVisit).toBeUndefined();

      const result = PatientManager.recordPatientVisit(patient.id);
      expect(result).toBe(true);

      const updatedPatients = PatientManager.getPatients();
      const updatedPatient = updatedPatients.find(p => p.id === patient.id);

      expect(updatedPatient!.metadata.visitCount).toBe(1);
      expect(updatedPatient!.metadata.lastVisit).toBeDefined();
      expect(updatedPatient!.metadata.isActive).toBe(true);
    });

    it('should return false for non-existent patient', () => {
      const result = PatientManager.recordPatientVisit('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('checkAllergyConflicts', () => {
    it('should detect allergy conflicts with medications', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      const medications = ['Penicillin V', 'Amoxicillin', 'Ibuprofen'];

      const result = PatientManager.checkAllergyConflicts(patient.id, medications);

      expect(result.hasConflicts).toBe(true);
      expect(result.conflicts).toHaveLength(2); // Penicillin V and Amoxicillin
      expect(result.conflicts[0].riskLevel).toBe('critical');
      expect(result.conflicts[0].allergy.name).toBe('Penicillin');
    });

    it('should return no conflicts for safe medications', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      const medications = ['Ibuprofen', 'Acetaminophen'];

      const result = PatientManager.checkAllergyConflicts(patient.id, medications);

      expect(result.hasConflicts).toBe(false);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should return no conflicts for non-existent patient', () => {
      const result = PatientManager.checkAllergyConflicts('non-existent-id', ['Aspirin']);

      expect(result.hasConflicts).toBe(false);
      expect(result.conflicts).toHaveLength(0);
    });
  });

  describe('getInactivePatients', () => {
    it('should identify inactive patients', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      
      // Record a visit and then manually set it to old date
      PatientManager.recordPatientVisit(patient.id);
      
      const patients = PatientManager.getPatients();
      const updatedPatient = patients.find(p => p.id === patient.id)!;
      
      // Set last visit to 13 months ago
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 13);
      updatedPatient.metadata.lastVisit = oldDate.toISOString();
      
      localStorage.setItem('pharmacy_patients', JSON.stringify(patients));

      const inactivePatients = PatientManager.getInactivePatients(12);
      expect(inactivePatients).toHaveLength(1);
      expect(inactivePatients[0].id).toBe(patient.id);
    });
  });

  describe('performAutomatedMonitoring', () => {
    it('should create birthday alerts', () => {
      const today = new Date();
      const birthdayPatient = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: {
          ...mockPatientData.personalInfo,
          dateOfBirth: `1990-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        }
      });

      PatientManager.performAutomatedMonitoring();

      const alerts = PatientManager.getPatientAlerts();
      const birthdayAlert = alerts.find(alert => alert.type === 'birthday');

      expect(birthdayAlert).toBeDefined();
      expect(birthdayAlert!.severity).toBe('low');
      expect(birthdayAlert!.message).toContain('birthday');
    });

    it('should create inactive patient alerts', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      
      // Set last visit to 13 months ago
      const patients = PatientManager.getPatients();
      const updatedPatient = patients.find(p => p.id === patient.id)!;
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 13);
      updatedPatient.metadata.lastVisit = oldDate.toISOString();
      localStorage.setItem('pharmacy_patients', JSON.stringify(patients));

      PatientManager.performAutomatedMonitoring();

      const alerts = PatientManager.getPatientAlerts();
      const inactiveAlert = alerts.find(alert => alert.type === 'inactive_patient');

      expect(inactiveAlert).toBeDefined();
      expect(inactiveAlert!.severity).toBe('low');
      expect(inactiveAlert!.message).toContain("hasn't visited");
    });
  });

  describe('getPatientStats', () => {
    it('should calculate patient statistics', () => {
      // Create patients with different characteristics
      const patient1 = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { ...mockPatientData.personalInfo, name: 'Patient 1', gender: 'male' }
      });

      const patient2 = PatientManager.addPatient({
        ...mockPatientData,
        personalInfo: { 
          ...mockPatientData.personalInfo, 
          name: 'Patient 2', 
          gender: 'female',
          dateOfBirth: '2000-01-01' // ~24 years old
        },
        medicalInfo: {
          ...mockPatientData.medicalInfo,
          allergies: [],
          insuranceInfo: {
            provider: 'Test Insurance',
            policyNumber: 'POL123',
            isActive: true
          }
        }
      });

      // Record visit for one patient
      PatientManager.recordPatientVisit(patient1.id);

      const stats = PatientManager.getPatientStats();

      expect(stats.total).toBe(2);
      expect(stats.active).toBe(2);
      expect(stats.withAllergies).toBe(1);
      expect(stats.withSevereAllergies).toBe(1);
      expect(stats.withInsurance).toBe(1);
      expect(stats.byGender.male).toBe(1);
      expect(stats.byGender.female).toBe(1);
      expect(stats.byAgeGroup['18-34']).toBe(1);
      expect(stats.byAgeGroup['35-54']).toBe(1);
    });
  });

  describe('deletePatient', () => {
    it('should delete patient and resolve alerts', () => {
      const patient = PatientManager.addPatient(mockPatientData);
      
      // Verify patient exists
      expect(PatientManager.getPatients()).toHaveLength(1);
      
      // Verify allergy alert exists
      let alerts = PatientManager.getPatientAlerts();
      expect(alerts.some(alert => alert.patientId === patient.id)).toBe(true);

      const result = PatientManager.deletePatient(patient.id);
      expect(result).toBe(true);

      // Verify patient is deleted
      expect(PatientManager.getPatients()).toHaveLength(0);

      // Verify alerts are resolved
      alerts = PatientManager.getPatientAlerts();
      const patientAlerts = alerts.filter(alert => alert.patientId === patient.id);
      expect(patientAlerts.every(alert => alert.isResolved)).toBe(true);
    });

    it('should return false for non-existent patient', () => {
      const result = PatientManager.deletePatient('non-existent-id');
      expect(result).toBe(false);
    });
  });
});