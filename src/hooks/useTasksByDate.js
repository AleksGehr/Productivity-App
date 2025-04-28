import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';

export const useTasksByDate = (dateKey) => {
  const [tasks, setTasks] = useState([]);
  const [celebrated, setCelebrated] = useState(false);

  const tasksRef = doc(db, 'tasksByDate', dateKey);
  const celebrationCollection = collection(db, 'celebratedDates');
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

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

  useEffect(() => {
    const loadCelebration = async () => {
      if (!userId) return;

      const q = query(
        celebrationCollection,
        where('userId', '==', userId),
        where('dateKey', '==', dateKey)
      );

      const querySnapshot = await getDocs(q);
      setCelebrated(!querySnapshot.empty);
    };

    loadCelebration();
  }, [dateKey, userId]);

  const addTask = async (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };

    await setDoc(tasksRef, { tasks: arrayUnion(newTask) }, { merge: true });
  };

  const toggleComplete = async (id) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    await setDoc(tasksRef, { tasks: updated });
  };

  const deleteTask = async (id) => {
    const updated = tasks.filter(t => t.id !== id);
    await setDoc(tasksRef, { tasks: updated });
  };

  const markCelebrated = async () => {
    if (!userId) return;

    await addDoc(celebrationCollection, {
      celebrated: true,
      userId: userId,
      dateKey: dateKey
    });

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
