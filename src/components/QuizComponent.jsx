import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

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
            <h3 className={`text-2xl font-heading font-bold mb-2 ${
              quizScore.passed ? 'text-success' : 'text-error'
            }`}>
              {quizScore.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h3>
            
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
              >
                Try Again
              </motion.button>
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
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
              Quiz Completed
            </h3>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
              >
                Retake Quiz
              </motion.button>
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
          <h3 className="text-lg font-heading font-semibold text-gray-900">
            Quiz: Lesson Assessment
          </h3>
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
          <h4 className="text-lg font-medium text-gray-900 mb-6 break-words">
            {quiz.questions[currentQuestion].question}
          </h4>

          <div className="space-y-3 mb-8">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 break-words ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon name="ChevronLeft" size={16} />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!selectedAnswers.hasOwnProperty(currentQuestion)}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ApperIcon name="ChevronRight" size={16} />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className="px-6 py-2 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </motion.button>
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