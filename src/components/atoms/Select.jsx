import React from 'react';

const Select = ({ value, onChange, options, className, ...props }) => {
  const baseClasses = 'px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white';

  return (
    <select
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${className || ''}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;