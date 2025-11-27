import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm',
    outlined: 'bg-transparent border-gray-300 dark:border-gray-600'
  };

  const baseClasses = 'border rounded-lg shadow-sm overflow-hidden';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
};

export default Card;