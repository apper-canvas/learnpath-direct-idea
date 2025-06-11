import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const QuizComponent = ({ quiz, userScore, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    
    setQuizScore({ score, passed, correctAnswers, totalQuestions: quiz.questions.length });
    setShowResults(true);
    
    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizScore(null);
  };

  const allQuestionsAnswered = quiz.questions.every((_, index) => 
    selectedAnswers.hasOwnProperty(index)
  );

  if (showResults && quizScore) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              quizScore.passed 
                ? 'bg-success text-white' 
                : 'bg-error text-white'
            }`}
          >
            <ApperIcon 
              name={quizScore.passed ? "CheckCircle" : "XCircle"} 
              size={40} 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="quiz-result"
          >
            <Heading level={3} className={`text-2xl mb-2 ${
              quizScore.passed ? 'text-success' : 'text-error'
            }`}>
              {quizScore.passed ? 'Congratulations!' : 'Keep Trying!'}
            </Heading>
            
            <p className="text-gray-600 mb-4">
              You scored {quizScore.score}% ({quizScore.correctAnswers}/{quizScore.totalQuestions} correct)
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              {quizScore.passed 
                ? 'You have successfully passed this quiz!'
                : `You need ${quiz.passingScore}% to pass. Review the material and try again.`
              }
            </p>
            
            {!quizScore.passed && (
              <Button onClick={resetQuiz} variant="primary">
                Try Again
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Show previous score if exists
  if (userScore && !showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <Heading level={3} className="text-lg font-semibold mb-2">
              Quiz Completed
            </Heading>
            <p className="text-gray-600">
              Previous score: {userScore.score}% 
              <span className={`ml-2 ${userScore.passed ? 'text-success' : 'text-error'}`}>
                ({userScore.passed ? 'Passed' : 'Failed'})
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              userScore.passed ? 'bg-success text-white' : 'bg-error text-white'
            }`}>
              <ApperIcon name={userScore.passed ? "CheckCircle" : "XCircle"} size={24} />
            </div>
            {!userScore.passed && (
              <Button onClick={resetQuiz} variant="primary">
                Retake Quiz
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level={3} className="text-lg font-semibold">
            Quiz: Lesson Assessment
          </Heading>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Heading level={4} className="text-lg font-medium mb-6 break-words">
            {quiz.questions[currentQuestion].question}
          </Heading>

          <div className="space-y-3 mb-8">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full p-4 text-left border-2 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variant="ghost" // Override default Button styling for quiz answers
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          variant="ghost"
          icon={ApperIcon}
          iconName="ChevronLeft"
          iconSize={16}
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!selectedAnswers.hasOwnProperty(currentQuestion)}
              variant="primary"
              icon={ApperIcon}
              iconName="ChevronRight"
              iconSize={16}
              iconPosition="right"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              variant="success"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Info */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Passing score: {quiz.passingScore}%</span>
          <span>Questions answered: {Object.keys(selectedAnswers).length}/{quiz.questions.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizComponent;