import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';

export const useTasksByDate = (dateKey) => {
  const [tasks, setTasks] = useState([]);
  const [celebrated, setCelebrated] = useState(false);

  const tasksRef = doc(db, 'tasksByDate', dateKey);
  const celebrationRef = doc(db, 'celebratedDates', dateKey);

  // 🔄 Load tasks in real-time
  useEffect(() => {
    const unsub = onSnapshot(tasksRef, (docSnap) => {
      if (docSnap.exists()) {
        setTasks(docSnap.data().tasks || []);
      } else {
        setTasks([]);
      }
    });

    return () => unsub();
  }, [dateKey]);

  // 🎉 Check celebration status
  useEffect(() => {
    getDoc(celebrationRef).then((docSnap) => {
      if (docSnap.exists()) {
        setCelebrated(!!docSnap.data().celebrated);
      } else {
        setCelebrated(false);
      }
    });
  }, [dateKey]);

  // ➕ Add task
  const addTask = async (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };

    await setDoc(tasksRef, { tasks: arrayUnion(newTask) }, { merge: true });
  };

  // ✅ Toggle completion
  const toggleComplete = async (id) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    await setDoc(tasksRef, { tasks: updated });
  };

  // ❌ Delete task
  const deleteTask = async (id) => {
    const updated = tasks.filter(t => t.id !== id);
    await setDoc(tasksRef, { tasks: updated });
  };

  // 🎉 Mark as celebrated
  const markCelebrated = async () => {
    await setDoc(celebrationRef, { celebrated: true });
    setCelebrated(true);
  };

  return {
    tasks,
    addTask,
    toggleComplete,
    deleteTask,
    celebrated,
    markCelebrated,
  };
};
