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
  const baseClasses = 'block w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-colors';

  const variantClasses = error
    ? 'border-status-overdue text-status-overdue placeholder-red-300 focus:ring-status-overdue focus:border-status-overdue'
    : 'border-border-gray dark:border-gray-600 text-text-primary dark:text-dark-text placeholder-text-secondary dark:placeholder-dark-textSecondary focus:ring-active-blue focus:border-active-blue bg-background-white dark:bg-dark-surface';

  const disabledClass = disabled ? 'bg-background-gray dark:bg-gray-700 cursor-not-allowed' : '';
  const inputClasses = `${baseClasses} ${variantClasses} ${disabledClass} ${className}`;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary dark:text-dark-text mb-1">
          {label} {required && <span className="text-status-overdue">*</span>}
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
        <p className="mt-1 text-sm text-status-overdue">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
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