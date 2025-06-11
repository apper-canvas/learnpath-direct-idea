import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressRing from '../components/ProgressRing';
import { courseService, userProgressService } from '../services';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getById(id),
          userProgressService.getAll()
        ]);
        
        setCourse(courseData);
        const progress = progressData.find(p => p.courseId === id);
        setUserProgress(progress);
      } catch (err) {
        setError(err.message || 'Failed to load course');
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourseData();
    }
  }, [id]);

  const handleEnroll = async () => {
    if (userProgress) {
      // Already enrolled, go to first lesson
      const firstLesson = course.modules[0]?.lessons[0];
      if (firstLesson) {
        navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
      }
      return;
    }

    setEnrolling(true);
    try {
      const newProgress = await userProgressService.create({
        courseId: course.id,
        completedLessons: [],
        quizScores: {},
        notes: {},
        lastAccessed: new Date()
      });
      
      setUserProgress(newProgress);
      toast.success('Successfully enrolled in course!');
      
      // Navigate to first lesson
      const firstLesson = course.modules[0]?.lessons[0];
      if (firstLesson) {
        navigate(`/course/${course.id}/lesson/${firstLesson.id}`);
      }
    } catch (err) {
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const calculateProgress = () => {
    if (!course || !userProgress) return 0;
    
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = userProgress.completedLessons.length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getTotalDuration = () => {
    if (!course) return 0;
    return course.modules.reduce((sum, module) => 
      sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.duration, 0), 0
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-success bg-success/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-error bg-error/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested course could not be found'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const totalDuration = getTotalDuration();
  const isEnrolled = !!userProgress;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {course.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex items-center gap-6 mb-6">
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
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnroll}
                disabled={enrolling}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isEnrolled
                    ? 'bg-success text-white hover:bg-success/90'
                    : 'bg-primary text-white hover:bg-primary/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
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
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-heading font-semibold text-gray-900">Course Content</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {course.modules.map((module, moduleIndex) => (
            <div key={module.id} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  {moduleIndex + 1}
                </span>
                {module.title}
              </h3>
              
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = userProgress?.completedLessons.includes(lesson.id);
                  return (
                    <div 
                      key={lesson.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isEnrolled 
                          ? 'hover:bg-gray-50 cursor-pointer' 
                          : 'opacity-60'
                      }`}
                      onClick={() => {
                        if (isEnrolled) {
                          navigate(`/course/${course.id}/lesson/${lesson.id}`);
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
                        <p className="font-medium text-gray-900 break-words">
                          {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lesson.type} • {lesson.duration} min
                        </p>
                      </div>
                      
                      {!isEnrolled && (
                        <ApperIcon name="Lock" size={16} className="text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetail;