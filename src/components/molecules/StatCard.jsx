import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Heading from '@/components/atoms/Heading';

const StatCard = ({ title, value, iconName, iconBgClass, iconColorClass, progressValue, animationDelay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <Heading level={2} className="text-2xl font-bold">
            {value}
          </Heading>
        </div>
        {progressValue !== undefined ? (
          <ProgressRing progress={progressValue} size={48} />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass}`}>
            <ApperIcon name={iconName} size={24} className={iconColorClass} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;