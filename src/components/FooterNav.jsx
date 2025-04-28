import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './FooterNav.css';

const FooterNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="footer-nav">
      <button onClick={() => navigate('/')}>Tasks</button>
      <button onClick={() => navigate('/habits')}>Habits</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default FooterNav;
