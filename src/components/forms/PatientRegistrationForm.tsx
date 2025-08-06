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
  Plus,
  X,
  Save,
  UserCheck
} from 'lucide-react';
import { PatientData, Allergy, EmergencyContact, InsuranceInfo, ValidationResult, Gender, AllergySeverity } from '@/types/pharmacy';
import { validatePatientData } from '@/utils/validation';

interface PatientRegistrationFormProps {
  onSubmit: (patientData: PatientData) => void;
  onCancel: () => void;
  initialData?: Partial<PatientData>;
  isEditing?: boolean;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<PatientData>({
    name: initialData?.name || '',
    age: initialData?.age || 0,
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || 'male',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    allergies: initialData?.allergies || [],
    medicalHistory: initialData?.medicalHistory || '',
    emergencyContact: initialData?.emergencyContact || {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    insuranceInfo: initialData?.insuranceInfo || undefined
  });

  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [showInsurance, setShowInsurance] = useState(!!initialData?.insuranceInfo);
  const [newAllergy, setNewAllergy] = useState<Allergy>({ name: '', severity: 'mild', notes: '' });

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: keyof EmergencyContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleInsuranceChange = (field: keyof InsuranceInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo!,
        [field]: value
      }
    }));
  };

  const addAllergy = () => {
    if (newAllergy.name.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, { ...newAllergy }]
      }));
      setNewAllergy({ name: '', severity: 'mild', notes: '' });
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = validatePatientData(formData);
    setValidation(validationResult);

    if (validationResult.isValid) {
      onSubmit(formData);
    }
  };

  const calculateAgeFromDOB = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDOBChange = (dob: string) => {
    handleInputChange('dateOfBirth', dob);
    const calculatedAge = calculateAgeFromDOB(dob);
    handleInputChange('age', calculatedAge);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validation.errors.find(error => 
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Patient' : 'Patient Registration'}
          </h2>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-teal-600" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter patient's full name"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleDOBChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('date of birth') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('date of birth') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('date of birth')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('age') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Age"
                min="0"
                max="150"
              />
              {getFieldError('age') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('age')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+977-9812345678"
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="patient@example.com"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('address') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {getFieldError('address') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Medical Information
          </h3>

          {/* Allergies Management */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            
            {/* Existing Allergies */}
            {formData.allergies.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <div className="flex-1">
                      <span className="font-medium">{allergy.name}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        allergy.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {allergy.severity}
                      </span>
                      {allergy.notes && (
                        <p className="text-sm text-gray-600 mt-1">{allergy.notes}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Allergy */}
            <div className="bg-white p-4 rounded-lg border border-dashed border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Allergy name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <select
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value as AllergySeverity }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <input
                  type="text"
                  value={newAllergy.notes}
                  onChange={(e) => setNewAllergy(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes (optional)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical History
            </label>
            <textarea
              value={formData.medicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter patient's medical history, previous conditions, surgeries, etc."
            />
          </div>
        </div>      
  {/* Emergency Contact Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-red-600" />
            Emergency Contact
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('emergency contact name') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Emergency contact name"
              />
              {getFieldError('emergency contact name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('emergency contact name')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('emergency contact') && getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+977-9812345678"
              />
              {getFieldError('emergency contact') && getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('emergency contact')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emergencyContact.email}
                onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  getFieldError('emergency contact email') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@example.com"
              />
              {getFieldError('emergency contact email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('emergency contact email')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
              Insurance Information
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowInsurance(!showInsurance);
                if (!showInsurance) {
                  setFormData(prev => ({
                    ...prev,
                    insuranceInfo: {
                      provider: '',
                      policyNumber: '',
                      groupNumber: '',
                      expiryDate: ''
                    }
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    insuranceInfo: undefined
                  }));
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showInsurance 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {showInsurance ? 'Remove Insurance' : 'Add Insurance'}
            </button>
          </div>

          {showInsurance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo?.provider || ''}
                  onChange={(e) => handleInsuranceChange('provider', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Insurance company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo?.policyNumber || ''}
                  onChange={(e) => handleInsuranceChange('policyNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Policy number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Number
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo?.groupNumber || ''}
                  onChange={(e) => handleInsuranceChange('groupNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Group number (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.insuranceInfo?.expiryDate || ''}
                  onChange={(e) => handleInsuranceChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Patient' : 'Register Patient'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientRegistrationForm;