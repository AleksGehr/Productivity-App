import React, { useState, useEffect } from 'react';
import './TaskPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { auth, db } from '../firebase';
import {
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection
} from 'firebase/firestore';

import WeekCalendar from '../components/WeekCalendar';
import Header from '../components/Header';
import InputGroup from '../components/InputGroup';
import TaskList from '../components/TaskList';
import MotivationalOverlay from '../components/MotivationalOverlay';
import FooterNav from '../components/FooterNav';
import TaskSettingsModal from '../components/TaskSettingsModal';
import { useCelebrations } from '../hooks/useCelebrations';
import { useTasks } from '../hooks/useTasks';

const TaskPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [taskSettingsOpen, setTaskSettingsOpen] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  const formatDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  };
  const dateKey = formatDate(selectedDate);

  const { tasks, addTask, toggleComplete } = useTasks(dateKey);
  const { hasCelebrated, markCelebrated, loadingCelebration } = useCelebrations(dateKey);

  // 🎉 Trigger celebration if 70% of tasks completed
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    if (!loadingCelebration && total > 0 && completed / total >= 0.7 && !hasCelebrated) {
      setShowConfetti(true);
      markCelebrated();
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [tasks, loadingCelebration, hasCelebrated, markCelebrated]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask.trim());
    setNewTask('');
  };

  const handleEdit = async (task) => {
    const ref = doc(db, 'tasks', task.id);
    await updateDoc(ref, { text: task.text });
    setTaskSettingsOpen(null);
    loadTasks();   
  };

  const handleMove = async (task, newDate) => {
    if (!newDate) return;
    const formattedDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const taskRef = doc(db, 'tasks', task.id);
    await updateDoc(taskRef, { date: formattedDate });
    setTaskSettingsOpen(null);
  };

  const handleCopy = async (task, targetDate) => {
    if (!targetDate) return;
    const formattedDate = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    await addDoc(collection(db, 'tasks'), {
      text: task.text,
      completed: false,
      date: formattedDate,
      userId: auth.currentUser.uid
    });

    setTaskSettingsOpen(null);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTaskSettingsOpen(null);
  };

  return (
    <div className="page-container">
      <div className="content-wrap">
        {showConfetti && <Confetti width={width} height={height} />}
        {showConfetti && <MotivationalOverlay />}

        <TaskSettingsModal
          task={taskSettingsOpen}
          onClose={() => setTaskSettingsOpen(null)}
          onMove={handleMove}
          onCopy={handleCopy}
          onDelete={deleteTask}
          onEdit={handleEdit}
        />

        <div className="task-manager-container">
          <Header />
          <div className="week-wrapper">
            <WeekCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>

          <InputGroup newTask={newTask} setNewTask={setNewTask} onAddTask={handleAddTask} />

          {tasks.length === 0 ? (
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
                  toggleComplete(id);
                }}
                onDelete={deleteTask}
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
