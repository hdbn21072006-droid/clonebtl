// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />
        {/* Các trang khác thêm ở đây */}
      </Route>

      {/* Trang mặc định */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;