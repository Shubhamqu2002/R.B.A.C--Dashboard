import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionManagement from './components/PermissionManagement';
import ActivityLogs from './components/ActivityLogs';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setIsSidebarOpen(!newIsMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className={`flex h-screen bg-gray-100 ${darkMode ? 'dark' : ''}`}>
        {isLoggedIn && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoggedIn && (
            <Header 
              toggleSidebar={toggleSidebar} 
              setIsLoggedIn={setIsLoggedIn} 
              isMobile={isMobile}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          )}
          <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 ${isLoggedIn && !isMobile ? 'md:ml-64' : ''}`}>
            <Routes>
              <Route path="/login" element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />
              } />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
              <Route path="/permissions" element={<ProtectedRoute><PermissionManagement /></ProtectedRoute>} />
              <Route path="/activity-logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

