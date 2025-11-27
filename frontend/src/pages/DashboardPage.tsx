// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import BorrowModal from '@/components/borrows/BorrowModal';
import { Plus, LogOut, Clock, BookOpen, Users, ReceiptText, AlertTriangle } from 'lucide-react';
import './DashboardPage.css';
import { apiThuVien } from '@/api/apiThuVien';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [tongSoSach, setTongSoSach] = useState<number | string>('...');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const laySoLieu = async () => {
      try {
        const data = await apiThuVien.layDanhSachSach(1, '');
        if (data && data.phanTrang) {
          setTongSoSach(data.phanTrang.tongSoBanGhi);
        }
      } catch (error) {
        console.error("Lỗi lấy số liệu:", error);
        setTongSoSach(0);
      }
    };
    laySoLieu();
  }, []);

  return (
    <div className="dashboard-page">
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
        {/* --- Ô TỔNG SỐ SÁCH (Đã sửa) --- */}
        <div 
          className="stat-card indigo" 
          onClick={() => navigate('/books')}  // <-- Dòng quan trọng để chuyển trang
          style={{ cursor: 'pointer' }}       // <-- Hiện hình bàn tay khi di chuột
        >
          <BookOpen size={40} />
          <div>
            <h3>{tongSoSach}</h3>
            <p>Tổng số đầu sách</p>
          </div>
          <span className="stat-growth up">SQL</span>
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

      <div className="recent-activity">
        <h2>Hoạt động gần đây</h2>
        {/* Phần activity giữ nguyên */}
      </div>

      <button onClick={() => setModalOpen(true)} className="fab-button">
        <Plus size={32} />
      </button>
      <BorrowModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;