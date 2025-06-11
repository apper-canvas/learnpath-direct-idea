import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const NoteCard = ({ note, onUpdate, onDelete, onGoToLesson, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Heading level={3} className="text-lg font-semibold break-words">
            {note.lessonTitle}
          </Heading>
          <p className="text-sm text-gray-500 break-words">
            {note.courseName}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last modified: {new Date(note.lastModified).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={onGoToLesson}
            className="p-2"
            variant="ghost"
            title="Go to lesson"
          >
            <ApperIcon name="ExternalLink" size={16} />
          </Button>
          <Button
            onClick={onDelete}
            className="p-2"
            variant="ghost"
            title="Delete note"
          >
            <ApperIcon name="Trash2" size={16} className="text-error" />
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <Input
          type="textarea"
          value={note.content}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-gray-700 leading-relaxed"
          rows={Math.max(3, note.content.split('\n').length)}
          placeholder="Your notes..."
        />
      </div>
    </motion.div>
  );
};

export default NoteCard;