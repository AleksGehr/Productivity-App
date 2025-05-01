import React, { useState, useEffect, useRef } from 'react';
import './TaskPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
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
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import WeekCalendar from '../components/WeekCalendar';
import Header from '../components/Header';
import InputGroup from '../components/InputGroup';
import TaskList from '../components/TaskList';
import MotivationalOverlay from '../components/MotivationalOverlay';
import FooterNav from '../components/FooterNav';
import TaskSettingsModal from '../components/TaskSettingsModal';
import { useCelebrations } from '../hooks/useCelebrations';

const TaskPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId, setUserId] = useState(null);
  const [taskSettingsOpen, setTaskSettingsOpen] = useState(null);

  const [width, height] = useWindowSize();
  const isFirstRender = useRef(true);

  const formatDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  };
  const dateKey = formatDate(selectedDate);

  const { hasCelebrated, markCelebrated, loadingCelebration } = useCelebrations(dateKey);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      if (!userId) {
        setTasks([]);
        return;
      }

      const q = query(
        collection(db, 'tasks'),
        where('date', '==', dateKey),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const loadedTasks = [];
      querySnapshot.forEach((doc) => {
        loadedTasks.push({ id: doc.id, ...doc.data() });
      });
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndCelebrate = async (loadedTasks) => {
    const total = loadedTasks.length;
    const completed = loadedTasks.filter(t => t.completed).length;

    if (!loadingCelebration && total > 0 && completed / total >= 0.7 && !hasCelebrated) {
      setShowConfetti(true);
      await markCelebrated();
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      loadTasks();
    }
    isFirstRender.current = false;
  }, [dateKey, userId]);

  useEffect(() => {
    if (!loading && !loadingCelebration) {
      checkAndCelebrate(tasks);
    }
  }, [tasks, loading, loadingCelebration]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !userId) return;

    await addDoc(collection(db, 'tasks'), {
      text: newTask,
      completed: false,
      date: dateKey,
      userId: userId
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
    setTaskSettingsOpen(null);
  };

  const handleMove = async (task, newDate) => {
    if (!userId || !newDate) return;
  
    const formattedDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  
    const ref = doc(db, 'tasks', task.id);
    await updateDoc(ref, { date: formattedDate });
  
    loadTasks();
    setTaskSettingsOpen(null);
  };

  const handleCopy = async (task, targetDate) => {
    if (!userId || !targetDate) return;
  
    const formattedDate = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  
    await addDoc(collection(db, 'tasks'), {
      text: task.text,
      completed: false,
      date: formattedDate,
      userId: userId
    });
  
    loadTasks();
    setTaskSettingsOpen(null);
  };

  const handleEdit = async (task) => {
    const ref = doc(db, 'tasks', task.id);
    await updateDoc(ref, { text: task.text });
    loadTasks();
    setTaskSettingsOpen(null);
  };

  const closeTaskModal = () => setTaskSettingsOpen(null);

  return (
    <div className="page-container">
      <div className="content-wrap">
        {showConfetti && <Confetti width={width} height={height} />}
        {showConfetti && <MotivationalOverlay />}

        <TaskSettingsModal
          task={taskSettingsOpen}
          onClose={closeTaskModal}
          onMove={handleMove}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

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
                dateKey={dateKey}
                onToggle={(id) => {
                  const task = tasks.find(t => t.id === id);
                  handleToggle(id, task.completed);
                }}
                onDelete={handleDelete}
                onMove={handleMove}
                onCopy={handleCopy}
                onOpenSettings={(task) => setTaskSettingsOpen(task)}
              />
            </>
          )}
        </div>
      </div>

      <FooterNav />
    </div>
  );
};

export default TaskPage;
