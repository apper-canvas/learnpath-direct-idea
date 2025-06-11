import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import BrowseCoursesPage from '@/components/pages/BrowseCoursesPage';
import CourseDetailPage from '@/components/pages/CourseDetailPage';
import LessonViewPage from '@/components/pages/LessonViewPage';
import ProgressPage from '@/components/pages/ProgressPage';
import NotesPage from '@/components/pages/NotesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  browseCourses: {
    id: 'browseCourses',
    label: 'Browse Courses',
path: '/browse',
    icon: 'BookOpen',
    component: BrowseCoursesPage
  },
  courseDetail: {
    id: 'courseDetail',
    label: 'Course Detail',
path: '/course/:id',
    icon: 'Book',
    component: CourseDetailPage,
    hidden: true
  },
  lessonView: {
    id: 'lessonView',
label: 'Lesson View',
    path: '/course/:courseId/lesson/:lessonId',
    component: LessonViewPage,
    hidden: true
  },
  progress: {
    id: 'progress',
    label: 'My Progress',
path: '/progress',
    icon: 'TrendingUp',
    component: ProgressPage
  },
  notes: {
    id: 'notes',
    label: 'Notes',
path: '/notes',
    icon: 'StickyNote',
    component: NotesPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
path: '*',
    component: NotFoundPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);