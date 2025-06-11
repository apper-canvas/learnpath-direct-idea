import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import LessonMainContent from '@/components/organisms/LessonMainContent';
import LessonSidebar from '@/components/organisms/LessonSidebar';
import { courseService, userProgressService, quizService } from '@/services';

const LessonViewPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const navigateToNextLesson = useCallback(() => {
    if (!course || !currentLesson) return;
    
    let foundNext = false;
    for (const module of course.modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        if (foundNext) {
          navigate(`/course/${courseId}/lesson/${module.lessons[i].id}`);
          return;
        }
        if (module.lessons[i].id === lessonId) {
          foundNext = true;
        }
      }
    }
    
    // No next lesson, go back to course
    navigate(`/course/${courseId}`);
  }, [course, currentLesson, courseId, lessonId, navigate]);

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, progressData, quizData] = await Promise.all([
          courseService.getById(courseId),
          userProgressService.getAll(),
          quizService.getAll()
        ]);
        
        setCourse(courseData);
        
        let foundLesson = null;
        for (const module of courseData.modules) {
          foundLesson = module.lessons.find(lesson => lesson.id === lessonId);
          if (foundLesson) break;
        }
        
        if (!foundLesson) {
          throw new Error('Lesson not found');
        }
        
        setCurrentLesson(foundLesson);
        
        const progress = progressData.find(p => p.courseId === courseId);
        if (!progress) {
          throw new Error('Please enroll in the course first');
        }
        
        setUserProgress(progress);
        
        const lessonNotes = progress.notes[lessonId] || '';
        setNotes(lessonNotes);
        
        const lessonQuiz = quizData.find(q => q.lessonId === lessonId);
        setQuiz(lessonQuiz);
        
      } catch (err) {
        setError(err.message || 'Failed to load lesson');
        toast.error(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      loadLessonData();
    }
  }, [courseId, lessonId]);

  const handleCompleteLesson = async () => {
    if (!userProgress || !currentLesson) return;
    
    try {
      const isAlreadyCompleted = userProgress.completedLessons.includes(lessonId);
      
      if (!isAlreadyCompleted) {
        const updatedProgress = await userProgressService.update(userProgress.id, {
          ...userProgress,
          completedLessons: [...userProgress.completedLessons, lessonId],
          lastAccessed: new Date()
        });
        
        setUserProgress(updatedProgress);
        toast.success('Lesson completed!');
      }
      
      if (quiz && !showQuiz) {
        setShowQuiz(true);
      } else {
        navigateToNextLesson();
      }
    } catch (err) {
      toast.error('Failed to complete lesson');
    }
  };

  const handleSaveNotes = async (newNotes) => {
    if (!userProgress) return;
    
    try {
      // Update local state immediately for responsiveness
      setNotes(newNotes);

      const updatedNotes = { ...userProgress.notes, [lessonId]: newNotes };
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        notes: updatedNotes
      });
      
      setUserProgress(updatedProgress);
    } catch (err) {
      toast.error('Failed to save notes');
    }
  };

  const handleQuizComplete = async (score, passed) => {
    if (!userProgress || !quiz) return;
    
    try {
      const updatedQuizScores = { ...userProgress.quizScores, [quiz.id]: { score, passed } };
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        quizScores: updatedQuizScores
      });
      
      setUserProgress(updatedProgress);
      
      if (passed) {
        toast.success(`Quiz passed with ${score}%!`);
        setTimeout(() => navigateToNextLesson(), 2000);
      } else {
        toast.error(`Quiz failed. You need ${quiz.passingScore}% to pass.`);
      }
    } catch (err) {
      toast.error('Failed to save quiz score');
    }
  };

  const getNavigationData = useCallback(() => {
    if (!course) return { prev: null, next: null, moduleTitle: '', lessonIndex: 0 };
    
    let prev = null;
    let next = null;
    let moduleTitle = '';
    let lessonIndex = 0;
    let totalLessons = 0;
    
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });
    
    let currentIndex = 0;
    let found = false;
    
    for (const module of course.modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        if (module.lessons[i].id === lessonId) {
          moduleTitle = module.title;
          lessonIndex = currentIndex + 1;
          found = true;
          
          let prevCount = 0;
          for(const mod of course.modules) {
            for(const les of mod.lessons) {
              if (prevCount === currentIndex - 1) {
                prev = les;
                break;
              }
              prevCount++;
            }
            if (prev) break;
          }

          let nextCount = 0;
          for(const mod of course.modules) {
            for(const les of mod.lessons) {
              if (nextCount === currentIndex + 1) {
                next = les;
                break;
              }
              nextCount++;
            }
            if (next) break;
          }
          break;
        }
        currentIndex++;
      }
      if (found) break;
    }
    
    return { prev, next, moduleTitle, lessonIndex, totalLessons };
  }, [course, lessonId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="aspect-video bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <Heading level={3} className="text-lg font-medium mb-2">Lesson Not Found</Heading>
          <p className="text-gray-500 mb-4">{error || 'The requested lesson could not be found'}</p>
          <Button onClick={() => navigate(`/course/${courseId}`)} variant="primary">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const { moduleTitle, lessonIndex, totalLessons } = getNavigationData();
  const isCompleted = userProgress?.completedLessons.includes(lessonId);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(`/course/${courseId}`)}
              className="p-2"
              variant="ghost"
              icon={ApperIcon}
              iconName="ArrowLeft"
              iconSize={20}
            >
              <span className="sr-only">Back to course</span>
            </Button>
            <div>
              <Heading level={1} className="font-semibold text-lg break-words">
                {currentLesson.title}
              </Heading>
              <p className="text-sm text-gray-500">
                {moduleTitle} • Lesson {lessonIndex} of {totalLessons}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isCompleted && (
              <div className="flex items-center gap-2 text-success">
                <ApperIcon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <LessonMainContent
            courseId={courseId}
            currentLesson={currentLesson}
            userProgress={userProgress}
            quiz={quiz}
            showQuiz={showQuiz}
            handleCompleteLesson={handleCompleteLesson}
            handleQuizComplete={handleQuizComplete}
            getNavigationData={getNavigationData}
          />
          <LessonSidebar
            course={course}
            userProgress={userProgress}
            currentLessonId={lessonId}
            notes={notes}
            onSaveNotes={handleSaveNotes}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonViewPage;