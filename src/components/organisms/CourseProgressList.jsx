import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import ProgressProgressBar from '@/components/molecules/ProgressProgressBar';
import Heading from '@/components/atoms/Heading';

const CourseProgressList = ({ enrolledCourses, userProgress, calculateCourseProgress }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Heading level={2} className="text-xl mb-6">Course Progress</Heading>
      <div className="space-y-4">
        {enrolledCourses.map((course, index) => {
          const progress = calculateCourseProgress(course.id);
          const isCompleted = progress === 100;
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <Heading level={3} className="text-lg font-semibold break-words">
                    {course.title}
                  </Heading>
                  <p className="text-sm text-gray-500 break-words">
                    {course.instructor}
                  </p>
                </div>
                {isCompleted && (
                  <div className="achievement-badge">
                    <ApperIcon name="Award" size={24} className="text-accent" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                  </div>
                  <ProgressProgressBar progress={progress} isCompleted={isCompleted} animationDelay={index * 0.1} />
                </div>
                <ProgressRing progress={progress} size={40} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgressList;