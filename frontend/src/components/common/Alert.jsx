import React from 'react';
import PropTypes from 'prop-types';
import { XCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  showIcon = true,
  className = '' 
}) => {
  const typeClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
  };

  const iconMap = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle
  };

  const IconComponent = showIcon ? iconMap[type] : null;

  return (
    <div className={`border rounded-md p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          {message && (
            <div className={`mt-2 text-sm ${type === 'error' ? 'text-red-700 dark:text-red-300' : ''}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md ${type === 'error' ? 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30' : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main`}
              onClick={onClose}
            >
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
};

export default Alert;