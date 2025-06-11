import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from '@/components/molecules/CourseCard';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const CourseList = ({ courses, userProgress, navigate, title, description, showBrowseButton }) => {
  const getProgressForCourse = (courseId) => {
    return userProgress.find(p => p.courseId === courseId);
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <Heading level={3} className="mt-4 text-lg font-medium">No courses found</Heading>
        <p className="mt-2 text-gray-500">{description || 'Start your learning journey by browsing our course catalog'}</p>
        {showBrowseButton && (
          <Button
            onClick={() => navigate('/browse')}
            className="mt-4"
          >
            Browse Courses
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level={2} className="text-xl">
              {title}
            </Heading>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          {showBrowseButton && (
            <Button
              onClick={() => navigate('/browse')}
              variant="ghost"
              className="text-primary hover:text-primary/80 font-medium"
              icon={ApperIcon}
              iconName="ArrowRight"
              iconSize={16}
            >
              View All
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => {
          const progress = getProgressForCourse(course.id);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard 
                course={course}
                progress={progress}
                onClick={() => navigate(`/course/${course.id}`)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseList;