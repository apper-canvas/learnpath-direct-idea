import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { courseService, userProgressService } from '../services';

const Notes = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const loadNotesData = async () => {
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
        setError(err.message || 'Failed to load notes');
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    loadNotesData();
  }, []);

  const getAllNotes = () => {
    const allNotes = [];
    
    userProgress.forEach(progress => {
      const course = courses.find(c => c.id === progress.courseId);
      if (!course || !progress.notes) return;
      
      Object.entries(progress.notes).forEach(([lessonId, noteContent]) => {
        if (!noteContent.trim()) return;
        
        // Find the lesson
        let lesson = null;
        for (const module of course.modules) {
          lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) break;
        }
        
        if (lesson) {
          allNotes.push({
            id: `${progress.courseId}-${lessonId}`,
            courseId: progress.courseId,
            lessonId,
            courseName: course.title,
            lessonTitle: lesson.title,
            content: noteContent,
            lastModified: progress.lastAccessed || new Date()
          });
        }
      });
    });
    
    return allNotes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  };

  const getEnrolledCourses = () => {
    const enrolledCourseIds = userProgress.map(p => p.courseId);
    return courses.filter(course => enrolledCourseIds.includes(course.id));
  };

  const updateNote = async (courseId, lessonId, newContent) => {
    try {
      const progress = userProgress.find(p => p.courseId === courseId);
      if (!progress) return;
      
      const updatedNotes = { ...progress.notes, [lessonId]: newContent };
      const updatedProgress = await userProgressService.update(progress.id, {
        ...progress,
        notes: updatedNotes
      });
      
      // Update local state
      setUserProgress(prev => 
        prev.map(p => p.id === progress.id ? updatedProgress : p)
      );
      
      toast.success('Note updated successfully');
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (courseId, lessonId) => {
    try {
      const progress = userProgress.find(p => p.courseId === courseId);
      if (!progress) return;
      
      const updatedNotes = { ...progress.notes };
      delete updatedNotes[lessonId];
      
      const updatedProgress = await userProgressService.update(progress.id, {
        ...progress,
        notes: updatedNotes
      });
      
      // Update local state
      setUserProgress(prev => 
        prev.map(p => p.id === progress.id ? updatedProgress : p)
      );
      
      toast.success('Note deleted successfully');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const filteredNotes = getAllNotes().filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = selectedCourse === 'all' || note.courseId === selectedCourse;
    
    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Notes</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const enrolledCourses = getEnrolledCourses();
  const allNotes = getAllNotes();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">My Notes</h1>
        <p className="text-gray-600">Review and manage your lesson notes</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Courses</option>
            {enrolledCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          {(searchTerm || selectedCourse !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCourse('all');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          )}

          <div className="ml-auto text-sm text-gray-500">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Notes List */}
      {allNotes.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="StickyNote" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
          <p className="mt-2 text-gray-500">Start taking notes during lessons to see them here</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Browse Courses
          </motion.button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No matching notes</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 break-words">
                    {note.lessonTitle}
                  </h3>
                  <p className="text-sm text-gray-500 break-words">
                    {note.courseName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last modified: {new Date(note.lastModified).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/course/${note.courseId}/lesson/${note.lessonId}`)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title="Go to lesson"
                  >
                    <ApperIcon name="ExternalLink" size={16} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.courseId, note.lessonId)}
                    className="p-2 text-gray-400 hover:text-error transition-colors"
                    title="Delete note"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <textarea
                  value={note.content}
                  onChange={(e) => updateNote(note.courseId, note.lessonId, e.target.value)}
                  className="w-full bg-transparent border-none resize-none focus:outline-none text-gray-700 leading-relaxed"
                  rows={Math.max(3, note.content.split('\n').length)}
                  placeholder="Your notes..."
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;