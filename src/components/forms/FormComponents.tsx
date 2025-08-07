import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Enhanced Input Field Component
interface EnhancedInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'date';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  required,
  disabled,
  icon,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
          isFocused || hasValue
            ? 'top-2 text-xs text-blue-600 font-medium'
            : 'top-4 text-gray-500'
        }`}
        animate={{
          y: isFocused || hasValue ? -8 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: error ? '#ef4444' : success ? '#10b981' : isFocused ? '#2563eb' : '#6b7280'
        }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          className={`
            w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-200
            ${icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${error 
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
              : success 
              ? 'border-green-300 bg-green-50/50 focus:border-green-500 focus:ring-green-500/20'
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-4
            placeholder-gray-400
          `}
          whileFocus={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Success/Error Icons */}
        {(success || error) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {success && <Check className="w-5 h-5 text-green-500" />}
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
        )}
      </div>

      {/* Error/Success Message */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 text-sm flex items-center space-x-2 ${
              error ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {error && <AlertCircle className="w-4 h-4" />}
            {success && <Check className="w-4 h-4" />}
            <span>{error || (success && 'Valid input')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Select Component
interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface EnhancedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Select an option',
  error,
  required,
  disabled,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const hasValue = !!selectedOption;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Floating Label */}
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-20 ${
          isFocused || hasValue || isOpen
            ? 'top-2 text-xs text-blue-600 font-medium'
            : 'top-4 text-gray-500'
        }`}
        animate={{
          y: isFocused || hasValue || isOpen ? -8 : 0,
          scale: isFocused || hasValue || isOpen ? 0.85 : 1,
          color: error ? '#ef4444' : isFocused || isOpen ? '#2563eb' : '#6b7280'
        }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      {/* Select Button */}
      <motion.button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsFocused(!isOpen);
          }
        }}
        className={`
          w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-200
          flex items-center justify-between
          ${error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500' 
            : 'border-gray-200 bg-white focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
        `}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <div className="flex items-center space-x-3">
          {selectedOption?.icon && (
            <div className="text-gray-500">
              {selectedOption.icon}
            </div>
          )}
          <span className={hasValue ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setIsFocused(false);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                  flex items-center space-x-3
                  ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                  ${index === 0 ? 'rounded-t-xl' : ''}
                  ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                `}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: '#eff6ff' }}
              >
                {option.icon && (
                  <div className={option.value === value ? 'text-blue-600' : 'text-gray-500'}>
                    {option.icon}
                  </div>
                )}
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600 ml-auto" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm flex items-center space-x-2 text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Button Component
interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconPosition = 'left',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/20 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500/20 shadow-lg hover:shadow-xl',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/20 shadow-lg hover:shadow-xl',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500/20 shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/20 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-500/20'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading && (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <div className="mr-2">{icon}</div>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <div className="ml-2">{icon}</div>
      )}
    </motion.button>
  );
};

// Enhanced Textarea Component
interface EnhancedTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required,
  disabled,
  rows = 4,
  maxLength,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
          isFocused || hasValue
            ? 'top-2 text-xs text-blue-600 font-medium'
            : 'top-4 text-gray-500'
        }`}
        animate={{
          y: isFocused || hasValue ? -8 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: error ? '#ef4444' : isFocused ? '#2563eb' : '#6b7280'
        }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      {/* Textarea */}
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        placeholder={isFocused ? placeholder : ''}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 pt-8 pb-4 rounded-xl border-2 transition-all duration-200 resize-none
          ${error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20'
          }
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-4
          placeholder-gray-400
        `}
        whileFocus={{
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
      />

      {/* Character Count */}
      {maxLength && (
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm flex items-center space-x-2 text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Form Container Component
interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
  className = ''
}) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {(title || subtitle) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          {title && (
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="p-8">
        <div className="space-y-6">
          {children}
        </div>
      </form>
    </motion.div>
  );
};

// Common form field icons
export const FormIcons = {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  Search
};