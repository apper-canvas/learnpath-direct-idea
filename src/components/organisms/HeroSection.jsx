import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import IconContainer from '@/components/atoms/IconContainer';
import ProgressRing from '@/components/atoms/ProgressRing';

const HeroSection = ({ overallProgress = 0, enrolledCount = 0, isDashboard }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`text-center ${isDashboard ? 'bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-8' : ''}`}
    >
      {!isDashboard && (
        <IconContainer
          iconName="GraduationCap"
          iconSize={40}
          iconClassName="text-white"
          className="w-20 h-20 bg-gradient-to-br from-primary to-secondary mb-6 mx-auto rounded-2xl"
        />
      )}

      <Heading level={1} className={`text-4xl md:text-5xl mb-6 ${isDashboard ? 'text-left' : ''}`}>
        {isDashboard ? (
          <>
            Master New Skills with
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Structured Learning
            </span>
          </>
        ) : (
          <>
            Learn New Skills Through
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Structured Courses
            </span>
          </>
        )}
      </Heading>
      <p className={`text-xl text-gray-600 mb-8 max-w-2xl ${isDashboard ? 'text-left' : 'mx-auto'}`}>
        Master new skills with our comprehensive learning platform. Track your progress,
        take quizzes, and earn certificates as you advance through structured courses.
      </p>
      <div className={`flex flex-col sm:flex-row gap-4 ${isDashboard ? 'justify-start' : 'justify-center'}`}>
        <Button
          onClick={() => navigate('/browse')}
          variant="primary"
        >
          Explore Courses
        </Button>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline-primary"
        >
          My Dashboard
        </Button>
      </div>

      {isDashboard && enrolledCount > 0 && (
        <div className="flex items-center gap-8 mt-8">
          <div className="text-center">
            <ProgressRing progress={overallProgress} size={80} />
            <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{enrolledCount}</div>
            <p className="text-sm text-gray-600">Courses Enrolled</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HeroSection;