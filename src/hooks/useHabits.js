import { useState, useEffect } from 'react';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('habits')) || [];
    setHabits(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name) => {
    if (!name.trim()) return;
    setHabits([...habits, { name, log: {} }]);
  };

  const toggleHabitDay = (habitIndex, date) => {
    const updated = [...habits];
    const current = updated[habitIndex].log[date];
    updated[habitIndex].log[date] = !current;
    setHabits(updated);
  };

  return { habits, addHabit, toggleHabitDay };
};
