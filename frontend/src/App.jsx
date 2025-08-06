// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import useAuthStore from './Store/authStore';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import AllIdeas from './pages/AllIdeas';
import Register from './pages/Register';
import Newproject from './pages/Newproject';

function App() {
  const { user, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {user ? (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/allideas" element={<AllIdeas />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/newproject" element={<Newproject />} />

            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
