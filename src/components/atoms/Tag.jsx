import React from 'react';

const Tag = ({ children, className, variant = 'gray', ...props }) => {
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary/10 text-primary';
      break;
    case 'secondary':
      variantClasses = 'bg-secondary/10 text-secondary';
      break;
    case 'success':
      variantClasses = 'bg-success/10 text-success';
      break;
    case 'warning':
      variantClasses = 'bg-warning/10 text-warning';
      break;
    case 'error':
      variantClasses = 'bg-error/10 text-error';
      break;
    case 'info':
      variantClasses = 'bg-info/10 text-info';
      break;
    default:
      variantClasses = 'bg-gray-100 text-gray-600';
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${variantClasses} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;