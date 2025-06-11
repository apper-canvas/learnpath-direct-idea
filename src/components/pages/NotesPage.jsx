import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import NotesList from '@/components/organisms/NotesList';
import { courseService, userProgressService } from '@/services';

const NotesPage = () => {
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

  const getEnrolledCourseOptions = () => {
    const enrolledCourseIds = userProgress.map(p => p.courseId);
    const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
    return [{ value: 'all', label: 'All Courses' }, ...enrolledCourses.map(course => ({
      value: course.id,
      label: course.title
    }))];
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('all');
  };

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
          <Heading level={3} className="text-lg font-medium mb-2">Failed to Load Notes</Heading>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const allNotes = getAllNotes();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Heading level={1} className="text-2xl mb-2">My Notes</Heading>
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
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={getEnrolledCourseOptions()}
          />

          {(searchTerm || selectedCourse !== 'all') && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              className="px-4 py-2"
            >
              Clear Filters
            </Button>
          )}

          <div className="ml-auto text-sm text-gray-500">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Notes List */}
      {allNotes.length === 0 ? (
        <NotesList
          notes={[]}
          onBrowseCourses={() => navigate('/browse')}
        />
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
          <Heading level={3} className="mt-4 text-lg font-medium">No matching notes</Heading>
          <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <NotesList
          notes={filteredNotes}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
          onGoToLesson={(courseId, lessonId) => navigate(`/course/${courseId}/lesson/${lessonId}`)}
        />
      )}
    </div>
  );
};

export default NotesPage;