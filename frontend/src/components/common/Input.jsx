import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled = false, 
  required = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main sm:text-sm';
  
  const variantClasses = error 
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-main focus:border-primary-main';
  
  const disabledClass = disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '';
  const inputClasses = `${baseClasses} ${variantClasses} ${disabledClass} ${className}`;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;