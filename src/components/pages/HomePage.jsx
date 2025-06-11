import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturesGrid from '@/components/organisms/FeaturesGrid';
import StatsOverview from '@/components/organisms/StatsOverview';

const HomePage = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <HeroSection isDashboard={false} />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          <Heading level={3} className="text-xl font-semibold mb-6 text-center">
            Why Choose LearnPath?
          </Heading>
          <StatsOverview />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;