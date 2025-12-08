// File: backend/index.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Để tạo token
const pool = require('./db'); // Import kết nối DB
const authMiddleware = require('./authMiddleware'); // Import "người gác cổng"

// Import các Controller cũ
const quanLySachController = require('./quanLySachController'); 
const statisticsController = require('./controllers/statisticsController'); 

// === [MỚI] Import Route cho Thành viên ===
// (Đảm bảo bạn đã tạo file memberRoutes.js trong thư mục routes)
const memberRoutes = require('./routes/memberRoutes'); 

const app = express();
const PORT = 8080; // Cổng backend sẽ chạy

// === Cấu hình cơ bản ===
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// Key bí mật
const MY_SECRET_KEY = 'lap-trinh-web-nang-cao-bi-mat';

// === API Endpoints ===

// 🔑 API 1: Đăng ký (Register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, full_name } = req.body;

    // --- 1. Kiểm tra tồn tại ---
    const [existingUser] = await pool.query(
      'SELECT * FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }

    // --- 2. Mã hóa mật khẩu ---
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // --- 3. Lưu vào database ---
    const [result] = await pool.query(
      'INSERT INTO Users (username, password_hash, email, full_name) VALUES (?, ?, ?, ?)',
      [username, password_hash, email, full_name]
    );

    res.status(201).json({ message: 'Tạo tài khoản thành công', userId: result.insertId });
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// API 2: Đăng nhập (Login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user trong DB
    const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // 3. Tạo Token (JWT)
    const payload = {
      userId: user.user_id,
      username: user.username,
      full_name: user.full_name,
      role: user.role 
    };
    
    const token = jwt.sign(payload, MY_SECRET_KEY, { expiresIn: '1h' }); 

    res.json({
      message: 'Đăng nhập thành công',
      token: token,
      user: payload
    });

  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// API 3: Lấy thông tin User
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const [rows] = await pool.query('SELECT user_id, username, email, full_name FROM Users WHERE user_id = ?', [userId]);
  
  res.json({ 
    message: 'Bạn đã được xác thực', 
    user: rows[0] 
  });
});

// --- Nhiệm vụ Quản lý Sách ---
app.get('/api/books', quanLySachController.layDanhSachSach);
app.get('/api/categories', quanLySachController.layDanhSachTheLoai);
app.post('/api/books', authMiddleware, quanLySachController.themSachMoi);
app.put('/api/books/:id', authMiddleware, quanLySachController.capNhatSach);
app.delete('/api/books/:id', authMiddleware, quanLySachController.xoaSach);

// --- [MỚI] Nhiệm vụ Quản lý Thành viên (Members) ---
// Đường dẫn này sẽ xử lý các request: GET, POST, PUT, DELETE tới /api/members
app.use('/api/members', memberRoutes);

// --- Nhiệm vụ Thống kê ---
app.get('/api/statistics/overview', statisticsController.getOverview);
app.get('/api/statistics/most-borrowed-books', statisticsController.getMostBorrowedBooks);
app.get('/api/statistics/most-borrowing-readers', statisticsController.getMostBorrowingReaders);
app.get('/api/statistics/borrow-trends', statisticsController.getBorrowTrends);
app.get('/api/statistics/stock-status', statisticsController.getStockStatus);
app.get('/api/statistics/overdue-books', statisticsController.getOverdueBooks);
app.get('/api/statistics/category-stats', statisticsController.getCategoryStats);
app.get('/api/statistics/time-stats', statisticsController.getTimeStats);


// === Chạy Server ===
app.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy ở http://localhost:${PORT}`);
});