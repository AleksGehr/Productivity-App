import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

import WeekCalendar from './WeekCalendar';
import Header from './components/Header';
import InputGroup from './components/InputGroup';
import TaskList from './components/TaskList';
import MotivationalOverlay from './components/MotivationalOverlay';
import { useTasksByDate } from './hooks/useTasksByDate';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const isFirstRender = useRef(true);
  const [width, height] = useWindowSize();

  const dateKey = selectedDate.toISOString().split('T')[0];

  const {
    tasksByDate,
    addTask,
    toggleComplete,
    deleteTask,
    celebratedDates,
    markCelebrated
  } = useTasksByDate(dateKey);

  const todayTasks = tasksByDate[dateKey] || [];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;

    if (total > 0 && completed / total >= 0.7 && !celebratedDates[dateKey]) {
      setHasCelebrated(true);
      markCelebrated();
      setTimeout(() => setHasCelebrated(false), 5000);
    }
  }, [todayTasks, dateKey, celebratedDates, markCelebrated]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask('');
  };

  return (
    <div className="app-wrapper">
      {hasCelebrated && <Confetti width={width} height={height} />}
      {hasCelebrated && <MotivationalOverlay />}

      <div className="task-manager-container">
        <Header />

        <div className="week-wrapper">
          <WeekCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        <InputGroup
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddTask}
        />

        {todayTasks.length > 0 &&
          todayTasks.filter(t => t.completed).length / todayTasks.length >= 0.7 && (
            <div className="celebration-inline">
              <p>🎉 You are very productive today!</p>
            </div>
          )}

        <TaskList
          tasks={todayTasks}
          onToggle={toggleComplete}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
