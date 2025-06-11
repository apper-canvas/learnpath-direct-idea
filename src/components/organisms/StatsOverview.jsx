import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const StatsOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      <StatCard
        title="Courses Available"
        value="50+"
        iconName="BookOpen"
        iconBgClass="bg-primary/10 to-primary/20"
        iconColorClass="text-primary"
        animationDelay={0.1}
      />
      <StatCard
        title="Students Learning"
        value="1,200+"
        iconName="Users"
        iconBgClass="bg-secondary/10 to-secondary/20"
        iconColorClass="text-secondary"
        animationDelay={0.2}
      />
      <StatCard
        title="Completion Rate"
        value="95%"
        iconName="Trophy"
        iconBgClass="bg-accent/10 to-accent/20"
        iconColorClass="text-accent"
        animationDelay={0.3}
      />
      <StatCard
        title="Average Rating"
        value="4.8"
        iconName="Star"
        iconBgClass="bg-success/10 to-success/20"
        iconColorClass="text-success"
        animationDelay={0.4}
      />
    </div>
  );
};

export default StatsOverview;