# Hướng Dẫn Sử Dụng Database

## File SQL Chính

### `setup_database.sql` - File hoàn chỉnh (KHUYẾN NGHỊ)
- **Tạo database** nếu chưa có
- **Tạo tất cả các bảng** (Users, Categories, Books, Readers, BorrowRecords)
- **Insert dữ liệu mẫu đầy đủ**:
  - 5 Thể loại sách
  - 31 Cuốn sách (có image_url)
  - 5 Bạn đọc
  - 10 Phiếu mượn (để test thống kê)
- **Chạy file này một lần để setup toàn bộ database**

### `kobt2.sql` - Chỉ tạo bảng (Schema)
- Chỉ chứa CREATE TABLE
- Dùng khi chỉ muốn tạo bảng mà không insert dữ liệu

## Cách Chạy SQL

### Cách 1: Sử dụng MySQL Command Line (Khuyến nghị)
```bash
mysql -u root -p < setup_database.sql
```
Hoặc nếu database đã tồn tại:
```bash
mysql -u root -p quan_ly_thu_vien < setup_database.sql
```

### Cách 2: Sử dụng MySQL Workbench
1. Mở MySQL Workbench
2. Kết nối đến MySQL server
3. File → Open SQL Script → Chọn `setup_database.sql`
4. Chọn database `quan_ly_thu_vien` (hoặc tạo mới)
5. Click "Execute" (⚡) để chạy

### Cách 3: Sử dụng phpMyAdmin
1. Đăng nhập phpMyAdmin
2. Chọn database `quan_ly_thu_vien` (hoặc tạo mới)
3. Click tab "SQL"
4. Copy toàn bộ nội dung file `setup_database.sql`
5. Paste vào và click "Go"

## Lưu Ý Quan Trọng

- ✅ File `setup_database.sql` sẽ **xóa dữ liệu cũ** trước khi insert mới (trừ Users)
- ✅ Đảm bảo thông tin kết nối trong `db.js` đúng (host, user, password, database)
- ✅ Nếu gặp lỗi foreign key, file đã tự động xử lý với `SET FOREIGN_KEY_CHECKS`

## Dữ Liệu Mẫu Bao Gồm

- **5 Thể loại**: Tiểu thuyết, Khoa học, Truyện tranh, Sách giáo khoa, Tâm lý - Kỹ năng sống
- **31 Cuốn sách**: 
  - 9 Tiểu thuyết
  - 5 Khoa học
  - 7 Truyện tranh
  - 6 Sách giáo khoa
  - 8 Tâm lý - Kỹ năng sống
- **5 Bạn đọc**: Dữ liệu mẫu để test
- **10 Phiếu mượn**: Bao gồm BORROWING, RETURNED, OVERDUE để test thống kê

## Sau Khi Chạy

Kiểm tra dữ liệu đã insert thành công:
```sql
SELECT COUNT(*) FROM Categories;  -- Kỳ vọng: 5
SELECT COUNT(*) FROM Books;       -- Kỳ vọng: 31
SELECT COUNT(*) FROM Readers;     -- Kỳ vọng: 5
SELECT COUNT(*) FROM BorrowRecords; -- Kỳ vọng: 10
```

