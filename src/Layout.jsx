import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = Object.values(routes).filter(route => !route.hidden);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900">LearnPath</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ApperIcon name="Search" size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ApperIcon name="Bell" size={20} className="text-gray-600" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface border-r border-gray-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-surface border-r border-gray-200 z-50"
              >
                <nav className="p-4 space-y-2 overflow-y-auto h-full">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;