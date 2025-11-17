// File: frontend/src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang của bạn
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
// (Sau này import các trang của Người 2, 3, 4 ở đây)
// import BookManagementPage from './pages/BookManagementPage';

function App() {
  return (
    <Routes>
      {/* === Route công khai (Public) === */}
      <Route path="/login" element={<LoginPage />} />

      {/* === Các Route được bảo vệ (Private) === */}
      {/* Tất cả các Route bọc trong PrivateRoute 
        sẽ bị "người gác cổng" kiểm tra
      */}
      <Route element={<PrivateRoute />}>
        {/* Trang của Người 1 */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Trang của Người 2 (ví dụ) */}
        {/* <Route path="/manage/books" element={<BookManagementPage />} /> */}
        
        {/* Trang của Người 3 (ví dụ) */}
        {/* <Route path="/manage/readers" element={<ReaderManagementPage />} /> */}
      </Route>

      {/* Route mặc định: Chuyển hướng về /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;