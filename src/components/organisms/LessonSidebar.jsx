import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import LessonItem from '@/components/molecules/LessonItem';

const LessonSidebar = ({ course, userProgress, currentLessonId, notes, onSaveNotes }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <Heading level={3} className="text-lg mb-4">
          My Notes
        </Heading>
        <Input
          type="textarea"
          value={notes}
          onChange={(e) => onSaveNotes(e.target.value)} // Update state on change, save on blur
          onBlur={(e) => onSaveNotes(e.target.value)} // Explicit save on blur
          placeholder="Add your notes here..."
          rows={5}
        />
        <p className="text-xs text-gray-500 mt-2">Notes are saved automatically</p>
      </motion.div>

      {/* Course Progress */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <Heading level={3} className="text-lg mb-4">
          Course Progress
        </Heading>
        <div className="space-y-3">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-sm font-medium text-gray-700 mb-2 break-words">
                {module.title}
              </p>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isEnrolled={true} // Assumed to be enrolled if viewing lesson
                    isCompleted={userProgress?.completedLessons.includes(lesson.id)}
                    isCurrent={lesson.id === currentLessonId}
                    onClick={() => navigate(`/course/${course.id}/lesson/${lesson.id}`)}
                  >
                    {/* Render indicator for completed/current */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      userProgress?.completedLessons.includes(lesson.id)
                        ? 'bg-success text-white'
                        : 'bg-gray-200'
                    }`}>
                      {userProgress?.completedLessons.includes(lesson.id) ? (
                        <ApperIcon name="Check" size={10} />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  </LessonItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LessonSidebar;