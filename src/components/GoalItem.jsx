 import { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSave,
  FaFlag,
  FaRunning,
  FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { format, isValid, parseISO } from 'date-fns';

const safeFormatDate = (dateValue, fallback = 'No deadline') => {
  try {
    if (!dateValue) return fallback;
    const date = dateValue instanceof Date ? dateValue : parseISO(dateValue);
    return isValid(date) ? format(date, 'MMM d, yyyy') : fallback;
  } catch {
    return fallback;
  }
};

const statusIcons = {
  'not-started': <FaFlag className="text-gray-400" />,
  'in-progress': <FaRunning className="text-blue-400" />,
  'completed': <FaCheckCircle className="text-green-400" />
};

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800'
};

export default function GoalItem({ goal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState({ ...goal });

  useEffect(() => {
    if (isEditing) {
      setEditedGoal({
        ...goal,
        deadline: goal.deadline instanceof Date ? 
          goal.deadline.toISOString().split('T')[0] : 
          goal.deadline
      });
    }
  }, [isEditing, goal]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'goals', goal.id), {
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : goal.progress
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteDoc(doc(db, 'goals', goal.id));
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'goals', goal.id), editedGoal);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGoal(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={editedGoal.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editedGoal.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline*</label>
                <input
                  type="date"
                  name="deadline"
                  value={editedGoal.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editedGoal.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress: {editedGoal.progress}%
              </label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={editedGoal.progress}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="secondary"
                size="small"
                icon={FaTimes}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="primary"
                size="small"
                icon={FaSave}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[goal.status]}`}>
                    {statusIcons[goal.status]}
                    <span className="ml-1">{goal.status.replace('-', ' ')}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {safeFormatDate(goal.createdAt, 'Unknown date')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                {goal.description && (
                  <p className="mt-1 text-gray-600">{goal.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="small"
                  icon={FaEdit}
                  className="text-gray-500 hover:text-indigo-600"
                />
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  size="small"
                  icon={FaTrash}
                  className="text-gray-500 hover:text-red-600"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Deadline: {safeFormatDate(goal.deadline)}
                </span>
                <span className="text-sm font-medium">
                  {goal.progress}% Complete
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    goal.progress < 30 ? 'bg-red-500' :
                    goal.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                onClick={() => handleStatusChange('not-started')}
                variant={goal.status === 'not-started' ? 'secondary' : 'ghost'}
                size="small"
              >
                Not Started
              </Button>
              <Button
                onClick={() => handleStatusChange('in-progress')}
                variant={goal.status === 'in-progress' ? 'secondary' : 'ghost'}
                size="small"
              >
                In Progress
              </Button>
              <Button
                onClick={() => handleStatusChange('completed')}
                variant={goal.status === 'completed' ? 'secondary' : 'ghost'}
                size="small"
              >
                Complete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}