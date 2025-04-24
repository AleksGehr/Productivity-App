import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskPage from './pages/TaskPage';
import HabitPage from './pages/HabitPage';

const App = () => (
  <Routes>
    <Route path="/" element={<TaskPage />} />
    <Route path="/habits" element={<HabitPage />} />
  </Routes>
);

export default App;