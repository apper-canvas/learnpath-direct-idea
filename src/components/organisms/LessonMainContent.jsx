import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import QuizComponent from '@/components/organisms/QuizComponent';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const LessonMainContent = ({
  courseId,
  currentLesson,
  userProgress,
  quiz,
  showQuiz,
  handleCompleteLesson,
  handleQuizComplete,
  getNavigationData
}) => {
  const navigate = useNavigate();
  const { prev, next } = getNavigationData();
  const isCompleted = userProgress?.completedLessons.includes(currentLesson.id);

  return (
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
        <Heading level={2} className="text-xl mb-4">
          Lesson Content
        </Heading>
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
            <Button
              onClick={() => navigate(`/course/${courseId}/lesson/${prev.id}`)}
              variant="ghost"
              icon={ApperIcon}
              iconName="ChevronLeft"
              iconSize={16}
            >
              <span className="break-words">{prev.title}</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button
              onClick={handleCompleteLesson}
              variant="success"
            >
              Mark Complete
            </Button>
          )}
          
          {next && (
            <Button
              onClick={() => navigate(`/course/${courseId}/lesson/${next.id}`)}
              variant="ghost"
              className="text-primary hover:text-primary/80"
              icon={ApperIcon}
              iconName="ChevronRight"
              iconSize={16}
              iconPosition="right"
            >
              <span className="break-words">{next.title}</span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LessonMainContent;