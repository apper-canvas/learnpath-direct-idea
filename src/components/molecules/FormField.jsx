import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, ...inputProps }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Input id={id} {...inputProps} />
    </div>
  );
};

export default FormField;