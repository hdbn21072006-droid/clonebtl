// controllers/borrowController.js
const db = require('../db');

// POST /api/borrows - Tạo phiếu mượn
const createBorrow = async (req, res) => {
  const { reader_id, book_id } = req.body;

  try {
    await db.query('START TRANSACTION');

    // Kiểm tra quota (giả sử mỗi bạn đọc chỉ được mượn tối đa 5 cuốn)
    const [quota] = await db.query(
      'SELECT COUNT(*) as count FROM borrow_records WHERE reader_id = ? AND return_date IS NULL',
      [reader_id]
    );
    if (quota[0].count >= 5) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Bạn đọc đã mượn quá số lượng cho phép (5 cuốn)' });
    }

    // Kiểm tra sách còn không
    const [book] = await db.query(
      'SELECT available_quantity FROM books WHERE id = ? FOR UPDATE',
      [book_id]
    );
    if (!book[0] || book[0].available_quantity <= 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Sách đã hết hoặc không tồn tại' });
    }

    // Tạo phiếu mượn
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    await db.query(
      'INSERT INTO borrow_records (reader_id, book_id, borrow_date, due_date) VALUES (?, ?, ?, ?)',
      [reader_id, book_id, borrowDate, dueDate]
    );

    // Giảm số lượng sách
    await db.query(
      'UPDATE books SET available_quantity = available_quantity - 1 WHERE id = ?',
      [book_id]
    );

    await db.query('COMMIT');
    res.status(201).json({ message: 'Tạo phiếu mượn thành công' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /api/borrows/:id/return - Trả sách
const returnBook = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('START TRANSACTION');

    const [borrow] = await db.query(
      'SELECT book_id FROM borrow_records WHERE id = ? AND return_date IS NULL',
      [id]
    );

    if (!borrow[0]) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Không tìm thấy phiếu mượn hoặc đã trả' });
    }

    await db.query(
      'UPDATE borrow_records SET return_date = NOW() WHERE id = ?',
      [id]
    );

    await db.query(
      'UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?',
      [borrow[0].book_id]
    );

    await db.query('COMMIT');
    res.json({ message: 'Trả sách thành công' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PUT /api/borrows/:id - Gia hạn
const extendBorrow = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'UPDATE borrow_records SET due_date = DATE_ADD(due_date, INTERVAL 7 DAY) WHERE id = ? AND return_date IS NULL',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không thể gia hạn' });
    }
    res.json({ message: 'Gia hạn thành công +7 ngày' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /api/borrows/:id - Xóa phiếu
const deleteBorrow = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('START TRANSACTION');

    const [borrow] = await db.query('SELECT book_id FROM borrow_records WHERE id = ?', [id]);
    if (borrow[0]) {
      await db.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?', [borrow[0].book_id]);
    }

    await db.query('DELETE FROM borrow_records WHERE id = ?', [id]);
    await db.query('COMMIT');
    res.json({ message: 'Xóa phiếu thành công' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { createBorrow, returnBook, extendBorrow, deleteBorrow };