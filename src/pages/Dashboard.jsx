import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressRing from '../components/ProgressRing';
import CourseCard from '../components/CourseCard';
import { courseService, userProgressService } from '../services';

const Dashboard = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courses, progress] = await Promise.all([
          courseService.getAll(),
          userProgressService.getAll()
        ]);
        
        // Filter to show only enrolled courses (courses with progress)
        const enrolledCourseIds = progress.map(p => p.courseId);
        const enrolled = courses.filter(course => enrolledCourseIds.includes(course.id));
        
        setEnrolledCourses(enrolled);
        setUserProgress(progress);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getProgressForCourse = (courseId) => {
    return userProgress.find(p => p.courseId === courseId);
  };

  const calculateOverallStats = () => {
    if (userProgress.length === 0) return { totalLessons: 0, completedLessons: 0, studyStreak: 0 };
    
    const totalLessons = userProgress.reduce((sum, progress) => {
      const course = enrolledCourses.find(c => c.id === progress.courseId);
      if (!course) return sum;
      return sum + course.modules.reduce((moduleSum, module) => moduleSum + module.lessons.length, 0);
    }, 0);

    const completedLessons = userProgress.reduce((sum, progress) => {
      return sum + progress.completedLessons.length;
    }, 0);

    return {
      totalLessons,
      completedLessons,
      studyStreak: 7 // Mock streak data
    };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Course Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Dashboard</h3>
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

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No courses enrolled yet</h3>
          <p className="mt-2 text-gray-500">Start your learning journey by browsing our course catalog</p>
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
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
              </p>
            </div>
            <ProgressRing 
              progress={stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0} 
              size={48}
            />
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
              <p className="text-sm text-gray-600 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-success/20 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
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
              <p className="text-sm text-gray-600 mb-1">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.studyStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-900">My Courses</h2>
          <button
            onClick={() => navigate('/browse')}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Browse More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, index) => {
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
    </div>
  );
};

export default Dashboard;