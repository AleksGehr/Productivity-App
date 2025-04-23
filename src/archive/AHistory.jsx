import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import WeekCalendar from '../WeekCalendar';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [newTask, setNewTask] = useState('');
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [celebratedDates, setCelebratedDates] = useState({});
  const isFirstRender = useRef(true);
  const [width, height] = useWindowSize();

  const dateKey = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasksByDate')) || {};
    const savedCelebrated = JSON.parse(localStorage.getItem('celebratedDates')) || {};
    setTasksByDate(savedTasks);
    setCelebratedDates(savedCelebrated);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem('tasksByDate', JSON.stringify(tasksByDate));

    const todayTasks = tasksByDate[dateKey] || [];
    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;

    if (total > 0 && completed / total >= 0.7 && !celebratedDates[dateKey]) {
      setHasCelebrated(true);
      const updatedCelebrated = { ...celebratedDates, [dateKey]: true };
      setCelebratedDates(updatedCelebrated);
      localStorage.setItem('celebratedDates', JSON.stringify(updatedCelebrated));
      setTimeout(() => setHasCelebrated(false), 10000);
    }
  }, [tasksByDate, dateKey, celebratedDates]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newEntry = { id: Date.now(), text: newTask, completed: false };
    setTasksByDate(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEntry]
    }));
    setNewTask('');
  };

  const toggleComplete = (id) => {
    const updated = tasksByDate[dateKey].map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasksByDate(prev => ({ ...prev, [dateKey]: updated }));
  };

  const deleteTask = (id) => {
    const updated = tasksByDate[dateKey].filter(task => task.id !== id);
    setTasksByDate(prev => ({ ...prev, [dateKey]: updated }));
  };

  const todayTasks = tasksByDate[dateKey] || [];

  return (
    <div className="app-wrapper">
      {hasCelebrated && <Confetti width={width} height={height} />}

      {hasCelebrated && (
        <div className="motivational-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="motivational-message"
          >
            <img
              src="/productive.jpg"
              alt="Motivational"
              className="motivational-image"
            />
            <p>🎉 You’ve been super productive today!<br />I’m proud of you!</p>
          </motion.div>
        </div>
      )}

      <div className="task-manager-container">
        <h1>
          <img
            src="/leaf.png"
            alt="Leaf Icon"
            className="leaf-image"
          />
          My Tasks
        </h1>

        <div className="week-wrapper">
          <WeekCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {todayTasks.length > 0 &&
          todayTasks.filter(t => t.completed).length / todayTasks.length >= 0.7 && (
            <div className="celebration-inline">
              <p>🎉 You are very productive today!</p>
            </div>
          )}

        <ul className="task-list">
          <AnimatePresence>
            {[...todayTasks]
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
                      onChange={() => toggleComplete(task.id)}
                    />
                    <span className="custom-checkbox"></span>
                    <span className="task-text">{task.text}</span>
                  </div>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                    <FaTrashAlt />
                  </button>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

export default App;
