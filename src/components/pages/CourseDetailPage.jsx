import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import CourseHeader from '@/components/organisms/CourseHeader';
import CourseContent from '@/components/organisms/CourseContent';
import { courseService, userProgressService } from '@/services';

const CourseDetailPage = () => {
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
          <Heading level={3} className="text-lg font-medium mb-2">Course Not Found</Heading>
          <p className="text-gray-500 mb-4">{error || 'The requested course could not be found'}</p>
          <Button onClick={() => navigate('/browse')} variant="primary">
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CourseHeader
        course={course}
        userProgress={userProgress}
        onEnroll={handleEnroll}
        enrolling={enrolling}
        calculateProgress={calculateProgress}
        getTotalDuration={getTotalDuration}
      />
      <CourseContent
        course={course}
        userProgress={userProgress}
        navigate={navigate}
      />
    </div>
  );
};

export default CourseDetailPage;