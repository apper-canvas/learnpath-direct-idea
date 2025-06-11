import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import ActivityItem from '@/components/molecules/ActivityItem';
import Heading from '@/components/atoms/Heading';

const RecentActivityList = ({ recentActivity, calculateCourseProgress, navigate }) => {
  return (
    <div>
      <Heading level={2} className="text-xl mb-6">Recent Activity</Heading>
      
      {recentActivity.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivity.map(({ course, progress }, index) => (
            <ActivityItem
              key={course.id}
              courseTitle={course.title}
              lastAccessed={progress.lastAccessed}
              progressPercentage={calculateCourseProgress(course.id)}
              onClick={() => navigate(`/course/${course.id}`)}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityList;