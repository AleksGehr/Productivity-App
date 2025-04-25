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
  updateDoc,
  setDoc,
  getDoc
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
  const [loading, setLoading] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [width, height] = useWindowSize();
  const isFirstRender = useRef(true);

  const formatDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  };
  const dateKey = formatDate(selectedDate);

  // Celebration helpers using Firestore
  const getCelebrationStatus = async (dateKey) => {
    const docRef = doc(db, 'celebrations', dateKey);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const setCelebrationStatus = async (dateKey) => {
    const docRef = doc(db, 'celebrations', dateKey);
    await setDoc(docRef, { celebrated: true });
  };

  // Load tasks from Firestore and handle celebration check
  const loadTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'tasks'), where('date', '==', dateKey));
      const querySnapshot = await getDocs(q);
      const loaded = [];
      querySnapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() });
      });
      setTasks(loaded);

      // 🎯 Check celebration AFTER loading tasks
      const total = loaded.length;
      const completed = loaded.filter(t => t.completed).length;
      const alreadyCelebrated = await getCelebrationStatus(dateKey);

      if (total > 0 && completed / total >= 0.7 && !alreadyCelebrated) {
        setHasCelebrated(true);
        await setCelebrationStatus(dateKey);

        setTimeout(() => setHasCelebrated(false), 5000);
      }

    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
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

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks for today yet! Add one ✨</p>
        ) : (
          <>
            {tasks.filter(t => t.completed).length / tasks.length >= 0.7 && (
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
          </>
        )}

        <Link to="/habits" className="nav-link">Go to Habits</Link>
      </div>
    </div>
  );
};

export default TaskPage;
