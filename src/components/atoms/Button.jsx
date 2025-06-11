import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className, variant = 'primary', disabled, type = 'button', whileHover, whileTap, icon: Icon, iconSize, ...props }) => {
  let baseClasses = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md';
      break;
    case 'secondary':
      variantClasses = 'bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md';
      break;
    case 'outline-primary':
      variantClasses = 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
      break;
    case 'outline-secondary':
      variantClasses = 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white';
      break;
    case 'ghost':
      variantClasses = 'text-gray-600 hover:text-gray-800 hover:bg-gray-100';
      break;
    case 'success':
      variantClasses = 'bg-success text-white hover:bg-success/90 shadow-sm hover:shadow-md';
      break;
    case 'error':
      variantClasses = 'bg-error text-white hover:bg-error/90 shadow-sm hover:shadow-md';
      break;
    case 'info':
      variantClasses = 'bg-info text-white hover:bg-info/90 shadow-sm hover:shadow-md';
      break;
    default:
      variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  const mergedClasses = `${baseClasses} ${variantClasses} ${className || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={mergedClasses}
      disabled={disabled}
      whileHover={whileHover || (disabled ? {} : { scale: 1.05 })}
      whileTap={whileTap || (disabled ? {} : { scale: 0.95 })}
      {...props}
    >
      {Icon && <Icon size={iconSize || 16} />}
      {children}
    </motion.button>
  );
};

export default Button;