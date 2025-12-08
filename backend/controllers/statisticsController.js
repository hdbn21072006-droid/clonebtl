// File: backend/controllers/statisticsController.js
const pool = require('../db');

const StatisticsController = {
  
  // 1. Thống kê tổng quan (Dashboard)
  // GET /api/statistics/overview
  getOverview: async (req, res) => {
    try {
      const [result] = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM Books WHERE is_hidden = 0) AS total_books,
            (SELECT COUNT(*) FROM Readers) AS total_readers,
            (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'BORROWING') AS total_borrowing,
            (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'OVERDUE') AS total_overdue,
            (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'RETURNED') AS total_returned,
            (SELECT SUM(total_quantity) FROM Books WHERE is_hidden = 0) AS total_books_quantity,
            (SELECT SUM(available_quantity) FROM Books WHERE is_hidden = 0) AS total_available_quantity
      `);
      
      res.json(result[0]);
    } catch (err) {
      console.error('Lỗi khi lấy thống kê tổng quan:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 2. Sách được mượn nhiều nhất
  // GET /api/statistics/most-borrowed-books?limit=10
  getMostBorrowedBooks: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const [books] = await pool.query(`
        SELECT 
            b.book_id,
            b.title,
            b.author,
            c.name AS category_name,
            b.total_quantity,
            b.available_quantity,
            b.image_url,
            COUNT(br.borrow_id) AS borrow_count
        FROM Books b
        LEFT JOIN BorrowRecords br ON b.book_id = br.book_id
        LEFT JOIN Categories c ON b.category_id = c.category_id
        WHERE b.is_hidden = 0
        GROUP BY b.book_id, b.title, b.author, c.name, b.total_quantity, b.available_quantity, b.image_url
        ORDER BY borrow_count DESC
        LIMIT ?
      `, [limit]);
      
      res.json(books);
    } catch (err) {
      console.error('Lỗi khi lấy sách mượn nhiều nhất:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 3. Bạn đọc mượn nhiều nhất
  // GET /api/statistics/most-borrowing-readers?limit=10
  getMostBorrowingReaders: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const [readers] = await pool.query(`
        SELECT 
            r.reader_id,
            r.full_name,
            r.email,
            r.phone,
            COUNT(br.borrow_id) AS total_borrows,
            COUNT(CASE WHEN br.status = 'BORROWING' THEN 1 END) AS current_borrows,
            COUNT(CASE WHEN br.status = 'RETURNED' THEN 1 END) AS returned_borrows,
            COUNT(CASE WHEN br.status = 'OVERDUE' THEN 1 END) AS overdue_borrows
        FROM Readers r
        LEFT JOIN BorrowRecords br ON r.reader_id = br.reader_id
        GROUP BY r.reader_id, r.full_name, r.email, r.phone
        ORDER BY total_borrows DESC
        LIMIT ?
      `, [limit]);
      
      res.json(readers);
    } catch (err) {
      console.error('Lỗi khi lấy bạn đọc mượn nhiều nhất:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 4. Xu hướng mượn/trả
  // GET /api/statistics/borrow-trends?period=week|month|day
  getBorrowTrends: async (req, res) => {
    try {
      const period = req.query.period || 'week'; // week, month, day
      let query = '';
      
      if (period === 'week') {
        // 7 ngày gần nhất
        query = `
          SELECT 
              DATE(br.borrow_date) AS date,
              COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
              COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
          FROM BorrowRecords br
          WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          GROUP BY DATE(br.borrow_date)
          ORDER BY date ASC
        `;
      } else if (period === 'month') {
        // 12 tháng gần nhất
        query = `
          SELECT 
              DATE_FORMAT(br.borrow_date, '%Y-%m') AS month,
              COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
              COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
          FROM BorrowRecords br
          WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
          GROUP BY DATE_FORMAT(br.borrow_date, '%Y-%m')
          ORDER BY month ASC
        `;
      } else {
        // 30 ngày gần nhất (mặc định)
        query = `
          SELECT 
              DATE(br.borrow_date) AS date,
              COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
              COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
          FROM BorrowRecords br
          WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          GROUP BY DATE(br.borrow_date)
          ORDER BY date ASC
        `;
      }
      
      const [trends] = await pool.query(query);
      res.json(trends);
    } catch (err) {
      console.error('Lỗi khi lấy xu hướng mượn/trả:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 5. Tình trạng kho
  // GET /api/statistics/stock-status
  getStockStatus: async (req, res) => {
    try {
      const [overview] = await pool.query(`
        SELECT 
            COUNT(*) AS total_books,
            SUM(total_quantity) AS total_quantity,
            SUM(available_quantity) AS total_available,
            SUM(total_quantity - available_quantity) AS total_borrowed,
            ROUND(SUM(available_quantity) * 100.0 / NULLIF(SUM(total_quantity), 0), 2) AS availability_rate
        FROM Books
        WHERE is_hidden = 0
      `);
      
      const [lowStock] = await pool.query(`
        SELECT 
            b.book_id,
            b.title,
            b.author,
            c.name AS category_name,
            b.total_quantity,
            b.available_quantity,
            (b.total_quantity - b.available_quantity) AS borrowed_quantity
        FROM Books b
        LEFT JOIN Categories c ON b.category_id = c.category_id
        WHERE b.is_hidden = 0 
          AND b.available_quantity < 5
          AND b.available_quantity >= 0
        ORDER BY b.available_quantity ASC
      `);
      
      const [outOfStock] = await pool.query(`
        SELECT 
            b.book_id,
            b.title,
            b.author,
            c.name AS category_name,
            b.total_quantity,
            b.available_quantity
        FROM Books b
        LEFT JOIN Categories c ON b.category_id = c.category_id
        WHERE b.is_hidden = 0 
          AND b.available_quantity = 0
        ORDER BY b.title ASC
      `);
      
      const [byCategory] = await pool.query(`
        SELECT 
            c.category_id,
            c.name AS category_name,
            COUNT(b.book_id) AS book_count,
            SUM(b.total_quantity) AS total_quantity,
            SUM(b.available_quantity) AS available_quantity,
            ROUND(SUM(b.available_quantity) * 100.0 / NULLIF(SUM(b.total_quantity), 0), 2) AS availability_rate
        FROM Categories c
        LEFT JOIN Books b ON c.category_id = b.category_id AND b.is_hidden = 0
        GROUP BY c.category_id, c.name
        ORDER BY book_count DESC
      `);
      
      res.json({
        overview: overview[0],
        lowStock: lowStock,
        outOfStock: outOfStock,
        byCategory: byCategory
      });
    } catch (err) {
      console.error('Lỗi khi lấy tình trạng kho:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 6. Sách quá hạn
  // GET /api/statistics/overdue-books
  getOverdueBooks: async (req, res) => {
    try {
      const [overdue] = await pool.query(`
        SELECT 
            br.borrow_id,
            br.borrow_date,
            br.due_date,
            br.return_date,
            DATEDIFF(CURDATE(), br.due_date) AS days_overdue,
            b.title AS book_title,
            b.author AS book_author,
            r.reader_id,
            r.full_name AS reader_name,
            r.email AS reader_email,
            r.phone AS reader_phone
        FROM BorrowRecords br
        INNER JOIN Books b ON br.book_id = b.book_id
        INNER JOIN Readers r ON br.reader_id = r.reader_id
        WHERE br.status = 'OVERDUE' 
           OR (br.status = 'BORROWING' AND br.due_date < CURDATE() AND br.return_date IS NULL)
        ORDER BY days_overdue DESC
      `);
      
      res.json(overdue);
    } catch (err) {
      console.error('Lỗi khi lấy sách quá hạn:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 7. Thống kê theo thể loại
  // GET /api/statistics/category-stats
  getCategoryStats: async (req, res) => {
    try {
      const [stats] = await pool.query(`
        SELECT 
            c.category_id,
            c.name AS category_name,
            COUNT(DISTINCT b.book_id) AS total_books,
            COUNT(br.borrow_id) AS total_borrows,
            COUNT(DISTINCT br.reader_id) AS unique_readers
        FROM Categories c
        LEFT JOIN Books b ON c.category_id = b.category_id AND b.is_hidden = 0
        LEFT JOIN BorrowRecords br ON b.book_id = br.book_id
        GROUP BY c.category_id, c.name
        ORDER BY total_borrows DESC
      `);
      
      res.json(stats);
    } catch (err) {
      console.error('Lỗi khi lấy thống kê thể loại:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  },

  // 8. Thống kê theo thời gian
  // GET /api/statistics/time-stats?year=2024
  getTimeStats: async (req, res) => {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      
      const [monthlyStats] = await pool.query(`
        SELECT 
            MONTH(br.borrow_date) AS month,
            DATE_FORMAT(br.borrow_date, '%Y-%m') AS month_name,
            COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
            COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
        FROM BorrowRecords br
        WHERE YEAR(br.borrow_date) = ?
        GROUP BY MONTH(br.borrow_date), DATE_FORMAT(br.borrow_date, '%Y-%m')
        ORDER BY month ASC
      `, [year]);
      
      res.json({
        year: year,
        monthlyStats: monthlyStats
      });
    } catch (err) {
      console.error('Lỗi khi lấy thống kê thời gian:', err);
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  }
};

module.exports = StatisticsController;

