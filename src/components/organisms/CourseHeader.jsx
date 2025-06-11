import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Tag from '@/components/atoms/Tag';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const CourseHeader = ({
  course,
  userProgress,
  onEnroll,
  enrolling,
  calculateProgress,
  getTotalDuration
}) => {
  const progress = calculateProgress();
  const totalDuration = getTotalDuration();
  const isEnrolled = !!userProgress;

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'gray';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Tag variant={getDifficultyVariant(course.difficulty)}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </Tag>
            <Tag variant="primary">
              {course.category}
            </Tag>
          </div>
          
          <Heading level={1} className="text-3xl mb-4">
            {course.title}
          </Heading>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {course.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="User" size={16} className="text-gray-500" />
              <span className="text-gray-700">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={16} className="text-gray-500" />
              <span className="text-gray-700">{Math.round(totalDuration / 60)} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="BookOpen" size={16} className="text-gray-500" />
              <span className="text-gray-700">
                {course.modules.reduce((sum, module) => sum + module.lessons.length, 0)} lessons
              </span>
            </div>
          </div>

          {isEnrolled && (
            <div className="flex items-center gap-4 mb-6">
              <ProgressRing progress={progress} size={48} />
              <div>
                <p className="text-sm text-gray-600">Your Progress</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(progress)}% Complete</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
              <ApperIcon name="Play" size={32} className="text-primary" />
            </div>
            
            <Button
              onClick={onEnroll}
              disabled={enrolling}
              className="w-full"
              variant={isEnrolled ? 'success' : 'primary'}
            >
              {enrolling ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enrolling...
                </div>
              ) : isEnrolled ? (
                'Continue Learning'
              ) : (
                'Enroll Now - Free'
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseHeader;