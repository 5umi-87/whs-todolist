import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  id, 
  value, 
  onChange, 
  options, 
  placeholder, 
  error, 
  disabled = false, 
  required = false, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm';
  
  const variantClasses = error 
    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-primary-main focus:border-primary-main';
  
  const disabledClass = disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '';
  const selectClasses = `${baseClasses} ${variantClasses} ${disabledClass} ${className}`;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;