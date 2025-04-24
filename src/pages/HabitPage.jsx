import React, { useState } from 'react';
import './HabitPage.css';
import { Link } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';

const getYearDays = () => {
  const start = new Date(new Date().getFullYear(), 0, 1);
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date.toISOString().split('T')[0];
  });
};

const HabitPage = () => {
  const { habits, addHabit, toggleHabitDay } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const yearDays = getYearDays();

  return (
    <div className="habit-tracker-container">
      <h1>🌿 Habit Tracker</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="New habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button onClick={() => {
          addHabit(newHabit);
          setNewHabit('');
        }}>Add</button>
      </div>

      <div className="habit-list">
        {habits.map((habit, index) => (
          <div key={index} className="habit-card">
            <div className="habit-title">{habit.name}</div>
            <div className="habit-days">
              {yearDays.map((date) => (
                <div
                  key={date}
                  className={`habit-day ${habit.log[date] ? 'checked' : ''}`}
                  onClick={() => toggleHabitDay(index, date)}
                  title={date}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="nav-link">Back to Tasks</Link>
    </div>
  );
};

export default HabitPage;
