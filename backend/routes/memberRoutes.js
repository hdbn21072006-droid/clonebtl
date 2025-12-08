// File: backend/routes/memberRoutes.js

const express = require('express');
const router = express.Router();

// Import controller (file xử lý logic)
// Lưu ý: Chúng ta sẽ tạo file này ở bước 2
const memberController = require('../controllers/memberController');

// Định nghĩa các đường dẫn
router.get('/', memberController.getAllMembers);           // Lấy danh sách
router.post('/', memberController.createMember);           // Thêm mới
router.put('/:id', memberController.updateMember);         // Sửa
router.delete('/:id', memberController.deleteMember);      // Xóa

module.exports = router;