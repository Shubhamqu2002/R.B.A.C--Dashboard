import React, { useState, useCallback } from 'react';
import { FaBars, FaUser, FaCog, FaSignOutAlt, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ toggleSidebar, setIsLoggedIn, isMobile, darkMode, toggleDarkMode }) {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = useCallback(() => {
    setShowProfile((prev) => !prev);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`bg-gradient-to-r ${
        darkMode ? 'from-gray-800/90 via-gray-900/90 to-black/90' : 'from-indigo-600/80 via-purple-600/80 to-pink-500/80'
      } backdrop-blur-md text-white shadow-lg w-full z-30 sticky top-0`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center max-w-full">
        {/* Logo & Sidebar */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {isMobile && (
            <button
              className="text-white focus:outline-none p-2 rounded-lg bg-white bg-opacity-20"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <FaBars className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
          <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
            RBAC Dashboard
          </h1>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="text-white hover:text-pink-200 p-2 sm:p-3"
          >
            <FaBell className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>

          {/* Profile */}
          <div className="relative">
            <button
              className="text-white hover:text-pink-200 p-2 sm:p-3 rounded-full"
              onClick={toggleProfile}
            >
              <FaUser className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 sm:w-48 bg-white text-gray-800 rounded-md shadow-lg"
                >
                  <div className="px-4 py-2 text-sm">
                    <div className="font-medium">Admin</div>
                    <div className="text-xs text-gray-500">ID: 12345</div>
                    <div className="text-xs text-gray-500">admin@example.com</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="text-white hover:text-pink-200 p-2 sm:p-3 rounded-full"
          >
            <FaCog className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleDarkMode}
            className={`p-2 sm:p-3 rounded-full ${
              darkMode ? 'hover:text-yellow-400' : 'hover:text-pink-400'
            }`}
          >
            {darkMode ? <FaSun className="h-4 w-4 sm:h-5 sm:w-5" /> : <FaMoon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsLoggedIn(false)}
            className={`py-1 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded-md bg-gradient-to-r ${
              darkMode
                ? 'from-blue-500/80 to-indigo-600/80 hover:from-blue-600/80 hover:to-indigo-700/80'
                : 'from-pink-500/80 to-purple-600/80 hover:from-pink-600/80 hover:to-purple-700/80'
            } text-white`}
          >
            <FaSignOutAlt className="inline-block mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
