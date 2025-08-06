// Comprehensive Formatting Utilities

/**
 * Format currency values with proper localization
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'NPR', 
  locale: string = 'en-NP'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'NPR' ? 'USD' : currency, // Fallback for NPR
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('$', 'Rs. ');
  } catch (error) {
    // Fallback formatting
    return `Rs. ${amount.toFixed(2)}`;
  }
};

/**
 * Format numbers with thousand separators
 */
export const formatNumber = (
  num: number, 
  decimals: number = 0,
  locale: string = 'en-NP'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch (error) {
    return num.toFixed(decimals);
  }
};

/**
 * Format dates with various options
 */
export const formatDate = (
  dateInput: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' | 'iso' | 'relative' = 'medium',
  locale: string = 'en-US'
): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  try {
    switch (format) {
      case 'short':
        return date.toLocaleDateString(locale, {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric'
        });
      
      case 'medium':
        return date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      
      case 'long':
        return date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'full':
        return date.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'iso':
        return date.toISOString().split('T')[0];
      
      case 'relative':
        return formatRelativeDate(date);
      
      default:
        return date.toLocaleDateString(locale);
    }
  } catch (error) {
    return date.toLocaleDateString();
  }
};

/**
 * Format relative dates (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      const suffix = count === 1 ? '' : 's';
      const timeAgo = diffInSeconds > 0 ? 'ago' : 'from now';
      return `${count} ${interval.label}${suffix} ${timeAgo}`;
    }
  }
  
  return 'just now';
};

/**
 * Format time with various options
 */
export const formatTime = (
  dateInput: string | Date,
  format: '12h' | '24h' = '12h',
  includeSeconds: boolean = false,
  locale: string = 'en-US'
): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return 'Invalid Time';
  }

  try {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: format === '12h'
    };

    if (includeSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString(locale, options);
  } catch (error) {
    return date.toLocaleTimeString();
  }
};

/**
 * Format datetime combinations
 */
export const formatDateTime = (
  dateInput: string | Date,
  dateFormat: 'short' | 'medium' | 'long' = 'medium',
  timeFormat: '12h' | '24h' = '12h',
  locale: string = 'en-US'
): string => {
  const formattedDate = formatDate(dateInput, dateFormat, locale);
  const formattedTime = formatTime(dateInput, timeFormat, false, locale);
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    return `${value.toFixed(decimals)}%`;
  }
};

/**
 * Format file sizes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (
  phone: string,
  format: 'international' | 'national' | 'local' = 'national'
): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Nepali phone numbers
  if (cleaned.startsWith('977')) {
    const number = cleaned.substring(3);
    switch (format) {
      case 'international':
        return `+977-${number.substring(0, 2)}-${number.substring(2)}`;
      case 'national':
        return `0${number.substring(0, 2)}-${number.substring(2)}`;
      case 'local':
        return number;
      default:
        return phone;
    }
  }
  
  // Handle 10-digit numbers (assuming Nepali mobile)
  if (cleaned.length === 10) {
    switch (format) {
      case 'international':
        return `+977-${cleaned}`;
      case 'national':
        return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
      case 'local':
        return cleaned;
      default:
        return phone;
    }
  }
  
  return phone; // Return original if no pattern matches
};

/**
 * Format addresses for display
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Format names (proper case)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format invoice numbers with padding
 */
export const formatInvoiceNumber = (
  number: number | string,
  prefix: string = 'INV',
  padding: number = 4
): string => {
  const numStr = number.toString().padStart(padding, '0');
  return `${prefix}-${numStr}`;
};

/**
 * Format status badges with appropriate styling
 */
export const formatStatusBadge = (status: string): {
  text: string;
  className: string;
} => {
  const statusMap: Record<string, { text: string; className: string }> = {
    paid: { text: 'Paid', className: 'bg-green-100 text-green-800' },
    pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    overdue: { text: 'Overdue', className: 'bg-red-100 text-red-800' },
    draft: { text: 'Draft', className: 'bg-gray-100 text-gray-800' },
    cancelled: { text: 'Cancelled', className: 'bg-gray-100 text-gray-600' },
    refunded: { text: 'Refunded', className: 'bg-blue-100 text-blue-800' },
    in_stock: { text: 'In Stock', className: 'bg-green-100 text-green-800' },
    low_stock: { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' },
    out_of_stock: { text: 'Out of Stock', className: 'bg-red-100 text-red-800' },
    expired: { text: 'Expired', className: 'bg-gray-100 text-gray-600' },
    active: { text: 'Active', className: 'bg-green-100 text-green-800' },
    inactive: { text: 'Inactive', className: 'bg-gray-100 text-gray-600' },
    blocked: { text: 'Blocked', className: 'bg-red-100 text-red-800' }
  };

  return statusMap[status.toLowerCase()] || { 
    text: status, 
    className: 'bg-gray-100 text-gray-800' 
  };
};

/**
 * Format duration (in seconds) to human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format arrays as comma-separated lists
 */
export const formatList = (
  items: string[],
  conjunction: 'and' | 'or' = 'and',
  maxItems?: number
): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  
  let displayItems = items;
  let suffix = '';
  
  if (maxItems && items.length > maxItems) {
    displayItems = items.slice(0, maxItems);
    suffix = ` and ${items.length - maxItems} more`;
  }
  
  if (displayItems.length === 2) {
    return `${displayItems[0]} ${conjunction} ${displayItems[1]}${suffix}`;
  }
  
  const lastItem = displayItems.pop();
  return `${displayItems.join(', ')}, ${conjunction} ${lastItem}${suffix}`;
};

/**
 * Format search highlights
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  className: string = 'bg-yellow-200'
): string => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<mark class="${className}">$1</mark>`);
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  
  return `• ${errors.join('\n• ')}`;
};