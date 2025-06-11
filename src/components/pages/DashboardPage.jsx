import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import DashboardStats from '@/components/organisms/DashboardStats';
import CourseList from '@/components/organisms/CourseList';
import { courseService, userProgressService } from '@/services';

const DashboardPage = () => {
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
          <Heading level={3} className="text-lg font-medium mb-2">Failed to Load Dashboard</Heading>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
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
          <Heading level={3} className="mt-4 text-lg font-medium">No courses enrolled yet</Heading>
          <p className="mt-2 text-gray-500">Start your learning journey by browsing our course catalog</p>
          <Button onClick={() => navigate('/browse')} className="mt-4">
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <Heading level={1} className="text-2xl mb-2">Welcome back!</Heading>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="mb-8">
        <Heading level={2} className="text-xl mb-6">My Courses</Heading>
        <CourseList
          courses={enrolledCourses}
          userProgress={userProgress}
          navigate={navigate}
          showBrowseButton={true}
        />
      </div>
    </div>
  );
};

export default DashboardPage;