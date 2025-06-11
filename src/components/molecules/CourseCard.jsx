import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const CourseCard = ({ course, progress, onClick }) => {
  const calculateProgress = () => {
    if (!progress) return 0;
    
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'gray';
    }
  };

  const progressPercentage = calculateProgress();
  const isEnrolled = !!progress;
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer max-w-full overflow-hidden"
    >
      {/* Course Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <ApperIcon name="Play" size={32} className="text-primary" />
        {isEnrolled && (
          <div className="absolute top-2 right-2">
            <ProgressRing progress={progressPercentage} size={32} />
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tag variant={getDifficultyVariant(course.difficulty)}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </Tag>
          <Tag variant="primary">
            {course.category}
          </Tag>
        </div>

        <Heading level={3} className="text-lg leading-tight break-words line-clamp-2">
          {course.title}
        </Heading>

        <p className="text-gray-600 text-sm leading-relaxed break-words line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="User" size={14} />
            <span className="break-words">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            <span>{course.duration} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="BookOpen" size={14} />
            <span>{totalLessons} lessons</span>
          </div>
          {isEnrolled && (
            <div className="flex items-center gap-1 text-primary">
              <ApperIcon name="TrendingUp" size={14} />
              <span className="font-medium">{Math.round(progressPercentage)}% complete</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="pt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full"
          variant={isEnrolled ? 'success' : 'primary'}
        >
          {isEnrolled ? 'Continue Learning' : 'View Course'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;