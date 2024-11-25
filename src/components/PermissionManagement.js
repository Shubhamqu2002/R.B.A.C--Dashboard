import React, { useState, useMemo } from 'react';
import { 
  FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport, 
  FaHistory, FaShieldAlt, FaSort 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import useLocalStorage from '../hooks/useLocalStorage';

function PermissionManagement() {
  // Initial State
  const [permissions, setPermissions] = useLocalStorage('dashboard_permissions', [
    { id: 1, name: 'Read', description: 'Can view resources', type: 'Basic', createdAt: new Date().toISOString() },
    { id: 2, name: 'Write', description: 'Can create and edit resources', type: 'Advanced', createdAt: new Date().toISOString() },
    { id: 3, name: 'Delete', description: 'Can delete resources', type: 'Advanced', createdAt: new Date().toISOString() },
  ]);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Form State
  const [newPermission, setNewPermission] = useState({ name: '', description: '', type: '' });
  const [editPermission, setEditPermission] = useState(null);
  const [activityLogs, setActivityLogs] = useLocalStorage('permission_activity_logs', []);

  // Permission Types Configuration
  const permissionTypes = [
    { value: 'Basic', label: 'Basic', color: 'green' },
    { value: 'Advanced', label: 'Advanced', color: 'purple' },
    { value: 'Custom', label: 'Custom', color: 'blue' },
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

  const filteredAndSortedPermissions = useMemo(() => {
    let result = [...permissions];
    
    if (searchTerm) {
      result = result.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [permissions, searchTerm, sortConfig]);

  // Event Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPermissionId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = () => {
    const permissionData = {
      id: Date.now(),
      ...newPermission,
      createdAt: new Date().toISOString()
    };
    setPermissions(prev => [...prev, permissionData]);
    addActivityLog(`Added new permission: ${newPermission.name}`);
    resetForm();
  };

  const handleUpdate = () => {
    setPermissions(prev => prev.map(permission =>
      permission.id === editingPermissionId ? { ...editPermission, id: editingPermissionId } : permission
    ));
    addActivityLog(`Updated permission: ${editPermission.name}`);
    resetForm();
  };

  const handleDelete = (id) => {
    const permissionToDelete = permissions.find(permission => permission.id === id);
    setPermissions(prev => prev.filter(permission => permission.id !== id));
    addActivityLog(`Deleted permission: ${permissionToDelete.name}`);
    setShowDeleteConfirm(null);
  };

  const resetForm = () => {
    setNewPermission({ name: '', description: '', type: '' });
    setEditPermission(null);
    setEditingPermissionId(null);
    setShowForm(false);
  };

  const startEditing = (permission) => {
    setEditingPermissionId(permission.id);
    setEditPermission({ ...permission });
    setShowForm(true);
  };

  const exportToCSV = () => {
    const headers = ['Permission Name', 'Description', 'Type', 'Created At'];
    const csvData = filteredAndSortedPermissions.map(permission => [
      permission.name,
      permission.description,
      permission.type,
      format(new Date(permission.createdAt), 'PP')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `permissions_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    addActivityLog('Exported permissions data to CSV');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 p-4 sm:p-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
              <FaShieldAlt className="h-6 w-6 sm:h-8 sm:w-8" />
              Permission Management
            </h2>
            <p className="text-white/80 mt-2 text-sm sm:text-base">
              Total Permissions: {permissions.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingPermissionId(null);
                setEditPermission(null);
                setShowForm(!showForm);
              }}
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <FaPlus className="text-sm" />
              <span>Add Permission</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
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
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-lg transition-all duration-300 text-sm sm:text-base"
        />
        <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100 overflow-hidden"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingPermissionId ? 'Edit Permission' : 'Add New Permission'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Permission Name
                </label>
                <input
                  type="text"
                  value={editingPermissionId ? editPermission.name : newPermission.name}
                  onChange={(e) => {
                    if (editingPermissionId) {
                      setEditPermission({ ...editPermission, name: e.target.value });
                    } else {
                      setNewPermission({ ...newPermission, name: e.target.value });
                    }
                  }}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Permission Type
                </label>
                <select
                  value={editingPermissionId ? editPermission.type : newPermission.type}
                  onChange={(e) => {
                    if (editingPermissionId) {
                      setEditPermission({ ...editPermission, type: e.target.value });
                    } else {
                      setNewPermission({ ...newPermission, type: e.target.value });
                    }
                  }}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                >
                  <option value="">Select Type</option>
                  {permissionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={editingPermissionId ? editPermission.description : newPermission.description}
                  onChange={(e) => {
                    if (editingPermissionId) {
                      setEditPermission({ ...editPermission, description: e.target.value });
                    } else {
                      setNewPermission({ ...newPermission, description: e.target.value });
                    }
                  }}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4 sm:mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-3 sm:px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 sm:px-4 py-2 rounded-lg text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 text-sm sm:text-base"
              >
                {editingPermissionId ? 'Update Permission' : 'Add Permission'}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Permissions Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Description', 'Type', 'Created At', 'Actions'].map((header, index) => (
                
<th
                    key={header}
                    onClick={() => index !== 4 && handleSort(header.toLowerCase())}
                    className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200
                      ${index === 1 ? 'hidden sm:table-cell' : ''}
                      ${index === 2 || index === 3 ? 'hidden md:table-cell' : ''}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      {sortConfig.key === header.toLowerCase() && (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredAndSortedPermissions.map((permission, index) => (
                  <motion.tr
                    key={permission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-500">
                        {permission.description}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full
                        ${permission.type === 'Basic' ? 'bg-emerald-100 text-emerald-800' : 
                          permission.type === 'Advanced' ? 'bg-purple-100 text-purple-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {permission.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {format(new Date(permission.createdAt), 'PP')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(permission)}
                          className="text-teal-600 hover:text-teal-900 p-1 sm:p-2"
                          aria-label="Edit permission"
                        >
                          <FaEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(permission.id)}
                          className="text-red-600 hover:text-red-900 p-1 sm:p-2"
                          aria-label="Delete permission"
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
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
          <FaHistory className="mr-2 text-teal-500" />
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Recent Activity
          </span>
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {activityLogs.slice(0, 5).map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete this permission? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-3 sm:px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-3 sm:px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
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

export default PermissionManagement;

