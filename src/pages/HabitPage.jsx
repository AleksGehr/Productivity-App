import React, { useState, useEffect } from 'react';
import './HabitPage.css';
import { useHabits } from '../hooks/useHabits';
import FooterNav from '../components/FooterNav';
import HabitInput from '../components/HabitInput';
import HabitTabs from '../components/HabitTabs';
import MonthNavigation from '../components/MonthNavigation';
import HabitCalendar from '../components/HabitCalendar';

const getMonthCalendar = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

  const days = [];
  const correctedStartDay = startDay === 0 ? 6 : startDay - 1;
  for (let i = 0; i < correctedStartDay; i++) days.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month, day);
    const formattedDate = dayDate.toLocaleDateString('en-CA');
    days.push({ dayNumber: day, fullDate: formattedDate });
  }

  return days;
};

const getMonthName = (date) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const HabitPage = () => {
  const { habits, addHabit, toggleHabitDay, deleteHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const todayString = new Date().toLocaleDateString('en-CA');
  const monthDays = getMonthCalendar(selectedMonth);
  const monthName = getMonthName(selectedMonth);

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const handleAddHabit = async () => {
    if (newHabit.trim()) {
      await addHabit(newHabit);
      setNewHabit('');
    }
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="habit-tracker-container">
          <h1>
            <img src="/leaf_habit.png" alt="Leaf Icon" className="leaf-image" />
            Habit Tracker
          </h1>

          <HabitInput
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            handleAddHabit={handleAddHabit}
          />

          {habits.length > 0 && (
            <HabitTabs
              habits={habits}
              selectedHabitId={selectedHabitId}
              setSelectedHabitId={setSelectedHabitId}
              deleteHabit={deleteHabit}
            />
          )}

          <div className="habit-list">
            {habits.length === 0 && (
              <p className="no-habits-text">No habits yet. Start by adding one! ✨</p>
            )}

            {selectedHabit && (
              <div className="habit-card">
                <MonthNavigation
                  habitName={selectedHabit.name}
                  monthName={monthName}
                  onPrev={() =>
                    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                  }
                  onNext={() =>
                    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                  }
                />

                <HabitCalendar
                  monthDays={monthDays}
                  todayString={todayString}
                  selectedHabit={selectedHabit}
                  toggleHabitDay={toggleHabitDay}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterNav />
    </div>
  );
};

export default HabitPage;
