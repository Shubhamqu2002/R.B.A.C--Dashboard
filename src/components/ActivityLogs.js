import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        message: ['User added', 'User updated', 'User deleted', 'Role changed', 'Permission granted'][Math.floor(Math.random() * 5)],
        timestamp: new Date().toISOString(),
        type: ['user', 'role', 'permission'][Math.floor(Math.random() * 3)]
      };
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 4)]);
    }, 5000); // Add a new log every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Activity Logs</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.type === 'user' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                  log.type === 'role' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                }`}>
                  {log.type}
                </span>
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200">{log.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActivityLogs;

