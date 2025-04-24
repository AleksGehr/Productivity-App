// src/context/TaskContext.jsx
import { createContext, useContext } from 'react';
import { useTasksByDate } from '../hooks/useTasksByDate';

const TaskContext = createContext();

export const TaskProvider = ({ children, dateKey }) => {
  const value = useTasksByDate(dateKey);
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
