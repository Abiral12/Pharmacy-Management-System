// Enhanced Patient Management with Notification Integration

import { NotificationManager } from './notificationManager';

export interface Patient {
  id: string;
  personalInfo: {
    name: string;
    age: number;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
    address: string;
  };
  medicalInfo: {
    allergies: Allergy[];
    medicalHistory: string;
    emergencyContact: EmergencyContact;
    insuranceInfo?: InsuranceInfo;
    chronicConditions?: string[];
    currentMedications?: string[];
  };
  metadata: {
    dateAdded: string;
    lastUpdated: string;
    createdBy: string;
    lastModifiedBy?: string;
    visitCount: number;
    lastVisit?: string;
    isActive: boolean;
  };
  preferences: {
    preferredContactMethod: 'phone' | 'email' | 'sms';
    languagePreference?: string;
    specialInstructions?: string;
  };
}

export interface Allergy {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  notes?: string;
  dateReported: string;
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
  expiryDate?: string;
  isActive: boolean;
}

export interface PatientAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'allergy_alert' | 'insurance_expiry' | 'medication_review' | 'birthday' | 'inactive_patient' | 'emergency_contact_update';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  dateCreated: string;
  isRead: boolean;
  isResolved: boolean;
  actionRequired?: string;
  metadata?: Record<string, any>;
}

export class PatientManager {
  private static STORAGE_KEY = 'pharmacy_patients';
  private static ALERTS_KEY = 'pharmacy_patient_alerts';

  // Get all patients
  static getPatients(): Patient[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save patients
  private static savePatients(patients: Patient[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
  }

  // Add new patient
  static addPatient(patientData: {
    personalInfo: Omit<Patient['personalInfo'], 'age'> & { age?: number };
    medicalInfo: Omit<Patient['medicalInfo'], 'emergencyContact'> & { emergencyContact?: EmergencyContact };
    preferences?: Partial<Patient['preferences']>;
    createdBy: string;
  }): Patient {
    const patients = this.getPatients();
    
    // Calculate age from date of birth if not provided
    const age = patientData.personalInfo.age || this.calculateAge(patientData.personalInfo.dateOfBirth);
    
    const newPatient: Patient = {
      id: `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      personalInfo: {
        ...patientData.personalInfo,
        age
      },
      medicalInfo: {
        allergies: patientData.medicalInfo.allergies || [],
        medicalHistory: patientData.medicalInfo.medicalHistory || '',
        emergencyContact: patientData.medicalInfo.emergencyContact || {
          name: '',
          relationship: '',
          phone: ''
        },
        insuranceInfo: patientData.medicalInfo.insuranceInfo,
        chronicConditions: patientData.medicalInfo.chronicConditions || [],
        currentMedications: patientData.medicalInfo.currentMedications || []
      },
      metadata: {
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        createdBy: patientData.createdBy,
        visitCount: 0,
        isActive: true
      },
      preferences: {
        preferredContactMethod: 'phone',
        ...patientData.preferences
      }
    };

    patients.push(newPatient);
    this.savePatients(patients);

    // Create registration notification
    NotificationManager.notifyPatientRegistered(newPatient.personalInfo.name);

    // Check for allergy alerts
    if (newPatient.medicalInfo.allergies.length > 0) {
      newPatient.medicalInfo.allergies.forEach(allergy => {
        if (allergy.severity === 'severe') {
          this.createPatientAlert({
            patientId: newPatient.id,
            patientName: newPatient.personalInfo.name,
            type: 'allergy_alert',
            severity: 'high',
            message: `Patient has severe allergy to ${allergy.name}`,
            actionRequired: 'Always check medications against allergies',
            metadata: { allergy }
          });

          // Trigger notification
          NotificationManager.notifyAllergyAlert(
            newPatient.personalInfo.name,
            allergy.name
          );
        }
      });
    }

    // Check insurance expiry
    if (newPatient.medicalInfo.insuranceInfo?.expiryDate) {
      this.checkInsuranceExpiry(newPatient);
    }

    return newPatient;
  }

  // Update patient
  static updatePatient(
    patientId: string,
    updates: Partial<Patient>,
    modifiedBy: string
  ): Patient | null {
    const patients = this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) return null;

    const existingPatient = patients[patientIndex];
    const updatedPatient: Patient = {
      ...existingPatient,
      ...updates,
      metadata: {
        ...existingPatient.metadata,
        ...updates.metadata,
        lastUpdated: new Date().toISOString(),
        lastModifiedBy: modifiedBy
      }
    };

    // Check for new allergies
    if (updates.medicalInfo?.allergies) {
      const newAllergies = updates.medicalInfo.allergies.filter(newAllergy =>
        !existingPatient.medicalInfo.allergies.some(existing => 
          existing.name.toLowerCase() === newAllergy.name.toLowerCase()
        )
      );

      newAllergies.forEach(allergy => {
        if (allergy.severity === 'severe') {
          this.createPatientAlert({
            patientId: updatedPatient.id,
            patientName: updatedPatient.personalInfo.name,
            type: 'allergy_alert',
            severity: 'high',
            message: `New severe allergy added: ${allergy.name}`,
            actionRequired: 'Update all prescriptions and verify compatibility',
            metadata: { allergy, isNew: true }
          });

          // Trigger notification
          NotificationManager.notifyAllergyAlert(
            updatedPatient.personalInfo.name,
            allergy.name
          );
        }
      });
    }

    // Check insurance updates
    if (updates.medicalInfo?.insuranceInfo) {
      this.checkInsuranceExpiry(updatedPatient);
    }

    patients[patientIndex] = updatedPatient;
    this.savePatients(patients);

    return updatedPatient;
  }

  // Get patient by ID
  static getPatientById(patientId: string): Patient | null {
    const patients = this.getPatients();
    return patients.find(p => p.id === patientId) || null;
  }

  // Search patients
  static searchPatients(query: string): Patient[] {
    const patients = this.getPatients();
    const lowerQuery = query.toLowerCase();
    
    return patients.filter(patient => 
      patient.personalInfo.name.toLowerCase().includes(lowerQuery) ||
      patient.personalInfo.phone.includes(query) ||
      patient.personalInfo.email?.toLowerCase().includes(lowerQuery) ||
      patient.id.toLowerCase().includes(lowerQuery)
    );
  }

  // Get patients with allergies
  static getPatientsWithAllergies(): Patient[] {
    return this.getPatients().filter(patient => 
      patient.medicalInfo.allergies.length > 0
    );
  }

  // Get patients with severe allergies
  static getPatientsWithSevereAllergies(): Patient[] {
    return this.getPatients().filter(patient => 
      patient.medicalInfo.allergies.some(allergy => allergy.severity === 'severe')
    );
  }

  // Get patients by age range
  static getPatientsByAgeRange(minAge: number, maxAge: number): Patient[] {
    return this.getPatients().filter(patient => 
      patient.personalInfo.age >= minAge && patient.personalInfo.age <= maxAge
    );
  }

  // Get inactive patients
  static getInactivePatients(monthsThreshold: number = 12): Patient[] {
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - monthsThreshold);
    
    return this.getPatients().filter(patient => {
      if (!patient.metadata.lastVisit) return true;
      const lastVisit = new Date(patient.metadata.lastVisit);
      return lastVisit < thresholdDate;
    });
  }

  // Record patient visit
  static recordPatientVisit(patientId: string): boolean {
    const patients = this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) return false;

    const patient = patients[patientIndex];
    patient.metadata.visitCount++;
    patient.metadata.lastVisit = new Date().toISOString();
    patient.metadata.lastUpdated = new Date().toISOString();
    patient.metadata.isActive = true;

    patients[patientIndex] = patient;
    this.savePatients(patients);

    return true;
  }

  // Check for allergy conflicts with medications
  static checkAllergyConflicts(patientId: string, medications: string[]): {
    hasConflicts: boolean;
    conflicts: Array<{
      medication: string;
      allergy: Allergy;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
    }>;
  } {
    const patient = this.getPatientById(patientId);
    if (!patient) return { hasConflicts: false, conflicts: [] };

    const conflicts: Array<{
      medication: string;
      allergy: Allergy;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
    }> = [];

    patient.medicalInfo.allergies.forEach(allergy => {
      medications.forEach(medication => {
        // Simple string matching - in real app would use comprehensive drug database
        if (medication.toLowerCase().includes(allergy.name.toLowerCase()) ||
            allergy.name.toLowerCase().includes(medication.toLowerCase())) {
          
          const riskLevel = allergy.severity === 'severe' ? 'critical' :
                           allergy.severity === 'moderate' ? 'high' : 'medium';
          
          conflicts.push({
            medication,
            allergy,
            riskLevel
          });

          // Create alert for critical conflicts
          if (riskLevel === 'critical') {
            this.createPatientAlert({
              patientId: patient.id,
              patientName: patient.personalInfo.name,
              type: 'allergy_alert',
              severity: 'critical',
              message: `CRITICAL: Patient allergic to ${allergy.name}, prescribed ${medication}`,
              actionRequired: 'DO NOT DISPENSE - Contact prescriber immediately',
              metadata: { medication, allergy, riskLevel }
            });

            // Trigger notification
            NotificationManager.notifyAllergyAlert(
              patient.personalInfo.name,
              `${allergy.name} (prescribed ${medication})`
            );
          }
        }
      });
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }

  // Calculate age from date of birth
  private static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Check insurance expiry
  private static checkInsuranceExpiry(patient: Patient): void {
    if (!patient.medicalInfo.insuranceInfo?.expiryDate) return;

    const expiryDate = new Date(patient.medicalInfo.insuranceInfo.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      // Check if alert already exists
      const existingAlert = this.getPatientAlerts().find(alert =>
        alert.patientId === patient.id &&
        alert.type === 'insurance_expiry' &&
        !alert.isResolved
      );

      if (!existingAlert) {
        this.createPatientAlert({
          patientId: patient.id,
          patientName: patient.personalInfo.name,
          type: 'insurance_expiry',
          severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
          message: `Insurance expires in ${daysUntilExpiry} days`,
          actionRequired: 'Contact patient to update insurance information',
          metadata: {
            expiryDate: patient.medicalInfo.insuranceInfo.expiryDate,
            daysUntilExpiry,
            provider: patient.medicalInfo.insuranceInfo.provider
          }
        });
      }
    } else if (daysUntilExpiry <= 0) {
      // Insurance has expired
      this.createPatientAlert({
        patientId: patient.id,
        patientName: patient.personalInfo.name,
        type: 'insurance_expiry',
        severity: 'high',
        message: 'Insurance has expired',
        actionRequired: 'Update insurance information before dispensing',
        metadata: {
          expiryDate: patient.medicalInfo.insuranceInfo.expiryDate,
          daysExpired: Math.abs(daysUntilExpiry),
          provider: patient.medicalInfo.insuranceInfo.provider
        }
      });
    }
  }

  // Patient alerts management
  private static createPatientAlert(alertData: {
    patientId: string;
    patientName: string;
    type: PatientAlert['type'];
    severity: PatientAlert['severity'];
    message: string;
    actionRequired?: string;
    metadata?: Record<string, any>;
  }): void {
    const alerts = this.getPatientAlerts();
    
    const newAlert: PatientAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      dateCreated: new Date().toISOString(),
      isRead: false,
      isResolved: false
    };
    
    alerts.push(newAlert);
    this.savePatientAlerts(alerts);
  }

  // Get patient alerts
  static getPatientAlerts(): PatientAlert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save patient alerts
  private static savePatientAlerts(alerts: PatientAlert[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }

  // Get active patient alerts
  static getActivePatientAlerts(): PatientAlert[] {
    return this.getPatientAlerts().filter(alert => !alert.isResolved && !alert.isRead);
  }

  // Get alerts for specific patient
  static getAlertsForPatient(patientId: string): PatientAlert[] {
    return this.getPatientAlerts().filter(alert => alert.patientId === patientId);
  }

  // Mark patient alert as read
  static markPatientAlertAsRead(alertId: string): void {
    const alerts = this.getPatientAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isRead = true;
      this.savePatientAlerts(alerts);
    }
  }

  // Resolve patient alert
  static resolvePatientAlert(alertId: string): void {
    const alerts = this.getPatientAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isResolved = true;
      this.savePatientAlerts(alerts);
    }
  }

  // Automated monitoring for patients
  static performAutomatedMonitoring(): void {
    const patients = this.getPatients();
    const today = new Date();

    patients.forEach(patient => {
      // Check for birthdays (for birthday greetings/medication reviews)
      const birthday = new Date(patient.personalInfo.dateOfBirth);
      birthday.setFullYear(today.getFullYear());
      
      if (birthday.toDateString() === today.toDateString()) {
        const existingAlert = this.getPatientAlerts().find(alert =>
          alert.patientId === patient.id &&
          alert.type === 'birthday' &&
          alert.dateCreated.startsWith(today.toISOString().split('T')[0])
        );

        if (!existingAlert) {
          this.createPatientAlert({
            patientId: patient.id,
            patientName: patient.personalInfo.name,
            type: 'birthday',
            severity: 'low',
            message: `Today is ${patient.personalInfo.name}'s birthday`,
            actionRequired: 'Consider sending birthday wishes and medication review reminder',
            metadata: { age: patient.personalInfo.age + 1 }
          });
        }
      }

      // Check for inactive patients
      if (patient.metadata.lastVisit) {
        const lastVisit = new Date(patient.metadata.lastVisit);
        const monthsSinceVisit = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30));
        
        if (monthsSinceVisit >= 12 && patient.metadata.isActive) {
          const existingAlert = this.getPatientAlerts().find(alert =>
            alert.patientId === patient.id &&
            alert.type === 'inactive_patient' &&
            !alert.isResolved
          );

          if (!existingAlert) {
            this.createPatientAlert({
              patientId: patient.id,
              patientName: patient.personalInfo.name,
              type: 'inactive_patient',
              severity: 'low',
              message: `Patient hasn't visited in ${monthsSinceVisit} months`,
              actionRequired: 'Consider reaching out for wellness check',
              metadata: { monthsSinceVisit, lastVisit: patient.metadata.lastVisit }
            });
          }
        }
      }

      // Check insurance expiry
      if (patient.medicalInfo.insuranceInfo?.expiryDate) {
        this.checkInsuranceExpiry(patient);
      }
    });
  }

  // Get patient statistics
  static getPatientStats(): {
    total: number;
    active: number;
    inactive: number;
    withAllergies: number;
    withSevereAllergies: number;
    withInsurance: number;
    byAgeGroup: Record<string, number>;
    byGender: Record<string, number>;
    averageAge: number;
    recentRegistrations: number; // Last 30 days
  } {
    const patients = this.getPatients();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = {
      total: patients.length,
      active: 0,
      inactive: 0,
      withAllergies: 0,
      withSevereAllergies: 0,
      withInsurance: 0,
      byAgeGroup: {
        '0-17': 0,
        '18-34': 0,
        '35-54': 0,
        '55-74': 0,
        '75+': 0
      },
      byGender: {
        male: 0,
        female: 0,
        other: 0
      },
      averageAge: 0,
      recentRegistrations: 0
    };

    let totalAge = 0;

    patients.forEach(patient => {
      // Active/Inactive
      if (patient.metadata.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      // Allergies
      if (patient.medicalInfo.allergies.length > 0) {
        stats.withAllergies++;
        if (patient.medicalInfo.allergies.some(a => a.severity === 'severe')) {
          stats.withSevereAllergies++;
        }
      }

      // Insurance
      if (patient.medicalInfo.insuranceInfo) {
        stats.withInsurance++;
      }

      // Age groups
      const age = patient.personalInfo.age;
      totalAge += age;
      
      if (age <= 17) stats.byAgeGroup['0-17']++;
      else if (age <= 34) stats.byAgeGroup['18-34']++;
      else if (age <= 54) stats.byAgeGroup['35-54']++;
      else if (age <= 74) stats.byAgeGroup['55-74']++;
      else stats.byAgeGroup['75+']++;

      // Gender
      stats.byGender[patient.personalInfo.gender]++;

      // Recent registrations
      const registrationDate = new Date(patient.metadata.dateAdded);
      if (registrationDate > thirtyDaysAgo) {
        stats.recentRegistrations++;
      }
    });

    stats.averageAge = patients.length > 0 ? Math.round(totalAge / patients.length) : 0;

    return stats;
  }

  // Delete patient (move to recycle bin)
  static deletePatient(patientId: string): boolean {
    const patients = this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) return false;

    // In a real implementation, this would move to recycle bin
    patients.splice(patientIndex, 1);
    this.savePatients(patients);

    // Resolve all alerts for this patient
    const alerts = this.getPatientAlerts();
    const updatedAlerts = alerts.map(alert => {
      if (alert.patientId === patientId) {
        return { ...alert, isResolved: true };
      }
      return alert;
    });
    this.savePatientAlerts(updatedAlerts);

    return true;
  }
}