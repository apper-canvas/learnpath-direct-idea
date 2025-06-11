import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import LessonItem from '@/components/molecules/LessonItem';

const CourseContent = ({ course, userProgress, navigate }) => {
  const isEnrolled = !!userProgress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="p-6 border-b border-gray-100">
        <Heading level={2} className="text-xl">Course Content</Heading>
      </div>
      
      <div className="divide-y divide-gray-100">
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="p-6">
            <Heading level={3} className="text-lg font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                {moduleIndex + 1}
              </span>
              {module.title}
            </Heading>
            
            <div className="space-y-3">
              {module.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isEnrolled={isEnrolled}
                  isCompleted={userProgress?.completedLessons.includes(lesson.id)}
                  onClick={() => navigate(`/course/${course.id}/lesson/${lesson.id}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseContent;