import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressRing from '../components/ProgressRing';
import { courseService, userProgressService } from '../services';

const Progress = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgressData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, progressData] = await Promise.all([
          courseService.getAll(),
          userProgressService.getAll()
        ]);
        setCourses(coursesData);
        setUserProgress(progressData);
      } catch (err) {
        setError(err.message || 'Failed to load progress data');
        toast.error('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const getEnrolledCourses = () => {
    const enrolledCourseIds = userProgress.map(p => p.courseId);
    return courses.filter(course => enrolledCourseIds.includes(course.id));
  };

  const calculateCourseProgress = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    const progress = userProgress.find(p => p.courseId === courseId);
    
    if (!course || !progress) return 0;
    
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const calculateOverallStats = () => {
    const enrolledCourses = getEnrolledCourses();
    
    if (enrolledCourses.length === 0) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        averageProgress: 0,
        certificates: 0
      };
    }

    const totalLessons = enrolledCourses.reduce((sum, course) => {
      return sum + course.modules.reduce((moduleSum, module) => moduleSum + module.lessons.length, 0);
    }, 0);

    const completedLessons = userProgress.reduce((sum, progress) => {
      return sum + progress.completedLessons.length;
    }, 0);

    const completedCourses = enrolledCourses.filter(course => {
      const progress = calculateCourseProgress(course.id);
      return progress === 100;
    }).length;

    const averageProgress = enrolledCourses.reduce((sum, course) => {
      return sum + calculateCourseProgress(course.id);
    }, 0) / enrolledCourses.length;

    return {
      totalCourses: enrolledCourses.length,
      completedCourses,
      totalLessons,
      completedLessons,
      averageProgress: Math.round(averageProgress),
      certificates: completedCourses
    };
  };

  const getRecentActivity = () => {
    return userProgress
      .filter(p => p.lastAccessed)
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, 5)
      .map(progress => {
        const course = courses.find(c => c.id === progress.courseId);
        return { course, progress };
      })
      .filter(item => item.course);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Progress</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const enrolledCourses = getEnrolledCourses();
  const stats = calculateOverallStats();
  const recentActivity = getRecentActivity();

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No progress to show</h3>
          <p className="mt-2 text-gray-500">Enroll in courses to start tracking your progress</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Browse Courses
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
            </div>
            <ProgressRing progress={stats.averageProgress} size={48} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Courses Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedLessons}/{stats.totalLessons}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-success/20 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Certificates Earned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center achievement-badge">
              <ApperIcon name="Award" size={24} className="text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <div>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">Course Progress</h2>
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
                      <h3 className="font-semibold text-gray-900 break-words">
                        {course.title}
                      </h3>
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2 rounded-full ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-success to-success/80' 
                              : 'bg-gradient-to-r from-primary to-secondary'
                          }`}
                        />
                      </div>
                    </div>
                    <ProgressRing progress={progress} size={40} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">Recent Activity</h2>
          
          {recentActivity.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map(({ course, progress }, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 break-words">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {Math.round(calculateCourseProgress(course.id))}%
                      </p>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;