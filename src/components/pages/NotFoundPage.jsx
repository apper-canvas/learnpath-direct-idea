import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import IconContainer from '@/components/atoms/IconContainer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IconContainer
            iconName="AlertTriangle"
            iconSize={48}
            iconClassName="text-primary"
            className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 mb-6 mx-auto rounded-full"
          />
          
          <Heading level={1} className="text-6xl mb-4">404</Heading>
          <Heading level={2} className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </Heading>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="primary"
              className="px-6 py-3"
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;