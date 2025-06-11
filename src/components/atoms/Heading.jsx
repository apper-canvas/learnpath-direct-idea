import React from 'react';

const Heading = ({ level, children, className, ...props }) => {
  const Tag = `h${level >= 1 && level <= 6 ? level : 1}`;
  return (
    <Tag className={`font-heading font-bold text-gray-900 ${className || ''}`} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;