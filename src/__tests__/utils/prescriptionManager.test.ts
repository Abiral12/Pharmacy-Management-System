// Unit Tests for Prescription Manager

import { PrescriptionManager, Prescription, Medication, PrescriptionStatus } from '../../utils/prescriptionManager';

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

describe('PrescriptionManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockMedications: Medication[] = [
    {
      id: 'med1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      quantity: 30,
      unit: 'tablets',
      instructions: 'Take with food',
      isControlled: false
    }
  ];

  const mockPrescriptionData = {
    patientInfo: {
      patientId: 'pat123',
      patientName: 'John Doe',
      patientPhone: '+1234567890',
      patientEmail: 'john@example.com'
    },
    prescriptionDetails: {
      doctorName: 'Dr. Jane Smith',
      doctorLicense: 'MD12345',
      medications: mockMedications,
      instructions: 'Take as directed',
      notes: 'Patient has no known allergies'
    },
    priority: 'medium' as const,
    isInsurance: false,
    createdBy: 'TestUser'
  };

  describe('createPrescription', () => {
    it('should create a new prescription successfully', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);

      expect(prescription).toBeDefined();
      expect(prescription.id).toMatch(/^rx_/);
      expect(prescription.patientInfo.patientName).toBe('John Doe');
      expect(prescription.prescriptionDetails.doctorName).toBe('Dr. Jane Smith');
      expect(prescription.prescriptionDetails.medications).toHaveLength(1);
      expect(prescription.status).toBe('pending');
      expect(prescription.validation.isValidated).toBe(false);
      expect(prescription.metadata.createdBy).toBe('TestUser');
      expect(prescription.metadata.priority).toBe('medium');
      expect(prescription.metadata.totalItems).toBe(1);
    });

    it('should generate unique prescription numbers', () => {
      const prescription1 = PrescriptionManager.createPrescription(mockPrescriptionData);
      const prescription2 = PrescriptionManager.createPrescription(mockPrescriptionData);

      expect(prescription1.prescriptionDetails.prescriptionNumber).toBeDefined();
      expect(prescription2.prescriptionDetails.prescriptionNumber).toBeDefined();
      expect(prescription1.prescriptionDetails.prescriptionNumber)
        .not.toBe(prescription2.prescriptionDetails.prescriptionNumber);
    });

    it('should set due date to 7 days from creation', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      const createdDate = new Date(prescription.timestamps.dateCreated);
      const dueDate = new Date(prescription.timestamps.dateDue!);
      const daysDifference = Math.floor((dueDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(daysDifference).toBe(7);
    });

    it('should detect drug interactions', () => {
      const medicationsWithInteraction: Medication[] = [
        {
          id: 'med1',
          name: 'Warfarin',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unit: 'tablets',
          instructions: 'Take as directed',
          isControlled: false
        },
        {
          id: 'med2',
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unit: 'tablets',
          instructions: 'Take with food',
          isControlled: false
        }
      ];

      const prescriptionData = {
        ...mockPrescriptionData,
        prescriptionDetails: {
          ...mockPrescriptionData.prescriptionDetails,
          medications: medicationsWithInteraction
        }
      };

      const prescription = PrescriptionManager.createPrescription(prescriptionData);

      expect(prescription.validation.drugInteractions).toHaveLength(1);
      expect(prescription.validation.drugInteractions![0].severity).toBe('major');
      expect(prescription.validation.drugInteractions![0].drug1).toBe('Warfarin');
      expect(prescription.validation.drugInteractions![0].drug2).toBe('Aspirin');
    });

    it('should create alerts for controlled substances', () => {
      const controlledMedications: Medication[] = [
        {
          id: 'med1',
          name: 'Oxycodone',
          dosage: '5mg',
          frequency: 'Every 6 hours',
          duration: '7 days',
          quantity: 28,
          unit: 'tablets',
          instructions: 'Take for pain as needed',
          isControlled: true
        }
      ];

      const prescriptionData = {
        ...mockPrescriptionData,
        prescriptionDetails: {
          ...mockPrescriptionData.prescriptionDetails,
          medications: controlledMedications
        }
      };

      PrescriptionManager.createPrescription(prescriptionData);

      const alerts = PrescriptionManager.getPrescriptionAlerts();
      const controlledAlert = alerts.find(alert => alert.type === 'controlled_substance');
      
      expect(controlledAlert).toBeDefined();
      expect(controlledAlert!.severity).toBe('medium');
      expect(controlledAlert!.message).toContain('controlled substance');
    });
  });

  describe('updatePrescriptionStatus', () => {
    it('should update prescription status successfully', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      const result = PrescriptionManager.updatePrescriptionStatus(
        prescription.id,
        'processing',
        'PharmacistUser',
        'Started processing'
      );

      expect(result).toBe(true);

      const prescriptions = PrescriptionManager.getPrescriptions();
      const updatedPrescription = prescriptions.find(p => p.id === prescription.id);
      
      expect(updatedPrescription!.status).toBe('processing');
      expect(updatedPrescription!.metadata.lastModifiedBy).toBe('PharmacistUser');
      expect(updatedPrescription!.timestamps.dateProcessed).toBeDefined();
      expect(updatedPrescription!.prescriptionDetails.notes).toContain('Started processing');
    });

    it('should create ready notification when status changes to ready', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      PrescriptionManager.updatePrescriptionStatus(prescription.id, 'ready', 'PharmacistUser');

      const alerts = PrescriptionManager.getPrescriptionAlerts();
      const readyAlert = alerts.find(alert => alert.type === 'ready_for_pickup');
      
      expect(readyAlert).toBeDefined();
      expect(readyAlert!.severity).toBe('medium');
      expect(readyAlert!.message).toContain('ready for pickup');
    });

    it('should resolve alerts when prescription is dispensed', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      // First set to ready to create alert
      PrescriptionManager.updatePrescriptionStatus(prescription.id, 'ready', 'PharmacistUser');
      
      let alerts = PrescriptionManager.getPrescriptionAlerts();
      expect(alerts.some(alert => alert.type === 'ready_for_pickup' && !alert.isResolved)).toBe(true);
      
      // Then dispense
      PrescriptionManager.updatePrescriptionStatus(prescription.id, 'dispensed', 'PharmacistUser');
      
      alerts = PrescriptionManager.getPrescriptionAlerts();
      const readyAlert = alerts.find(alert => alert.type === 'ready_for_pickup');
      expect(readyAlert?.isResolved).toBe(true);
    });

    it('should return false for non-existent prescription', () => {
      const result = PrescriptionManager.updatePrescriptionStatus(
        'non-existent-id',
        'processing',
        'PharmacistUser'
      );

      expect(result).toBe(false);
    });
  });

  describe('validatePrescription', () => {
    it('should validate prescription successfully', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      const result = PrescriptionManager.validatePrescription(
        prescription.id,
        'ValidatorUser',
        'All checks passed'
      );

      expect(result).toBe(true);

      const prescriptions = PrescriptionManager.getPrescriptions();
      const validatedPrescription = prescriptions.find(p => p.id === prescription.id);
      
      expect(validatedPrescription!.validation.isValidated).toBe(true);
      expect(validatedPrescription!.validation.validatedBy).toBe('ValidatorUser');
      expect(validatedPrescription!.validation.validationNotes).toBe('All checks passed');
    });

    it('should return false for non-existent prescription', () => {
      const result = PrescriptionManager.validatePrescription(
        'non-existent-id',
        'ValidatorUser'
      );

      expect(result).toBe(false);
    });
  });

  describe('checkDrugInteractions', () => {
    it('should detect known drug interactions', () => {
      const medications: Medication[] = [
        {
          id: 'med1',
          name: 'Warfarin',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unit: 'tablets',
          instructions: 'Take as directed',
          isControlled: false
        },
        {
          id: 'med2',
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unit: 'tablets',
          instructions: 'Take with food',
          isControlled: false
        }
      ];

      const interactions = PrescriptionManager.checkDrugInteractions(medications);

      expect(interactions).toHaveLength(1);
      expect(interactions[0].severity).toBe('major');
      expect(interactions[0].description).toContain('bleeding');
    });

    it('should return empty array for no interactions', () => {
      const medications: Medication[] = [
        {
          id: 'med1',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unit: 'tablets',
          instructions: 'Take as directed',
          isControlled: false
        }
      ];

      const interactions = PrescriptionManager.checkDrugInteractions(medications);
      expect(interactions).toHaveLength(0);
    });
  });

  describe('getPrescriptionsByStatus', () => {
    it('should filter prescriptions by status', () => {
      const prescription1 = PrescriptionManager.createPrescription(mockPrescriptionData);
      const prescription2 = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      PrescriptionManager.updatePrescriptionStatus(prescription2.id, 'processing', 'TestUser');

      const pendingPrescriptions = PrescriptionManager.getPrescriptionsByStatus('pending');
      const processingPrescriptions = PrescriptionManager.getPrescriptionsByStatus('processing');

      expect(pendingPrescriptions).toHaveLength(1);
      expect(processingPrescriptions).toHaveLength(1);
      expect(pendingPrescriptions[0].id).toBe(prescription1.id);
      expect(processingPrescriptions[0].id).toBe(prescription2.id);
    });
  });

  describe('getOverduePrescriptions', () => {
    it('should identify overdue prescriptions', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      // Set to ready and backdate the ready timestamp
      PrescriptionManager.updatePrescriptionStatus(prescription.id, 'ready', 'TestUser');
      
      // Manually set ready date to 4 days ago
      const prescriptions = PrescriptionManager.getPrescriptions();
      const updatedPrescription = prescriptions.find(p => p.id === prescription.id)!;
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      updatedPrescription.timestamps.dateReady = fourDaysAgo.toISOString();
      
      // Save the modified prescription back
      localStorage.setItem('pharmacy_prescriptions', JSON.stringify(prescriptions));

      const overduePrescriptions = PrescriptionManager.getOverduePrescriptions();
      expect(overduePrescriptions).toHaveLength(1);
      expect(overduePrescriptions[0].id).toBe(prescription.id);
    });
  });

  describe('searchPrescriptions', () => {
    it('should search prescriptions by patient name', () => {
      const prescription1 = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        patientInfo: { ...mockPrescriptionData.patientInfo, patientName: 'John Doe' }
      });
      
      const prescription2 = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        patientInfo: { ...mockPrescriptionData.patientInfo, patientName: 'Jane Smith' }
      });

      const results = PrescriptionManager.searchPrescriptions('john');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(prescription1.id);
    });

    it('should search prescriptions by doctor name', () => {
      const prescription = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        prescriptionDetails: {
          ...mockPrescriptionData.prescriptionDetails,
          doctorName: 'Dr. Special Name'
        }
      });

      const results = PrescriptionManager.searchPrescriptions('special');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(prescription.id);
    });

    it('should search prescriptions by medication name', () => {
      const prescription = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        prescriptionDetails: {
          ...mockPrescriptionData.prescriptionDetails,
          medications: [{
            ...mockMedications[0],
            name: 'Unique Medicine Name'
          }]
        }
      });

      const results = PrescriptionManager.searchPrescriptions('unique');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(prescription.id);
    });
  });

  describe('getPrescriptionStats', () => {
    it('should calculate prescription statistics', () => {
      // Create prescriptions with different statuses and priorities
      const prescription1 = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        priority: 'high'
      });
      
      const prescription2 = PrescriptionManager.createPrescription({
        ...mockPrescriptionData,
        priority: 'urgent'
      });

      PrescriptionManager.updatePrescriptionStatus(prescription1.id, 'ready', 'TestUser');
      PrescriptionManager.updatePrescriptionStatus(prescription2.id, 'dispensed', 'TestUser');

      const stats = PrescriptionManager.getPrescriptionStats();

      expect(stats.total).toBe(2);
      expect(stats.byStatus.pending).toBe(0);
      expect(stats.byStatus.ready).toBe(1);
      expect(stats.byStatus.dispensed).toBe(1);
      expect(stats.byPriority.high).toBe(1);
      expect(stats.byPriority.urgent).toBe(1);
      expect(stats.readyCount).toBe(1);
    });
  });

  describe('performAutomatedMonitoring', () => {
    it('should create overdue alerts for old ready prescriptions', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      // Set to ready
      PrescriptionManager.updatePrescriptionStatus(prescription.id, 'ready', 'TestUser');
      
      // Manually backdate the ready timestamp to 4 days ago
      const prescriptions = PrescriptionManager.getPrescriptions();
      const updatedPrescription = prescriptions.find(p => p.id === prescription.id)!;
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      updatedPrescription.timestamps.dateReady = fourDaysAgo.toISOString();
      localStorage.setItem('pharmacy_prescriptions', JSON.stringify(prescriptions));

      // Run monitoring
      PrescriptionManager.performAutomatedMonitoring();

      const alerts = PrescriptionManager.getPrescriptionAlerts();
      const overdueAlert = alerts.find(alert => alert.type === 'overdue');
      
      expect(overdueAlert).toBeDefined();
      expect(overdueAlert!.severity).toBe('medium');
      expect(overdueAlert!.message).toContain('4 days');
    });

    it('should expire old prescriptions', () => {
      const prescription = PrescriptionManager.createPrescription(mockPrescriptionData);
      
      // Manually set due date to past
      const prescriptions = PrescriptionManager.getPrescriptions();
      const updatedPrescription = prescriptions.find(p => p.id === prescription.id)!;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      updatedPrescription.timestamps.dateDue = yesterday.toISOString();
      localStorage.setItem('pharmacy_prescriptions', JSON.stringify(prescriptions));

      // Run monitoring
      PrescriptionManager.performAutomatedMonitoring();

      const updatedPrescriptions = PrescriptionManager.getPrescriptions();
      const expiredPrescription = updatedPrescriptions.find(p => p.id === prescription.id);
      
      expect(expiredPrescription!.status).toBe('expired');
    });
  });
});