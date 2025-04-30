import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const MonthNavigation = ({ monthName, habitName, onPrev, onNext }) => (
  <div className="month-navigation">
    <button className="nav-arrow" onClick={onPrev}>
      <MdKeyboardArrowLeft />
    </button>
    <span className="month-name">{habitName} : {monthName}</span>
    <button className="nav-arrow" onClick={onNext}>
      <MdKeyboardArrowRight />
    </button>
  </div>
);

export default MonthNavigation;
