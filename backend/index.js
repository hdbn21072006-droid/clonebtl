// File: backend/index.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Để tạo token
const pool = require('./db'); // Import kết nối DB
const authMiddleware = require('./authMiddleware'); // Import "người gác cổng"

const app = express();
const PORT = 8080; // Cổng backend sẽ chạy

// === Cấu hình cơ bản ===
// 1. Cho phép Frontend (chạy ở port 3000) gọi API
app.use(cors({
  origin: 'http://localhost:3000'
}));

// 2. Cho phép Express đọc body của request dạng JSON
app.use(express.json());

// Key bí mật để tạo token (phải giống ở file authMiddleware.js)
const MY_SECRET_KEY = 'lap-trinh-web-nang-cao-bi-mat';

// === APIEndpoints ===

// --- Nhiệm vụ của Người 1: Xác thực ---

// API 1: Đăng ký (Register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, full_name } = req.body;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const [existingUser] = await pool.query(
      'SELECT * FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Lưu vào database
    const [result] = await pool.query(
      'INSERT INTO Users (username, password_hash, email, full_name) VALUES (?, ?, ?, ?)',
      [username, password_hash, email, full_name]
    );

    res.status(201).json({ message: 'Tạo tài khoản thành công', userId: result.insertId });
  } catch (err) {
    console.error(err);
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
      role: user.role // Giả sử bạn có cột 'role'
    };
    
    const token = jwt.sign(payload, MY_SECRET_KEY, { expiresIn: '1h' }); // Token sống 1 giờ

    res.json({
      message: 'Đăng nhập thành công',
      token: token,
      user: payload
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// API 3: Lấy thông tin User (để test token)
// API này được bảo vệ bởi authMiddleware
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  // Nhờ authMiddleware, chúng ta có req.user
  const userId = req.user.userId;
  
  // Bạn có thể lấy thông tin mới nhất từ DB nếu muốn
  const [rows] = await pool.query('SELECT user_id, username, email, full_name FROM Users WHERE user_id = ?', [userId]);
  
  res.json({ 
    message: 'Bạn đã được xác thực', 
    user: rows[0] 
  });
});

// --- Nhiệm vụ của Người 2: Quản lý Sách (Chờ code) ---
// app.get('/api/books', ...)
// app.post('/api/books', authMiddleware, ...) // Chỉ admin mới được thêm sách




// --- Nhiệmvụ của Người 3: Quản lý Bạn đọc (Chờ code) ---
// app.get('/api/readers', authMiddleware, ...)


// --- Nhiệm vụ của Người 4: Mượn/Trả (Chờ code) ---
// app.post('/api/borrows', authMiddleware, ...)


// === Chạy Server ===
app.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy ở http://localhost:${PORT}`);
});