const db = require('../db'); // Import kết nối database (file db.js của bạn)

// 1. Lấy danh sách thành viên (Chỉ lấy người đang hoạt động status=1)
exports.getAllMembers = async (req, res) => {
    try {
        // Nếu bạn muốn lấy tất cả (kể cả bị khóa) thì bỏ đoạn "WHERE status = 1"
        const [rows] = await db.query('SELECT * FROM members WHERE status = 1 ORDER BY member_id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách', error });
    }
};

// 2. Thêm thành viên mới
exports.createMember = async (req, res) => {
    const { name, email, phone, address } = req.body;
    
    // Validate cơ bản
    if (!name || !email) {
        return res.status(400).json({ message: 'Tên và Email là bắt buộc' });
    }

    try {
        // Kiểm tra email trùng
        const [existing] = await db.query('SELECT * FROM members WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        const sql = 'INSERT INTO members (name, email, phone, address) VALUES (?, ?, ?, ?)';
        await db.query(sql, [name, email, phone, address]);
        
        res.status(201).json({ message: 'Thêm thành viên thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm thành viên', error });
    }
};

// 3. Sửa thông tin thành viên
exports.updateMember = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
        const sql = 'UPDATE members SET name = ?, email = ?, phone = ?, address = ? WHERE member_id = ?';
        const [result] = await db.query(sql, [name, email, phone, address, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên để sửa' });
        }

        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật', error });
    }
};

// 4. Xóa thành viên (Xóa mềm - Chuyển status về 0)
exports.deleteMember = async (req, res) => {
    const { id } = req.params;

    try {
        // Cách 1: Xóa mềm (Khuyên dùng) - Giữ lại dữ liệu lịch sử
        const sql = 'UPDATE members SET status = 0 WHERE member_id = ?';
        
        // Cách 2: Xóa vĩnh viễn (Nếu bạn muốn xóa hẳn khỏi DB thì dùng dòng dưới)
        // const sql = 'DELETE FROM members WHERE member_id = ?';

        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }

        res.json({ message: 'Xóa thành viên thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi xóa thành viên', error });
    }
};