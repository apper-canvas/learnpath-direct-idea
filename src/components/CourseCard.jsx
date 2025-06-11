import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import ProgressRing from './ProgressRing';

const CourseCard = ({ course, progress, onClick }) => {
  const calculateProgress = () => {
    if (!progress) return 0;
    
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-success bg-success/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-error bg-error/10';
      default: return 'text-gray-600 bg-gray-100';
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {course.category}
          </span>
        </div>

        <h3 className="text-lg font-heading font-semibold text-gray-900 leading-tight break-words">
          {course.title}
        </h3>

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
        <motion.button
          whileHover={{ scale: 1.05, brightness: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
            isEnrolled
              ? 'bg-success text-white hover:bg-success/90'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isEnrolled ? 'Continue Learning' : 'View Course'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;