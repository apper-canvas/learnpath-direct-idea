import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Progress"
        value={`${stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%`}
        progressValue={stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0}
        animationDelay={0.1}
      />
      <StatCard
        title="Lessons Completed"
        value={stats.completedLessons}
        iconName="CheckCircle"
        iconBgClass="bg-success/10 to-success/20"
        iconColorClass="text-success"
        animationDelay={0.2}
      />
      <StatCard
        title="Study Streak"
        value={`${stats.studyStreak} days`}
        iconName="Flame"
        iconBgClass="bg-accent/10 to-accent/20"
        iconColorClass="text-accent"
        animationDelay={0.3}
      />
    </div>
  );
};

export default DashboardStats;