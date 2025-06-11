import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import IconContainer from '@/components/atoms/IconContainer';

const FeatureCard = ({ iconName, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <IconContainer
        iconName={iconName}
        iconSize={24}
        iconClassName="text-primary"
        className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 mb-4"
      />
      <Heading level={3} className="text-xl mb-2">
        {title}
      </Heading>
      <p className="text-gray-600">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;