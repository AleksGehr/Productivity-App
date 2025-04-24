import React, { useState, useEffect, useRef } from 'react';
import './TaskPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

import WeekCalendar from '../components/WeekCalendar';
import Header from '../components/Header';
import InputGroup from '../components/InputGroup';
import TaskList from '../components/TaskList';
import MotivationalOverlay from '../components/MotivationalOverlay';

const TaskPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const isFirstRender = useRef(true);
  const [width, height] = useWindowSize();

  const formatDate = (date) => date.toISOString().split('T')[0];
  const dateKey = formatDate(selectedDate);

  // Load tasks from Firestore
  const loadTasks = async () => {
    const q = query(collection(db, 'tasks'), where('date', '==', dateKey));
    const querySnapshot = await getDocs(q);
    const loaded = [];
    querySnapshot.forEach((doc) => {
      loaded.push({ id: doc.id, ...doc.data() });
    });
    setTasks(loaded);
  };

  useEffect(() => {
    loadTasks();
  }, [dateKey]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addDoc(collection(db, 'tasks'), {
      text: newTask,
      completed: false,
      date: dateKey
    });
    setNewTask('');
    loadTasks();
  };

  const handleToggle = async (id, current) => {
    const ref = doc(db, 'tasks', id);
    await updateDoc(ref, { completed: !current });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    loadTasks();
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    if (total > 0 && completed / total >= 0.7) {
      setHasCelebrated(true);
      setTimeout(() => setHasCelebrated(false), 5000);
    }
  }, [tasks]);

  return (
    <div className="app-wrapper">
      {hasCelebrated && <Confetti width={width} height={height} />}
      {hasCelebrated && <MotivationalOverlay />}

      <div className="task-manager-container">
        <Header />
        <div className="week-wrapper">
          <WeekCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>
        <InputGroup newTask={newTask} setNewTask={setNewTask} onAddTask={handleAddTask} />

        {tasks.length > 0 &&
          tasks.filter(t => t.completed).length / tasks.length >= 0.7 && (
            <div className="celebration-inline">
              <p>🎉 You are very productive today!</p>
            </div>
          )}

        <TaskList
          tasks={tasks}
          onToggle={(id) => {
            const task = tasks.find(t => t.id === id);
            handleToggle(id, task.completed);
          }}
          onDelete={handleDelete}
        />

        <Link to="/habits" className="nav-link">Go to Habits</Link>
      </div>
    </div>
  );
};

export default TaskPage;
