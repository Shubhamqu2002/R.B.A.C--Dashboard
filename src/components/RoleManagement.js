import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport, FaHistory } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import useLocalStorage from '../hooks/useLocalStorage';

function RoleManagement() {
  // State Management
  const [roles, setRoles] = useLocalStorage('dashboard_roles', [
    { id: 1, name: 'Admin', permissions: ['Read', 'Write', 'Delete'], createdAt: new Date().toISOString() },
    { id: 2, name: 'User', permissions: ['Read'], createdAt: new Date().toISOString() },
    { id: 3, name: 'Editor', permissions: ['Read', 'Write'], createdAt: new Date().toISOString() },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [activityLogs, setActivityLogs] = useLocalStorage('role_activity_logs', []);
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });
  const [editRole, setEditRole] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Available Permissions
  const availablePermissions = [
    { id: 'read', label: 'Read', description: 'Can view resources' },
    { id: 'write', label: 'Write', description: 'Can create and edit resources' },
    { id: 'delete', label: 'Delete', description: 'Can remove resources' },
    { id: 'admin', label: 'Admin', description: 'Full system access' },
  ];

  // Memoized Functions
  const addActivityLog = useMemo(() => (action) => {
    const newLog = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  }, [setActivityLogs]);

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;
    return roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.permissions.some(perm => perm.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [roles, searchTerm]);

  // Form Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoleId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = () => {
    const roleData = {
      id: Date.now(),
      ...newRole,
      createdAt: new Date().toISOString()
    };
    setRoles(prev => [...prev, roleData]);
    addActivityLog(`Added new role: ${newRole.name}`);
    resetForm();
  };

  const handleUpdate = () => {
    setRoles(prev => prev.map(role =>
      role.id === editingRoleId ? { ...editRole, id: editingRoleId } : role
    ));
    addActivityLog(`Updated role: ${editRole.name}`);
    resetForm();
  };

  const handleDelete = (id) => {
    const roleToDelete = roles.find(role => role.id === id);
    setRoles(prev => prev.filter(role => role.id !== id));
    addActivityLog(`Deleted role: ${roleToDelete.name}`);
    setShowDeleteConfirm(null);
  };

  const resetForm = () => {
    setNewRole({ name: '', permissions: [] });
    setEditRole(null);
    setEditingRoleId(null);
    setShowForm(false);
  };

  const startEditing = (role) => {
    setEditingRoleId(role.id);
    setEditRole({ ...role });
    setShowForm(true);
  };

  const handlePermissionChange = (permission, isEditing = false) => {
    const targetRole = isEditing ? editRole : newRole;
    const setTargetRole = isEditing ? setEditRole : setNewRole;
    
    const updatedPermissions = targetRole.permissions.includes(permission)
      ? targetRole.permissions.filter(p => p !== permission)
      : [...targetRole.permissions, permission];

    setTargetRole(prev => ({
      ...prev,
      permissions: updatedPermissions
    }));
  };

  // Export Function
  const exportToCSV = () => {
    const headers = ['Role Name', 'Permissions', 'Created At'];
    const csvData = roles.map(role => [
      role.name,
      role.permissions.join('; '),
      format(new Date(role.createdAt), 'PP')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `roles_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    addActivityLog('Exported roles data to CSV');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 sm:p-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-xl shadow-xl p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-white">
              Role Management
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              Managing {roles.length} role{roles.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                         shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center 
                         space-x-2 backdrop-blur-sm"
            >
              <FaPlus className="text-sm" />
              <span>Add Role</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg 
                         shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center 
                         space-x-2 backdrop-blur-sm"
            >
              <FaFileExport className="text-sm" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Search Section */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search roles by name or permission..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 
                     rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                     shadow-lg transition-all duration-300"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 space-y-6 
                      border border-gray-100"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={editingRoleId ? editRole.name : newRole.name}
                  onChange={(e) => {
                    if (editingRoleId) {
                      setEditRole(prev => ({ ...prev, name: e.target.value }));
                    } else {
                      setNewRole(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                           focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 
                               hover:border-purple-500 transition-all duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={editingRoleId
                          ? editRole.permissions.includes(permission.label)
                          : newRole.permissions.includes(permission.label)
                        }
                        onChange={() => handlePermissionChange(permission.label, editingRoleId)}
                        className="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300 
                                 focus:ring-purple-500 transition duration-150 ease-in-out"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {permission.label}
                        </label>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 
                         transition-all duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 
                         to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                         transition-all duration-300"
              >
                {editingRoleId ? 'Update Role' : 'Create Role'}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Roles Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden 
                    border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 
                             uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 
                             uppercase tracking-wider hidden sm:table-cell">
                  Permissions
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 
                             uppercase tracking-wider hidden md:table-cell">
                  Created At
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 
                             uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredRoles.map((role, index) => (
                  <motion.tr
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      <div className="sm:hidden mt-1 flex flex-wrap gap-1">
                        {role.permissions.map((permission, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 
                                     text-indigo-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-indigo-100 
                                     text-indigo-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 
                                 hidden md:table-cell">
                      {format(new Date(role.createdAt), 'PP')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm 
                                 font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(role)}
                          className="text-indigo-600 hover:text-indigo-900 p-2"
                        >
                          <FaEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(role.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <FaTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <FaHistory className="mr-2 text-purple-500" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text 
                         text-transparent">
            Recent Activity
          </span>
        </h3>
        <div className="space-y-4">
          <AnimatePresence>
            {activityLogs.slice(0, 5).map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 
                         hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-700 text-sm">{log.action}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.timestamp), 'PPpp')}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center 
                     justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this role? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 
                           hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 rounded-lg text-white bg-red-600 
                           hover:bg-red-700 transition-all duration-300"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RoleManagement;