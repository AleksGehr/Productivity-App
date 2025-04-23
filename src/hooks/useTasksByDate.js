import { useState, useEffect } from 'react';

export const useTasksByDate = (dateKey) => {
  const [tasksByDate, setTasksByDate] = useState({});
  const [celebratedDates, setCelebratedDates] = useState({});

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasksByDate')) || {};
    const savedCelebrated = JSON.parse(localStorage.getItem('celebratedDates')) || {};
    setTasksByDate(savedTasks);
    setCelebratedDates(savedCelebrated);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));
  }, [tasksByDate]);

  const addTask = (text) => {
    const newEntry = { id: Date.now(), text, completed: false };
    setTasksByDate(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEntry]
    }));
  };

  const toggleComplete = (id) => {
    const updated = tasksByDate[dateKey].map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasksByDate(prev => ({ ...prev, [dateKey]: updated }));
  };

  const deleteTask = (id) => {
    const updated = tasksByDate[dateKey].filter(task => task.id !== id);
    setTasksByDate(prev => ({ ...prev, [dateKey]: updated }));
  };

  const markCelebrated = () => {
    const updated = { ...celebratedDates, [dateKey]: true };
    setCelebratedDates(updated);
    localStorage.setItem('celebratedDates', JSON.stringify(updated));
  };

  return {
    tasksByDate,
    addTask,
    toggleComplete,
    deleteTask,
    celebratedDates,
    markCelebrated
  };
};
