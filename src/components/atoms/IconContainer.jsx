import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const IconContainer = ({ iconName, iconSize = 24, iconClassName, className, children, ...props }) => {
  return (
    <div
      className={`rounded-lg flex items-center justify-center ${className || ''}`}
      {...props}
    >
      {iconName && <ApperIcon name={iconName} size={iconSize} className={iconClassName} />}
      {children}
    </div>
  );
};

export default IconContainer;