import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, onToggle, onDelete, dateKey }) => (
  <AnimatePresence mode="wait">
    <motion.ul
      className="task-list"
      key={dateKey} // ensure entire list re-renders per day
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {[...tasks]
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
        .map((task) => (
          <motion.li
            key={task.id}
            className={task.completed ? 'completed' : ''}
            initial={{ opacity: 0, y: 10 }}   // subtle slide
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
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
    </motion.ul>
  </AnimatePresence>
);

export default TaskList;
