 import { motion } from 'framer-motion';
import { useContext } from 'react';
import { FaClipboardCheck, FaRunning, FaFlagCheckered } from 'react-icons/fa';
import { GoalContext } from './context';

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
};

export default function ProgressStats() {
  const { goals } = useContext(GoalContext);

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 
    ? Math.round((completedGoals / totalGoals) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Goals",
      value: totalGoals,
      icon: <FaClipboardCheck className="text-indigo-500" />,
      color: "bg-indigo-50"
    },
    {
      title: "In Progress",
      value: inProgressGoals,
      icon: <FaRunning className="text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: <FaFlagCheckered className="text-green-500" />,
      color: "bg-green-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-700">Overall Progress</h3>
          <span className="text-sm font-medium">{completionRate}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              completionRate < 30 ? 'bg-red-500' :
              completionRate < 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`} 
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={statVariants}
            className={`${stat.color} p-4 rounded-xl shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="text-2xl">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}