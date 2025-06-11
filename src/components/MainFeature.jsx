import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import CourseCard from './CourseCard';
import ProgressRing from './ProgressRing';
import { courseService, userProgressService } from '../services';

const MainFeature = () => {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courses, progress] = await Promise.all([
          courseService.getAll(),
          userProgressService.getAll()
        ]);
        
        // Get top 6 courses as featured
        setFeaturedCourses(courses.slice(0, 6));
        setUserProgress(progress);
      } catch (err) {
        setError(err.message || 'Failed to load featured content');
        toast.error('Failed to load featured content');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

  const getProgressForCourse = (courseId) => {
    return userProgress.find(p => p.courseId === courseId);
  };

  const calculateOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    
    const enrolledCourses = featuredCourses.filter(course => 
      userProgress.some(p => p.courseId === course.id)
    );
    
    if (enrolledCourses.length === 0) return 0;
    
    const totalProgress = enrolledCourses.reduce((sum, course) => {
      const progress = getProgressForCourse(course.id);
      const totalLessons = course.modules.reduce((moduleSum, module) => 
        moduleSum + module.lessons.length, 0
      );
      const completedLessons = progress ? progress.completedLessons.length : 0;
      return sum + (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
    }, 0);
    
    return Math.round(totalProgress / enrolledCourses.length);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-4 mt-6">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        
        {/* Courses Grid Skeleton */}
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
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Content</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const enrolledCount = userProgress.length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Master New Skills with
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Structured Learning
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
              Join thousands of learners advancing their careers through our comprehensive course platform. 
              Track your progress, take quizzes, and earn certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse')}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Explore Courses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200"
              >
                My Dashboard
              </motion.button>
            </div>
          </div>
          
          {enrolledCount > 0 && (
            <div className="flex items-center gap-8">
              <div className="text-center">
                <ProgressRing progress={overallProgress} size={80} />
                <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{enrolledCount}</div>
                <p className="text-sm text-gray-600">Courses Enrolled</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-heading font-semibold text-gray-900">
              Featured Courses
            </h3>
            <p className="text-gray-600">Popular courses to boost your skills</p>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2"
          >
            View All
            <ApperIcon name="ArrowRight" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => {
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

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-6 text-center">
          Why Choose LearnPath?
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600">Expert Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">1,200+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">95%</div>
            <div className="text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;