import React, { useEffect, useState } from 'react';
import { apiThuVien } from '../api/apiThuVien';
import { Edit, Trash2, Plus, Search, BookOpen, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuanLySach.css';

interface Sach {
  id: number;
  title: string;
  author: string;
  category_id: number;
  ten_the_loai?: string;
  total_quantity: number;
  available_quantity: number;
  published_year: number;
  image_url?: string; // Thêm trường ảnh
}

interface TheLoai {
  category_id: number;
  name: string;
}

const QuanLySach: React.FC = () => {
  const navigate = useNavigate();
  const [danhSachSach, setDanhSachSach] = useState<Sach[]>([]);
  const [danhSachTheLoai, setDanhSachTheLoai] = useState<TheLoai[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tuKhoa, setTuKhoa] = useState<string>('');
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);

  const [hienModal, setHienModal] = useState(false);
  const [dangSuaSach, setDangSuaSach] = useState<Sach | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category_id: 1,
    published_year: 2020,
    total_quantity: 10,
    image_url: '' // Thêm state cho link ảnh
  });

  useEffect(() => {
    const fetchTheLoai = async () => {
      try {
        const data = await apiThuVien.layDanhSachTheLoai();
        setDanhSachTheLoai(data);
        if (data.length > 0) setFormData(prev => ({...prev, category_id: data[0].category_id}));
      } catch (error) { console.error("Lỗi tải thể loại:", error); }
    };
    fetchTheLoai();
  }, []);

  useEffect(() => { taiDanhSachSach(); }, [trangHienTai, tuKhoa]);

  const taiDanhSachSach = async () => {
    setIsLoading(true);
    try {
      const data = await apiThuVien.layDanhSachSach(trangHienTai, tuKhoa);
      if (data) {
        setDanhSachSach(data.duLieu || []);
        if (data.phanTrang) setTongSoTrang(data.phanTrang.tongSoTrang);
      }
    } catch (error) { console.error("Lỗi tải sách:", error); } 
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        // Nếu không nhập link ảnh thì dùng ảnh mặc định
        image_url: formData.image_url || 'https://via.placeholder.com/150'
      };

      if (dangSuaSach) {
        await apiThuVien.capNhatSach(dangSuaSach.id, dataToSend);
        alert('Cập nhật thành công!');
      } else {
        await apiThuVien.themSachMoi(dataToSend);
        alert('Thêm mới thành công!');
      }
      setHienModal(false);
      taiDanhSachSach();
    } catch (error) { alert('Có lỗi xảy ra!'); }
  };

  const handleXoa = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
      try {
        await apiThuVien.xoaSach(id);
        taiDanhSachSach();
      } catch (error) { alert('Lỗi khi xóa sách'); }
    }
  };

  const openAddModal = () => {
    setDangSuaSach(null);
    setFormData({
      title: '', author: '', category_id: danhSachTheLoai[0]?.category_id || 1,
      published_year: new Date().getFullYear(), total_quantity: 10, image_url: ''
    });
    setHienModal(true);
  };

  const openEditModal = (sach: Sach) => {
    setDangSuaSach(sach);
    setFormData({
      title: sach.title, author: sach.author, category_id: sach.category_id,
      published_year: sach.published_year, total_quantity: sach.total_quantity,
      image_url: sach.image_url || ''
    });
    setHienModal(true);
  };

  return (
    <div className="quan-ly-sach-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-back" title="Quay lại Dashboard">
            <ArrowLeft size={20} />
          </button>
          <h2><BookOpen className="icon" /> Thư Viện Sách</h2>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Thêm sách mới
        </button>
      </div>

      <div className="search-bar">
        <Search className="search-icon" size={20} />
        <input 
          type="text" placeholder="Tìm kiếm sách, tác giả..." 
          value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)}
        />
      </div>

      {/* Grid View (Dạng lưới Card) */}
      {isLoading ? (
        <p className="loading-text">Đang tải dữ liệu...</p>
      ) : (
        <div className="book-grid">
          {danhSachSach.length > 0 ? (
            danhSachSach.map((sach) => (
              <div key={sach.id} className="book-card">
                <div className="book-image">
                  <img 
                    src={sach.image_url || 'https://via.placeholder.com/300x400?text=No+Cover'} 
                    alt={sach.title} 
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Error')}
                  />
                  <div className={`status-badge ${sach.available_quantity > 0 ? 'available' : 'out-of-stock'}`}>
                    {sach.available_quantity > 0 ? 'Sẵn sàng' : 'Hết hàng'}
                  </div>
                </div>
                
                <div className="book-info">
                  <div className="book-meta">
                    <span className="book-category">{sach.ten_the_loai || 'Chưa phân loại'}</span>
                    <span className="book-year">{sach.published_year}</span>
                  </div>
                  <h3 className="book-title" title={sach.title}>{sach.title}</h3>
                  <p className="book-author">Tác giả: {sach.author}</p>
                  
                  <div className="book-stats">
                    <div className="stat-item">
                      <span className="label">Tổng:</span>
                      <span className="value">{sach.total_quantity}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Còn:</span>
                      <span className="value highlight">{sach.available_quantity}</span>
                    </div>
                  </div>

                  <div className="book-actions">
                    <button className="btn-action edit" onClick={() => openEditModal(sach)}>
                      <Edit size={16} /> Sửa
                    </button>
                    <button className="btn-action delete" onClick={() => handleXoa(sach.id)}>
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">Không tìm thấy sách nào.</p>
          )}
        </div>
      )}

      {/* Phân trang */}
      {tongSoTrang > 1 && (
        <div className="pagination">
          <button disabled={trangHienTai === 1} onClick={() => setTrangHienTai(t => t - 1)}>Trước</button>
          <span>Trang {trangHienTai} / {tongSoTrang}</span>
          <button disabled={trangHienTai === tongSoTrang} onClick={() => setTrangHienTai(t => t + 1)}>Sau</button>
        </div>
      )}

      {/* Modal Form */}
      {hienModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{dangSuaSach ? 'Cập Nhật Sách' : 'Thêm Sách Mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên sách:</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Link ảnh bìa (URL):</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                   <input placeholder="https://..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                   {formData.image_url && <img src={formData.image_url} alt="Preview" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4}} />}
                </div>
              </div>
              <div className="form-group">
                <label>Tác giả:</label>
                <input required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                   <label>Thể loại:</label>
                   <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: Number(e.target.value)})}>
                      {danhSachTheLoai.map(tl => <option key={tl.category_id} value={tl.category_id}>{tl.name}</option>)}
                   </select>
                </div>
                <div className="form-group">
                  <label>Năm XB:</label>
                  <input required type="number" value={formData.published_year} onChange={e => setFormData({...formData, published_year: Number(e.target.value)})} />
                </div>
              </div>
              <div className="form-group">
                  <label>Tổng số lượng:</label>
                  <input required type="number" value={formData.total_quantity} onChange={e => setFormData({...formData, total_quantity: Number(e.target.value)})} />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setHienModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn-save">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLySach;