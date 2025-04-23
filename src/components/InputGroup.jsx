import React from 'react';

const InputGroup = ({ newTask, setNewTask, onAddTask }) => (
  <div className="input-group">
    <input
      type="text"
      placeholder="Enter a task..."
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
    <button onClick={onAddTask}>Add</button>
  </div>
);

export default InputGroup;
