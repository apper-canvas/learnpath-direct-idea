import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const CourseFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories,
  difficulties,
  onClearFilters,
  resultsCount
}) => {
  const showClearFilters = searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <ApperIcon
          name="Search"
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
        />
        <Select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          options={difficulties}
        />

        {showClearFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="px-4 py-2">
            Clear Filters
          </Button>
        )}

        {resultsCount !== undefined && (
          <div className="ml-auto text-sm text-gray-500">
            {resultsCount} course{resultsCount !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFilters;