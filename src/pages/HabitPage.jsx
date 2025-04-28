import React, { useState, useEffect } from 'react';
import './HabitPage.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useHabits } from '../hooks/useHabits';
import FooterNav from '../components/FooterNav';

const getCurrentMonthCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  const days = [];

  // Fill empty slots before the first day (to start from Monday)
  const correctedStartDay = (startDay === 0) ? 6 : startDay - 1; // move Sunday to end
  for (let i = 0; i < correctedStartDay; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const formattedDate = date.toLocaleDateString('en-CA');
    days.push({ dayNumber: day, fullDate: formattedDate });
  }

  return days;
};

const getCurrentMonthName = () => {
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = now.getMonth();
  const year = now.getFullYear();
  return `${monthNames[month]} ${year}`;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HabitPage = () => {
  const { habits, addHabit, toggleHabitDay, deleteHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const monthDays = getCurrentMonthCalendar();
  const monthName = getCurrentMonthName();

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const handleAddHabit = async () => {
    if (newHabit.trim()) {
      const addedHabit = await addHabit(newHabit);
      setNewHabit('');
    }
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="page-container">
      <div className="content-wrap">

        <div className="habit-tracker-container">
          <h1>
            <img src="/leaf_habit.png" alt="Leaf Icon" className="leaf-image" />
            Habit Tracker
          </h1>

          <div className="input-group">
            <input
              type="text"
              placeholder="New habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddHabit();
                }
              }}
            />
            <button onClick={handleAddHabit}>
              Add
            </button>
          </div>

          {habits.length > 0 && (
            <div className="habit-tabs">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  className={`tab-button ${habit.id === selectedHabitId ? 'active' : ''}`}
                  onClick={() => setSelectedHabitId(habit.id)}
                >
                  {habit.name}
                  <button
                    className="delete-btn-tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                      if (habit.id === selectedHabitId) {
                        setSelectedHabitId(null);
                      }
                    }}
                    title="Delete habit"
                  >
                    <FaTrashAlt />
                  </button>
                </button>
              ))}
            </div>
          )}

          <div className="habit-list">
            {habits.length === 0 && (
              <p className="no-habits-text">No habits yet. Start by adding one! ✨</p>
            )}

            {selectedHabit && (
              <div className="habit-card">
                <div className="habit-title">
                  {selectedHabit.name}
                  <span className="month-name"> : {monthName}</span>
                </div>

                <div className="calendar-header">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="calendar-weekday">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {monthDays.map((dateObj, idx) => (
                    <div key={idx} className="calendar-cell">
                      {dateObj ? (
                        <label className="custom-habit-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedHabit.log?.[dateObj.fullDate] || false}
                            onChange={() => toggleHabitDay(selectedHabit.id, dateObj.fullDate)}
                          />
                          <span className="checkmark"></span>
                          <span className="day-number">{dateObj.dayNumber}</span>
                        </label>
                      ) : (
                        <div className="empty-cell"></div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      <FooterNav />
    </div>
  );
};

export default HabitPage;
