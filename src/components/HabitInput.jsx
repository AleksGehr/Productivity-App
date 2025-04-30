import React from 'react';

const HabitInput = ({ newHabit, setNewHabit, handleAddHabit }) => (
  <div className="input-group">
    <input
      type="text"
      placeholder="New habit..."
      value={newHabit}
      onChange={(e) => setNewHabit(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleAddHabit();
      }}
    />
    <button onClick={handleAddHabit}>Add</button>
  </div>
);

export default HabitInput;
