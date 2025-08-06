 import React, { createContext, useState } from 'react';

export const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <GoalContext.Provider value={{ goals, setGoals, loading, setLoading, error, setError }}>
      {children}
    </GoalContext.Provider>
  );
};