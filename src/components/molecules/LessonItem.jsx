import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';

const LessonItem = ({ lesson, isEnrolled, isCompleted, isCurrent, onClick }) => {
  return (
    <div
      key={lesson.id}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isEnrolled
          ? 'hover:bg-gray-50 cursor-pointer'
          : 'opacity-60'
      } ${isCurrent ? 'bg-primary/10 text-primary' : ''}`}
      onClick={() => {
        if (isEnrolled) {
          onClick();
        }
      }}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        isCompleted
          ? 'bg-success text-white'
          : 'bg-gray-200 text-gray-600'
      }`}>
        {isCompleted ? (
          <ApperIcon name="Check" size={12} />
        ) : (
          <ApperIcon name="Play" size={12} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Heading level={4} className="text-base font-medium break-words">
          {lesson.title}
        </Heading>
        <p className="text-sm text-gray-500">
          {lesson.type} • {lesson.duration} min
        </p>
      </div>

      {!isEnrolled && (
        <ApperIcon name="Lock" size={16} className="text-gray-400" />
      )}
    </div>
  );
};

export default LessonItem;