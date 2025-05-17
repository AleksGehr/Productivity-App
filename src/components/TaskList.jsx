import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSettingsSharp } from "react-icons/io5";

const TaskList = ({ tasks, onToggle, onDelete, dateKey, onMove, onCopy, onOpenSettings }) => {
  const sortedTasks = [
    ...tasks.filter(t => !t.completed).sort((a, b) => a.text.localeCompare(b.text)),
    ...tasks.filter(t => t.completed).sort((a, b) => a.text.localeCompare(b.text))
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.ul
        className="task-list"
        key={dateKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {sortedTasks.map((task) => (
          <motion.li
            key={task.id}
            className={task.completed ? 'completed' : ''}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            style={{ position: 'relative' }}
          >
            <div className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
              />
              <span className="custom-checkbox"></span>
              <span className="task-text">{task.text}</span>
            </div>

            <button
              className="settings-btn"
              onClick={() => onOpenSettings(task)}
            >
              <IoSettingsSharp />
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
};

export default TaskList;
