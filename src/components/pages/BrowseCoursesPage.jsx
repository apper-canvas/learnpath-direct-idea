import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import CourseFilters from '@/components/organisms/CourseFilters';
import CourseList from '@/components/organisms/CourseList';
import { courseService, userProgressService } from '@/services';

const BrowseCoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    const loadData = async () => {
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
        setError(err.message || 'Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Search and Filters Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex flex-wrap gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Course Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
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
          <Heading level={3} className="text-lg font-medium mb-2">Failed to Load Courses</Heading>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <Heading level={1} className="text-2xl mb-2">Browse Courses</Heading>
        <p className="text-gray-600">Discover new skills and advance your career</p>
      </div>

      <CourseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        categories={categories}
        difficulties={difficulties}
        onClearFilters={handleClearFilters}
        resultsCount={filteredCourses.length}
      />

      {filteredCourses.length === 0 && (searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all') ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No matching courses</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <CourseList
          courses={filteredCourses}
          userProgress={userProgress}
          navigate={navigate}
          showBrowseButton={false}
        />
      )}
    </div>
  );
};

export default BrowseCoursesPage;