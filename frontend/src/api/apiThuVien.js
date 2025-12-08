import axiosInstance from './axiosInstance'; 

export const apiThuVien = {
  // ========== QUẢN LÝ SÁCH ==========
  // Lấy danh sách sách
  layDanhSachSach: async (trang = 1, tuKhoa = '') => {
    const res = await axiosInstance.get(`/books?page=${trang}&search=${tuKhoa}`);
    return res.data;
  },

  // Lấy danh sách thể loại
  layDanhSachTheLoai: async () => {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },

  // Thêm sách
  themSachMoi: async (data) => {
    const res = await axiosInstance.post('/books', data);
    return res.data;
  },

  // Sửa sách
  capNhatSach: async (id, data) => {
    const res = await axiosInstance.put(`/books/${id}`, data);
    return res.data;
  },

  // Xóa sách
  xoaSach: async (id) => {
    const res = await axiosInstance.delete(`/books/${id}`);
    return res.data;
  },

  // ========== QUẢN LÝ THÀNH VIÊN (MỚI) ==========
  // Lấy danh sách thành viên
  getMembers: async () => {
    const res = await axiosInstance.get('/members');
    return res.data;
  },

  // Thêm thành viên mới
  addMember: async (data) => {
    const res = await axiosInstance.post('/members', data);
    return res.data;
  },

  // Cập nhật thông tin thành viên
  updateMember: async (id, data) => {
    const res = await axiosInstance.put(`/members/${id}`, data);
    return res.data;
  },

  // Xóa thành viên
  deleteMember: async (id) => {
    const res = await axiosInstance.delete(`/members/${id}`);
    return res.data;
  },

  // ========== THỐNG KÊ ==========
  // Thống kê tổng quan
  getOverview: async () => {
    const res = await axiosInstance.get('/statistics/overview');
    return res.data;
  },

  // Sách được mượn nhiều nhất
  getMostBorrowedBooks: async (limit = 10) => {
    const res = await axiosInstance.get(`/statistics/most-borrowed-books?limit=${limit}`);
    return res.data;
  },

  // Bạn đọc mượn nhiều nhất
  getMostBorrowingReaders: async (limit = 10) => {
    const res = await axiosInstance.get(`/statistics/most-borrowing-readers?limit=${limit}`);
    return res.data;
  },

  // Xu hướng mượn/trả
  getBorrowTrends: async (period = 'week') => {
    const res = await axiosInstance.get(`/statistics/borrow-trends?period=${period}`);
    return res.data;
  },

  // Tình trạng kho
  getStockStatus: async () => {
    const res = await axiosInstance.get('/statistics/stock-status');
    return res.data;
  },

  // Sách quá hạn
  getOverdueBooks: async () => {
    const res = await axiosInstance.get('/statistics/overdue-books');
    return res.data;
  },

  // Thống kê theo thể loại
  getCategoryStats: async () => {
    const res = await axiosInstance.get('/statistics/category-stats');
    return res.data;
  },

  // Thống kê theo thời gian
  getTimeStats: async (year) => {
    const res = await axiosInstance.get(`/statistics/time-stats?year=${year || new Date().getFullYear()}`);
    return res.data;
  }
};