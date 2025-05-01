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
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const habitsCollection = collection(db, 'habits');

  useEffect(() => {
    if (!userId) return;

    const q = query(habitsCollection, where('userId', '==', userId));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const fetchedHabits = [];
      querySnapshot.forEach((doc) => {
        fetchedHabits.push({ id: doc.id, ...doc.data() });
      });
    
      // ✅ Sort alphabetically
      fetchedHabits.sort((a, b) => a.name.localeCompare(b.name));
      setHabits(fetchedHabits);
    });

    return () => unsub();
  }, [userId]);

  const addHabit = async (name) => {
    if (!userId || !name.trim()) return;
  
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-04-30"
  
    const newHabit = {
      internalId: Date.now(),
      name,
      log: {},
      userId: userId,
      startDate: today, // ✅ Save start date
    };
  
    await addDoc(habitsCollection, newHabit);
  };

  const toggleHabitDay = async (habitDocId, date) => {
    if (!userId) return;
  
    const habitRef = doc(db, 'habits', habitDocId);
    const habitSnap = await getDoc(habitRef);
  
    if (!habitSnap.exists()) return;
  
    const habitData = habitSnap.data();
    const currentState = habitData.log?.[date] || false;
    const updatedLog = { ...habitData.log, [date]: !currentState };
  
    // ✅ 1. Update the habit log
    await updateDoc(habitRef, { log: updatedLog });
  
    // ✅ 2. Update the matching task if it exists
    const taskQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('habitId', '==', habitDocId),
      where('date', '==', date)
    );
  
    const taskSnap = await getDocs(taskQuery);
    taskSnap.forEach(async (docSnap) => {
      const taskRef = doc(db, 'tasks', docSnap.id);
      await updateDoc(taskRef, { completed: !currentState });
    });
  };
  

  const deleteHabit = async (habitDocId) => {
    if (!userId) return;

    const habitRef = doc(db, 'habits', habitDocId);
    await deleteDoc(habitRef);
  };

  return { habits, addHabit, toggleHabitDay, deleteHabit };
};
