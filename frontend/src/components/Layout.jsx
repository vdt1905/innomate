// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
