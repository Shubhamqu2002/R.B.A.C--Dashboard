import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaShieldAlt, 
  FaCog,
  FaTimes,
  FaHistory
} from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: FaHome, label: 'Dashboard', color: 'from-purple-400 to-indigo-500' },
    { id: 'users', path: '/users', icon: FaUsers, label: 'Users', color: 'from-green-400 to-blue-500' },
    { id: 'roles', path: '/roles', icon: FaShieldAlt, label: 'Roles', color: 'from-yellow-400 to-orange-500' },
    { id: 'permissions', path: '/permissions', icon: FaCog, label: 'Permissions', color: 'from-red-400 to-pink-500' },
    { id: 'activity-logs', path: '/activity-logs', icon: FaHistory, label: 'Activity Logs', color: 'from-indigo-400 to-purple-500' },
  ];

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    closed: { 
      x: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    },
  };

  const menuItemVariants = {
    open: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
  };

  return (
    <AnimatePresence>
      {(isOpen || !isMobile) && (
        <motion.aside
          initial={isMobile ? "closed" : "open"}
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg overflow-hidden ${
            isMobile ? 'top-0' : 'top-16'
          }`}
        >
          <div className="h-full p-4 overflow-y-auto">
            {isMobile && (
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>
            )}
            <nav>
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <motion.li key={item.id} variants={menuItemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setIsOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition duration-300 ease-in-out bg-gradient-to-r ${item.color} hover:from-white hover:to-gray-100 hover:text-gray-900 group ${
                        location.pathname === item.path ? 'from-white to-gray-100 text-gray-900' : ''
                      }`}
                    >
                      <item.icon className="mr-3 h-6 w-6 group-hover:text-gray-900" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;

