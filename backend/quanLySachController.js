// File: backend/quanLySachController.js

const pool = require('./db');

// Lấy danh sách sách có phân trang và tìm kiếm
const layDanhSachSach = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const limit = 10;
    const offset = (page - 1) * limit;

    // Tìm sách
    let query = `
      SELECT b.book_id as id, b.title, b.author, b.category_id, c.name as ten_the_loai, 
             b.total_quantity, b.available_quantity, b.published_year
      FROM Books b
      LEFT JOIN Categories c ON b.category_id = c.category_id
    `;
    let countQuery = `SELECT COUNT(*) as total FROM Books b WHERE 1=1`;
    let params = [];

    if (search) {
      query += ` WHERE b.title LIKE ? OR b.author LIKE ?`;
      countQuery += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [books] = await pool.query(query, params);
    
    // Lấy tổng số bản ghi
    const countParams = search ? [`%${search}%`, `%${search}%`] : [];
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      duLieu: books,
      phanTrang: {
        tongSoBanGhi: countResult[0].total,
        trangHienTai: page,
        tongSoTrang: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy danh sách thể loại
const layDanhSachTheLoai = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT category_id as id, name FROM Categories');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Thêm sách mới
const themSachMoi = async (req, res) => {
  try {
    const { title, author, category_id, total_quantity, published_year } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Books (title, author, category_id, total_quantity, available_quantity, published_year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, category_id, total_quantity, total_quantity, published_year]
    );

    res.status(201).json({ 
      message: 'Thêm sách thành công', 
      bookId: result.insertId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật sách
const capNhatSach = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category_id, total_quantity, published_year } = req.body;

    // Lấy số lượng mượn hiện tại
    const [book] = await pool.query('SELECT available_quantity, total_quantity FROM Books WHERE book_id = ?', [id]);
    if (book.length === 0) {
      return res.status(404).json({ message: 'Sách không tồn tại' });
    }

    const quantityBorrowed = book[0].total_quantity - book[0].available_quantity;
    const newAvailable = total_quantity - quantityBorrowed;

    await pool.query(
      `UPDATE Books SET title = ?, author = ?, category_id = ?, total_quantity = ?, available_quantity = ?, published_year = ?
       WHERE book_id = ?`,
      [title, author, category_id, total_quantity, newAvailable, published_year, id]
    );

    res.json({ message: 'Cập nhật sách thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa sách
const xoaSach = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sách có được mượn không
    const [book] = await pool.query('SELECT available_quantity, total_quantity FROM Books WHERE book_id = ?', [id]);
    if (book.length === 0) {
      return res.status(404).json({ message: 'Sách không tồn tại' });
    }

    if (book[0].available_quantity !== book[0].total_quantity) {
      return res.status(400).json({ message: 'Không thể xóa sách đang được mượn' });
    }

    await pool.query('DELETE FROM Books WHERE book_id = ?', [id]);

    res.json({ message: 'Xóa sách thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = {
  layDanhSachSach,
  layDanhSachTheLoai,
  themSachMoi,
  capNhatSach,
  xoaSach
};
