
-- Thể loại mẫu
INSERT INTO Categories (name, description) VALUES
('Tiểu thuyết', 'Sách văn học tiểu thuyết'),
('Khoa học', 'Sách khoa học tự nhiên và xã hội'),
('Truyện tranh', 'Manga, Comic'),
('Sách giáo khoa', 'SGK các cấp'),
('Tâm lý - Kỹ năng sống', 'Self-help');

-- Sách mẫu
INSERT INTO Books (title, author, category_id, total_quantity, available_quantity, published_year) VALUES
('Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 1, 10, 8, 2010),
('Đắc nhân tâm', 'Dale Carnegie', 5, 15, 12, 1936),
('Nhà giả kim', 'Paulo Coelho', 5, 20, 20, 1988),
('Doraemon tập 1', 'Fujiko F. Fujio', 3, 30, 25, 1974),
('Vật lý 11', 'Nhiều tác giả', 4, 50, 48, 2020);

ALTER TABLE Books ADD COLUMN is_hidden INT DEFAULT 0;




INSERT INTO Books (title, author, category_id, total_quantity, available_quantity, published_year, is_hidden) VALUES 
-- Thể loại 1: Tiểu thuyết (Văn học)
('Mắt Biếc', 'Nguyễn Nhật Ánh', 1, 20, 15, 2019, 0),
('Số Đỏ', 'Vũ Trọng Phụng', 1, 15, 15, 1936, 0),
('Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 1, 30, 28, 1941, 0),
('Rừng Na Uy', 'Haruki Murakami', 1, 12, 5, 1987, 0),
('Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 1, 50, 2, 1997, 0),
('Chí Phèo', 'Nam Cao', 1, 20, 20, 1941, 0),
('Bố Già (The Godfather)', 'Mario Puzo', 1, 10, 8, 1969, 0),
('Không Gia Đình', 'Hector Malot', 1, 18, 16, 1878, 0),

-- Thể loại 2: Khoa học
('Vũ Trụ', 'Carl Sagan', 2, 10, 10, 1980, 0),
('Lược Sử Thời Gian', 'Stephen Hawking', 2, 25, 22, 1988, 0),
('Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 2, 40, 35, 2011, 0),
('Gen: Lịch Sử Và Tương Lai', 'Siddhartha Mukherjee', 2, 8, 6, 2016, 0),
('Những Nền Văn Minh Thế Giới', 'Fernand Braudel', 2, 5, 5, 1993, 0),

-- Thể loại 3: Truyện tranh
('Thám Tử Lừng Danh Conan Tập 1', 'Gosho Aoyama', 3, 50, 45, 1994, 0),
('Doraemon Truyện Ngắn Tập 10', 'Fujiko F. Fujio', 3, 60, 50, 1975, 0),
('One Piece Tập 100', 'Eiichiro Oda', 3, 45, 10, 2021, 0),
('Naruto Tập 72', 'Masashi Kishimoto', 3, 30, 30, 2015, 0),
('Thần Đồng Đất Việt 1', 'Lê Linh', 3, 40, 38, 2002, 0),
('Dragon Ball Tập 42', 'Akira Toriyama', 3, 25, 20, 1995, 0),

-- Thể loại 4: Sách giáo khoa
('Toán 12 (Tập 1)', 'Bộ Giáo Dục', 4, 100, 90, 2023, 0),
('Ngữ Văn 11 (Tập 2)', 'Bộ Giáo Dục', 4, 80, 75, 2023, 0),
('Vật Lý 10', 'Bộ Giáo Dục', 4, 70, 68, 2023, 0),
('Tiếng Anh 12 Global Success', 'Bộ Giáo Dục', 4, 90, 85, 2024, 0),
('Lịch Sử 12', 'Bộ Giáo Dục', 4, 50, 50, 2023, 0),

-- Thể loại 5: Tâm lý - Kỹ năng sống
('Quẳng Gánh Lo Đi Và Vui Sống', 'Dale Carnegie', 5, 35, 30, 1948, 0),
('Nhà Giả Kim', 'Paulo Coelho', 5, 55, 10, 1988, 0),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 5, 40, 39, 2016, 0),
('Đời Thay Đổi Khi Chúng Ta Thay Đổi', 'Andrew Matthews', 5, 20, 18, 1988, 0),
('Hiểu Về Trái Tim', 'Minh Niệm', 5, 30, 25, 2011, 0),
('Cà Phê Cùng Tony', 'Tony Buổi Sáng', 5, 45, 40, 2015, 0);
INSERT INTO Categories (name, description) VALUES
('Tiểu thuyết', 'Văn học trong và ngoài nước'),
('Khoa học', 'Kiến thức khoa học tự nhiên, xã hội'),
('Truyện tranh', 'Manga, Comic giải trí'),
('Sách giáo khoa', 'Sách dùng cho học sinh phổ thông'),
('Tâm lý - Kỹ năng sống', 'Sách self-help, phát triển bản thân');




-- Tắt kiểm tra khóa ngoại để xóa được dữ liệu
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa sạch dữ liệu cũ và reset ID về 1
TRUNCATE TABLE Books;
TRUNCATE TABLE Categories;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- GIỜ THÌ CHẠY LẠI 2 ĐOẠN INSERT CỦA MÌNH LÀ ĐƯỢC:
-- 1. Insert Categories
INSERT INTO Categories (name, description) VALUES ('Tiểu thuyết', 'Văn học'), ('Khoa học', 'TN-XH'), ('Truyện tranh', 'Comic'), ('Sách giáo khoa', 'SGK'), ('Tâm lý - Kỹ năng sống', 'Self-help');

-- 2. Insert Books (Copy đoạn code 30 cuốn sách ở câu trả lời trước dán vào đây)
