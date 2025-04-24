import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      {children}
    </div>
  );
};

export default Layout;