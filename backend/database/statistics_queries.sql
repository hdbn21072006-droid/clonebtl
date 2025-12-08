-- ============================================
-- FILE: statistics_queries.sql
-- Mô tả: Các query SQL cho chức năng Thống kê
-- ============================================

-- ============================================
-- 1. THỐNG KÊ TỔNG QUAN (Overview/Dashboard)
-- ============================================
-- API: GET /api/statistics/overview
-- Trả về: Tổng số sách, tổng số bạn đọc, tổng số lượt mượn đang hoạt động

SELECT 
    (SELECT COUNT(*) FROM Books WHERE is_hidden = 0) AS total_books,
    (SELECT COUNT(*) FROM Readers) AS total_readers,
    (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'BORROWING') AS total_borrowing,
    (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'OVERDUE') AS total_overdue,
    (SELECT COUNT(*) FROM BorrowRecords WHERE status = 'RETURNED') AS total_returned,
    (SELECT SUM(total_quantity) FROM Books WHERE is_hidden = 0) AS total_books_quantity,
    (SELECT SUM(available_quantity) FROM Books WHERE is_hidden = 0) AS total_available_quantity;


-- ============================================
-- 2. SÁCH ĐƯỢC MƯỢN NHIỀU NHẤT
-- ============================================
-- API: GET /api/statistics/most-borrowed-books
-- Trả về: Top N sách được mượn nhiều nhất

SELECT 
    b.book_id,
    b.title,
    b.author,
    c.name AS category_name,
    b.total_quantity,
    b.available_quantity,
    COUNT(br.borrow_id) AS borrow_count
FROM Books b
LEFT JOIN BorrowRecords br ON b.book_id = br.book_id
LEFT JOIN Categories c ON b.category_id = c.category_id
WHERE b.is_hidden = 0
GROUP BY b.book_id, b.title, b.author, c.name, b.total_quantity, b.available_quantity
ORDER BY borrow_count DESC
LIMIT 10;  -- Top 10 sách được mượn nhiều nhất


-- ============================================
-- 3. BẠN ĐỌC MƯỢN NHIỀU NHẤT
-- ============================================
-- API: GET /api/statistics/most-borrowing-readers
-- Trả về: Top N bạn đọc mượn nhiều nhất

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
LIMIT 10;  -- Top 10 bạn đọc mượn nhiều nhất


-- ============================================
-- 4. THỐNG KÊ XU HƯỚNG MƯỢN/TRẢ (Borrow Trends)
-- ============================================
-- API: GET /api/statistics/borrow-trends?period=week|month
-- Trả về: Số lượng mượn/trả theo tuần hoặc tháng

-- 4.1. Theo TUẦN (7 ngày gần nhất)
SELECT 
    DATE(br.borrow_date) AS date,
    COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
    COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
FROM BorrowRecords br
WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(br.borrow_date)
ORDER BY date ASC;

-- 4.2. Theo THÁNG (12 tháng gần nhất)
SELECT 
    DATE_FORMAT(br.borrow_date, '%Y-%m') AS month,
    COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
    COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
FROM BorrowRecords br
WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(br.borrow_date, '%Y-%m')
ORDER BY month ASC;

-- 4.3. Theo NGÀY (30 ngày gần nhất) - Chi tiết hơn
SELECT 
    DATE(br.borrow_date) AS date,
    COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
    COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
FROM BorrowRecords br
WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(br.borrow_date)
ORDER BY date ASC;


-- ============================================
-- 5. THỐNG KÊ TÌNH TRẠNG KHO (Stock Status)
-- ============================================
-- API: GET /api/statistics/stock-status
-- Trả về: Thống kê về tình trạng sách trong kho

-- 5.1. Tổng quan tình trạng kho
SELECT 
    COUNT(*) AS total_books,
    SUM(total_quantity) AS total_quantity,
    SUM(available_quantity) AS total_available,
    SUM(total_quantity - available_quantity) AS total_borrowed,
    ROUND(SUM(available_quantity) * 100.0 / NULLIF(SUM(total_quantity), 0), 2) AS availability_rate
FROM Books
WHERE is_hidden = 0;

-- 5.2. Sách sắp hết (available_quantity < 5)
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
ORDER BY b.available_quantity ASC;

-- 5.3. Sách đã hết (available_quantity = 0)
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
  AND b.available_quantity = 0
ORDER BY b.title ASC;

-- 5.4. Thống kê theo thể loại
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
ORDER BY book_count DESC;


-- ============================================
-- 6. THỐNG KÊ SÁCH QUÁ HẠN (Overdue Books)
-- ============================================
-- API: GET /api/statistics/overdue-books
-- Trả về: Danh sách sách đã quá hạn chưa trả

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
ORDER BY days_overdue DESC;


-- ============================================
-- 7. THỐNG KÊ THEO THỂ LOẠI (Category Statistics)
-- ============================================
-- API: GET /api/statistics/category-stats
-- Trả về: Thống kê mượn sách theo từng thể loại

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
ORDER BY total_borrows DESC;


-- ============================================
-- 8. THỐNG KÊ THEO THỜI GIAN (Time-based Statistics)
-- ============================================
-- API: GET /api/statistics/time-stats?year=2024
-- Trả về: Thống kê mượn/trả theo năm, tháng

-- 8.1. Theo năm
SELECT 
    YEAR(br.borrow_date) AS year,
    COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
    COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
FROM BorrowRecords br
WHERE YEAR(br.borrow_date) = YEAR(CURDATE())  -- Năm hiện tại
GROUP BY YEAR(br.borrow_date);

-- 8.2. Theo tháng trong năm hiện tại
SELECT 
    MONTH(br.borrow_date) AS month,
    DATE_FORMAT(br.borrow_date, '%Y-%m') AS month_name,
    COUNT(CASE WHEN br.borrow_date IS NOT NULL THEN 1 END) AS borrows_count,
    COUNT(CASE WHEN br.return_date IS NOT NULL THEN 1 END) AS returns_count
FROM BorrowRecords br
WHERE YEAR(br.borrow_date) = YEAR(CURDATE())
GROUP BY MONTH(br.borrow_date), DATE_FORMAT(br.borrow_date, '%Y-%m')
ORDER BY month ASC;

