 import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-indigo-600 hover:text-indigo-800 underline'
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;