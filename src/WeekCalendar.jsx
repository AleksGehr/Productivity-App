import React, { useState, useEffect } from 'react';
import './WeekCalendar.css';

const WeekCalendar = ({ selectedDate, onDateSelect }) => {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const offset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + offset);

    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    setWeekDates(dates);
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];

  return (
    <div className="week-calendar">
      {weekDates.map((date, index) => {
        const isToday = formatDate(date) === formatDate(new Date());
        const isSelected = formatDate(date) === formatDate(selectedDate);

        return (
          <div
            key={index}
            className={`day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => onDateSelect(date)}
          >
            <div className="day-label">{days[index]}</div>
            <div className="day-number">{date.getDate()}</div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekCalendar;