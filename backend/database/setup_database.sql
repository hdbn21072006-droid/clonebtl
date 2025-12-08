-- ============================================
-- FILE: setup_database.sql
-- Mô tả: File SQL hoàn chỉnh - Tạo database, bảng và insert dữ liệu mẫu
-- Cách chạy: mysql -u root -p quan_ly_thu_vien < setup_database.sql
-- ============================================

-- Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS quan_ly_thu_vien;
USE quan_ly_thu_vien;

-- ============================================
-- PHẦN 1: TẠO CÁC BẢNG
-- ============================================

-- Bảng 1: Người dùng (Quản trị viên / Thủ thư)
CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    avatar VARCHAR(255) DEFAULT 'https://placehold.co/100x100?text=Avatar',
    role ENUM('ADMIN', 'LIBRARIAN') NOT NULL DEFAULT 'LIBRARIAN',
    provider VARCHAR(50) DEFAULT 'local',
    provider_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: Thể loại sách
CREATE TABLE IF NOT EXISTS Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);

-- Bảng 3: Sách
CREATE TABLE IF NOT EXISTS Books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INT,
    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    published_year INT,
    image_url VARCHAR(500) DEFAULT 'https://placehold.co/300x400?text=No+Image',
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
        ON DELETE SET NULL
);

-- Bảng 4: Bạn đọc
CREATE TABLE IF NOT EXISTS Readers (
    reader_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    max_quota INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 5: Lịch sử Mượn/Trả sách (phiếu mượn)
CREATE TABLE IF NOT EXISTS BorrowRecords (
    borrow_id INT PRIMARY KEY AUTO_INCREMENT,
    reader_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    return_date DATETIME,
    status ENUM('BORROWING', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'BORROWING',
    FOREIGN KEY (reader_id) REFERENCES Readers(reader_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- ============================================
-- PHẦN 2: XÓA DỮ LIỆU CŨ (NẾU CẦN)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE BorrowRecords;
TRUNCATE TABLE Books;
TRUNCATE TABLE Readers;
TRUNCATE TABLE Categories;
-- Không xóa Users để giữ tài khoản đã đăng ký
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- PHẦN 3: INSERT DỮ LIỆU MẪU
-- ============================================

-- 3.1. Insert Thể loại (5 thể loại)
INSERT INTO Categories (name, description) VALUES
('Tiểu thuyết', 'Sách văn học tiểu thuyết trong và ngoài nước'),
('Khoa học', 'Sách khoa học tự nhiên và xã hội'),
('Truyện tranh', 'Manga, Comic giải trí'),
('Sách giáo khoa', 'Sách dùng cho học sinh phổ thông'),
('Tâm lý - Kỹ năng sống', 'Sách self-help, phát triển bản thân');

-- 3.2. Insert Sách mẫu (30 cuốn)
INSERT INTO Books (title, author, category_id, total_quantity, available_quantity, published_year, image_url, is_hidden) VALUES
-- Thể loại 1: Tiểu thuyết (9 cuốn)
('Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 1, 10, 8, 2010, 'https://placehold.co/300x400?text=Tôi+thấy+hoa+vàng', 0),
('Mắt Biếc', 'Nguyễn Nhật Ánh', 1, 20, 15, 2019, 'https://placehold.co/300x400?text=Mắt+Biếc', 0),
('Số Đỏ', 'Vũ Trọng Phụng', 1, 15, 15, 1936, 'https://placehold.co/300x400?text=Số+Đỏ', 0),
('Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 1, 30, 28, 1941, 'https://placehold.co/300x400?text=Dế+Mèn', 0),
('Rừng Na Uy', 'Haruki Murakami', 1, 12, 5, 1987, 'https://placehold.co/300x400?text=Rừng+Na+Uy', 0),
('Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 1, 50, 2, 1997, 'https://placehold.co/300x400?text=Harry+Potter', 0),
('Chí Phèo', 'Nam Cao', 1, 20, 20, 1941, 'https://placehold.co/300x400?text=Chí+Phèo', 0),
('Bố Già (The Godfather)', 'Mario Puzo', 1, 10, 8, 1969, 'https://placehold.co/300x400?text=Bố+Già', 0),
('Không Gia Đình', 'Hector Malot', 1, 18, 16, 1878, 'https://placehold.co/300x400?text=Không+Gia+Đình', 0),

-- Thể loại 2: Khoa học (5 cuốn)
('Vũ Trụ', 'Carl Sagan', 2, 10, 10, 1980, 'https://placehold.co/300x400?text=Vũ+Trụ', 0),
('Lược Sử Thời Gian', 'Stephen Hawking', 2, 25, 22, 1988, 'https://placehold.co/300x400?text=Lược+Sử', 0),
('Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 2, 40, 35, 2011, 'https://placehold.co/300x400?text=Sapiens', 0),
('Gen: Lịch Sử Và Tương Lai', 'Siddhartha Mukherjee', 2, 8, 6, 2016, 'https://placehold.co/300x400?text=Gen', 0),
('Những Nền Văn Minh Thế Giới', 'Fernand Braudel', 2, 5, 5, 1993, 'https://placehold.co/300x400?text=Văn+Minh', 0),

-- Thể loại 3: Truyện tranh (7 cuốn)
('Doraemon tập 1', 'Fujiko F. Fujio', 3, 30, 25, 1974, 'https://placehold.co/300x400?text=Doraemon', 0),
('Thám Tử Lừng Danh Conan Tập 1', 'Gosho Aoyama', 3, 50, 45, 1994, 'https://placehold.co/300x400?text=Conan', 0),
('Doraemon Truyện Ngắn Tập 10', 'Fujiko F. Fujio', 3, 60, 50, 1975, 'https://placehold.co/300x400?text=Doraemon+10', 0),
('One Piece Tập 100', 'Eiichiro Oda', 3, 45, 10, 2021, 'https://placehold.co/300x400?text=One+Piece', 0),
('Naruto Tập 72', 'Masashi Kishimoto', 3, 30, 30, 2015, 'https://placehold.co/300x400?text=Naruto', 0),
('Thần Đồng Đất Việt 1', 'Lê Linh', 3, 40, 38, 2002, 'https://placehold.co/300x400?text=Thần+Đồng', 0),
('Dragon Ball Tập 42', 'Akira Toriyama', 3, 25, 20, 1995, 'https://placehold.co/300x400?text=Dragon+Ball', 0),

-- Thể loại 4: Sách giáo khoa (6 cuốn)
('Vật lý 11', 'Nhiều tác giả', 4, 50, 48, 2020, 'https://placehold.co/300x400?text=Vật+Lý+11', 0),
('Toán 12 (Tập 1)', 'Bộ Giáo Dục', 4, 100, 90, 2023, 'https://placehold.co/300x400?text=Toán+12', 0),
('Ngữ Văn 11 (Tập 2)', 'Bộ Giáo Dục', 4, 80, 75, 2023, 'https://placehold.co/300x400?text=Ngữ+Văn+11', 0),
('Vật Lý 10', 'Bộ Giáo Dục', 4, 70, 68, 2023, 'https://placehold.co/300x400?text=Vật+Lý+10', 0),
('Tiếng Anh 12 Global Success', 'Bộ Giáo Dục', 4, 90, 85, 2024, 'https://placehold.co/300x400?text=Tiếng+Anh+12', 0),
('Lịch Sử 12', 'Bộ Giáo Dục', 4, 50, 50, 2023, 'https://placehold.co/300x400?text=Lịch+Sử+12', 0),

-- Thể loại 5: Tâm lý - Kỹ năng sống (8 cuốn)
('Đắc nhân tâm', 'Dale Carnegie', 5, 15, 12, 1936, 'https://placehold.co/300x400?text=Đắc+nhân+tâm', 0),
('Nhà giả kim', 'Paulo Coelho', 5, 20, 20, 1988, 'https://placehold.co/300x400?text=Nhà+giả+kim', 0),
('Quẳng Gánh Lo Đi Và Vui Sống', 'Dale Carnegie', 5, 35, 30, 1948, 'https://placehold.co/300x400?text=Quẳng+Gánh+Lo', 0),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 5, 40, 39, 2016, 'https://placehold.co/300x400?text=Tuổi+Trẻ', 0),
('Đời Thay Đổi Khi Chúng Ta Thay Đổi', 'Andrew Matthews', 5, 20, 18, 1988, 'https://placehold.co/300x400?text=Đời+Thay+Đổi', 0),
('Hiểu Về Trái Tim', 'Minh Niệm', 5, 30, 25, 2011, 'https://placehold.co/300x400?text=Hiểu+Về+Trái+Tim', 0),
('Cà Phê Cùng Tony', 'Tony Buổi Sáng', 5, 45, 40, 2015, 'https://placehold.co/300x400?text=Cà+Phê+Tony', 0),
('7 Thói Quen Của Người Thành Đạt', 'Stephen Covey', 5, 25, 22, 1989, 'https://placehold.co/300x400?text=7+Thói+Quen', 0);

-- 3.3. Insert Bạn đọc mẫu (5 bạn đọc)
INSERT INTO Readers (full_name, email, phone, address, max_quota) VALUES
('Nguyễn Văn An', 'nguyenvanan@email.com', '0912345678', '123 Đường ABC, Quận 1, TP.HCM', 5),
('Trần Thị Bình', 'tranthibinh@email.com', '0923456789', '456 Đường XYZ, Quận 2, TP.HCM', 5),
('Lê Văn Cường', 'levancuong@email.com', '0934567890', '789 Đường DEF, Quận 3, TP.HCM', 5),
('Phạm Thị Dung', 'phamthidung@email.com', '0945678901', '321 Đường GHI, Quận 4, TP.HCM', 5),
('Hoàng Văn Em', 'hoangvanem@email.com', '0956789012', '654 Đường JKL, Quận 5, TP.HCM', 5);

-- 3.4. Insert Phiếu mượn mẫu (10 phiếu để test thống kê)
INSERT INTO BorrowRecords (reader_id, book_id, borrow_date, due_date, return_date, status) VALUES
(1, 1, '2024-01-15 10:00:00', '2024-01-29 10:00:00', NULL, 'BORROWING'),
(2, 3, '2024-01-10 14:00:00', '2024-01-24 14:00:00', '2024-01-20 15:00:00', 'RETURNED'),
(3, 5, '2024-01-05 09:00:00', '2024-01-19 09:00:00', NULL, 'OVERDUE'),
(1, 6, '2024-01-20 11:00:00', '2024-02-03 11:00:00', NULL, 'BORROWING'),
(4, 2, '2024-01-12 13:00:00', '2024-01-26 13:00:00', '2024-01-25 14:00:00', 'RETURNED'),
(2, 7, '2024-01-18 16:00:00', '2024-02-01 16:00:00', NULL, 'BORROWING'),
(5, 4, '2024-01-08 08:00:00', '2024-01-22 08:00:00', NULL, 'OVERDUE'),
(1, 10, '2024-01-22 09:00:00', '2024-02-05 09:00:00', NULL, 'BORROWING'),
(3, 12, '2024-01-14 10:00:00', '2024-01-28 10:00:00', '2024-01-27 11:00:00', 'RETURNED'),
(4, 15, '2024-01-16 15:00:00', '2024-01-30 15:00:00', NULL, 'BORROWING');

-- ============================================
-- PHẦN 4: KIỂM TRA KẾT QUẢ
-- ============================================
SELECT 'Categories:' as 'Table', COUNT(*) as 'Count' FROM Categories
UNION ALL
SELECT 'Books:', COUNT(*) FROM Books
UNION ALL
SELECT 'Readers:', COUNT(*) FROM Readers
UNION ALL
SELECT 'BorrowRecords:', COUNT(*) FROM BorrowRecords
UNION ALL
SELECT 'Users:', COUNT(*) FROM Users;

-- Hiển thị thông báo thành công
SELECT '✅ Database đã được setup thành công!' as 'Status';

