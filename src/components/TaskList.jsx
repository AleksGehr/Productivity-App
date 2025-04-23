import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, onToggle, onDelete }) => (
  <ul className="task-list">
    <AnimatePresence>
      {[...tasks]
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
        .map((task) => (
          <motion.li
            key={task.id}
            className={task.completed ? 'completed' : ''}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
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
            <button className="delete-btn" onClick={() => onDelete(task.id)}>
              <FaTrashAlt />
            </button>
          </motion.li>
        ))}
    </AnimatePresence>
  </ul>
);

export default TaskList;
