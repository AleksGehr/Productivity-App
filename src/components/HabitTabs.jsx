import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import './HabitTabs.css'; 

const HabitTabs = ({ habits, selectedHabitId, setSelectedHabitId, deleteHabit }) => {
  const sortedHabits = [...habits].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="habit-tabs">
      {sortedHabits.map((habit) => (
        <div key={habit.id} className="tab-container">
          <button
            className={`tab-button ${habit.id === selectedHabitId ? 'active' : ''}`}
            onClick={() => setSelectedHabitId(habit.id)}
          >
            {habit.name}
          </button>
          <button
            className="delete-btn-tab"
            onClick={() => {
              deleteHabit(habit.id);
              if (habit.id === selectedHabitId) {
                setSelectedHabitId(null);
              }
            }}
            title="Delete habit"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );
};

export default HabitTabs;
