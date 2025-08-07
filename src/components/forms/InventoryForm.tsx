import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  AlertTriangle,
  Plus,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  EnhancedInput,
  EnhancedSelect,
  EnhancedButton,
  EnhancedTextarea,
  FormContainer,
  FormIcons
} from './FormComponents';

interface InventoryFormData {
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: string;
  minStockLevel: string;
  location: string;
  description: string;
}

interface InventoryFormProps {
  initialData?: Partial<InventoryFormData>;
  onSubmit: (data: InventoryFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'prescription', label: 'Prescription Drugs', icon: <Package className="w-4 h-4" /> },
  { value: 'otc', label: 'Over-the-Counter', icon: <Package className="w-4 h-4" /> },
  { value: 'supplements', label: 'Supplements', icon: <Package className="w-4 h-4" /> },
  { value: 'medical-devices', label: 'Medical Devices', icon: <Package className="w-4 h-4" /> },
  { value: 'first-aid', label: 'First Aid', icon: <Package className="w-4 h-4" /> },
  { value: 'cosmetics', label: 'Cosmetics', icon: <Package className="w-4 h-4" /> }
];

const MANUFACTURER_OPTIONS = [
  { value: 'pfizer', label: 'Pfizer Inc.' },
  { value: 'johnson-johnson', label: 'Johnson & Johnson' },
  { value: 'roche', label: 'Roche' },
  { value: 'novartis', label: 'Novartis' },
  { value: 'merck', label: 'Merck & Co.' },
  { value: 'gsk', label: 'GlaxoSmithKline' },
  { value: 'sanofi', label: 'Sanofi' },
  { value: 'abbott', label: 'Abbott Laboratories' },
  { value: 'other', label: 'Other' }
];

const LOCATION_OPTIONS = [
  { value: 'shelf-a1', label: 'Shelf A1' },
  { value: 'shelf-a2', label: 'Shelf A2' },
  { value: 'shelf-b1', label: 'Shelf B1' },
  { value: 'shelf-b2', label: 'Shelf B2' },
  { value: 'refrigerator', label: 'Refrigerator' },
  { value: 'controlled-substances', label: 'Controlled Substances' },
  { value: 'storage-room', label: 'Storage Room' }
];

export const InventoryForm: React.FC<InventoryFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false
}) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: initialData.name || '',
    genericName: initialData.genericName || '',
    category: initialData.category || '',
    manufacturer: initialData.manufacturer || '',
    batchNumber: initialData.batchNumber || '',
    expiryDate: initialData.expiryDate || '',
    quantity: initialData.quantity || '',
    minStockLevel: initialData.minStockLevel || '',
    location: initialData.location || '',
    description: initialData.description || ''
  });

  const [errors, setErrors] = useState<Partial<InventoryFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof InventoryFormData, boolean>>>({});

  const validateField = (name: keyof InventoryFormData, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Product name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Product name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'category':
        if (!value) {
          newErrors.category = 'Category is required';
        } else {
          delete newErrors.category;
        }
        break;
        
      case 'quantity':
        if (!value) {
          newErrors.quantity = 'Quantity is required';
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          newErrors.quantity = 'Quantity must be a valid positive number';
        } else {
          delete newErrors.quantity;
        }
        break;
        
      case 'expiryDate':
        if (!value) {
          newErrors.expiryDate = 'Expiry date is required';
        } else {
          const expiryDate = new Date(value);
          const today = new Date();
          if (expiryDate <= today) {
            newErrors.expiryDate = 'Expiry date must be in the future';
          } else {
            delete newErrors.expiryDate;
          }
        }
        break;
        
      case 'minStockLevel':
        if (!value) {
          newErrors.minStockLevel = 'Minimum stock level is required';
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          newErrors.minStockLevel = 'Minimum stock level must be a valid positive number';
        } else {
          delete newErrors.minStockLevel;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (name: keyof InventoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name: keyof InventoryFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const allFields = Object.keys(formData) as (keyof InventoryFormData)[];
    allFields.forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    });
    
    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: initialData.name || '',
      genericName: initialData.genericName || '',
      category: initialData.category || '',
      manufacturer: initialData.manufacturer || '',
      batchNumber: initialData.batchNumber || '',
      expiryDate: initialData.expiryDate || '',
      quantity: initialData.quantity || '',
      minStockLevel: initialData.minStockLevel || '',
      location: initialData.location || '',
      description: initialData.description || ''
    });
    setErrors({});
    setTouched({});
  };

  const isLowStock = formData.quantity && formData.minStockLevel && 
    Number(formData.quantity) <= Number(formData.minStockLevel);

  return (
    <FormContainer
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      subtitle={isEditing ? 'Update product information' : 'Enter product details to add to inventory'}
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto"
    >
      {/* Product Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-xl p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Product Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedInput
            label="Product Name"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : undefined}
            required
            icon={<Package className="w-4 h-4" />}
            placeholder="Enter product name"
          />
          
          <EnhancedInput
            label="Generic Name"
            value={formData.genericName}
            onChange={(value) => handleInputChange('genericName', value)}
            placeholder="Enter generic name (optional)"
          />
          
          <EnhancedSelect
            label="Category"
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            onBlur={() => handleBlur('category')}
            options={CATEGORY_OPTIONS}
            error={touched.category ? errors.category : undefined}
            required
            placeholder="Select category"
          />
          
          <EnhancedSelect
            label="Manufacturer"
            value={formData.manufacturer}
            onChange={(value) => handleInputChange('manufacturer', value)}
            options={MANUFACTURER_OPTIONS}
            placeholder="Select manufacturer"
          />
        </div>
      </motion.div>

      {/* Stock Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-xl p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
          Stock Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedInput
            label="Batch Number"
            value={formData.batchNumber}
            onChange={(value) => handleInputChange('batchNumber', value)}
            placeholder="Enter batch number"
          />
          
          <EnhancedInput
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(value) => handleInputChange('expiryDate', value)}
            onBlur={() => handleBlur('expiryDate')}
            error={touched.expiryDate ? errors.expiryDate : undefined}
            required
            icon={<Calendar className="w-4 h-4" />}
          />
          
          <EnhancedSelect
            label="Storage Location"
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            options={LOCATION_OPTIONS}
            placeholder="Select location"
          />
          
          <div className="relative">
            <EnhancedInput
              label="Current Quantity"
              type="number"
              value={formData.quantity}
              onChange={(value) => handleInputChange('quantity', value)}
              onBlur={() => handleBlur('quantity')}
              error={touched.quantity ? errors.quantity : undefined}
              success={!errors.quantity && formData.quantity && !isLowStock}
              required
              placeholder="0"
            />
            {isLowStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Low Stock
              </motion.div>
            )}
          </div>
          
          <EnhancedInput
            label="Minimum Stock Level"
            type="number"
            value={formData.minStockLevel}
            onChange={(value) => handleInputChange('minStockLevel', value)}
            onBlur={() => handleBlur('minStockLevel')}
            error={touched.minStockLevel ? errors.minStockLevel : undefined}
            required
            placeholder="0"
          />
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <EnhancedTextarea
          label="Description / Notes"
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          placeholder="Enter any additional notes or description about the product..."
          rows={4}
          maxLength={500}
        />
      </motion.div>

      {/* Form Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
      >
        <EnhancedButton
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          className="flex-1"
        >
          {isEditing ? 'Update Product' : 'Add Product'}
        </EnhancedButton>
        
        <EnhancedButton
          type="button"
          variant="ghost"
          size="lg"
          onClick={handleReset}
          icon={<RotateCcw className="w-5 h-5" />}
          disabled={loading}
        >
          Reset
        </EnhancedButton>
        
        {onCancel && (
          <EnhancedButton
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </EnhancedButton>
        )}
      </motion.div>
    </FormContainer>
  );
};