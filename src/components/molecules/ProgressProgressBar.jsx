import React from 'react';
import { motion } from 'framer-motion';

const ProgressProgressBar = ({ progress, isCompleted, animationDelay }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, delay: animationDelay }}
        className={`h-2 rounded-full ${
          isCompleted
            ? 'bg-gradient-to-r from-success to-success/80'
            : 'bg-gradient-to-r from-primary to-secondary'
        }`}
      />
    </div>
  );
};

export default ProgressProgressBar;