const mysql = require('mysql2/promise');

// *** THAY THÔNG TIN CỦA BẠN VÀO ĐÂY ***
const pool = mysql.createPool({
  host: 'localhost', // Hoặc 127.0.0.1
  user: 'root', // User MySQL của bạn
  password: '21072006', // Mật khẩu MySQL của bạn
  database: 'quan_ly_thu_vien', // Tên database bạn đã tạo
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Đã tạo pool kết nối MySQL!');

module.exports = pool;