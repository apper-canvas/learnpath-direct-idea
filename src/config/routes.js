import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import BrowseCourses from '../pages/BrowseCourses';
import CourseDetail from '../pages/CourseDetail';
import LessonView from '../pages/LessonView';
import Progress from '../pages/Progress';
import Notes from '../pages/Notes';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  browseCourses: {
    id: 'browseCourses',
    label: 'Browse Courses',
    path: '/browse',
    icon: 'BookOpen',
    component: BrowseCourses
  },
  courseDetail: {
    id: 'courseDetail',
    label: 'Course Detail',
    path: '/course/:id',
    icon: 'Book',
    component: CourseDetail,
    hidden: true
  },
  lessonView: {
    id: 'lessonView',
    label: 'Lesson View',
    path: '/course/:courseId/lesson/:lessonId',
    icon: 'Play',
    component: LessonView,
    hidden: true
  },
  progress: {
    id: 'progress',
    label: 'My Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  notes: {
    id: 'notes',
    label: 'Notes',
    path: '/notes',
    icon: 'StickyNote',
    component: Notes
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound,
    hidden: true
  }
};

export const routeArray = Object.values(routes);