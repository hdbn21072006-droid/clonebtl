import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import BorrowsPage from '@/pages/Borrows';
import PrivateRoute from '@/components/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/borrows" element={<BorrowsPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}