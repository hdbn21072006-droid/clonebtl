// File: src/routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import BorrowsPage from '@/pages/Borrows';
import QuanLySachPage from '@/pages/QuanLySachPage';
import RegisterPage from '@/pages/RegisterPage';
import StatisticsPage from '@/pages/StatisticsPage';
import PrivateRoute from '@/components/PrivateRoute';
// [MỚI] 1. Import trang Thành viên
import Members from '@/pages/Members'; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* Tuyến đường công khai (Không cần đăng nhập) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Tuyến đường được bảo vệ (Yêu cầu đăng nhập) */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/books" element={<QuanLySachPage />} />
        <Route path="/borrows" element={<BorrowsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        
        {/* [MỚI] 2. Định nghĩa đường dẫn cho trang Thành viên */}
        <Route path="/members" element={<Members />} />

        {/* Mặc định chuyển về Dashboard nếu không tìm thấy trang */}
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}