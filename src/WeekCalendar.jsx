import React, { useState, useEffect } from 'react';
import './WeekCalendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const WeekCalendar = ({ selectedDate, onDateSelect }) => {
  const [weekDates, setWeekDates] = useState([]);
  const [startOfWeek, setStartOfWeek] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(0);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const today = new Date();
    const monday = getStartOfWeek(today);
    setStartOfWeek(monday);
  }, []);

  useEffect(() => {
    if (startOfWeek) {
      const week = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
      });
      setWeekDates(week);
    }
  }, [startOfWeek]);

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(date.setDate(diff));
    return new Date(monday.setHours(0, 0, 0, 0));
  };

  const changeWeek = (direction) => {
    setAnimationDirection(direction);
    const newStart = new Date(startOfWeek);
    newStart.setDate(startOfWeek.getDate() + direction * 7);
    setStartOfWeek(newStart);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('sv-SE'); 
  };

  return (
    <div className="week-calendar-row">
      <button className="nav-btn" onClick={() => changeWeek(-1)}>
  <MdKeyboardArrowLeft />
</button>

      <AnimatePresence initial={false} custom={animationDirection}>
        <motion.div
          key={formatDate(weekDates[0] || new Date())}
          className="week-calendar"
          custom={animationDirection}
          initial={{ x: animationDirection > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: animationDirection > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {weekDates.map((date, index) => {
            const isToday = formatDate(date) === formatDate(new Date());
            const isSelected = formatDate(date) === formatDate(selectedDate);

            return (
              <div
                key={index}
                className={`day ${isSelected ? 'selected' : isToday ? 'today' : ''}`}
                onClick={() => onDateSelect(date)}
                tabIndex="0"
              >
                <div className="day-label">{days[index]}</div>
                <div className="day-number">{date.getDate()}</div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <button className="nav-btn" onClick={() => changeWeek(1)}>
  <MdKeyboardArrowRight />
</button>
    </div>
  );
};

export default WeekCalendar;