"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Edit,
  Save,
  X,
  Clock,
  FileText,
  Shield,
  Heart,
  Pill
} from 'lucide-react';
import { Patient, PatientData, Prescription } from '@/types/pharmacy';
import PatientRegistrationForm from '@/components/forms/PatientRegistrationForm';

interface PatientProfileProps {
  patient: Patient;
  onUpdate: (patientData: PatientData) => void;
  onClose: () => void;
  prescriptionHistory?: Prescription[];
}

const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onUpdate,
  onClose,
  prescriptionHistory = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'prescriptions'>('profile');

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

  const handleUpdate = (patientData: PatientData) => {
    onUpdate(patientData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isEditing) {
    return (
      <div className="h-full bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Patient Profile</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          <PatientRegistrationForm
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            initialData={getPatientDataForForm(patient)}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{patient.personalInfo.name}</h2>
            <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'medical'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Medical Info
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'prescriptions'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Pill className="w-4 h-4 inline mr-2" />
          Prescriptions ({prescriptionHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-gray-800 font-medium">{patient.personalInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <p className="text-gray-800 capitalize">{patient.personalInfo.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                  <p className="text-gray-800">{patient.personalInfo.age} years old</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <p className="text-gray-800">{formatDate(patient.personalInfo.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <div className="flex items-center text-gray-800">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {patient.personalInfo.phone}
                  </div>
                </div>
                {patient.personalInfo.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <div className="flex items-center text-gray-800">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {patient.personalInfo.email}
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                  <div className="flex items-start text-gray-800">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                    {patient.personalInfo.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contact Name</label>
                  <p className="text-gray-800 font-medium">{patient.medicalInfo.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                  <p className="text-gray-800">{patient.medicalInfo.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <div className="flex items-center text-gray-800">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {patient.medicalInfo.emergencyContact.phone}
                  </div>
                </div>
                {patient.medicalInfo.emergencyContact.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <div className="flex items-center text-gray-800">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {patient.medicalInfo.emergencyContact.email}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insurance Information */}
            {patient.medicalInfo.insuranceInfo && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Provider</label>
                    <p className="text-gray-800 font-medium">{patient.medicalInfo.insuranceInfo.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Policy Number</label>
                    <p className="text-gray-800">{patient.medicalInfo.insuranceInfo.policyNumber}</p>
                  </div>
                  {patient.medicalInfo.insuranceInfo.groupNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Group Number</label>
                      <p className="text-gray-800">{patient.medicalInfo.insuranceInfo.groupNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                    <p className="text-gray-800">{formatDate(patient.medicalInfo.insuranceInfo.expiryDate)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Record Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date Added</label>
                  <p className="text-gray-800">{formatDate(patient.metadata.dateAdded)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                  <p className="text-gray-800">{formatDate(patient.metadata.lastUpdated)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created By</label>
                  <p className="text-gray-800">{patient.metadata.createdBy}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'medical' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Allergies */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Allergies
              </h3>
              {patient.medicalInfo.allergies.length > 0 ? (
                <div className="space-y-3">
                  {patient.medicalInfo.allergies.map((allergy, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{allergy.name}</h4>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          allergy.severity === 'severe' ? 'bg-red-100 text-red-800' :
                          allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {allergy.severity.toUpperCase()}
                        </span>
                      </div>
                      {allergy.notes && (
                        <p className="text-gray-600 text-sm">{allergy.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No known allergies recorded.</p>
              )}
            </div>

            {/* Medical History */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Medical History
              </h3>
              {patient.medicalInfo.medicalHistory ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{patient.medicalInfo.medicalHistory}</p>
                </div>
              ) : (
                <p className="text-gray-600">No medical history recorded.</p>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'prescriptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Prescription History</h3>
              <span className="text-sm text-gray-600">
                {prescriptionHistory.length} prescription{prescriptionHistory.length !== 1 ? 's' : ''}
              </span>
            </div>

            {prescriptionHistory.length > 0 ? (
              <div className="space-y-4">
                {prescriptionHistory.map((prescription) => (
                  <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">Prescription #{prescription.id}</h4>
                        <p className="text-sm text-gray-600">
                          Dr. {prescription.prescriptionDetails.doctorName}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        prescription.status === 'dispensed' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        prescription.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Medications</label>
                        <div className="space-y-1">
                          {prescription.prescriptionDetails.medications.map((medication, index) => (
                            <div key={index} className="text-sm text-gray-800">
                              <span className="font-medium">{medication.name}</span>
                              {medication.genericName && (
                                <span className="text-gray-600"> ({medication.genericName})</span>
                              )}
                              <span className="text-gray-600"> - {medication.dosage}, {medication.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.prescriptionDetails.instructions && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Instructions</label>
                          <p className="text-sm text-gray-800">{prescription.prescriptionDetails.instructions}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span>Created: {formatDate(prescription.timestamps.dateCreated)}</span>
                        {prescription.timestamps.dateDispensed && (
                          <span>Dispensed: {formatDate(prescription.timestamps.dateDispensed)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">No Prescriptions</h4>
                <p className="text-gray-500">This patient has no prescription history.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;