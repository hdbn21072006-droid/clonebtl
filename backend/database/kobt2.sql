-- Bảng 1: Người dùng (Quản trị viên / Thủ thư)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,           -- ID người dùng tự tăng
    username VARCHAR(50) NOT NULL UNIQUE,             -- Tên đăng nhập (duy nhất)
    password_hash VARCHAR(255) NOT NULL,              -- Mật khẩu đã mã hóa
    email VARCHAR(150) NOT NULL UNIQUE,               -- Email (duy nhất)
    full_name VARCHAR(150),                           -- Họ tên
    avatar VARCHAR(255) DEFAULT 'https://.../default.jpg', -- Link ảnh đại diện
    role ENUM('ADMIN', 'LIBRARIAN') NOT NULL DEFAULT 'LIBRARIAN', -- Vai trò: ADMIN hoặc LIBRARIAN
    provider VARCHAR(50) DEFAULT 'local',             -- Đăng nhập bằng local, google, facebook...
    provider_id VARCHAR(255),                         -- ID khi đăng nhập bằng Google/Facebook
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày tạo tài khoản
);

-- Bảng 2: Thể loại sách
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,       -- ID thể loại tự tăng
    name VARCHAR(150) NOT NULL UNIQUE,                -- Tên thể loại (duy nhất)
    description TEXT                                  -- Mô tả thể loại
);

-- Bảng 3: Sách
CREATE TABLE Books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,           -- ID sách tự tăng
    title VARCHAR(255) NOT NULL,                      -- Tên sách
    author VARCHAR(255) NOT NULL,                     -- Tác giả
    category_id INT,                                  -- Thuộc thể loại nào
    total_quantity INT NOT NULL DEFAULT 0,            -- Tổng số cuốn có trong thư viện
    available_quantity INT NOT NULL DEFAULT 0,        -- Số sách còn lại có thể mượn (đang có sẵn)
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,         -- Ẩn/hiện sách (true = đã ẩn/đã xóa mềm)
    published_year INT,                               -- Năm xuất bản
    image_url VARCHAR(500) DEFAULT 'https://placehold.co/300x400?text=No+Image', -- Link ảnh bìa sách
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
        ON DELETE SET NULL                             -- Nếu xóa thể loại thì để trống cột này
);

-- Bảng 4: Bạn đọc
CREATE TABLE Readers (
    reader_id INT PRIMARY KEY AUTO_INCREMENT,         -- ID bạn đọc tự tăng
    full_name VARCHAR(150) NOT NULL,                  -- Họ tên bạn đọc
    email VARCHAR(150) UNIQUE,                        -- Email (duy nhất, có thể để trống)
    phone VARCHAR(20),                                -- Số điện thoại
    address TEXT,                                     -- Địa chỉ
    max_quota INT NOT NULL DEFAULT 5,                 -- Số sách tối đa được mượn cùng lúc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- Ngày tạo thẻ bạn đọc
);

-- Bảng 5: Lịch sử Mượn/Trả sách (phiếu mượn)
CREATE TABLE BorrowRecords (
    borrow_id INT PRIMARY KEY AUTO_INCREMENT,         -- ID phiếu mượn
    reader_id INT NOT NULL,                           -- Bạn đọc nào mượn
    book_id INT NOT NULL,                             -- Mượn sách nào
    borrow_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Ngày mượn
    due_date DATETIME NOT NULL,                       -- Hạn phải trả
    return_date DATETIME,                             -- Ngày thực tế trả (NULL = chưa trả)
    status ENUM('BORROWING', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'BORROWING',
        -- Trạng thái: 
        -- BORROWING = đang mượn
        -- RETURNED  = đã trả
        -- OVERDUE   = quá hạn chưa trả
    FOREIGN KEY (reader_id) REFERENCES Readers(reader_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);