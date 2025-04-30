import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const HabitTabs = ({ habits, selectedHabitId, setSelectedHabitId, deleteHabit }) => (
  <div className="habit-tabs">
    {[...habits]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((habit) => (
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
              if (habit.id === selectedHabitId) setSelectedHabitId(null);
            }}
            title="Delete habit"
          >
            <FaTrashAlt />
          </button>
        </button>
      ))}
  </div>
);

export default HabitTabs;
