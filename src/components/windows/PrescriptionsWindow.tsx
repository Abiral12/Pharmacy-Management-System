"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Check,
  Clock,
  User,
  Calendar,
  FileText,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  UserPlus
} from 'lucide-react';
import { 
  Prescription, 
  PrescriptionData, 
  PrescriptionStatus, 
  Patient, 
  Medication,
  InteractionWarning 
} from '@/types/pharmacy';
import { validatePrescriptionData, checkDrugInteractions } from '@/utils/validation';

interface PrescriptionsWindowProps {
  patients?: Patient[];
  prescriptions?: Prescription[];
  onAddPrescription?: (prescription: PrescriptionData) => void;
  onUpdatePrescription?: (id: string, updates: Partial<Prescription>) => void;
  onDeletePrescription?: (prescription: Prescription) => void;
}

const PrescriptionsWindow: React.FC<PrescriptionsWindowProps> = ({
  patients = [],
  prescriptions = [],
  onAddPrescription,
  onUpdatePrescription,
  onDeletePrescription
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'details'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for creating new prescription
  const [formData, setFormData] = useState<PrescriptionData>({
    patientId: '',
    patientName: '',
    doctorName: '',
    doctorLicense: '',
    medications: [],
    instructions: '',
    notes: ''
  });

  const [currentMedication, setCurrentMedication] = useState<Medication>({
    name: '',
    genericName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 1,
    instructions: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<InteractionWarning[]>([]);

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = searchQuery === '' || 
      prescription.patientInfo.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescriptionDetails.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle form input changes
  const handleFormChange = (field: keyof PrescriptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: selectedPatient.id,
        patientName: selectedPatient.personalInfo.name
      }));
    }
  };

  // Add medication to prescription
  const addMedication = () => {
    if (!currentMedication.name || !currentMedication.dosage || !currentMedication.frequency) {
      alert('Please fill in all required medication fields');
      return;
    }

    const newMedications = [...formData.medications, { ...currentMedication }];
    setFormData(prev => ({ ...prev, medications: newMedications }));
    
    // Check for drug interactions
    const interactions = checkDrugInteractions(newMedications);
    setDrugInteractions(interactions);

    // Reset current medication form
    setCurrentMedication({
      name: '',
      genericName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 1,
      instructions: ''
    });
  };

  // Remove medication from prescription
  const removeMedication = (index: number) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medications: newMedications }));
    
    // Recheck drug interactions
    const interactions = checkDrugInteractions(newMedications);
    setDrugInteractions(interactions);
  };

  // Submit prescription form
  const handleSubmitPrescription = async () => {
    setIsLoading(true);
    
    try {
      // Validate form data
      const validation = validatePrescriptionData(formData);
      
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      // Check for critical drug interactions
      const criticalInteractions = drugInteractions.filter(
        interaction => interaction.severity === 'critical' || interaction.severity === 'high'
      );

      if (criticalInteractions.length > 0) {
        const proceed = window.confirm(
          `Warning: ${criticalInteractions.length} critical drug interaction(s) detected. Do you want to proceed?`
        );
        if (!proceed) {
          setIsLoading(false);
          return;
        }
      }

      // Submit prescription
      if (onAddPrescription) {
        await onAddPrescription(formData);
      }

      // Reset form
      setFormData({
        patientId: '',
        patientName: '',
        doctorName: '',
        doctorLicense: '',
        medications: [],
        instructions: '',
        notes: ''
      });
      setDrugInteractions([]);
      setFormErrors([]);
      setActiveTab('list');
      
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Failed to create prescription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update prescription status
  const updatePrescriptionStatus = async (prescriptionId: string, newStatus: PrescriptionStatus) => {
    if (onUpdatePrescription) {
      await onUpdatePrescription(prescriptionId, { status: newStatus });
    }
  };

  // Get status color
  const getStatusColor = (status: PrescriptionStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'dispensed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Pill className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-800">Prescription Management</h2>
        </div>
        
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'list'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Prescriptions ({prescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'create'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Create New
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'list' && (
          <div className="p-4">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prescriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PrescriptionStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="dispensed">Dispensed</option>
              </select>
            </div>

            {/* Prescriptions List */}
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No prescriptions match your search criteria.' 
                    : 'Start by creating your first prescription.'}
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Create Prescription
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {prescription.id}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{prescription.patientInfo.patientName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Dr. {prescription.prescriptionDetails.doctorName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(prescription.timestamps.dateCreated)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Pill className="w-4 h-4" />
                            <span>{prescription.prescriptionDetails.medications.length} medication(s)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {prescription.status === 'pending' && (
                          <button
                            onClick={() => updatePrescriptionStatus(prescription.id, 'processing')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Start Processing"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        
                        {prescription.status === 'processing' && (
                          <button
                            onClick={() => updatePrescriptionStatus(prescription.id, 'ready')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Ready"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setActiveTab('details');
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeletePrescription && onDeletePrescription(prescription)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Prescription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Prescription</h3>

              {/* Form Errors */}
              {formErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Drug Interactions Warning */}
              {drugInteractions.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-medium text-amber-800">Drug Interaction Warnings:</h4>
                  </div>
                  <div className="space-y-2">
                    {drugInteractions.map((interaction, index) => (
                      <div key={index} className="text-sm">
                        <div className={`font-medium ${
                          interaction.severity === 'critical' ? 'text-red-700' :
                          interaction.severity === 'high' ? 'text-orange-700' :
                          'text-amber-700'
                        }`}>
                          {interaction.severity.toUpperCase()}: {interaction.description}
                        </div>
                        <div className="text-amber-700">
                          Recommendation: {interaction.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form className="space-y-6">
                {/* Patient Selection */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Patient *
                    </label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.personalInfo.name} - {patient.personalInfo.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => handleFormChange('doctorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter doctor's name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor License *
                    </label>
                    <input
                      type="text"
                      value={formData.doctorLicense}
                      onChange={(e) => handleFormChange('doctorLicense', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter license number"
                      required
                    />
                  </div>
                </div>

                {/* Medications Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Medications</h4>
                  
                  {/* Current Medications List */}
                  {formData.medications.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {formData.medications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{medication.name}</div>
                            <div className="text-sm text-gray-600">
                              {medication.dosage} - {medication.frequency} for {medication.duration} (Qty: {medication.quantity})
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Medication Form */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Add Medication</h5>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medication Name *
                        </label>
                        <input
                          type="text"
                          value={currentMedication.name}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., Paracetamol 500mg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Generic Name
                        </label>
                        <input
                          type="text"
                          value={currentMedication.genericName}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, genericName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Generic name (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          value={currentMedication.dosage}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, dosage: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., 500mg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency *
                        </label>
                        <input
                          type="text"
                          value={currentMedication.frequency}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, frequency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., Twice daily"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={currentMedication.duration}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., 7 days"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={currentMedication.quantity}
                          onChange={(e) => setCurrentMedication(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <input
                        type="text"
                        value={currentMedication.instructions}
                        onChange={(e) => setCurrentMedication(prev => ({ ...prev, instructions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Take after meals"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addMedication}
                      className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Medication</span>
                    </button>
                  </div>
                </div>

                {/* Instructions and Notes */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      General Instructions *
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => handleFormChange('instructions', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="General instructions for the patient..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Any additional notes or observations..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitPrescription}
                    disabled={isLoading || formData.medications.length === 0}
                    className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Creating...' : 'Create Prescription'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'details' && selectedPrescription && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Prescription Details - {selectedPrescription.id}
                </h3>
                <button
                  onClick={() => setActiveTab('list')}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Prescription Header */}
                <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                    <p className="text-gray-600">{selectedPrescription.patientInfo.patientName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prescribing Doctor</h4>
                    <p className="text-gray-600">Dr. {selectedPrescription.prescriptionDetails.doctorName}</p>
                    <p className="text-sm text-gray-500">License: {selectedPrescription.prescriptionDetails.doctorLicense}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                      {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Created Date</h4>
                    <p className="text-gray-600">{formatDate(selectedPrescription.timestamps.dateCreated)}</p>
                  </div>
                </div>

                {/* Medications */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Prescribed Medications</h4>
                  <div className="space-y-3">
                    {selectedPrescription.prescriptionDetails.medications.map((medication, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 mb-1">{medication.name}</div>
                        {medication.genericName && (
                          <div className="text-sm text-gray-600 mb-1">Generic: {medication.genericName}</div>
                        )}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Dosage:</span> {medication.dosage} | 
                          <span className="font-medium"> Frequency:</span> {medication.frequency} | 
                          <span className="font-medium"> Duration:</span> {medication.duration} | 
                          <span className="font-medium"> Quantity:</span> {medication.quantity}
                        </div>
                        {medication.instructions && (
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Instructions:</span> {medication.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions and Notes */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">General Instructions</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedPrescription.prescriptionDetails.instructions}
                    </p>
                  </div>
                  
                  {selectedPrescription.prescriptionDetails.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedPrescription.prescriptionDetails.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                  <div className="flex space-x-3">
                    {selectedPrescription.status === 'pending' && (
                      <button
                        onClick={() => updatePrescriptionStatus(selectedPrescription.id, 'processing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Processing
                      </button>
                    )}
                    
                    {selectedPrescription.status === 'processing' && (
                      <button
                        onClick={() => updatePrescriptionStatus(selectedPrescription.id, 'ready')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark as Ready
                      </button>
                    )}
                    
                    {selectedPrescription.status === 'ready' && (
                      <button
                        onClick={() => updatePrescriptionStatus(selectedPrescription.id, 'dispensed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Mark as Dispensed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionsWindow;