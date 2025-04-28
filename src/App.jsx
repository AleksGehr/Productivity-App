import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskPage from './pages/TaskPage';
import HabitPage from './pages/HabitPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route 
      path="/" 
      element={
        <ProtectedRoute>
          <TaskPage />
        </ProtectedRoute>
      }
    />
    <Route 
      path="/habits" 
      element={
        <ProtectedRoute>
          <HabitPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
