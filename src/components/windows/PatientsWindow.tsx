"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  X
} from 'lucide-react';
import { Patient, PatientData, ValidationResult } from '@/types/pharmacy';
import { validatePatientData } from '@/utils/validation';
import PatientRegistrationForm from '@/components/forms/PatientRegistrationForm';
import PatientProfile from '@/components/patient/PatientProfile';
import PatientSearch from '@/components/patient/PatientSearch';

interface PatientsWindowProps {
  onClose: () => void;
}

const PatientsWindow: React.FC<PatientsWindowProps> = ({ onClose }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load patients from localStorage on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    try {
      const storedPatients = localStorage.getItem('pharmacy_patients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const savePatients = (updatedPatients: Patient[]) => {
    try {
      localStorage.setItem('pharmacy_patients', JSON.stringify(updatedPatients));
      setPatients(updatedPatients);
    } catch (error) {
      console.error('Error saving patients:', error);
    }
  };

  const generatePatientId = (): string => {
    return `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddPatient = async (patientData: PatientData) => {
    setLoading(true);
    try {
      const newPatient: Patient = {
        id: generatePatientId(),
        personalInfo: {
          name: patientData.name,
          age: patientData.age,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          phone: patientData.phone,
          email: patientData.email,
          address: patientData.address
        },
        medicalInfo: {
          allergies: patientData.allergies,
          medicalHistory: patientData.medicalHistory,
          emergencyContact: patientData.emergencyContact,
          insuranceInfo: patientData.insuranceInfo
        },
        metadata: {
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          createdBy: 'current_user' // In a real app, this would be the logged-in user
        }
      };

      const updatedPatients = [...patients, newPatient];
      savePatients(updatedPatients);
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = async (patientData: PatientData) => {
    if (!selectedPatient) return;
    
    setLoading(true);
    try {
      const updatedPatient: Patient = {
        ...selectedPatient,
        personalInfo: {
          name: patientData.name,
          age: patientData.age,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          phone: patientData.phone,
          email: patientData.email,
          address: patientData.address
        },
        medicalInfo: {
          allergies: patientData.allergies,
          medicalHistory: patientData.medicalHistory,
          emergencyContact: patientData.emergencyContact,
          insuranceInfo: patientData.insuranceInfo
        },
        metadata: {
          ...selectedPatient.metadata,
          lastUpdated: new Date().toISOString()
        }
      };

      const updatedPatients = patients.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      );
      savePatients(updatedPatients);
      setShowRegistrationForm(false);
      setSelectedPatient(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      const updatedPatients = patients.filter(p => p.id !== patientId);
      savePatients(updatedPatients);
    }
  };

  const handleSearchResults = (results: Patient[]) => {
    setFilteredPatients(results);
  };

  const openPatientProfile = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientProfile(true);
  };

  const closePatientProfile = () => {
    setShowPatientProfile(false);
    setSelectedPatient(null);
  };

  const handlePatientUpdate = (patientData: PatientData) => {
    if (!selectedPatient) return;
    
    const updatedPatient: Patient = {
      ...selectedPatient,
      personalInfo: {
        name: patientData.name,
        age: patientData.age,
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address
      },
      medicalInfo: {
        allergies: patientData.allergies,
        medicalHistory: patientData.medicalHistory,
        emergencyContact: patientData.emergencyContact,
        insuranceInfo: patientData.insuranceInfo
      },
      metadata: {
        ...selectedPatient.metadata,
        lastUpdated: new Date().toISOString()
      }
    };

    const updatedPatients = patients.map(p => 
      p.id === selectedPatient.id ? updatedPatient : p
    );
    savePatients(updatedPatients);
    setShowPatientProfile(false);
    setSelectedPatient(null);
  };

  // Get prescription history for selected patient (mock data for now)
  const getPatientPrescriptionHistory = (patientId: string) => {
    // In a real app, this would fetch from localStorage or API
    try {
      const storedPrescriptions = localStorage.getItem('pharmacy_prescriptions');
      if (storedPrescriptions) {
        const prescriptions = JSON.parse(storedPrescriptions);
        return prescriptions.filter((p: any) => p.patientInfo.patientId === patientId);
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    }
    return [];
  };

  const openEditForm = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
    setShowRegistrationForm(true);
  };

  const closeForm = () => {
    setShowRegistrationForm(false);
    setSelectedPatient(null);
    setIsEditing(false);
  };

  const getPatientDataForForm = (patient: Patient): PatientData => {
    return {
      name: patient.personalInfo.name,
      age: patient.personalInfo.age,
      dateOfBirth: patient.personalInfo.dateOfBirth,
      gender: patient.personalInfo.gender,
      phone: patient.personalInfo.phone,
      email: patient.personalInfo.email,
      address: patient.personalInfo.address,
      allergies: patient.medicalInfo.allergies,
      medicalHistory: patient.medicalInfo.medicalHistory,
      emergencyContact: patient.medicalInfo.emergencyContact,
      insuranceInfo: patient.medicalInfo.insuranceInfo
    };
  };

  if (showRegistrationForm) {
    return (
      <div className="h-full bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditing ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button
            onClick={closeForm}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          <PatientRegistrationForm
            onSubmit={isEditing ? handleEditPatient : handleAddPatient}
            onCancel={closeForm}
            initialData={selectedPatient ? getPatientDataForForm(selectedPatient) : undefined}
            isEditing={isEditing}
          />
        </div>
      </div>
    );
  }

  if (showPatientProfile && selectedPatient) {
    return (
      <PatientProfile
        patient={selectedPatient}
        onUpdate={handlePatientUpdate}
        onClose={closePatientProfile}
        prescriptionHistory={getPatientPrescriptionHistory(selectedPatient.id)}
      />
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-800">Patient Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="p-4 border-b border-gray-200">
        <PatientSearch
          patients={patients}
          onSearchResults={handleSearchResults}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'No patients found' : 'No patients registered'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Start by adding your first patient'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="flex items-center mx-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Patient
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.personalInfo.name}</h3>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openPatientProfile(patient)}
                      className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditForm(patient)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Patient"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Patient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Age: {patient.personalInfo.age} • {patient.personalInfo.gender}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {patient.personalInfo.phone}
                  </div>
                  {patient.personalInfo.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {patient.personalInfo.email}
                    </div>
                  )}
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{patient.personalInfo.address}</span>
                  </div>
                  
                  {patient.medicalInfo.allergies.length > 0 && (
                    <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-xs">
                        {patient.medicalInfo.allergies.length} allerg{patient.medicalInfo.allergies.length === 1 ? 'y' : 'ies'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Added: {new Date(patient.metadata.dateAdded).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsWindow;