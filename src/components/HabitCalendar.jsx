import React from 'react';

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HabitCalendar = ({ monthDays, todayString, selectedHabit, toggleHabitDay }) => (
  <>
    <div className="calendar-header">
      {weekDays.map((day, idx) => (
        <div key={idx} className="calendar-weekday">{day}</div>
      ))}
    </div>

    <div className="calendar-grid">
      {monthDays.map((dateObj, idx) => (
        <div
          key={idx}
          className={`calendar-cell ${
            dateObj?.fullDate === todayString ? 'today-cell' : ''
          } ${!dateObj ? 'empty-hidden-cell' : ''}`}
        >
          {dateObj ? (
            <label className="custom-habit-checkbox">
              <input
                type="checkbox"
                checked={selectedHabit.log?.[dateObj.fullDate] || false}
                onChange={() =>
                  toggleHabitDay(selectedHabit.id, dateObj.fullDate)
                }
              />
              <span className="checkmark"></span>
              <span className="day-number-habits">{dateObj.dayNumber}</span>
            </label>
          ) : null}
        </div>
      ))}
    </div>
  </>
);

export default HabitCalendar;
