import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false, 
  indeterminate = false,
  className = '',
  ...props 
}) => {
  const checkboxRef = React.useRef();

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 dark:border-gray-600 rounded ${
          disabled ? 'cursor-not-allowed' : ''
        } ${className}`}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;