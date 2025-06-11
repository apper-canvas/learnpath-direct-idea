import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';
import { courseService, userProgressService, quizService } from '../services';

const LessonView = () => {
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
        
        // Find current lesson
        let foundLesson = null;
        for (const module of courseData.modules) {
          foundLesson = module.lessons.find(lesson => lesson.id === lessonId);
          if (foundLesson) break;
        }
        
        if (!foundLesson) {
          throw new Error('Lesson not found');
        }
        
        setCurrentLesson(foundLesson);
        
        // Find user progress
        const progress = progressData.find(p => p.courseId === courseId);
        if (!progress) {
          throw new Error('Please enroll in the course first');
        }
        
        setUserProgress(progress);
        
        // Load lesson notes
        const lessonNotes = progress.notes[lessonId] || '';
        setNotes(lessonNotes);
        
        // Find quiz for this lesson
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
      
      // Show quiz if available
      if (quiz && !showQuiz) {
        setShowQuiz(true);
      } else {
        // Navigate to next lesson or back to course
        navigateToNextLesson();
      }
    } catch (err) {
      toast.error('Failed to complete lesson');
    }
  };

  const handleSaveNotes = async (newNotes) => {
    if (!userProgress) return;
    
    try {
      const updatedNotes = { ...userProgress.notes, [lessonId]: newNotes };
      const updatedProgress = await userProgressService.update(userProgress.id, {
        ...userProgress,
        notes: updatedNotes
      });
      
      setUserProgress(updatedProgress);
      setNotes(newNotes);
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

  const navigateToNextLesson = () => {
    if (!course || !currentLesson) return;
    
    // Find next lesson
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
  };

  const getNavigationData = () => {
    if (!course) return { prev: null, next: null, moduleTitle: '', lessonIndex: 0 };
    
    let prev = null;
    let next = null;
    let moduleTitle = '';
    let lessonIndex = 0;
    let totalLessons = 0;
    
    // Calculate total lessons
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });
    
    // Find current lesson and neighbors
    let currentIndex = 0;
    let found = false;
    
    for (const module of course.modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        if (module.lessons[i].id === lessonId) {
          moduleTitle = module.title;
          lessonIndex = currentIndex + 1;
          found = true;
          if (currentIndex > 0) {
            // Find previous lesson
            let prevIndex = currentIndex - 1;
            let prevCount = 0;
            for (const prevModule of course.modules) {
              for (const prevLesson of prevModule.lessons) {
                if (prevCount === prevIndex) {
                  prev = prevLesson;
                  break;
                }
                prevCount++;
              }
              if (prev) break;
            }
          }
          if (currentIndex < totalLessons - 1) {
            // Find next lesson
            let nextIndex = currentIndex + 1;
            let nextCount = 0;
            for (const nextModule of course.modules) {
              for (const nextLesson of nextModule.lessons) {
                if (nextCount === nextIndex) {
                  next = nextLesson;
                  break;
                }
                nextCount++;
              }
              if (next) break;
            }
          }
          break;
        }
        currentIndex++;
      }
      if (found) break;
    }
    
    return { prev, next, moduleTitle, lessonIndex, totalLessons };
  };

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested lesson could not be found'}</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const { prev, next, moduleTitle, lessonIndex, totalLessons } = getNavigationData();
  const isCompleted = userProgress?.completedLessons.includes(lessonId);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h1 className="font-heading font-semibold text-gray-900 break-words">
                {currentLesson.title}
              </h1>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {currentLesson.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                  onComplete={handleCompleteLesson}
                />
              </motion.div>
            )}

            {/* Lesson Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Lesson Content
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed break-words">
                  {currentLesson.content}
                </p>
              </div>
            </motion.div>

            {/* Quiz */}
            {quiz && showQuiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <QuizComponent
                  quiz={quiz}
                  userScore={userProgress?.quizScores[quiz.id]}
                  onComplete={handleQuizComplete}
                />
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center"
            >
              <div>
                {prev && (
                  <button
                    onClick={() => navigate(`/course/${courseId}/lesson/${prev.id}`)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                    <span className="break-words">{prev.title}</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {!isCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCompleteLesson}
                    className="px-6 py-2 bg-success text-white rounded-lg font-medium"
                  >
                    Mark Complete
                  </motion.button>
                )}
                
                {next && (
                  <button
                    onClick={() => navigate(`/course/${courseId}/lesson/${next.id}`)}
                    className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="break-words">{next.title}</span>
                    <ApperIcon name="ChevronRight" size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                My Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={(e) => handleSaveNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">Notes are saved automatically</p>
            </motion.div>

            {/* Course Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Course Progress
              </h3>
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <p className="text-sm font-medium text-gray-700 mb-2 break-words">
                      {module.title}
                    </p>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const isLessonCompleted = userProgress?.completedLessons.includes(lesson.id);
                        const isCurrentLesson = lesson.id === lessonId;
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                              isCurrentLesson
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              isLessonCompleted 
                                ? 'bg-success text-white' 
                                : 'bg-gray-200'
                            }`}>
                              {isLessonCompleted ? (
                                <ApperIcon name="Check" size={10} />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <span className="break-words flex-1 min-w-0">{lesson.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;