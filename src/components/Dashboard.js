import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaUserTag, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

ChartJS.register(...registerables);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 150,
    activeRoles: 12,
    permissions: 45,
    completedTasks: 280
  });

  // Memoized chart configurations
  const chartConfigs = useMemo(() => ({
    userStats: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Active Users',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }],
    },
    taskCompletion: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(56, 189, 248, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        hoverBackgroundColor: [
          'rgba(56, 189, 248, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)'
        ],
      }],
    },
    roleDistribution: {
      labels: ['Admin', 'Manager', 'User'],
      datasets: [{
        label: 'Role Distribution',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(236, 72, 153, 0.7)',
          'rgba(56, 189, 248, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
      }],
    },
  }), []);

  const statItems = useMemo(() => [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      textGradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Roles',
      value: stats.activeRoles,
      icon: FaUserTag,
      gradient: 'from-purple-500/20 to-pink-500/20',
      textGradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Permissions',
      value: stats.permissions,
      icon: FaShieldAlt,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      textGradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: FaCheckCircle,
      gradient: 'from-orange-500/20 to-amber-500/20',
      textGradient: 'from-orange-500 to-amber-500'
    },
  ], [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 5),
        activeRoles: Math.floor(Math.random() * 3) + 10,
        permissions: Math.floor(Math.random() * 5) + 40,
        completedTasks: prev.completedTasks + Math.floor(Math.random() * 10),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-lg rounded-xl p-6 border border-white/10`}
            >
              <div className="flex items-center space-x-4">
                <div className={`bg-gradient-to-br ${stat.textGradient} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{stat.title}</p>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={stat.value}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`text-2xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent`}
                    >
                      {stat.value.toLocaleString()}
                    </motion.h3>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-4">User Activity</h2>
            <div className="h-[300px]">
              <Line data={chartConfigs.userStats} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-4">Task Completion</h2>
            <div className="h-[300px]">
              <Doughnut data={chartConfigs.taskCompletion} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-4">Role Distribution</h2>
            <div className="h-[300px]">
              <Bar data={chartConfigs.roleDistribution} options={chartOptions} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;