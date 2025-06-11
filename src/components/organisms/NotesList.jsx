import React from 'react';
import { motion } from 'framer-motion';
import NoteCard from '@/components/molecules/NoteCard';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const NotesList = ({ notes, onUpdateNote, onDeleteNote, onGoToLesson, onBrowseCourses }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="StickyNote" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <Heading level={3} className="mt-4 text-lg font-medium">No notes yet</Heading>
        <p className="mt-2 text-gray-500">Start taking notes during lessons to see them here</p>
        <Button onClick={onBrowseCourses} className="mt-4">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          index={index}
          onUpdate={(newContent) => onUpdateNote(note.courseId, note.lessonId, newContent)}
          onDelete={() => onDeleteNote(note.courseId, note.lessonId)}
          onGoToLesson={() => onGoToLesson(note.courseId, note.lessonId)}
        />
      ))}
    </div>
  );
};

export default NotesList;