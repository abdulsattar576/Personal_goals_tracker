 import { useContext, useState } from 'react';
import GoalList from '../components/GoalList';
import GoalForm from '../components/GoalForm';
import ProgressStats from '../components/ProgressStats';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { GoalContext } from '../components/context'; // Import GoalContext instead of GoalProvider

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { goals } = useContext(GoalContext); // Use GoalContext here

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            My SMART Goals
          </motion.h1>
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            icon={FaPlus}
            iconPosition="left"
          >
            Add New Goal
          </Button>
        </div>

        {/* ProgressStats and GoalList */}
        <ProgressStats />
        <GoalList />

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
                  <GoalForm onClose={() => setShowForm(false)} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}