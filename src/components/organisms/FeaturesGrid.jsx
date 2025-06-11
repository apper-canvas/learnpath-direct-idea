import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/molecules/FeatureCard';

const FeaturesGrid = () => {
  const features = [
    {
      icon: 'BookOpen',
      title: 'Structured Courses',
      description: 'Learn through well-organized modules and lessons'
    },
    {
      icon: 'TrendingUp',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with visual progress indicators'
    },
    {
      icon: 'Award',
      title: 'Certificates',
      description: 'Earn certificates upon successful course completion'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid md:grid-cols-3 gap-8 mb-16"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          iconName={feature.icon}
          title={feature.title}
          description={feature.description}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default FeaturesGrid;