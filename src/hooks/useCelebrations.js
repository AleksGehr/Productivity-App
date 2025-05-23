import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useCelebrations = (dateKey) => {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [loadingCelebration, setLoadingCelebration] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !dateKey) return;

    const checkCelebration = async () => {
      setLoadingCelebration(true);
      const celebrationId = `${userId}_${dateKey}`;
      const docRef = doc(db, 'celebrations', celebrationId);
      const docSnap = await getDoc(docRef);

      setHasCelebrated(docSnap.exists());
      setLoadingCelebration(false);
    };

    checkCelebration();
  }, [userId, dateKey]);

  const markCelebrated = async () => {
    if (!userId || !dateKey) return;

    const celebrationId = `${userId}_${dateKey}`;
    const docRef = doc(db, 'celebrations', celebrationId);

    await setDoc(docRef, {
      celebrated: true,
      userId,
      dateKey,
      createdAt: new Date().toISOString(),
    });

    setHasCelebrated(true);
  };

  return { hasCelebrated, markCelebrated, loadingCelebration };
};
