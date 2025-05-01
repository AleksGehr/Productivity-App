import React, { useState, useEffect } from 'react';
import './TaskSettingsModal.css';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

registerLocale('en-GB', enGB);

const TaskSettingsModal = ({ task, onClose, onMove, onCopy, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [editText, setEditText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setIsEditing(false);
    setIsCopying(false);
    setIsMoving(false);
    setEditText(task?.text || '');
    setSelectedDate(new Date());
  }, [task]);

  if (!task) return null;

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit({ ...task, text: editText.trim() });
    }
  };

  const handleConfirmCopy = () => {
    if (selectedDate) {
      onCopy(task, selectedDate);
    }
  };

  const handleConfirmMove = () => {
    if (selectedDate) {
      onMove(task, selectedDate);
    }
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Task Options</h3>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-task-input"
              autoFocus
            />
            <button onClick={handleSaveEdit}>Save</button>
          </>
        ) : isCopying ? (
          <>
            <p>Copy to:</p>
            <DatePicker
              locale="en-GB"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled
              }) => (
                <div className="custom-datepicker-header">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="nav-btn"
                  >
                    <MdKeyboardArrowLeft size={24} />
                  </button>
                  <span className="month-label">
                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="nav-btn"
                  >
                    <MdKeyboardArrowRight size={24} />
                  </button>
                </div>
              )}
            />
            <button onClick={handleConfirmCopy}>Copy Task</button>
          </>
        ) : isMoving ? (
          <>
            <p>Move to:</p>
            <DatePicker
              locale="en-GB"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled
              }) => (
                <div className="custom-datepicker-header">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="nav-btn"
                  >
                    <MdKeyboardArrowLeft size={24} />
                  </button>
                  <span className="month-label">
                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="nav-btn"
                  >
                    <MdKeyboardArrowRight size={24} />
                  </button>
                </div>
              )}
            />
            <button onClick={handleConfirmMove}>Move Task</button>
          </>
        ) : (
          <>
            <p>{task.text}</p>
            <button onClick={() => setIsEditing(true)}>Edit Task</button>
            <button onClick={() => setIsMoving(true)}>Move Task</button>
            <button onClick={() => setIsCopying(true)}>Copy Task</button> 
            <button onClick={() => onDelete(task.id)}>Delete Task</button>
          </>
        )}

        {/* Cancel button always at the bottom */}
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default TaskSettingsModal;
