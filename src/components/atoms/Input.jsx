import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, ...props }) => {
  const baseClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200";

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} resize-none ${className || ''}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className || ''}`}
      {...props}
    />
  );
};

export default Input;