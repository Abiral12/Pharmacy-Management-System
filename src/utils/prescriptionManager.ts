// Enhanced Prescription Management with Notification Integration

import { NotificationManager } from './notificationManager';

export interface Prescription {
  id: string;
  patientInfo: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
  };
  prescriptionDetails: {
    doctorName: string;
    doctorLicense: string;
    medications: Medication[];
    instructions: string;
    notes?: string;
    prescriptionNumber: string;
  };
  status: PrescriptionStatus;
  timestamps: {
    dateCreated: string;
    dateProcessed?: string;
    dateReady?: string;
    dateDispensed?: string;
    dateDue?: string;
  };
  validation: {
    isValidated: boolean;
    validatedBy?: string;
    validationNotes?: string;
    drugInteractions?: DrugInteraction[];
  };
  metadata: {
    createdBy: string;
    lastModifiedBy?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    isInsurance: boolean;
    totalItems: number;
  };
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  instructions: string;
  isControlled: boolean;
  ndc?: string; // National Drug Code
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  recommendation: string;
  source: string;
}

export type PrescriptionStatus = 
  | 'pending'      // Just received, needs processing
  | 'processing'   // Being prepared
  | 'ready'        // Ready for pickup
  | 'dispensed'    // Given to patient
  | 'cancelled'    // Cancelled
  | 'returned'     // Returned to stock
  | 'expired'      // Prescription expired
  | 'on_hold';     // On hold for various reasons

export interface PrescriptionAlert {
  id: string;
  prescriptionId: string;
  patientName: string;
  type: 'ready_for_pickup' | 'overdue' | 'drug_interaction' | 'allergy_alert' | 'controlled_substance' | 'insurance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  dateCreated: string;
  isRead: boolean;
  isResolved: boolean;
  actionRequired?: string;
  metadata?: Record<string, any>;
}

export class PrescriptionManager {
  private static STORAGE_KEY = 'pharmacy_prescriptions';
  private static ALERTS_KEY = 'pharmacy_prescription_alerts';
  private static INTERACTIONS_KEY = 'pharmacy_drug_interactions';

  // Drug interaction database (simplified - in real app would be comprehensive)
  private static drugInteractions: DrugInteraction[] = [
    {
      id: 'int_001',
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'major',
      description: 'Increased risk of bleeding',
      clinicalEffect: 'Enhanced anticoagulant effect leading to increased bleeding risk',
      recommendation: 'Monitor INR closely, consider alternative therapy',
      source: 'FDA Drug Interaction Database'
    },
    {
      id: 'int_002',
      drug1: 'Metformin',
      drug2: 'Alcohol',
      severity: 'moderate',
      description: 'Increased risk of lactic acidosis',
      clinicalEffect: 'Alcohol may increase the risk of lactic acidosis',
      recommendation: 'Advise patient to limit alcohol consumption',
      source: 'Clinical Pharmacology Database'
    },
    {
      id: 'int_003',
      drug1: 'Simvastatin',
      drug2: 'Grapefruit',
      severity: 'major',
      description: 'Increased statin levels and toxicity risk',
      clinicalEffect: 'Grapefruit inhibits CYP3A4, increasing simvastatin levels',
      recommendation: 'Avoid grapefruit products or consider alternative statin',
      source: 'Drug Interaction Checker'
    }
  ];

  // Get all prescriptions
  static getPrescriptions(): Prescription[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save prescriptions
  private static savePrescriptions(prescriptions: Prescription[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prescriptions));
  }

  // Create new prescription
  static createPrescription(prescriptionData: {
    patientInfo: Prescription['patientInfo'];
    prescriptionDetails: Omit<Prescription['prescriptionDetails'], 'prescriptionNumber'>;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    isInsurance?: boolean;
    createdBy: string;
  }): Prescription {
    const prescriptions = this.getPrescriptions();
    
    const newPrescription: Prescription = {
      id: `rx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientInfo: prescriptionData.patientInfo,
      prescriptionDetails: {
        ...prescriptionData.prescriptionDetails,
        prescriptionNumber: this.generatePrescriptionNumber()
      },
      status: 'pending',
      timestamps: {
        dateCreated: new Date().toISOString(),
        dateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Due in 7 days
      },
      validation: {
        isValidated: false,
        drugInteractions: []
      },
      metadata: {
        createdBy: prescriptionData.createdBy,
        priority: prescriptionData.priority || 'medium',
        isInsurance: prescriptionData.isInsurance || false,
        totalItems: prescriptionData.prescriptionDetails.medications.length
      }
    };

    // Check for drug interactions
    const interactions = this.checkDrugInteractions(prescriptionData.prescriptionDetails.medications);
    if (interactions.length > 0) {
      newPrescription.validation.drugInteractions = interactions;
      
      // Create alerts for significant interactions
      interactions.forEach(interaction => {
        if (interaction.severity === 'major' || interaction.severity === 'contraindicated') {
          this.createPrescriptionAlert({
            prescriptionId: newPrescription.id,
            patientName: newPrescription.patientInfo.patientName,
            type: 'drug_interaction',
            severity: interaction.severity === 'contraindicated' ? 'critical' : 'high',
            message: `Drug interaction detected: ${interaction.drug1} and ${interaction.drug2}`,
            actionRequired: 'Review interaction and consult prescriber if necessary',
            metadata: { interaction }
          });

          // Trigger notification
          NotificationManager.notifyDrugInteraction(interaction.drug1, interaction.drug2);
        }
      });
    }

    // Check for controlled substances
    const controlledMeds = prescriptionData.prescriptionDetails.medications.filter(med => med.isControlled);
    if (controlledMeds.length > 0) {
      this.createPrescriptionAlert({
        prescriptionId: newPrescription.id,
        patientName: newPrescription.patientInfo.patientName,
        type: 'controlled_substance',
        severity: 'medium',
        message: `Prescription contains ${controlledMeds.length} controlled substance(s)`,
        actionRequired: 'Verify patient ID and maintain proper documentation',
        metadata: { controlledMedications: controlledMeds }
      });
    }

    prescriptions.push(newPrescription);
    this.savePrescriptions(prescriptions);

    return newPrescription;
  }

  // Update prescription status
  static updatePrescriptionStatus(
    prescriptionId: string, 
    newStatus: PrescriptionStatus, 
    updatedBy: string,
    notes?: string
  ): boolean {
    const prescriptions = this.getPrescriptions();
    const prescriptionIndex = prescriptions.findIndex(p => p.id === prescriptionId);
    
    if (prescriptionIndex === -1) return false;

    const prescription = prescriptions[prescriptionIndex];
    const oldStatus = prescription.status;
    
    prescription.status = newStatus;
    prescription.metadata.lastModifiedBy = updatedBy;

    // Update timestamps based on status
    const now = new Date().toISOString();
    switch (newStatus) {
      case 'processing':
        prescription.timestamps.dateProcessed = now;
        break;
      case 'ready':
        prescription.timestamps.dateReady = now;
        // Notify patient that prescription is ready
        this.createPrescriptionAlert({
          prescriptionId: prescription.id,
          patientName: prescription.patientInfo.patientName,
          type: 'ready_for_pickup',
          severity: 'medium',
          message: `Prescription is ready for pickup`,
          actionRequired: 'Contact patient for pickup',
          metadata: { 
            patientPhone: prescription.patientInfo.patientPhone,
            patientEmail: prescription.patientInfo.patientEmail,
            medications: prescription.prescriptionDetails.medications.map(m => m.name)
          }
        });
        
        // Trigger notification
        NotificationManager.notifyPrescriptionReady(prescription.patientInfo.patientName);
        break;
      case 'dispensed':
        prescription.timestamps.dateDispensed = now;
        // Resolve ready_for_pickup alert
        this.resolveAlertsByType(prescriptionId, 'ready_for_pickup');
        break;
      case 'cancelled':
      case 'returned':
        // Resolve all active alerts for this prescription
        this.resolveAllAlertsForPrescription(prescriptionId);
        break;
    }

    if (notes) {
      prescription.prescriptionDetails.notes = 
        (prescription.prescriptionDetails.notes || '') + `\n[${now}] ${updatedBy}: ${notes}`;
    }

    prescriptions[prescriptionIndex] = prescription;
    this.savePrescriptions(prescriptions);

    return true;
  }

  // Validate prescription
  static validatePrescription(
    prescriptionId: string, 
    validatedBy: string, 
    validationNotes?: string
  ): boolean {
    const prescriptions = this.getPrescriptions();
    const prescriptionIndex = prescriptions.findIndex(p => p.id === prescriptionId);
    
    if (prescriptionIndex === -1) return false;

    const prescription = prescriptions[prescriptionIndex];
    prescription.validation.isValidated = true;
    prescription.validation.validatedBy = validatedBy;
    prescription.validation.validationNotes = validationNotes;

    prescriptions[prescriptionIndex] = prescription;
    this.savePrescriptions(prescriptions);

    return true;
  }

  // Check drug interactions
  static checkDrugInteractions(medications: Medication[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];
    
    // Check each medication against all others
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        // Check against known interactions
        const interaction = this.drugInteractions.find(int => 
          (int.drug1.toLowerCase() === med1.name.toLowerCase() && 
           int.drug2.toLowerCase() === med2.name.toLowerCase()) ||
          (int.drug1.toLowerCase() === med2.name.toLowerCase() && 
           int.drug2.toLowerCase() === med1.name.toLowerCase())
        );
        
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
    
    return interactions;
  }

  // Get prescriptions by status
  static getPrescriptionsByStatus(status: PrescriptionStatus): Prescription[] {
    return this.getPrescriptions().filter(p => p.status === status);
  }

  // Get prescriptions by patient
  static getPrescriptionsByPatient(patientId: string): Prescription[] {
    return this.getPrescriptions().filter(p => p.patientInfo.patientId === patientId);
  }

  // Get overdue prescriptions
  static getOverduePrescriptions(): Prescription[] {
    const now = new Date();
    return this.getPrescriptions().filter(prescription => {
      if (prescription.status !== 'ready') return false;
      
      const readyDate = new Date(prescription.timestamps.dateReady!);
      const daysSinceReady = Math.floor((now.getTime() - readyDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysSinceReady >= 3; // Consider overdue after 3 days
    });
  }

  // Get prescriptions ready for pickup
  static getReadyPrescriptions(): Prescription[] {
    return this.getPrescriptionsByStatus('ready');
  }

  // Search prescriptions
  static searchPrescriptions(query: string): Prescription[] {
    const prescriptions = this.getPrescriptions();
    const lowerQuery = query.toLowerCase();
    
    return prescriptions.filter(prescription => 
      prescription.patientInfo.patientName.toLowerCase().includes(lowerQuery) ||
      prescription.prescriptionDetails.prescriptionNumber.toLowerCase().includes(lowerQuery) ||
      prescription.prescriptionDetails.doctorName.toLowerCase().includes(lowerQuery) ||
      prescription.prescriptionDetails.medications.some(med => 
        med.name.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Generate prescription number
  private static generatePrescriptionNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `RX${year}${month}${day}${random}`;
  }

  // Prescription alerts management
  private static createPrescriptionAlert(alertData: {
    prescriptionId: string;
    patientName: string;
    type: PrescriptionAlert['type'];
    severity: PrescriptionAlert['severity'];
    message: string;
    actionRequired?: string;
    metadata?: Record<string, any>;
  }): void {
    const alerts = this.getPrescriptionAlerts();
    
    const newAlert: PrescriptionAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      dateCreated: new Date().toISOString(),
      isRead: false,
      isResolved: false
    };
    
    alerts.push(newAlert);
    this.savePrescriptionAlerts(alerts);
  }

  // Get prescription alerts
  static getPrescriptionAlerts(): PrescriptionAlert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save prescription alerts
  private static savePrescriptionAlerts(alerts: PrescriptionAlert[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }

  // Resolve alerts by type
  private static resolveAlertsByType(prescriptionId: string, type: PrescriptionAlert['type']): void {
    const alerts = this.getPrescriptionAlerts();
    const updatedAlerts = alerts.map(alert => {
      if (alert.prescriptionId === prescriptionId && alert.type === type) {
        return { ...alert, isResolved: true };
      }
      return alert;
    });
    this.savePrescriptionAlerts(updatedAlerts);
  }

  // Resolve all alerts for prescription
  private static resolveAllAlertsForPrescription(prescriptionId: string): void {
    const alerts = this.getPrescriptionAlerts();
    const updatedAlerts = alerts.map(alert => {
      if (alert.prescriptionId === prescriptionId) {
        return { ...alert, isResolved: true };
      }
      return alert;
    });
    this.savePrescriptionAlerts(updatedAlerts);
  }

  // Automated monitoring for prescriptions
  static performAutomatedMonitoring(): void {
    const prescriptions = this.getPrescriptions();
    const now = new Date();

    prescriptions.forEach(prescription => {
      // Check for overdue ready prescriptions
      if (prescription.status === 'ready' && prescription.timestamps.dateReady) {
        const readyDate = new Date(prescription.timestamps.dateReady);
        const daysSinceReady = Math.floor((now.getTime() - readyDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceReady >= 3) {
          // Check if overdue alert already exists
          const existingAlert = this.getPrescriptionAlerts().find(alert => 
            alert.prescriptionId === prescription.id && 
            alert.type === 'overdue' && 
            !alert.isResolved
          );
          
          if (!existingAlert) {
            this.createPrescriptionAlert({
              prescriptionId: prescription.id,
              patientName: prescription.patientInfo.patientName,
              type: 'overdue',
              severity: daysSinceReady >= 7 ? 'high' : 'medium',
              message: `Prescription has been ready for ${daysSinceReady} days`,
              actionRequired: 'Contact patient for pickup or return to stock',
              metadata: { 
                daysSinceReady,
                patientPhone: prescription.patientInfo.patientPhone,
                medications: prescription.prescriptionDetails.medications.map(m => m.name)
              }
            });
          }
        }
      }

      // Check for expired prescriptions
      if (prescription.timestamps.dateDue) {
        const dueDate = new Date(prescription.timestamps.dateDue);
        if (now > dueDate && prescription.status !== 'dispensed' && prescription.status !== 'expired') {
          // Update status to expired
          this.updatePrescriptionStatus(prescription.id, 'expired', 'System');
        }
      }
    });
  }

  // Get prescription statistics
  static getPrescriptionStats(): {
    total: number;
    byStatus: Record<PrescriptionStatus, number>;
    byPriority: Record<string, number>;
    averageProcessingTime: number;
    overdueCount: number;
    readyCount: number;
    controlledSubstanceCount: number;
  } {
    const prescriptions = this.getPrescriptions();
    
    const byStatus: Record<PrescriptionStatus, number> = {
      pending: 0,
      processing: 0,
      ready: 0,
      dispensed: 0,
      cancelled: 0,
      returned: 0,
      expired: 0,
      on_hold: 0
    };
    
    const byPriority: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };
    
    let totalProcessingTime = 0;
    let processedCount = 0;
    let controlledSubstanceCount = 0;
    
    prescriptions.forEach(prescription => {
      byStatus[prescription.status]++;
      byPriority[prescription.metadata.priority]++;
      
      // Calculate processing time for dispensed prescriptions
      if (prescription.status === 'dispensed' && 
          prescription.timestamps.dateCreated && 
          prescription.timestamps.dateDispensed) {
        const created = new Date(prescription.timestamps.dateCreated);
        const dispensed = new Date(prescription.timestamps.dateDispensed);
        const processingTime = (dispensed.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        totalProcessingTime += processingTime;
        processedCount++;
      }
      
      // Count controlled substances
      if (prescription.prescriptionDetails.medications.some(med => med.isControlled)) {
        controlledSubstanceCount++;
      }
    });
    
    return {
      total: prescriptions.length,
      byStatus,
      byPriority,
      averageProcessingTime: processedCount > 0 ? totalProcessingTime / processedCount : 0,
      overdueCount: this.getOverduePrescriptions().length,
      readyCount: byStatus.ready,
      controlledSubstanceCount
    };
  }

  // Get active prescription alerts
  static getActivePrescriptionAlerts(): PrescriptionAlert[] {
    return this.getPrescriptionAlerts().filter(alert => !alert.isResolved && !alert.isRead);
  }

  // Mark prescription alert as read
  static markPrescriptionAlertAsRead(alertId: string): void {
    const alerts = this.getPrescriptionAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isRead = true;
      this.savePrescriptionAlerts(alerts);
    }
  }

  // Resolve prescription alert
  static resolvePrescriptionAlert(alertId: string): void {
    const alerts = this.getPrescriptionAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].isResolved = true;
      this.savePrescriptionAlerts(alerts);
    }
  }
}