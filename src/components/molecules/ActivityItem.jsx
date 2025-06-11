import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';

const ActivityItem = ({ courseTitle, lastAccessed, progressPercentage, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
          <ApperIcon name="BookOpen" size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Heading level={3} className="text-base font-medium mb-1 break-words">
            {courseTitle}
          </Heading>
          <p className="text-sm text-gray-500">
            Last accessed: {new Date(lastAccessed).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {Math.round(progressPercentage)}%
          </p>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityItem;