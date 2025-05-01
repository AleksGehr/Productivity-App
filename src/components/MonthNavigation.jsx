import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const MonthNavigation = ({ habitName, monthName, onPrev, onNext, disablePrev = false }) => {
  return (
    <div className="month-navigation">
      <button
        className={`nav-arrow ${disablePrev ? 'disabled' : ''}`}
        onClick={disablePrev ? undefined : onPrev}
        disabled={disablePrev}
      >
        <MdKeyboardArrowLeft />
      </button>
      <span className="month-name">
        {habitName} : {monthName}
      </span>
      <button className="nav-arrow" onClick={onNext}>
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
};

export default MonthNavigation;
