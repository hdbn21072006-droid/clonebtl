// src/components/layout/MainLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          <Outlet /> {/* Nội dung trang con (Dashboard, Borrows...) hiện ở đây */}
        </main>
      </div>
    </div>
  );
}