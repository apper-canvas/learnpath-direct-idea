import * as Icons from 'lucide-react';
import React from 'react';

const ApperIcon = ({ name, className, size = 24, ...props }) => {
    let IconComponent = Icons[name];
    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist in lucide-react`);
        IconComponent = Icons['Smile']; // Fallback icon
    }
    return <IconComponent size={size} className={className} {...props} />;
};
export default ApperIcon;