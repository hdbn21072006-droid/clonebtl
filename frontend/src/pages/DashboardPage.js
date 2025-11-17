// File: frontend/src/pages/DashboardPage.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  // Lấy state từ "kho" Redux
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Gọi action `logout`
    dispatch(logout());
    // Chuyển về trang login
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Chào người dùng (nếu user đã kịp load) */}
      <h1>Chào mừng, {user?.full_name || user?.username}!</h1>
      <p>Đây là trang Dashboard (đã được bảo vệ).</p>
      
      <button onClick={handleLogout}>Đăng xuất</button>

      <hr />
      {/* Sau này các thành viên khác sẽ đặt link của họ ở đây
        ví dụ: <Link to="/manage/books">Quản lý sách</Link>
      */}
    </div>
  );
}

export default DashboardPage;