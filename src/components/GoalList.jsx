 import { useEffect, useContext, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase.config';
import GoalItem from './GoalItem';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
import { isValid, parseISO } from 'date-fns';
import { GoalContext } from './context';

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const errorVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const emptyVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

const parseFirestoreDate = (dateValue) => {
  try {
    if (!dateValue) return null;
    if (dateValue.toDate) return dateValue.toDate();
    if (dateValue instanceof Date) return dateValue;
    return parseISO(dateValue);
  } catch {
    return null;
  }
};

export default function GoalList() {
  const { goals, setGoals, loading, setLoading, error, setError } = useContext(GoalContext);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let unsubscribe;

    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);

        await auth.authStateReady();
        
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'goals'),
          where('userId', '==', auth.currentUser.uid)
        );

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const goalsData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            goalsData.push({ 
              id: doc.id, 
              ...data,
              deadline: parseFirestoreDate(data.deadline),
              createdAt: parseFirestoreDate(data.createdAt) || new Date()
            });
          });
          setGoals(goalsData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching goals:", error);
          setError("Failed to load goals. Please try again.");
          setLoading(false);
        });

      } catch (err) {
        console.error("Initialization error:", err);
        setError("Authentication not ready");
        setLoading(false);
      }
    };

    fetchGoals();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setGoals, setLoading, setError]);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.status !== 'completed';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const statusOrder = { 'not-started': 0, 'in-progress': 1, 'completed': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    const aDate = a.deadline ? new Date(a.deadline) : new Date(0);
    const bDate = b.deadline ? new Date(b.deadline) : new Date(0);
    return aDate - bDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'all' 
              ? 'bg-indigo-100 text-indigo-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'active' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={loadingVariants}
          className="flex flex-col items-center justify-center py-12 text-gray-500"
        >
          <FaSpinner className="animate-spin text-2xl mb-2" />
          <p>Loading your goals...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={errorVariants}
          className="flex flex-col items-center justify-center py-12 text-red-500"
        >
          <FaExclamationTriangle className="text-2xl mb-2" />
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </motion.div>
      ) : sortedGoals.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={emptyVariants}
          className="flex flex-col items-center justify-center py-12 text-gray-400"
        >
          <FaClipboardList className="text-3xl mb-3" />
          <p className="text-lg mb-1">No goals found</p>
          <p className="text-sm">Add your first goal to get started!</p>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1"
        >
          <AnimatePresence>
            {sortedGoals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <GoalItem goal={goal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && !error && goals.length > 0 && (
        <div className="text-sm text-gray-500 text-center mt-6">
          Showing {filteredGoals.length} of {goals.length} goals
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')}
              className="ml-2 text-indigo-600 hover:underline"
            >
              (Show all)
            </button>
          )}
        </div>
      )}
    </div>
  );
}