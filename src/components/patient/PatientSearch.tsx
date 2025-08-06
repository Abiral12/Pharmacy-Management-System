"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Patient, Gender } from '@/types/pharmacy';

interface PatientSearchProps {
  patients: Patient[];
  onSearchResults: (filteredPatients: Patient[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

interface SearchFilters {
  gender?: Gender;
  ageRange?: {
    min: number;
    max: number;
  };
  hasAllergies?: boolean;
  hasInsurance?: boolean;
  dateAddedRange?: {
    start: string;
    end: string;
  };
}

type SortField = 'name' | 'age' | 'dateAdded' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

const PatientSearch: React.FC<PatientSearchProps> = ({
  patients,
  onSearchResults,
  searchQuery,
  onSearchQueryChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Apply search and filters
  useEffect(() => {
    let filteredPatients = [...patients];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.personalInfo.name.toLowerCase().includes(query) ||
        patient.personalInfo.phone.includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        (patient.personalInfo.email && patient.personalInfo.email.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.gender) {
      filteredPatients = filteredPatients.filter(patient =>
        patient.personalInfo.gender === filters.gender
      );
    }

    if (filters.ageRange) {
      filteredPatients = filteredPatients.filter(patient =>
        patient.personalInfo.age >= filters.ageRange!.min &&
        patient.personalInfo.age <= filters.ageRange!.max
      );
    }

    if (filters.hasAllergies !== undefined) {
      filteredPatients = filteredPatients.filter(patient =>
        filters.hasAllergies
          ? patient.medicalInfo.allergies.length > 0
          : patient.medicalInfo.allergies.length === 0
      );
    }

    if (filters.hasInsurance !== undefined) {
      filteredPatients = filteredPatients.filter(patient =>
        filters.hasInsurance
          ? !!patient.medicalInfo.insuranceInfo
          : !patient.medicalInfo.insuranceInfo
      );
    }

    if (filters.dateAddedRange?.start && filters.dateAddedRange?.end) {
      const startDate = new Date(filters.dateAddedRange.start);
      const endDate = new Date(filters.dateAddedRange.end);
      filteredPatients = filteredPatients.filter(patient => {
        const patientDate = new Date(patient.metadata.dateAdded);
        return patientDate >= startDate && patientDate <= endDate;
      });
    }

    // Apply sorting
    filteredPatients.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.personalInfo.name.toLowerCase();
          bValue = b.personalInfo.name.toLowerCase();
          break;
        case 'age':
          aValue = a.personalInfo.age;
          bValue = b.personalInfo.age;
          break;
        case 'dateAdded':
          aValue = new Date(a.metadata.dateAdded);
          bValue = new Date(b.metadata.dateAdded);
          break;
        case 'lastUpdated':
          aValue = new Date(a.metadata.lastUpdated);
          bValue = new Date(b.metadata.lastUpdated);
          break;
        default:
          aValue = a.personalInfo.name.toLowerCase();
          bValue = b.personalInfo.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onSearchResults(filteredPatients);
  }, [patients, searchQuery, filters, sortField, sortOrder, onSearchResults]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && value !== '';
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by name, phone, ID, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
            hasActiveFilters || showFilters
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
              {Object.keys(filters).filter(key => filters[key as keyof SearchFilters] !== undefined).length}
            </span>
          )}
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        {[
          { field: 'name' as SortField, label: 'Name' },
          { field: 'age' as SortField, label: 'Age' },
          { field: 'dateAdded' as SortField, label: 'Date Added' },
          { field: 'lastUpdated' as SortField, label: 'Last Updated' }
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
              sortField === field
                ? 'bg-teal-100 text-teal-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
            {sortField === field && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
            )}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Advanced Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.ageRange?.min || ''}
                  onChange={(e) => handleFilterChange('ageRange', {
                    ...filters.ageRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="0"
                  max="150"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.ageRange?.max || ''}
                  onChange={(e) => handleFilterChange('ageRange', {
                    ...filters.ageRange,
                    max: parseInt(e.target.value) || 150
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="0"
                  max="150"
                />
              </div>
            </div>

            {/* Allergies Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <select
                value={filters.hasAllergies === undefined ? '' : filters.hasAllergies.toString()}
                onChange={(e) => handleFilterChange('hasAllergies', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Patients</option>
                <option value="true">Has Allergies</option>
                <option value="false">No Allergies</option>
              </select>
            </div>

            {/* Insurance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
              <select
                value={filters.hasInsurance === undefined ? '' : filters.hasInsurance.toString()}
                onChange={(e) => handleFilterChange('hasInsurance', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Patients</option>
                <option value="true">Has Insurance</option>
                <option value="false">No Insurance</option>
              </select>
            </div>

            {/* Date Added Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Added Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={filters.dateAddedRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateAddedRange', {
                    ...filters.dateAddedRange,
                    start: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={filters.dateAddedRange?.end || ''}
                  onChange={(e) => handleFilterChange('dateAddedRange', {
                    ...filters.dateAddedRange,
                    end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientSearch;