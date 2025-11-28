import React from 'react';
import PropTypes from 'prop-types';

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
  // Define button styles based on variant and size (구글 캘린더 스타일)
  const variantStyles = {
    primary: 'bg-primary-main hover:bg-primary-dark text-text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-active-blue disabled:bg-text-disabled',
    secondary: 'bg-transparent border border-border-gray dark:border-gray-600 text-text-primary dark:text-dark-text hover:bg-hover-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-active-blue disabled:bg-background-gray',
    icon: 'bg-transparent hover:bg-hover-gray dark:hover:bg-gray-700 text-text-primary dark:text-dark-text rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-active-blue disabled:hover:bg-transparent',
    danger: 'bg-status-overdue hover:bg-red-700 text-text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-status-overdue disabled:bg-red-300',
    success: 'bg-status-completed hover:bg-green-700 text-text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-status-completed disabled:bg-green-300'
  };

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-4',
    md: 'text-sm py-2 px-6',
    lg: 'text-base py-2.5 px-6'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = loading ? 'opacity-75 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // 구글 캘린더 스타일: primary는 둥근 모서리 (24px), 나머지는 작은 둥근 모서리
  const roundedClass = variant === 'primary' ? 'rounded-3xl' : 'rounded';

  const buttonClasses = `inline-flex items-center justify-center font-medium ${roundedClass} border-transparent transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${disabledClass} ${loadingClass} ${className}`;

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
  variant: PropTypes.oneOf(['primary', 'secondary', 'icon', 'danger', 'success']),
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