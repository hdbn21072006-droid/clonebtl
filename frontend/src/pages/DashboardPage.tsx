// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import BorrowModal from '@/components/borrows/BorrowModal';
import { Plus, LogOut, Clock, BookOpen, Users, ReceiptText, AlertTriangle, BarChart3, ArrowRight } from 'lucide-react';
import './DashboardPage.css';
import { apiThuVien } from '@/api/apiThuVien';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  
  // State lưu dữ liệu thống kê
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Dữ liệu giả cho phần hoạt động gần đây
  const recentActivities = [
    { id: 1, name: 'Nguyễn Văn An', action: ' mượn sách', book: 'Lập trình ReactJS Nâng Cao' },
    { id: 2, name: 'Trần Thị Bình', action: 'đã trả sách', book: 'Node.js Toàn Tập' },
    { id: 3, name: 'Lê Văn Cường', action: 'đã mượn sách', book: 'Thuật toán và Cấu trúc dữ liệu' },
  ];

  // Gọi API lấy thống kê tổng quan
  useEffect(() => {
    const layThongKe = async () => {
      try {
        setLoading(true);
        const data = await apiThuVien.getOverview();
        setOverview(data);
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    layThongKe();
  }, []);

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
        <div className="header-actions">
          <button 
            onClick={() => navigate('/statistics')} 
            className="statistics-header-btn"
            title="Xem thống kê chi tiết"
          >
            <BarChart3 size={20} /> Thống kê
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </div>
      
      {/* Các ô thống kê */}
      <div className="stats-grid">
        {/* --- Ô TỔNG SỐ SÁCH (Click vào để sang trang quản lý Sách) --- */}
        <div 
          className="stat-card indigo" 
          onClick={() => navigate('/books')}
          style={{ cursor: 'pointer' }}
        >
          <BookOpen size={40} />
          <div>
            <h3>{loading ? '...' : (overview?.total_books || 0)}</h3>
            <p>Tổng số đầu sách</p>
          </div>
          <span className="stat-growth up">SQL</span>
        </div>

        {/* --- [ĐÃ SỬA] Ô THÀNH VIÊN (Click vào để sang trang Members) --- */}
        <div 
            className="stat-card teal"
            onClick={() => navigate('/members')} // Chuyển hướng khi bấm
            style={{ cursor: 'pointer' }}        // Hiển thị con trỏ tay
        >
          <Users size={40} />
          <div>
            <h3>{loading ? '...' : (overview?.total_readers || 0)}</h3>
            <p>Thành viên</p>
          </div>
          <span className="stat-growth up">Thực tế</span>
        </div>

        {/* --- Ô ĐANG MƯỢN --- */}
        <div className="stat-card amber">
          <ReceiptText size={40} />
          <div>
            <h3>{loading ? '...' : (overview?.total_borrowing || 0)}</h3>
            <p>Đang mượn</p>
          </div>
          <span className="stat-growth up">Thực tế</span>
        </div>

        {/* --- Ô QUÁ HẠN --- */}
        <div className="stat-card red">
          <AlertTriangle size={40} />
          <div>
            <h3>{loading ? '...' : (overview?.total_overdue || 0)}</h3>
            <p>Quá hạn</p>
          </div>
          <span className="stat-growth down">Cần xử lý</span>
        </div>

        {/* Nút xem thống kê chi tiết */}
        <div 
          className="stat-card statistics-btn" 
          onClick={() => navigate('/statistics')}
          style={{ cursor: 'pointer' }}
        >
          <BarChart3 size={40} />
          <div style={{ flex: 1 }}>
            <h3>Xem thống kê</h3>
            <p>Chi tiết đầy đủ</p>
          </div>
          <ArrowRight size={24} className="arrow-icon" />
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

      <BorrowModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;