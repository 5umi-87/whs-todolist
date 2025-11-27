import React from 'react';
import PropTypes from 'prop-types';
import { LucideIcon } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left', 
  disabled = false, 
  loading = false, 
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  // Define button styles based on variant and size
  const variantStyles = {
    primary: 'bg-primary-main hover:bg-primary-dark text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:bg-gray-400',
    secondary: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:bg-gray-100',
    icon: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:hover:bg-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300'
  };

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = loading ? 'opacity-75 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = `inline-flex items-center justify-center font-medium rounded-md border border-transparent shadow-sm ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${disabledClass} ${loadingClass} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'icon', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;