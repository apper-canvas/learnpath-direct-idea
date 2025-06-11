import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'BookOpen',
      title: 'Structured Courses',
      description: 'Learn through well-organized modules and lessons'
    },
    {
      icon: 'TrendingUp',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with visual progress indicators'
    },
    {
      icon: 'Award',
      title: 'Certificates',
      description: 'Earn certificates upon successful course completion'
    }
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="GraduationCap" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Learn New Skills Through
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Structured Courses
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master new skills with our comprehensive learning platform. Track your progress, 
            take quizzes, and earn certificates as you advance through structured courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200"
            >
              Browse Courses
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <ApperIcon name={feature.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">1,200+</div>
              <div className="text-gray-600">Students Learning</div>
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
    </div>
  );
};

export default Home;