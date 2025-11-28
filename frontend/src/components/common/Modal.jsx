import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  isBottomSheet = false,  // New prop to control bottom sheet behavior
  ...props
}) => {
  const modalRef = useRef(null);

  // Handle Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // Reset overflow
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOverlayClick) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  if (!isOpen) return null;

  // Size classes based on Tailwind
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    full: 'max-w-full'
  };

  // Determine if mobile view (using Tailwind's md breakpoint at 768px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Use bottom sheet if explicitly set or if on mobile for todo modals
  const useBottomSheet = isBottomSheet || (isMobile && title && (title.includes('할일') || title.includes('추가') || title.includes('수정')));

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" onClick={closeOnOverlayClick ? onClose : undefined} />

      {/* Modal container */}
      <div
        className={`flex ${useBottomSheet
          ? 'items-end justify-center h-full'
          : 'items-center justify-center min-h-screen p-4'}`}
      >
        <div
          ref={modalRef}
          className={`relative bg-background-white dark:bg-dark-surface ${
            useBottomSheet
              ? 'w-full rounded-t-lg shadow-lg max-h-[80vh] flex flex-col'
              : `rounded shadow-google-lg ${sizeClasses[size]} w-full max-h-[90vh]`
          } overflow-y-auto`}
        >
          {/* Modal header */}
          <div className={`${
            useBottomSheet
              ? 'px-4 py-3 border-b border-border-light dark:border-gray-700 flex justify-between items-center sticky top-0 bg-background-white dark:bg-dark-surface z-10 rounded-t-lg'
              : 'px-6 py-4 border-b border-border-light dark:border-gray-700 flex justify-between items-center sticky top-0 bg-background-white dark:bg-dark-surface z-10'
          }`}
          >
            {title && (
              <h3 className={`${
                useBottomSheet
                  ? 'text-lg leading-6 font-medium text-text-primary dark:text-dark-text'
                  : 'text-lg leading-6 font-medium text-text-primary dark:text-dark-text'
              }`}
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="text-text-secondary hover:text-text-primary dark:hover:text-dark-text focus:outline-none p-1 rounded-full hover:bg-hover-gray dark:hover:bg-gray-700 transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Modal body */}
          <div className={`${useBottomSheet ? 'p-4 flex-1 overflow-y-auto' : 'px-6 py-5'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  isBottomSheet: PropTypes.bool,
};

export default Modal;