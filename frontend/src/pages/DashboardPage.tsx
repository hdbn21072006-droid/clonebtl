// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import BorrowModal from '@/components/borrows/BorrowModal';
import { Plus, LogOut, Clock, BookOpen, Users, ReceiptText, AlertTriangle } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const recentActivities = [
    { id: 1, name: 'Nguyễn Văn An', action: 'đã mượn sách', book: 'Lập trình ReactJS Nâng Cao' },
    { id: 2, name: 'Trần Thị Bình', action: 'đã trả sách', book: 'Node.js Toàn Tập' },
    { id: 3, name: 'Lê Văn Cường', action: 'đã mượn sách', book: 'Thuật toán và Cấu trúc dữ liệu' },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Chào mừng quay trở lại, {user?.full_name || 'Quản trị viên'}!</h1>
          <p className="dashboard-date">
            <Clock size={18} /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Đăng xuất
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card indigo">
          <BookOpen size={40} />
          <div>
            <h3>2.847</h3>
            <p>Tổng số đầu sách</p>
          </div>
          <span className="stat-growth up">+12%</span>
        </div>
        <div className="stat-card teal">
          <Users size={40} />
          <div>
            <h3>1.293</h3>
            <p>Thành viên</p>
          </div>
          <span className="stat-growth up">+8%</span>
        </div>
        <div className="stat-card amber">
          <ReceiptText size={40} />
          <div>
            <h3>187</h3>
            <p>Đang mượn</p>
          </div>
          <span className="stat-growth up">+5%</span>
        </div>
        <div className="stat-card red">
          <AlertTriangle size={40} />
          <div>
            <h3>9</h3>
            <p>Quá hạn</p>
          </div>
          <span className="stat-growth down">−23%</span>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="recent-activity">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          {recentActivities.map((a) => (
            <div key={a.id} className="activity-item">
              <strong>{a.name}</strong> {a.action}{' '}
              <em>“{a.book}”</em>
            </div>
          ))}
        </div>
      </div>

      {/* Nút FAB tạo phiếu mượn */}
      <button
        onClick={() => setModalOpen(true)}
        className="fab-button"
        title="Tạo phiếu mượn mới"
      >
        <Plus size={32} />
      </button>

      {/* Modal tạo phiếu */}
      <BorrowModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;