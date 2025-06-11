import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import CourseProgressList from '@/components/organisms/CourseProgressList';
import RecentActivityList from '@/components/organisms/RecentActivityList';
import { courseService, userProgressService } from '@/services';

const ProgressPage = () => {
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
          <Heading level={3} className="text-lg font-medium mb-2">Failed to Load Progress</Heading>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
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
          <Heading level={3} className="mt-4 text-lg font-medium">No progress to show</Heading>
          <p className="mt-2 text-gray-500">Enroll in courses to start tracking your progress</p>
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
        <Heading level={1} className="text-2xl mb-2">My Progress</Heading>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          progressValue={stats.averageProgress}
          animationDelay={0.1}
        />
        <StatCard
          title="Courses Enrolled"
          value={stats.totalCourses}
          iconName="BookOpen"
          iconBgClass="bg-primary/10 to-primary/20"
          iconColorClass="text-primary"
          animationDelay={0.2}
        />
        <StatCard
          title="Lessons Completed"
          value={`${stats.completedLessons}/${stats.totalLessons}`}
          iconName="CheckCircle"
          iconBgClass="bg-success/10 to-success/20"
          iconColorClass="text-success"
          animationDelay={0.3}
        />
        <StatCard
          title="Certificates Earned"
          value={stats.certificates}
          iconName="Award"
          iconBgClass="bg-accent/10 to-accent/20"
          iconColorClass="text-accent"
          animationDelay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <CourseProgressList
          enrolledCourses={enrolledCourses}
          userProgress={userProgress}
          calculateCourseProgress={calculateCourseProgress}
        />

        {/* Recent Activity */}
        <RecentActivityList
          recentActivity={recentActivity}
          calculateCourseProgress={calculateCourseProgress}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default ProgressPage;