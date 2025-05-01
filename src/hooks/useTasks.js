import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useTasks = (dateKey) => {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  const tasksCollection = collection(db, 'tasks');
  const habitsCollection = collection(db, 'habits');

  // 🔐 Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // 🔁 Subscribe to task changes
  useEffect(() => {
    if (!userId) return;

    const q = query(
      tasksCollection,
      where('userId', '==', userId),
      where('date', '==', dateKey)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(loaded);
    });

    return () => unsub();
  }, [userId, dateKey]);

  // ✅ One-time: Create habit tasks for today if missing
  useEffect(() => {
    const generateHabitTasks = async () => {
      if (!userId) return;

      const todayKey = new Date().toISOString().split('T')[0];
      if (dateKey !== todayKey) return;

      const [taskSnap, habitsSnap] = await Promise.all([
        getDocs(query(tasksCollection, where('userId', '==', userId), where('date', '==', dateKey))),
        getDocs(query(habitsCollection, where('userId', '==', userId)))
      ]);

      const existingTasks = taskSnap.docs.map(doc => doc.data());

      for (const habitDoc of habitsSnap.docs) {
        const habit = { id: habitDoc.id, ...habitDoc.data() };
        const start = new Date(habit.startDate);
        const current = new Date(dateKey);
        if (current < start) continue;

        const exists = existingTasks.some(t => t.habitId === habit.id);
        if (!exists) {
          console.log(`🟢 Generating habit task: ${habit.name}`);
          await addDoc(tasksCollection, {
            text: habit.name,
            completed: habit.log?.[dateKey] || false,
            habitId: habit.id,
            date: dateKey,
            userId
          });
        }
      }
    };

    generateHabitTasks();
  }, [userId, dateKey]);

  // ➕ Add
  const addTask = async (text) => {
    if (!userId || !text.trim()) return;
    await addDoc(tasksCollection, {
      text,
      completed: false,
      date: dateKey,
      userId
    });
  };

  // ✅ Toggle + sync to habit
  const toggleComplete = async (id) => {
    const ref = doc(db, 'tasks', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const current = snap.data();
    await updateDoc(ref, { completed: !current.completed });

    if (current.habitId) {
      const habitRef = doc(db, 'habits', current.habitId);
      const habitSnap = await getDoc(habitRef);
      if (habitSnap.exists()) {
        const log = habitSnap.data().log || {};
        log[dateKey] = !current.completed;
        await updateDoc(habitRef, { log });
      }
    }
  };

  return {
    tasks,
    addTask,
    toggleComplete
  };
};
